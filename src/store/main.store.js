import { observable, action, computed, makeObservable } from "mobx";
import { socket } from "../services/socket";
import { constants } from "../utils/constants";

export class AppStore {
  @observable accessor socketInfo = socket;
  @observable accessor socketId = null;
  @observable accessor localStream = "";
  @observable accessor remoteStream = "";
  @observable accessor screenSharingStream = null;
  @observable accessor allowConnectionsFromStranger = false;
  @observable accessor screenSharingActive = false;
  @observable accessor calleSocketId = "";
  @observable accessor typeOfCall = "";
  @observable accessor callerDetails = {
    callerId: null,
    typeOfCall: null,
  };
  @observable accessor isCallerDialogOpen = false;
  @observable accessor callDirection = null;
  @observable accessor callStatus = {
    status: "",
    enableCallStatusInfo: false,
  };
  @observable accessor constraints = { video: true, audio: true };
  @observable accessor callInfo = {
    status: "",
    type: "",
    isPersonal: "",
  };

  @observable accessor enableMic = true;
  @observable accessor enableVideo = true;
  @observable accessor enableScreenSharing = false;

  @observable accessor webRTCconfigurations = {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:13902",
      },
    ],
  };

  @observable accessor peerConnection = new RTCPeerConnection(
    this.webRTCconfigurations
  );

  @observable accessor dataChannel =
    this.peerConnection.createDataChannel("chat");

  @observable accessor messageStack = [];

  @observable accessor mediaRecorder = null;

  @observable accessor vp9Codec = "video/webm; codecs=vp=9";
  @observable accessor vp9Options = { mimeType: this.vp9Codec };
  @observable accessor recordedChunks = [];
  @observable accessor isCallAvailable = constants.CALL_AVAILABLE;

  constructor() {
    makeObservable(this);
    this.setConnection = this.setConnection.bind(this);
    this.sendPreOfferDetailsToServer =
      this.sendPreOfferDetailsToServer.bind(this);
    this.handlePreOfferDetailsFromServer =
      this.handlePreOfferDetailsFromServer.bind(this);
    this.handlePreOfferAnswerFromServer =
      this.handlePreOfferAnswerFromServer.bind(this);
    this.acceptCallHandler = this.acceptCallHandler.bind(this);
    this.rejectCallHandler = this.rejectCallHandler.bind(this);
    this.handleCallerDialogAfterTimeOut =
      this.handleCallerDialogAfterTimeOut.bind(this);
    this.handleWebRTCSignalling = this.handleWebRTCSignalling.bind(this);
    this.createRTCPeerConnection = this.createRTCPeerConnection.bind(this);
    this.handleWebRTCOffer = this.handleWebRTCOffer.bind(this);
    this.handleWebRTCAnswer = this.handleWebRTCAnswer.bind(this);
    this.handleWebRTCIceCandidates = this.handleWebRTCIceCandidates.bind(this);
    this.handleHangUp = this.handleHangUp.bind(this);
    this.handleGetStrangerId = this.handleGetStrangerId.bind(this);
  }

  @computed get getPeerConnection() {
    return this.peerConnection;
  }

  @computed
  get getStoreData() {
    return this;
  }

  @computed
  get getCallInfo() {
    return this.callInfo;
  }

  @action startRecording() {
    const stream = this.remoteStream;

    if (MediaRecorder.isTypeSupported(this.vp9Codec)) {
      this.mediaRecorder = new MediaRecorder(stream, this.vp9Options);
    } else {
      this.mediaRecorder = new MediaRecorder(stream);
    }

    this.mediaRecorder.start();
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.recordedChunks.push(event.data);
        this.downloadRecording();
      }
    };
  }
  @action stopRecording() {
    this.mediaRecorder.stop();
  }
  @action pauseRecording() {
    this.mediaRecorder.pause();
  }
  @action resumeRecording() {
    this.mediaRecorder.resume();
  }
  @action downloadRecording() {
    const blob = new Blob(this.recordedChunks, {
      type: "video/webm",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none;";
    a.href = url;
    a.download = "recording.webm";
    a.click();
    window.URL.revokeObjectURL(url);
  }

  @action pushMessageToSTack(message) {
    this.messageStack = [...this.messageStack, message];
  }

  @action sendMessageUsingDataChannel(message) {
    const stringifiedMessage = JSON.stringify(message);
    this.dataChannel.send(stringifiedMessage);
  }

  @action handleMic() {
    const localStream = this.localStream;
    const isMicEnabled = localStream.getAudioTracks()[0].enabled;
    this.localStream.getAudioTracks()[0].enabled = !isMicEnabled;
    this.enableMic = !this.enableMic;
  }

  @action handleVideo() {
    const localStream = this.localStream;
    const isVideoEnabled = localStream.getVideoTracks()[0].enabled;
    this.localStream.getVideoTracks()[0].enabled = !isVideoEnabled;
    this.enableVideo = !this.enableVideo;
  }

  @action handleScreenSharing = async function () {
    if (!this.enableScreenSharing) {
      try {
        const screeSharingStream = await navigator.mediaDevices.getDisplayMedia(
          {
            video: true,
          }
        );

        this.setScreenSharingStream(screeSharingStream);

        const senders = this.peerConnection.getSenders();
        const sender = senders.find(
          (item) =>
            item.track.kind === screeSharingStream.getVideoTracks()[0].kind
        );

        if (sender) {
          sender.replaceTrack(screeSharingStream.getVideoTracks()[0]);
        }

        this.setScreenSharingActive(!this.screenSharingActive);
      } catch (err) {
        console.error("Screen Sharing error: ", err);
      }
    } else {
      //
      const localStream = this.localStream;
      const senders = this.peerConnection.getSenders();
      const sender = senders.find(
        (item) => item.track.kind === localStream.getVideoTracks()[0].kind
      );

      if (sender) {
        sender.replaceTrack(localStream.getVideoTracks()[0]);
      }

      this.screenSharingStream.getTracks().forEach((track) => track.stop());

      this.setScreenSharingActive(!this.screenSharingActive);
      this.setLocalStream(localStream);
    }

    this.enableScreenSharing = !this.enableScreenSharing;
  };

  @action
  handleLocalStream = async function () {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        this.constraints
      );
      this.setLocalStream(stream);
    } catch (err) {
      console.log(err);
    }
  };

  @action addPeers() {
    const localStream = this.localStream;
    const senders = this.peerConnection.getSenders();
    const exSender = senders.find(
      (item) => item?.track?.kind === localStream?.getVideoTracks()[0]?.kind
    );

    if (exSender) {
      this.peerConnection.removeTrack(exSender);
    }

    localStream.getTracks().forEach((track) => {
      this.peerConnection.addTrack(track, localStream);
    });
  }

  @action
  acceptCallHandler() {
    console.log("Call accepted..!");
    socket.emit("pre-offer-answer", {
      callerId: this.callerDetails.callerId,
      status: constants.ACCEPT,
    });

    this.createRTCPeerConnection();

    this.isCallerDialogOpen = false;
    this.isCallAvailable = constants.CALL_UNAVAILABLE;

    const getType = this.callerDetails.typeOfCall.split("_");
    this.callInfo = {
      ...this.callInfo,
      status: constants.ACCEPT,
      type: getType[1],
      isPersonal: getType[0] === constants.PERSONAL,
    };
  }

  @action
  rejectCallHandler() {
    console.log("Call rejected..!");
    socket.emit("pre-offer-answer", {
      callerId:
        this.callDirection === constants.INCOMING_CALL
          ? this.callerDetails.callerId
          : this.calleSocketId,
      status: constants.REJECT,
    });

    this.isCallerDialogOpen = false;
  }

  @action
  setConnection() {
    socket.connect();
    socket.on(
      "connect",
      (() => {
        setTimeout(() => this.setSocketId(socket.id), 1000);
        socket.on("pre-offer", this.handlePreOfferDetailsFromServer);
        socket.on("pre-offer-answer", this.handlePreOfferAnswerFromServer);
        socket.on("webRTC-signalling", this.handleWebRTCSignalling);
        socket.on("hang-up-the-call", this.handleHangUp);
        socket.on("disconnect", this.handleSuddenDisconnection);
        socket.on("get-stranger-id", this.handleGetStrangerId);
      }).bind(this)
    );
  }

  @action
  handleSuddenDisconnection() {
    socket.emit("sudden-disconnect", {
      peerId: this.calleSocketId || this.callerDetails.callerId,
    });
  }

  @action
  setCalleSocketId(id) {
    this.calleSocketId = id;
  }

  @action
  copyToClipboard(text) {
    window.navigator.clipboard
      .writeText(text)
      .then(() => console.log(`${text} copied to clipboard succesfully..!`))
      .catch(() => console.error(`${text} unable to copy to clipboard..!:(`));
  }

  @action
  getCalleDetails(typeOfCall) {
    if (
      this.allowConnectionsFromStranger &&
      (typeOfCall === constants.STRANGER_VIDEO ||
        typeOfCall === constants.STRANGER_CHAT)
    ) {
      this.getStrangerId(typeOfCall);
      return;
    }

    if (!(this.calleSocketId && typeOfCall)) return;

    const data = { calleId: this.calleSocketId, typeOfCall };
    this.typeOfCall = typeOfCall;
    this.callDirection = constants.OUTGOING_CALL;

    this.sendPreOfferDetailsToServer(data);
  }

  @action
  sendPreOfferDetailsToServer(data) {
    if (this.isCallAvailable === constants.CALL_UNAVAILABLE) {
      return false;
    }
    socket.emit("pre-offer", data);
    if (
      data.typeOfCall === constants.PERSONAL_VIDEO ||
      data.typeOfCall === constants.STRANGER_VIDEO
    ) {
      this.addPeers();
    }
    this.isCallerDialogOpen = true;
  }

  @action
  handlePreOfferAnswerFromServer(data) {
    console.log("pre-offer-answer: Your call got attended..!", data);
    const { status, calleId } = data;

    if (this.isCallAvailable === constants.CALL_UNAVAILABLE) {
      socket.emit("pre-offer-answer", {
        callerId: calleId,
        status: constants.UNAVAILABLE,
      });
      return;
    }

    this.callStatus.status = status;
    this.callStatus.enableCallStatusInfo = true;

    if (status === constants.ACCEPT) {
      this.createRTCPeerConnection();
      this.sendWebRTCOffer();
      this.isCallAvailable = constants.CALL_UNAVAILABLE;
    }

    const getType = this.typeOfCall.split("_");
    this.callInfo = {
      ...this.callInfo,
      status,
      type: getType[1],
      isPersonal: getType[0] === constants.PERSONAL,
    };

    setTimeout(this.handleCallerDialogAfterTimeOut, 5000);
  }

  @action handleCallerDialogAfterTimeOut() {
    this.isCallerDialogOpen = false;
    this.callStatus.status = "";
    this.callStatus.enableCallStatusInfo = false;
  }

  @action
  handlePreOfferDetailsFromServer(data) {
    console.log("handle pre-offer details: ", data);
    const { callerId, typeOfCall } = data;

    if (this.isCallAvailable === constants.CALL_UNAVAILABLE) {
      socket.emit("pre-offer-answer", {
        callerId: callerId,
        status: constants.UNAVAILABLE,
      });
      return;
    }
    this.callerDetails.callerId = callerId;
    this.callerDetails.typeOfCall = typeOfCall;
    this.typeOfCall = typeOfCall;
    this.isCallerDialogOpen = true;
    this.callDirection = constants.INCOMING_CALL;
    if (
      data.typeOfCall === constants.PERSONAL_VIDEO ||
      data.typeOfCall === constants.STRANGER_VIDEO
    ) {
      this.addPeers();
    }
  }

  @action
  handleWebRTCSignalling(data) {
    console.log("on getting reponse from webRTC signalling server", data);

    switch (data.type) {
      case constants.OFFER:
        this.handleWebRTCOffer(data);
        break;
      case constants.ANSWER:
        this.handleWebRTCAnswer(data);
        break;
      case constants.ICE_CANDIDATES:
        this.handleWebRTCIceCandidates(data);
        break;
      default:
        return;
    }
  }

  @action
  async handleWebRTCOffer(data) {
    await this.peerConnection.setRemoteDescription(data.offer);
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    socket.emit("webRTC-signalling", {
      peerSocketId: this.callerDetails.callerId,
      type: constants.ANSWER,
      answer: answer,
    });
  }

  @action
  async handleWebRTCAnswer(data) {
    await this.peerConnection.setRemoteDescription(data.answer);
  }

  @action
  async handleWebRTCIceCandidates(data) {
    try {
      await this.peerConnection.addIceCandidate(data.candidate);
    } catch (error) {
      console.log("Ice candidate error: ", error);
    }
  }

  @action
  sendWebRTCOffer = async function () {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    socket.emit("webRTC-signalling", {
      peerSocketId: this.calleSocketId,
      type: constants.OFFER,
      offer: offer,
    });
  };
  /**
   * @param {null} id
   */
  @action
  setSocketId(id) {
    this.socketId = id || this.socketInfo.id;
  }

  /**
   * @param {null} stream
   */
  @action
  setLocalStream(stream) {
    this.localStream = stream;
  }

  /**
   * @param {null} stream
   */
  @action
  setRemoteStream(stream) {
    this.remoteStream = stream;
  }

  /**
   * @param {null} stream
   */
  @action
  setScreenSharingStream(stream) {
    this.screenSharingStream = stream;
  }

  @action handleGetStrangerId(data) {
    const { strangerId, typeOfCall } = data;
    if(!strangerId) return null;
    const offer = { calleId: strangerId, typeOfCall };
    this.typeOfCall = typeOfCall;
    this.callDirection = constants.OUTGOING_CALL;
    this.calleSocketId = strangerId;

    this.sendPreOfferDetailsToServer(offer);
  }

  @action getStrangerId(typeOfCall) {
    if (this.socketId && this.allowConnectionsFromStranger) {
      socket.emit("get-stranger-id", {
        peerId: this.socketId,
        typeOfCall: typeOfCall,
      });
    }
  }

  @action connectToStranger(status) {
    if (this.socketId) {
      socket.emit("stranger-connection-accept", {
        peerId: this.socketId,
        status,
      });
      this.setAllowConnectionsFromStranger(status);
    }
  }

  @action
  setAllowConnectionsFromStranger(status) {
    this.allowConnectionsFromStranger = status;
  }

  /**
   * @param {boolean} status
   */
  @action
  setScreenSharingActive(status) {
    this.screenSharingActive = status;
  }

  /**
   * RTCPeerConnection
   */
  @action reinitiatePeerConnection() {
    this.peerConnection = new RTCPeerConnection(this.webRTCconfigurations);
    this.dataChannel = this.peerConnection.createDataChannel("chat");
  }

  @action createRTCPeerConnection() {
    this.peerConnection.ondatachannel = function (event) {
      const dataChannel = event.channel;

      dataChannel.onopen = () => {
        console.log(
          "peer connection is ready to receive data channel messages"
        );
      };

      dataChannel.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log("message came from data channel: ", message);
        if (message) {
          this.pushMessageToSTack({
            message,
            timestamp: Date.now(),
            type: "recieved",
          });
        }
      };
    }.bind(this);

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        /// send our ice candidates to othe peers
        console.log("Getting ice candidates from stun server");
        socket.emit("webRTC-signalling", {
          peerSocketId: this.calleSocketId,
          type: constants.ICE_CANDIDATES,
          candidate: event.candidate,
        });
      }
    };

    this.peerConnection.onconnectionstatechange = (event) => {
      if (this.peerConnection.connectionState === "connected") {
        console.log("Succesfully connected to the other peer");
      }
    };

    //receiving tracks
    const remoteStream = new MediaStream();
    this.setRemoteStream(remoteStream);

    this.peerConnection.ontrack = (event) => {
      console.log("Tracks are getting added:", event);
      remoteStream.addTrack(event.track);
    };
  }

  @action hangUpTheCall() {
    socket.emit("hang-up-the-call", {
      peerId: this.calleSocketId || this.callerDetails.callerId,
    });
    this.finishTheCall();
    this.clearTheStore();
  }

  @action handleHangUp() {
    this.finishTheCall();
    this.clearTheStore();
  }

  @action finishTheCall() {
    const localStream = this.localStream;

    if (
      this.typeOfCall === constants.PERSONAL_VIDEO ||
      this.typeOfCall === constants.STRANGER_VIDEO
    ) {
      localStream.getAudioTracks()[0].enabled = true;
      localStream.getVideoTracks()[0].enabled = true;
    }

    this.peerConnection.close();

    if (this.peerConnection.signalingState === "closed") {
      console.log("Re Initiated: ---- Peer Connection");
      this.reinitiatePeerConnection();
    }
  }

  @action clearTheStore() {
    this.callerDetails.callerId = "";
    this.callerDetails.typeOfCall = null;
    this.typeOfCall = null;
    this.calleSocketId = "";
    this.callInfo = {
      status: "",
      type: "",
      isPersonal: "",
    };
    this.messageStack = [];
    this.isCallAvailable = constants.CALL_AVAILABLE;
  }
}

const accessAppStore = new AppStore();

export default accessAppStore;

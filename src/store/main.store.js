import { observable, action, computed, makeObservable } from "mobx";
import { socket } from "../services/socket";
import { constants } from "../utils/constants";

export class AppStore {
  @observable accessor socketInfo = socket;
  @observable accessor socketId = null;
  @observable accessor localStream = null;
  @observable accessor remoteStream = null;
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
    this.disconnectDuringCall = this.disconnectDuringCall.bind(this);
    this.handleCallerDialogAfterTimeOut =
      this.handleCallerDialogAfterTimeOut.bind(this);
  }

  @computed
  get getStoreData() {
    return this;
  }

  @action
  acceptCallHandler() {
    console.log("Call accepted..!");
    socket.emit("pre-offer-answer", {
      callerId: this.callerDetails.callerId,
      status: constants.ACCEPT,
    });

    this.isCallerDialogOpen = false;
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
  disconnectDuringCall() {
    socket.emit("pre-offer-answer", {
      callerId: this.callerDetails.callerId,
      status: constants.NOT_FOUND,
    });
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
      }).bind(this)
    );
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
    const data = { calleId: this.calleSocketId, typeOfCall };
    this.typeOfCall = typeOfCall;
    this.callDirection = constants.OUTGOING_CALL;
    this.sendPreOfferDetailsToServer(data);
  }

  @action
  sendPreOfferDetailsToServer(data) {
    console.log("pre-offer", data);
    socket.emit("pre-offer", data);
    this.isCallerDialogOpen = true;
  }

  @action
  handlePreOfferAnswerFromServer(data) {
    console.log("pre-offer-answer: You call got attended..!", data);
    const { status } = data;
    this.callStatus.status = status;
    this.callStatus.enableCallStatusInfo = true;

    setTimeout(this.handleCallerDialogAfterTimeOut, 5000);
  }

  @action handleCallerDialogAfterTimeOut() {
    this.isCallerDialogOpen = false;
    this.callStatus.status = "";
    this.callStatus.enableCallStatusInfo = false;
  }

  @action
  handlePreOfferDetailsFromServer(data) {
    const { callerId, typeOfCall } = data;
    this.callerDetails.callerId = callerId;
    this.callerDetails.typeOfCall = typeOfCall;
    this.isCallerDialogOpen = true;
    this.callDirection = constants.INCOMING_CALL;
  }

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

  /**
   * @param {boolean} status
   */
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
}

const accessAppStore = new AppStore();
export default accessAppStore;

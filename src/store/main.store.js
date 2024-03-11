import { observable, action, computed, makeObservable } from "mobx";
import { socket } from "../services/socket";

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

  constructor() {
    makeObservable(this);
    this.setConnection = this.setConnection.bind(this);
    this.sendPreOfferDetailsToServer =
      this.sendPreOfferDetailsToServer.bind(this);
  }

  @computed
  get getStoreData() {
    return this;
  }

  @action
  setConnection() {
    this.socketInfo.connect();
    setTimeout(() => this.setSocketId(this.socketInfo.id), 1000);
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
    this.sendPreOfferDetailsToServer(data);
  }

  @action
  sendPreOfferDetailsToServer(data) {
    this.socketInfo.emit("pre-offer", data);
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

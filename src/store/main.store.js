import { observable, action, computed, makeObservable } from "mobx";

export default class TodoStore {
  @observable accessor todos = [];
  @observable accessor socketId = null;
  @observable accessor localStream = null;
  @observable accessor remoteStream = null;
  @observable accessor screenSharingStream = null;
  @observable accessor allowConnectionsFromStranger = false;
  @observable accessor screenSharingActive = false;

  constructor() {
    makeObservable(this);
  }

  @computed
  get getStoreData() {
    return this;
  }

  @action addTodo(todo) {
    console.log(todo);
    this.todos.push(todo);
  }
}

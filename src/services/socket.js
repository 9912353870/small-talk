import { io } from "socket.io-client";
import appStore from "../store/main.store";

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  process.env.NODE_ENV === "production" ? "/" : "http://localhost:3000";

export const socket = io(URL, {
  autoConnect: false,
});



import React, { useEffect, useState } from "react";
import { socket } from "./services/socket";

export default function App() {
  // const [isConnected, setIsConnected] = useState(socket.connected);

  // useEffect(() => {
  //   function onConnect() {
  //     setIsConnected(true);
  //   }

  //   function onDisconnect() {
  //     setIsConnected(false);
  //   }

  //   socket.connect();
  //   socket.on("connect", onConnect);
  //   socket.on("disconnect", onDisconnect);

  //   return () => {
  //     socket.off("connect", onConnect);
  //     socket.off("disconnect", onDisconnect);
  //     socket.disconnect();
  //   };
  // }, []);

  return <div>{`Hello user: ${socket.id}`}</div>;
}

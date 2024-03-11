import React, { useEffect, useState } from "react";
import { socket } from "./services/socket";

import { observer } from "mobx-react";
import DashboardContainer from "./components/DashboardContainer";
import CallContainer from "./components/CallContainer";
import MessengerContainer from "./components/MessengerContainer";

function App({ appStore }) {
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

  return (
    <div className="main_container">
      {/* <div className="dashboard_container">
        <DashboardContainer />
      </div>
      <div className="call_container">
        <CallContainer />
      </div>
      <div className="messenger_container">
        <MessengerContainer />
      </div> */}
    </div>
  );
}

export default observer(App);

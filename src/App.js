import React, { useEffect, useState } from "react";
import { socket } from "./services/socket";

import { observer } from "mobx-react";
import DashboardContainer from "./components/DashboardContainer";
import CallContainer from "./components/CallContainer";
import MessengerContainer from "./components/MessengerContainer";
import ModalPopup from "./components/CallerModal";

function App({ appStore }) {
  return (
    <div className="main_container">
      <div className="dashboard_container">
        <DashboardContainer appStore={appStore} />
      </div>
      <div className="call_container">
        <CallContainer />
      </div>
      <div className="messenger_container">
        <MessengerContainer />
      </div>
      <ModalPopup appStore={appStore} />
    </div>
  );
}

export default observer(App);

import { observer } from "mobx-react";
import React from "react";
import { constants } from "../utils/constants";

function MessengerContainer({ appStore }) {
  const show = appStore.getCallInfo.status === constants.ACCEPT;
  return (
    <>
      <div className="messages_container" id="messages_container"></div>
      <div
        className={`new_message_container ${show ? "" : "display_none"}`}
        id="new_message"
      >
        <input
          className="new_message_input"
          id="new_message_input"
          type="text"
          placeholder="Type your message..."
        ></input>
        <button className="send_message_button" id="send_message_button">
          <img
            className="send_message_button_image"
            src={require("../../assets/Images/sendMessageButton.png").default}
          />
        </button>
      </div>
    </>
  );
}

export default observer(MessengerContainer);

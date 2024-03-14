import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { constants } from "../utils/constants";

function MessengerContainer({ appStore }) {
  const show = appStore.getCallInfo.status === constants.ACCEPT;
  const [msg, setMsg] = useState("");

  const handleInput = (e) => {
    if (e.key === "Enter") {
      appStore.sendMessageUsingDataChannel(e.target.value);
      appStore.pushMessageToSTack({
        message: e.target.value,
        timestamp: Date.now(),
        type: "sent",
      });
      setMsg("");
      return;
    }
    setMsg(e.target.value);
  };

  const handleSendMessage = () => {
    appStore.sendMessageUsingDataChannel(msg);
    appStore.pushMessageToSTack({
      message: msg,
      timestamp: Date.now(),
      type: "sent",
    });
    setMsg("");
  };

  return (
    <>
      <div className="messages_container" id="messages_container">
        {appStore.getStoreData.messageStack?.map((msg) => {
          return (
            <div
              className={
                msg.type === "sent"
                  ? "message_right_container"
                  : "message_left_container"
              }
              key={msg.timestamp}
            >
              <p
                className={
                  msg.type === "sent"
                    ? "message_right_paragraph"
                    : "message_left_paragraph"
                }
              >
                {msg.message}
              </p>
            </div>
          );
        })}
      </div>
      {show && (
        <div className={`new_message_container`} id="new_message">
          <input
            className="new_message_input"
            id="new_message_input"
            type="text"
            placeholder="Type your message..."
            value={msg}
            onChange={(e) => handleInput(e)}
          />
          <button
            className="send_message_button"
            id="send_message_button"
            onClick={handleSendMessage}
          >
            <img
              className="send_message_button_image"
              src={require("../../assets/Images/sendMessageButton.png").default}
            />
          </button>
        </div>
      )}
    </>
  );
}

export default observer(MessengerContainer);

import React from "react";

export default function MessengerContainer() {
  return (
    <>
      <div class="messages_container" id="messages_container"></div>
      <div class="new_message_container display_none" id="new_message">
        <input
          class="new_message_input"
          id="new_message_input"
          type="text"
          placeholder="Type your message..."
        ></input>
        <button class="send_message_button" id="send_message_button">
          <img
            class="send_message_button_image"
            src={require("../../assets/Images/sendMessageButton.png").default}
          />
        </button>
      </div>
    </>
  );
}

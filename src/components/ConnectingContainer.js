import React from "react";

export default function ConnectingContainer({ type }) {
  return (
    <div class="personal_code_connecting_container">
      <p class="personal_code_connecting_paragraph">
        {type === "personal" ? "Personal Code" : "Stranger"}
      </p>
      {type === "personal" && (
        <div class="personal_code_connecting_input_container">
          <input class="personal_code_input" id="personal_code_input"></input>
        </div>
      )}
      <div class="personal_code_connecting_buttons_container">
        <button class="connecting_button" id="personal_code_chat_button">
          <img
            src={require("../../assets/images/chatButton.png").default}
            class="connecting_buttons_image"
          ></img>
        </button>
        <button class="connecting_button" id="personal_code_video_button">
          <img
            src={require("../../assets/images/videoButton.png").default}
            class="connecting_buttons_image"
          ></img>
        </button>
      </div>
    </div>
  );
}

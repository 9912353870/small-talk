import { observer } from "mobx-react";
import React from "react";
import { constants } from "../utils/constants";

function ConnectingContainer({ calle: type, appStore }) {
  const onClickHandler = (callType) =>
    appStore.getCalleDetails(`${type}_${callType}`);
  return (
    <div className="personal_code_connecting_container">
      <p className="personal_code_connecting_paragraph">
        {type === constants.PERSONAL ? "Personal Code" : "Stranger"}
      </p>
      {type === constants.PERSONAL && (
        <div className="personal_code_connecting_input_container">
          <input
            className="personal_code_input"
            id="personal_code_input"
            value={appStore.getStoreData.calleSocketId}
            onChange={(e) => appStore.setCalleSocketId(e.target.value)}
          />
        </div>
      )}
      <div className="personal_code_connecting_buttons_container">
        <button
          className="connecting_button"
          id="personal_code_chat_button"
          onClick={() => onClickHandler(constants.CHAT)}
        >
          <img
            src={require("../../assets/images/chatButton.png").default}
            className="connecting_buttons_image"
          ></img>
        </button>
        <button
          className="connecting_button"
          id="personal_code_video_button"
          onClick={() => onClickHandler(constants.VIDEO)}
        >
          <img
            src={require("../../assets/images/videoButton.png").default}
            className="connecting_buttons_image"
          ></img>
        </button>
      </div>
    </div>
  );
}

export default observer(ConnectingContainer);

import { observer } from "mobx-react";
import React from "react";

function PersonalCodeContainer({ appStore }) {
  return (
    <div className="personal_code_container">
      <div className="personal_code_title_container">
        <p className="personal_code_title_paragraph">Your personal codes</p>
      </div>
      <div className="personal_code_value_container">
        <p className="personal_code_value_paragraph">
          {appStore.socketId || ""}
        </p>
        <button
          className="personal_code_copy_button"
          onClick={() => appStore.copyToClipboard(appStore.socketId)}
        >
          <img src={require("../../assets/Images/copyButton.png").default} />
        </button>
      </div>
    </div>
  );
}
export default observer(PersonalCodeContainer);

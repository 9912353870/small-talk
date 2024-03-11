import React from "react";

export default function PersonalCodeContainer() {
  return (
    <div className="personal_code_container">
      <div className="personal_code_title_container">
        <p className="personal_code_title_paragraph">Your personal codes</p>
      </div>
      <div className="personal_code_value_container">
        <p className="personal_code_value_paragraph">ashkflsfkls_128u8</p>
        <button class="personal_code_copy_button">
          <img src={require("../../assets/Images/copyButton.png").default} />
        </button>
      </div>
    </div>
  );
}

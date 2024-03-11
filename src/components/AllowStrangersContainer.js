import React from "react";

export default function AllowStrangersContainer() {
  return (
    <div className="checkbox_container">
      <div className="checkbox_connection" id="allow_strangers_checkbox">
        <img
          id="allow_strangers_checkbox_image"
          className=""
          src={require("../../assets/images/check.png").default}
        ></img>
      </div>
      <p className="checkbox_container_paragraph">
        Allow connection from strangers
      </p>
    </div>
  );
}

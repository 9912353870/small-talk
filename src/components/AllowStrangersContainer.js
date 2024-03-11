import React from "react";

export default function AllowStrangersContainer() {
  return (
    <div class="checkbox_container">
      <div class="checkbox_connection" id="allow_strangers_checkbox">
        <img
          id="allow_strangers_checkbox_image"
          class=""
          src={require("../../assets/images/check.png").default}
        ></img>
      </div>
      <p class="checkbox_container_paragraph">
        Allow connection from strangers
      </p>
    </div>
  );
}

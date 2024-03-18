import { observer } from "mobx-react";
import React from "react";

function AllowStrangersContainer({ appStore }) {
  return (
    <div className="checkbox_container">
      <div
        className="checkbox_connection"
        onClick={() => {
          appStore.connectToStranger(
            !appStore.getStoreData.allowConnectionsFromStranger
          );
        }}
      >
        {appStore.getStoreData.allowConnectionsFromStranger && (
          <img
            id="allow_strangers_checkbox_image"
            className=""
            src={require("../../assets/images/check.png").default}
          ></img>
        )}
      </div>
      <p className="checkbox_container_paragraph">
        Allow connection from strangers
      </p>
    </div>
  );
}

export default observer(AllowStrangersContainer);

import React from "react";
import { observer } from "mobx-react";

function DescriptionContainer () {
  return (
    <div className="description_container">
      <p className="description_container_paragraph">
        Talk with other users by passing his personal code or talk with
        starngers
      </p>
    </div>
  );
}

export default observer(DescriptionContainer);
import React from "react";
import VideoContainer from "./VideoContainer";
import { observer } from "mobx-react";

function CallContainer({ appStore }) {
  return <VideoContainer appStore={appStore} />;
}

export default observer(CallContainer);

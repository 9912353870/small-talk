import { observer } from "mobx-react";
import React from "react";


 function LogoContainer({ appStore }) {
  return (
    <div className="logo_container">
      <img src={require("../../assets/Images/logo.png").default} />
      <button onClick={appStore.setConnection}>Connect</button>
    </div>
  );
}

export default observer(LogoContainer);
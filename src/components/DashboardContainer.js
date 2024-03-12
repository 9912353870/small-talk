import React from "react";
import { observer } from "mobx-react";
import LogoContainer from "./LogoContainer";
import DescriptionContainer from "./DescriptionContainer";
import PersonalCodeContainer from "./PersonalCodeContainer";
import ConnectingContainer from "./ConnectingContainer";
import AllowStrangersContainer from "./AllowStrangersContainer";
import { constants } from "../utils/constants";

function DashboardContainer({ appStore }) {
  return (
    <div>
      <LogoContainer appStore={appStore} />
      <div>
        <DescriptionContainer />
        <PersonalCodeContainer appStore={appStore} />
        <ConnectingContainer calle={constants.PERSONAL} appStore={appStore} />
        <ConnectingContainer calle={constants.STRANGER} appStore={appStore} />
        <AllowStrangersContainer appStore={appStore} />
      </div>
    </div>
  );
}

export default observer(DashboardContainer);

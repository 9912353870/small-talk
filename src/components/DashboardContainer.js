import React from "react";
import LogoContainer from "./LogoContainer";
import DescriptionContainer from "./DescriptionContainer";
import PersonalCodeContainer from "./PersonalCodeContainer";
import ConnectingContainer from "./ConnectingContainer";
import AllowStrangersContainer from "./AllowStrangersContainer";

export default function DashboardContainer() {
  return (
    <div>
      <LogoContainer />
      <div>
        <DescriptionContainer />
        <PersonalCodeContainer />
        {["personal", "stranger"].map((item) => (
          <ConnectingContainer type={item} />
        ))}
        <AllowStrangersContainer />
      </div>
    </div>
  );
}

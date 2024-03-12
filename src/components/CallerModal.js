import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { constants } from "../utils/constants";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="dialog_wrapper">
      <div className="dialog_content">{children}</div>
    </div>,
    document.getElementById("modal-root")
  );
};

const ModalPopup = ({ appStore }) => {
  const [isOpen, setIsOpen] = useState(
    appStore.getStoreData.isCallerDialogOpen
  );
  const call_status = {
    [constants.ACCEPT]: "Call connected succesfully..!",
    [constants.REJECT]: "Call got rejected. Please try again..!",
    [constants.UNAVAILABLE]:
      "Call got disconnected due to callee unavailable..!",
    [constants.NOT_FOUND]: "Call got disconnected as callee not found..!",
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = (status) => {
    setIsOpen(false);
    if (status === constants.ACCEPT) {
      appStore.acceptCallHandler();
      return;
    }
    appStore.rejectCallHandler();
  };

  useEffect(() => {
    setIsOpen(appStore.getStoreData.isCallerDialogOpen);
  }, [appStore.getStoreData.isCallerDialogOpen]);


  return (
    <div>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <p className="dialog_title">
          {appStore.getStoreData.callDirection === constants.INCOMING_CALL
            ? constants.INCOMING_CALL
            : constants.OUTGOING_CALL}
        </p>
        <div className="dialog_image_container">
          <img src={require("../../assets/Images/dialogAvatar.png").default} />
        </div>
        <div className="dialog_button_container">
          {!appStore.getStoreData.callStatus.enableCallStatusInfo && (
            <>
              {appStore.getStoreData.callDirection ===
                constants.INCOMING_CALL && (
                <button
                  className="dialog_accept_call_button"
                  onClick={() => closeModal(constants.ACCEPT)}
                >
                  <img
                    src={require("../../assets/Images/acceptCall.png").default}
                    className="dialog_button_image"
                  />
                </button>
              )}
              <button
                className="dialog_reject_call_button"
                onClick={() => closeModal(constants.REJECT)}
              >
                <img
                  src={require("../../assets/Images/rejectCall.png").default}
                  className="dialog_button_image"
                />
              </button>
            </>
          )}
          {appStore.getStoreData.callStatus.enableCallStatusInfo && (
            <p>{call_status[appStore.getStoreData.callStatus.status]}</p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default observer(ModalPopup);

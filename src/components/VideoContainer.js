import { observer } from "mobx-react";
import React, { useEffect, useRef, useState } from "react";
import { constants } from "../utils/constants";

function VideoContainer({ appStore }) {
  const show =
    appStore.getCallInfo.status === constants.ACCEPT &&
    appStore.getStoreData.typeOfCall === constants.PERSONAL_VIDEO;
  const videoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const [startRecord, setStartRecord] = useState(false);
  const [pauseRecord, setPauseRecord] = useState(false);

  const handleStartAndStopRecording = (status) => {
    setStartRecord((prevState) => !prevState);
    if (status) {
      appStore.startRecording();
      return;
    }
    appStore.stopRecording();
  };

  const handlePauseAndResumeRecording = (status) => {
    setPauseRecord((prevState) => !prevState);

    if (status) {
      appStore.pauseRecording();
      return;
    }

    appStore.resumeRecording();
  };

  const handleHangUp = () => {
    appStore.hangUpTheCall();
  };

  useEffect(() => {
    appStore.handleLocalStream();
  }, []);

  useEffect(() => {
    if (
      appStore.getStoreData.localStream &&
      videoRef?.current &&
      "srcObject" in videoRef.current
    ) {
      videoRef.current.srcObject = appStore.getStoreData.enableScreenSharing
        ? appStore.getStoreData.screenSharingStream
        : appStore.getStoreData.localStream;
    }
  }, [
    appStore.getStoreData.localStream,
    appStore.getStoreData.screenSharingStream,
    appStore.getStoreData.enableScreenSharing,
  ]);

  useEffect(() => {
    if (
      appStore.getStoreData.remoteStream &&
      remoteVideoRef.current &&
      "srcObject" in remoteVideoRef.current
    ) {
      remoteVideoRef.current.srcObject = appStore.getStoreData.remoteStream;
    }
  }, [appStore.getStoreData.remoteStream]);

  return (
    <div className="videos_container">
      {!show && (
        <div id="video_placeholder" className={`videos_placeholder`}>
          <img src={require("../../assets/Images/logo.png").default} />
        </div>
      )}
      {show && (
        <video
          className={`remote_video`}
          autoPlay
          id="remote_video"
          ref={remoteVideoRef}
        ></video>
      )}
      <div className="local_video_container">
        <video
          className="local_video"
          id="local_video"
          muted
          autoPlay
          ref={videoRef}
        ></video>
      </div>
      {show && (
        <>
          <div className={`call_buttons_container`} id="call_buttons">
            <button
              className="call_button_small"
              id="mic_button"
              onClick={() => appStore.handleMic()}
            >
              {appStore.getStoreData.enableMic ? (
                <img src={require("../../assets/Images/mic.png").default} />
              ) : (
                <img src={require("../../assets/Images/micOff.png").default} />
              )}
            </button>
            <button
              className="call_button_small"
              id="camera_button"
              onClick={() => appStore.handleVideo()}
            >
              {appStore.getStoreData.enableVideo ? (
                <img src={require("../../assets/Images/camera.png").default} />
              ) : (
                <img
                  src={require("../../assets/Images/cameraOff.png").default}
                />
              )}
            </button>
            <button
              className="call_button_large"
              onClick={() => handleHangUp()}
            >
              <img src={require("../../assets/Images/hangUp.png").default} />
            </button>
            <button
              className="call_button_small"
              id="screen_sharing_button"
              onClick={() => appStore.handleScreenSharing()}
            >
              <img
                src={
                  require("../../assets/Images/switchCameraScreenSharing.png")
                    .default
                }
              />
            </button>
            <button
              className="call_button_small"
              onClick={() => handleStartAndStopRecording(true)}
            >
              <img
                src={require("../../assets/Images/recordingStart.png").default}
              />
            </button>
          </div>
        </>
      )}

      {appStore.getCallInfo.status === constants.ACCEPT &&
        appStore.getStoreData.typeOfCall === constants.PERSONAL_CHAT && (
          <div
            className={`finish_chat_button_container`}
            onClick={() => handleHangUp()}
          >
            <button className="call_button_large" id="finish_chat_call_button">
              <img src={require("../../assets/Images/hangUp.png").default} />
            </button>
          </div>
        )}
      {startRecord && (
        <div
          className="video_recording_buttons_container"
          id="video_recording_buttons"
        >
          {!pauseRecord && (
            <button
              id="pause_recording_button"
              onClick={() => handlePauseAndResumeRecording(true)}
            >
              <img src={require("../../assets/Images/pause.png").default} />
            </button>
          )}
          {pauseRecord && (
            <button
              id="resume_recording_button"
              onClick={() => handlePauseAndResumeRecording(false)}
            >
              <img src={require("../../assets/Images/resume.png").default} />
            </button>
          )}
          <button
            id="stop_recording_button"
            onClick={() => handleStartAndStopRecording(false)}
          >
            Stop recording
          </button>
        </div>
      )}
    </div>
  );
}

export default observer(VideoContainer);

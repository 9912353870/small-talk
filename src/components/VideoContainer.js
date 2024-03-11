import React from "react";

export default function VideoContainer() {
  return (
    <div className="videos_container">
      <div id="video_placeholder" className="videos_placeholder">
        <img src={require("../../assets/Images/logo.png").default} />
      </div>
      <video
        className="remote_video display_none"
        autoPlay
        id="remote_video"
      ></video>
      <div className="local_video_container">
        <video className="local_video" id="local_video" muted autoPlay></video>
      </div>
      <div className="call_buttons_container display_none" id="call_buttons">
        <button className="call_button_small" id="mic_button">
          <img
            src={require("../../assets/Images/mic.png").default}
            id="mic_button_image"
          />
        </button>
        <button className="call_button_small" id="camera_button">
          <img
            src={require("../../assets/Images/camera.png").default}
            id="camera_button_image"
          />
        </button>
        <button className="call_button_large" id="hang_up_button">
          <img src={require("../../assets/Images/hangUp.png").default} />
        </button>
        <button className="call_button_small" id="screen_sharing_button">
          <img
            src={
              require("../../assets/Images/switchCameraScreenSharing.png")
                .default
            }
          />
        </button>
        <button className="call_button_small" id="start_recording_button">
          <img
            src={require("../../assets/Images/recordingStart.png").default}
          />
        </button>
      </div>
      <div
        className="finish_chat_button_container display_none"
        id="finish_chat_button_container"
      >
        <button className="call_button_large" id="finish_chat_call_button">
          <img src={require("../../assets/Images/hangUp.png").default} />
        </button>
      </div>
      <div
        className="video_recording_buttons_container display_none"
        id="video_recording_buttons"
      >
        <button id="pause_recording_button">
          <img src={require("../../assets/Images/pause.png").default} />
        </button>
        <button id="resume_recording_button" className="display_none">
          <img src={require("../../assets/Images/resume.png").default} />
        </button>
        <button id="stop_recording_button">Stop recording</button>
      </div>
    </div>
  );
}

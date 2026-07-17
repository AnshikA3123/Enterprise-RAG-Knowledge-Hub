import React from "react";
import "../styles/Loading.css";

function Loading({ label = "Retrieving context and generating answer" }) {
  return (
    <div className="loading-row">
      <div className="loading-avatar">
        <span className="loading-avatar-pulse" />
        <span className="loading-avatar-core" />
      </div>
      <div className="loading-bubble">
        <div className="typing-dots" role="status" aria-live="polite">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
        <span className="loading-label">{label}…</span>
      </div>
    </div>
  );
}

export default Loading;

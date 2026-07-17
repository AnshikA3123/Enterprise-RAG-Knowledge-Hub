import React from "react";
import { HiOutlineSparkles, HiOutlineShieldCheck, HiOutlineBars3 } from "react-icons/hi2";
import "../styles/Header.css";

function Header({ viewLabel, isBackendOnline, onMenuToggle }) {
  return (
    <header className="app-header">
      <div className="app-header-left">
        <button
          type="button"
          className="header-menu-toggle"
          onClick={onMenuToggle}
          aria-label="Toggle navigation menu"
        >
          <HiOutlineBars3 aria-hidden="true" />
        </button>
        <div className="header-logo" aria-hidden="true">
          <span className="header-logo-hex" />
          <span className="header-logo-hex header-logo-hex-delay" />
          <HiOutlineSparkles className="header-logo-icon" />
        </div>
        <div className="header-titles">
          <h1 className="header-title">
            Enterprise AI Knowledge Hub
            <span className="header-title-accent">.</span>
          </h1>
          <p className="header-subtitle">{viewLabel}</p>
        </div>
      </div>

      <div className="app-header-right">
        <span className="header-badge header-badge-model">
          <HiOutlineShieldCheck aria-hidden="true" />
          Gemini 2.0
        </span>
        <span className="header-badge header-badge-secure">RAG Secured</span>
        <div className={`live-status ${isBackendOnline ? "live-status-on" : "live-status-off"}`}>
          <span className="live-status-dot" />
          <span>{isBackendOnline ? "Live" : "Offline"}</span>
        </div>
      </div>
    </header>
  );
}

export default Header;

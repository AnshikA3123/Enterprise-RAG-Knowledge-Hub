import React from "react";
import {
  HiOutlineSquares2X2,
  HiOutlineChatBubbleLeftRight,
  HiOutlineCircleStack,
  HiOutlineDocumentText,
  HiOutlineChartBar,
  HiOutlineCog6Tooth,
  HiOutlineSignal,
  HiOutlineXMark,
} from "react-icons/hi2";
import "../styles/Sidebar.css";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: HiOutlineSquares2X2 },
  { key: "chat", label: "AI Chat", icon: HiOutlineChatBubbleLeftRight },
  { key: "knowledge-base", label: "Knowledge Base", icon: HiOutlineCircleStack },
  { key: "documents", label: "Documents", icon: HiOutlineDocumentText },
  { key: "analytics", label: "Analytics", icon: HiOutlineChartBar },
  { key: "settings", label: "Settings", icon: HiOutlineCog6Tooth },
];

const SYSTEM_SERVICES = [
  { key: "gemini", label: "Gemini API", status: "online" },
  { key: "qdrant", label: "Qdrant", status: "connected" },
  { key: "fastapi", label: "FastAPI", status: "running" },
];

function Sidebar({
    activeView,
    conversations,
    selectedConversation,
    onConversationClick,
    onNavigate,
    isOpen,
    onClose
}) {
  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? "sidebar-overlay-visible" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brandmark">
          <div className="brand-node">
            <span className="brand-node-core" />
            <span className="brand-node-ring" />
          </div>
          <div className="brand-copy">
            <span className="brand-name">Knowledge Hub</span>
            <span className="brand-tier">ENTERPRISE</span>
          </div>
          <button type="button" className="sidebar-close" onClick={onClose} aria-label="Close navigation menu">
            <HiOutlineXMark aria-hidden="true" />
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Primary">
          <span className="nav-section-label">Workspace</span>
          <ul className="nav-list">
            {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
              <li key={key}>
                <button
                  type="button"
                  className={`nav-item ${activeView === key ? "nav-item-active" : ""}`}
                  onClick={() => onNavigate(key)}
                >
                  <Icon className="nav-icon" aria-hidden="true" />
                  <span>{label}</span>
                  {activeView === key && <span className="nav-item-glow" aria-hidden="true" />}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="conversation-history">
  <span className="nav-section-label">
    Recent Conversations
  </span>

  <ul className="conversation-list">
    {conversations.length === 0 ? (
      <li className="conversation-empty">
        No conversations yet
      </li>
    ) : (
      conversations.map((conversation) => (
        <li
          key={conversation.id}
          className={`conversation-item ${
            selectedConversation === conversation.id
              ? "conversation-item-active"
              : ""
          }`}
          onClick={() =>
            onConversationClick(conversation.id)
          }
        >
          {conversation.title}
        </li>
      ))
    )}
  </ul>
</div>
        

        <div className="system-status-card">
          <div className="system-status-header">
            <HiOutlineSignal className="system-status-icon" aria-hidden="true" />
            <span>System Status</span>
          </div>
          <ul className="system-status-list">
            {SYSTEM_SERVICES.map((service) => (
              <li key={service.key} className="system-status-item">
                <span className="status-dot-wrap">
                  <span className="status-dot" />
                </span>
                <span className="status-label">{service.label}</span>
                <span className="status-value">{service.status}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <span className="sidebar-user-avatar">EA</span>
            <div className="sidebar-user-meta">
              <span className="sidebar-user-name">Enterprise Admin</span>
              <span className="sidebar-user-role">Workspace Owner</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;

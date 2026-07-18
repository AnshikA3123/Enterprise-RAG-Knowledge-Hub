import { useEffect, useMemo, useState } from "react";
import { getSettings } from "../services/settingsApi";
import "../styles/Settings.css";
import "../styles/Dashboard.css";

// ------------------------------------------------------------------
// Inline icon set (no external icon package required)
// ------------------------------------------------------------------

function IconProvider() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="7" y="7" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9.5 3.5v3M14.5 3.5v3M9.5 17.5v3M14.5 17.5v3M3.5 9.5h3M3.5 14.5h3M17.5 9.5h3M17.5 14.5h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconEmbedding() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="6" cy="6" r="2.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="18" cy="6" r="2.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="18" r="2.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7.8 7.3 16.2 7.3M7.5 7.8 11 16M16.5 7.8 13 16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function IconDatabase() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="12" cy="5.5" rx="7.5" ry="2.8" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4.5 5.5V12c0 1.55 3.36 2.8 7.5 2.8s7.5-1.25 7.5-2.8V5.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4.5 12v6.2c0 1.55 3.36 2.8 7.5 2.8s7.5-1.25 7.5-2.8V12" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function IconCollection() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.5 8 12 3.5 20.5 8 12 12.5 3.5 8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M3.5 8v8L12 20.5 20.5 16V8" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M12 12.5V20.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function IconDocuments() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 2.5h8l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 20V4A1.5 1.5 0 0 1 5.5 2.5H6Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M14 2.5V7h4.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8 12h8M8 15.5h8M8 8.5h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconDepartments() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function IconChunks() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.5 21 7.5 12 12.5 3 7.5 12 2.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M3 12.5 12 17.5 21 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M3 17.2 12 22.2l9-5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function IconVectors() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="5" cy="6" r="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="19" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="9" cy="19" r="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17" cy="16" r="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M6.6 7.1 17.4 8.2M6.2 7.8 8.6 17.4M10.6 18.5 15.4 16.7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function IconServer() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3.5" y="4" width="17" height="6.4" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
      <rect x="3.5" y="13.6" width="17" height="6.4" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="7" cy="7.2" r="1" fill="currentColor" />
      <circle cx="7" cy="16.8" r="1" fill="currentColor" />
    </svg>
  );
}

function IconEnvironment() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.5 3h5M10.5 3v5.4L5.8 17a2 2 0 0 0 1.8 2.9h8.8a2 2 0 0 0 1.8-2.9L13.5 8.4V3" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M8.2 14.5h7.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconTag() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.5 3.5h5.6a1.4 1.4 0 0 1 1.4 1.4v5.6a1.4 1.4 0 0 1-.41 1L9.6 20a1.4 1.4 0 0 1-2 0l-4.6-4.6a1.4 1.4 0 0 1 0-2l8.5-8.5a1.4 1.4 0 0 1 1-.4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="15.2" cy="8.2" r="1.3" fill="currentColor" />
    </svg>
  );
}

function IconLink() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.5 14.5 14.5 9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M11 6.6 12.3 5.3a3.6 3.6 0 0 1 5.1 5.1L16 11.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M13 17.4 11.7 18.7a3.6 3.6 0 0 1-5.1-5.1L8 12.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3 19 6v5.5c0 5-3 8-7 9.5-4-1.5-7-4.5-7-9.5V6l7-3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9.5 12.2 11.3 14 15 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5.5" y="10.5" width="13" height="9" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="14.8" r="1.3" fill="currentColor" />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 12h17M12 3.5c2.4 2.4 3.6 5.4 3.6 8.5s-1.2 6.1-3.6 8.5c-2.4-2.4-3.6-5.4-3.6-8.5S9.6 5.9 12 3.5Z" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function IconPlug() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 3.5v4.2M15 3.5v4.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M6.5 7.7h11v3.6a5.5 5.5 0 0 1-11 0V7.7Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 16.8V21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconInfo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 11v5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="8" r="1" fill="currentColor" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="3.6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4.8 20c1-3.4 4-5.4 7.2-5.4s6.2 2 7.2 5.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconStack() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3 20.5 7.5 12 12 3.5 7.5 12 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M3.5 12 12 16.5 20.5 12" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M3.5 16.5 12 21 20.5 16.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7v5.3l3.6 2.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------

function toneForValue(value) {
  const v = String(value || "").toLowerCase();
  if (v.includes("healthy") || v.includes("enabled") || v.includes("connected") || v.includes("ready") || v.includes("live")) {
    return "success";
  }
  if (v.includes("development") || v.includes("pending") || v.includes("degraded")) {
    return "warning";
  }
  if (v.includes("error") || v.includes("down") || v.includes("disabled") || v.includes("disconnected")) {
    return "danger";
  }
  return "info";
}

// ------------------------------------------------------------------
// Reusable pieces
// ------------------------------------------------------------------

function SectionHeading({ eyebrow, title, description, accent }) {
  return (
    <div className="settings-section__heading" style={{ "--accent": accent }}>
      <span className="settings-section__rail" />
      <div>
        <span className="settings-section__eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}

function ConfigRow({ icon, label, value, index }) {
  return (
    <div className="config-row" style={{ "--delay": `${index * 70}ms` }}>
      <span className="config-row__icon">{icon}</span>
      <div className="config-row__text">
        <span className="config-row__label">{label}</span>
        <span className="config-row__value">{value ?? "—"}</span>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, index }) {
  return (
    <div className="stat-card" style={{ "--delay": `${index * 70}ms` }}>
      <span className="stat-card__icon">{icon}</span>
      <span className="stat-card__value">{Number(value ?? 0).toLocaleString()}</span>
      <span className="stat-card__label">{label}</span>
    </div>
  );
}

function StatusBadge({ label, value, index }) {
  const tone = toneForValue(value);
  return (
    <div className="status-badge" style={{ "--delay": `${index * 70}ms` }}>
      <span className="status-badge__label">{label}</span>
      <span className={`status-badge__pill status-badge__pill--${tone}`}>
        <span className="status-badge__dot" />
        {value ?? "Unknown"}
      </span>
    </div>
  );
}

// ------------------------------------------------------------------
// Skeleton loading
// ------------------------------------------------------------------

function SettingsSkeleton() {
  return (
    <div className="settings-skeleton" aria-busy="true" aria-label="Loading settings">
      <div className="skeleton-block skeleton-block--hero" />
      <div className="skeleton-grid skeleton-grid--rows">
        <div className="skeleton-block skeleton-block--row" />
        <div className="skeleton-block skeleton-block--row" />
        <div className="skeleton-block skeleton-block--row" />
        <div className="skeleton-block skeleton-block--row" />
      </div>
      <div className="skeleton-grid skeleton-grid--cards">
        <div className="skeleton-block skeleton-block--card" />
        <div className="skeleton-block skeleton-block--card" />
        <div className="skeleton-block skeleton-block--card" />
        <div className="skeleton-block skeleton-block--card" />
      </div>
      <div className="skeleton-grid skeleton-grid--rows">
        <div className="skeleton-block skeleton-block--row" />
        <div className="skeleton-block skeleton-block--row" />
      </div>
      <div className="skeleton-grid skeleton-grid--badges">
        <div className="skeleton-block skeleton-block--badge" />
        <div className="skeleton-block skeleton-block--badge" />
        <div className="skeleton-block skeleton-block--badge" />
        <div className="skeleton-block skeleton-block--badge" />
      </div>
      <div className="skeleton-block skeleton-block--about" />
    </div>
  );
}

function SettingsError({ message, onRetry }) {
  return (
    <div className="settings-error">
      <div className="settings-error__icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 8v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="12" cy="16.2" r="1" fill="currentColor" />
        </svg>
      </div>
      <h3>Settings couldn't load</h3>
      <p>{message || "Something went wrong while fetching your configuration."}</p>
      <button type="button" className="settings-error__retry" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}

// ------------------------------------------------------------------
// Main Page
// ------------------------------------------------------------------

export default function Settings() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [errorMessage, setErrorMessage] = useState("");

  const loadSettings = async () => {
    setStatus("loading");
    setErrorMessage("");
    try {
      const payload = await getSettings();
      setData(payload || null);
      setStatus("success");
    } catch (err) {
      setErrorMessage(err?.message || "Unable to reach the settings service.");
      setStatus("error");
    }
  };

  useEffect(() => {
    loadSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const aiConfiguration = data?.ai_configuration || {};
  const knowledgeBase = data?.knowledge_base || {};
  const application = data?.application || {};
  const security = data?.security || {};
  const about = data?.about || {};

  const aiConfigRows = useMemo(
    () => [
      {
  icon: <IconProvider />,
  label: "LLM Providers",
  value: (
    <div className="llm-provider-list">
      <span className="llm-provider-badge gemini">
        Gemini 2.0 Flash
      </span>

      <span className="llm-provider-badge grok">
        Grok
      </span>
    </div>
  ),
},
      { icon: <IconEmbedding />, label: "Embedding Model", value: aiConfiguration.embedding_model },
      { icon: <IconDatabase />, label: "Vector Database", value: aiConfiguration.vector_database },
      { icon: <IconCollection />, label: "Collection Name", value: aiConfiguration.collection_name },
    ],
    [aiConfiguration]
  );

  const knowledgeStats = useMemo(
    () => [
      { icon: <IconDocuments />, label: "Documents", value: knowledgeBase.documents },
      { icon: <IconDepartments />, label: "Departments", value: knowledgeBase.departments },
      { icon: <IconChunks />, label: "Chunks", value: knowledgeBase.chunks },
      { icon: <IconVectors />, label: "Vectors", value: knowledgeBase.vectors },
    ],
    [knowledgeBase]
  );

  const applicationRows = useMemo(
    () => [
      { icon: <IconServer />, label: "Backend Status", value: application.backend_status },
      { icon: <IconEnvironment />, label: "Environment", value: application.environment },
      { icon: <IconTag />, label: "API Version", value: application.version },
      { icon: <IconLink />, label: "API URL", value: application.api_url },
    ],
    [application]
  );

  const securityBadges = useMemo(
    () => [
      { icon: <IconShield />, label: "Authentication", value: security.authentication },
      { icon: <IconLock />, label: "HTTPS", value: security.https },
      { icon: <IconGlobe />, label: "CORS", value: security.cors },
      { icon: <IconPlug />, label: "API Status", value: security.api_status },
    ],
    [security]
  );

  return (
    <div className="settings-page">
      <div className="settings-page__backdrop" aria-hidden="true" />

      <header className="settings-hero">
        <div className="settings-hero__eyebrow">
          <span className="settings-hero__dot" />
          Live configuration
        </div>
        <h1 className="settings-hero__title">Settings</h1>
        <p className="settings-hero__subtitle">Enterprise AI Knowledge Hub Configuration</p>
      </header>

      {status === "loading" && <SettingsSkeleton />}

      {status === "error" && <SettingsError message={errorMessage} onRetry={loadSettings} />}

      {status === "success" && (
        <>
          {/* SECTION 1 — AI Configuration */}
          <section className="settings-section">
            <SectionHeading
              eyebrow="Section 01"
              title="AI Configuration"
              description="Core model and retrieval infrastructure powering the hub"
              accent="#4F7CFF"
            />
            <div className="config-row-list">
              {aiConfigRows.map((row, index) => (
                <ConfigRow key={row.label} icon={row.icon} label={row.label} value={row.value} index={index} />
              ))}
            </div>
          </section>

          {/* SECTION 2 — Knowledge Base */}
          <section className="settings-section">
            <SectionHeading
              eyebrow="Section 02"
              title="Knowledge Base"
              description="Snapshot of everything currently indexed"
              accent="#22D3EE"
            />
            <div className="stat-card-grid">
              {knowledgeStats.map((stat, index) => (
                <StatCard key={stat.label} icon={stat.icon} label={stat.label} value={stat.value} index={index} />
              ))}
            </div>
          </section>

          {/* SECTION 3 — Application */}
          <section className="settings-section">
            <SectionHeading
              eyebrow="Section 03"
              title="Application"
              description="Runtime environment and API connectivity"
              accent="#34D399"
            />
            <div className="config-row-list">
              {applicationRows.map((row, index) => (
                <ConfigRow key={row.label} icon={row.icon} label={row.label} value={row.value} index={index} />
              ))}
            </div>
          </section>

          {/* SECTION 4 — Security */}
          <section className="settings-section">
            <SectionHeading
              eyebrow="Section 04"
              title="Security"
              description="Access control and transport protection"
              accent="#A855F7"
            />
            <div className="status-badge-grid">
              {securityBadges.map((badge, index) => (
                <StatusBadge key={badge.label} label={badge.label} value={badge.value} index={index} />
              ))}
            </div>
          </section>

          {/* SECTION 5 — About */}
          <section className="settings-section">
            <SectionHeading
              eyebrow="Section 05"
              title="About"
              description="Project identity and release information"
              accent="#F472B6"
            />
            <div className="about-card">
              <div className="about-card__glow" aria-hidden="true" />
              <div className="about-card__top">
                <span className="about-card__icon">
                  <IconInfo />
                </span>
                <div>
                  <h3>{about.project_name || "Enterprise AI Knowledge Hub"}</h3>
                  <p>{about.tech_stack}</p>
                </div>
              </div>
              <div className="about-card__grid">
                <div className="about-card__item">
                  <span className="about-card__item-icon">
                    <IconUser />
                  </span>
                  <div>
                    <span className="about-card__item-label">Developer</span>
                    <span className="about-card__item-value">{about.developer || "—"}</span>
                  </div>
                </div>
                <div className="about-card__item">
                  <span className="about-card__item-icon">
                    <IconStack />
                  </span>
                  <div>
                    <span className="about-card__item-label">Tech Stack</span>
                    <span className="about-card__item-value">{about.tech_stack || "—"}</span>
                  </div>
                </div>
                <div className="about-card__item">
                  <span className="about-card__item-icon">
                    <IconClock />
                  </span>
                  <div>
                    <span className="about-card__item-label">Last Updated</span>
                    <span className="about-card__item-value">{about.last_updated || "—"}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
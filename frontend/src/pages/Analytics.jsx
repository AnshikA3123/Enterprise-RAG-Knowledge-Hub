import { useEffect, useMemo, useRef, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { getAnalytics } from "../services/analyticsApi";
import "../styles/Analytics.css";
import "../styles/Dashboard.css";


// ------------------------------------------------------------------
// Static config
// ------------------------------------------------------------------

const DEPARTMENT_PALETTE = [
  "#4F7CFF", // blue
  "#8B5CF6", // violet
  "#22D3EE", // cyan
  "#A855F7", // purple
  "#6366F1", // indigo
  "#38BDF8", // sky
  "#C084FC", // light purple
  "#3B82F6", // strong blue
];

function colorForIndex(index) {
  return DEPARTMENT_PALETTE[index % DEPARTMENT_PALETTE.length];
}

// ------------------------------------------------------------------
// Small inline icon set (no external icon package required)
// ------------------------------------------------------------------

function DocumentsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 2.5h8l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 20V4A1.5 1.5 0 0 1 5.5 2.5H6Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M14 2.5V7h4.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8 12h8M8 15.5h8M8 8.5h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function DepartmentsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function ChunksIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.5 21 7.5 12 12.5 3 7.5 12 2.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M3 12.5 12 17.5 21 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M3 17.2 12 22.2l9-5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function VectorsIcon() {
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

function TrendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 16.5 10 10.5 14 14.5 20 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 7.5h5v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ------------------------------------------------------------------
// Count-up hook for animated KPI numbers
// ------------------------------------------------------------------

function useCountUp(target, duration = 1100, startWhen = true) {
  const [value, setValue] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!startWhen) return undefined;
    const safeTarget = Number.isFinite(target) ? target : 0;

    if (safeTarget === 0) {
      setValue(0);
      return undefined;
    }

    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(safeTarget * eased));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration, startWhen]);

  return value;
}

// ------------------------------------------------------------------
// KPI Card
// ------------------------------------------------------------------

function KpiCard({ label, value, icon, accent, delay }) {
  const animated = useCountUp(value, 1200, true);

  return (
    <div
      className="kpi-card"
      style={{ "--accent": accent, "--delay": `${delay}ms` }}
    >
      <div className="kpi-card__glow" />
      <div className="kpi-card__top">
        <span className="kpi-card__icon">{icon}</span>
        <span className="kpi-card__badge">Live</span>
      </div>
      <div className="kpi-card__value">{animated.toLocaleString()}</div>
      <div className="kpi-card__label">{label}</div>
    </div>
  );
}

// ------------------------------------------------------------------
// Custom Recharts Tooltip
// ------------------------------------------------------------------

function BarTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const entry = payload[0];

  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip__label">{label}</div>
      <div className="chart-tooltip__row">
        <span className="chart-tooltip__dot" style={{ background: entry.color || "#4F7CFF" }} />
        <span className="chart-tooltip__key">Documents</span>
        <span className="chart-tooltip__value">{entry.value}</span>
      </div>
    </div>
  );
}

function PieTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const entry = payload[0];

  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip__label">{entry.name}</div>
      <div className="chart-tooltip__row">
        <span className="chart-tooltip__dot" style={{ background: entry.payload.fill }} />
        <span className="chart-tooltip__key">Share</span>
        <span className="chart-tooltip__value">{entry.value}</span>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Progress Row (Knowledge Distribution)
// ------------------------------------------------------------------

function ProgressRow({ department, count, percent, color, delay }) {
  const [widthReady, setWidthReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setWidthReady(true), 80 + delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div className="progress-row">
      <div className="progress-row__meta">
        <span className="progress-row__name">{department}</span>
        <span className="progress-row__count">
          {count} <span className="progress-row__percent">({percent.toFixed(1)}%)</span>
        </span>
      </div>
      <div className="progress-row__track">
        <div
          className="progress-row__fill"
          style={{
            width: widthReady ? `${percent}%` : "0%",
            background: `linear-gradient(90deg, ${color}, ${color}CC)`,
          }}
        />
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Loading / Error / Empty states
// ------------------------------------------------------------------

function LoadingState() {
  return (
    <div className="state-panel state-panel--loading">
      <div className="pulse-ring">
        <div className="pulse-ring__core" />
      </div>
      <h3>Crunching your knowledge metrics</h3>
      <p>Pulling the latest analytics from your knowledge base.</p>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="state-panel state-panel--error">
      <div className="state-panel__icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 8v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="12" cy="16.2" r="1" fill="currentColor" />
        </svg>
      </div>
      <h3>Analytics couldn't load</h3>
      <p>{message || "Something went wrong while fetching analytics data."}</p>
      {onRetry && (
        <button type="button" className="state-panel__retry" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="state-panel state-panel--empty">
      <div className="state-panel__icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 19V6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5V19" stroke="currentColor" strokeWidth="1.6" />
          <path d="M4 19h16M9 12h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </div>
      <h3>No analytics yet</h3>
      <p>Once documents are ingested into your knowledge base, insights will appear here.</p>
    </div>
  );
}

// ------------------------------------------------------------------
// Main Page
// ------------------------------------------------------------------

export default function Analytics() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [errorMessage, setErrorMessage] = useState("");

  const loadAnalytics = async () => {
    setStatus("loading");
    setErrorMessage("");
    try {
      const response = await getAnalytics();
      // analyticsApi.js may return the payload directly, or an axios-style
      // response object with a `.data` field. Handle both without touching
      // the service file itself.
      const payload = response && response.data ? response.data : response;
      setData(payload || null);
      setStatus("success");
    } catch (err) {
      setErrorMessage(err?.message || "Unable to reach the analytics service.");
      setStatus("error");
    }
  };

  useEffect(() => {
    loadAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const summary = data?.summary || {};
  const departmentDistribution = useMemo(
    () => (Array.isArray(data?.department_distribution) ? data.department_distribution : []),
    [data]
  );

  const totalDocuments = summary.documents ?? 0;
  const totalDepartments = summary.departments ?? 0;
  const totalChunks = summary.chunks ?? 0;
  const totalVectors = summary.vectors ?? 0;

  const stats = useMemo(() => {
    if (!departmentDistribution.length) {
      return {
        largestDepartment: "—",
        largestDepartmentCount: 0,
        avgDocsPerDepartment: 0,
      };
    }

    const largest = departmentDistribution.reduce((max, current) =>
      current.count > max.count ? current : max
    );

    const avg = totalDepartments > 0 ? totalDocuments / totalDepartments : 0;

    return {
      largestDepartment: largest.department,
      largestDepartmentCount: largest.count,
      avgDocsPerDepartment: avg,
    };
  }, [departmentDistribution, totalDepartments, totalDocuments]);

  const chartData = useMemo(
    () =>
      departmentDistribution.map((entry, index) => ({
        ...entry,
        fill: colorForIndex(index),
      })),
    [departmentDistribution]
  );

  const isEmpty =
    status === "success" &&
    totalDocuments === 0 &&
    departmentDistribution.length === 0;

  return (
    <div className="analytics-page">
      <div className="analytics-page__backdrop" aria-hidden="true" />

      <header className="analytics-hero">
        <div className="analytics-hero__eyebrow">
          <span className="analytics-hero__dot" />
          Live analytics
        </div>
        <h1 className="analytics-hero__title">Enterprise Analytics</h1>
        <p className="analytics-hero__subtitle">
          A real-time view of how knowledge flows through your organization.
        </p>
      </header>

      {status === "loading" && <LoadingState />}

      {status === "error" && <ErrorState message={errorMessage} onRetry={loadAnalytics} />}

      {status === "success" && isEmpty && <EmptyState />}

      {status === "success" && !isEmpty && (
        <>
          {/* KPI Cards */}
          <section className="kpi-grid">
            <KpiCard
              label="Documents"
              value={totalDocuments}
              icon={<DocumentsIcon />}
              accent="#4F7CFF"
              delay={0}
            />
            <KpiCard
              label="Departments"
              value={totalDepartments}
              icon={<DepartmentsIcon />}
              accent="#8B5CF6"
              delay={80}
            />
            <KpiCard
              label="Chunks"
              value={totalChunks}
              icon={<ChunksIcon />}
              accent="#22D3EE"
              delay={160}
            />
            <KpiCard
              label="Vectors"
              value={totalVectors}
              icon={<VectorsIcon />}
              accent="#A855F7"
              delay={240}
            />
          </section>

          {/* Bar + Doughnut Charts */}
          <section className="charts-grid">
            <div className="panel panel--chart">
              <div className="panel__header">
                <div>
                  <h2>Department Distribution</h2>
                  <p>Document volume across every connected department</p>
                </div>
              </div>
              <div className="panel__chart-body">
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={chartData} margin={{ top: 12, right: 16, left: -12, bottom: 0 }}>
                    <defs>
                      {chartData.map((entry, index) => (
                        <linearGradient
                          id={`barGradient-${index}`}
                          key={entry.department}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor={entry.fill} stopOpacity={0.95} />
                          <stop offset="100%" stopColor={entry.fill} stopOpacity={0.35} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 6" stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis
                      dataKey="department"
                      tick={{ fill: "#8792AD", fontSize: 12, fontFamily: "JetBrains Mono, monospace" }}
                      axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: "#8792AD", fontSize: 12, fontFamily: "JetBrains Mono, monospace" }}
                      axisLine={false}
                      tickLine={false}
                      width={32}
                    />
                    <Tooltip content={<BarTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                    <Bar dataKey="count" radius={[10, 10, 10, 10]} maxBarSize={46} animationDuration={900}>
                      {chartData.map((entry, index) => (
                        <Cell key={entry.department} fill={`url(#barGradient-${index})`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="panel panel--donut">
              <div className="panel__header">
                <div>
                  <h2>Department Breakdown</h2>
                  <p>Share of total documents</p>
                </div>
              </div>
              <div className="panel__chart-body">
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Tooltip content={<PieTooltip />} />
                    <Pie
                      data={chartData}
                      dataKey="count"
                      nameKey="department"
                      innerRadius={72}
                      outerRadius={110}
                      paddingAngle={3}
                      cornerRadius={8}
                      animationDuration={900}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={entry.department} fill={entry.fill} stroke="rgba(10,14,26,0.6)" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Legend
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                      iconType="circle"
                      wrapperStyle={{ fontSize: 12, color: "#B7C0DA", lineHeight: "22px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* Knowledge Distribution */}
          <section className="panel panel--distribution">
            <div className="panel__header">
              <div>
                <h2>Knowledge Distribution</h2>
                <p>Relative document share by department</p>
              </div>
            </div>
            <div className="progress-list">
              {departmentDistribution.map((entry, index) => (
                <ProgressRow
                  key={entry.department}
                  department={entry.department}
                  count={entry.count}
                  percent={totalDocuments > 0 ? (entry.count / totalDocuments) * 100 : 0}
                  color={colorForIndex(index)}
                  delay={index * 90}
                />
              ))}
            </div>
          </section>

          {/* Enterprise Statistics */}
          <section className="panel panel--stats">
            <div className="panel__header">
              <div>
                <h2>Enterprise Statistics</h2>
                <p>Computed from your live department distribution</p>
              </div>
              <span className="panel__header-icon">
                <TrendIcon />
              </span>
            </div>
            <div className="stats-grid">
              <div className="stat-tile">
                <span className="stat-tile__label">Largest department</span>
                <span className="stat-tile__value">{stats.largestDepartment}</span>
                <span className="stat-tile__meta">{stats.largestDepartmentCount} documents</span>
              </div>
              <div className="stat-tile">
                <span className="stat-tile__label">Avg. documents / department</span>
                <span className="stat-tile__value">{stats.avgDocsPerDepartment.toFixed(1)}</span>
                <span className="stat-tile__meta">across {totalDepartments} departments</span>
              </div>
              <div className="stat-tile">
                <span className="stat-tile__label">Total documents</span>
                <span className="stat-tile__value">{totalDocuments.toLocaleString()}</span>
                <span className="stat-tile__meta">ingested to date</span>
              </div>
              <div className="stat-tile">
                <span className="stat-tile__label">Total departments</span>
                <span className="stat-tile__value">{totalDepartments}</span>
                <span className="stat-tile__meta">connected to the hub</span>
              </div>
              <div className="stat-tile">
                <span className="stat-tile__label">Total chunks</span>
                <span className="stat-tile__value">{totalChunks.toLocaleString()}</span>
                <span className="stat-tile__meta">indexed segments</span>
              </div>
              <div className="stat-tile">
                <span className="stat-tile__label">Total vectors</span>
                <span className="stat-tile__value">{totalVectors.toLocaleString()}</span>
                <span className="stat-tile__meta">embedded &amp; searchable</span>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
import { useEffect, useState } from "react";
import {
  HiOutlineBuildingOffice2,
  HiOutlineDocumentText,
  HiOutlineCircleStack,
  HiOutlineServerStack,
  HiOutlineChatBubbleLeftRight,
} from "react-icons/hi2";

import { getDashboardStats } from "../services/dashboardApi";
import "../styles/Dashboard.css";

function StatCard({ icon, title, value, subtitle }) {
  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <div className="dashboard-icon">{icon}</div>

        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="dashboard-card-value">{value}</div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const data = await getDashboardStats();

      console.log("Dashboard API Response:", data);
      console.log("Recent Conversations:", data.recent_conversations);

      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading dashboard...
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="dashboard-loading">
        Failed to load dashboard.
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      <div className="dashboard-title">
        <h2>Workspace Overview</h2>
        <p>
          Enterprise AI Knowledge Hub statistics and infrastructure.
        </p>
      </div>

      <div className="dashboard-grid">

        <StatCard
          icon={<HiOutlineBuildingOffice2 />}
          title="Departments"
          subtitle="Knowledge Base"
          value={stats.departments}
        />

        <StatCard
          icon={<HiOutlineDocumentText />}
          title="Documents"
          subtitle="Indexed Files"
          value={stats.documents}
        />

        <StatCard
          icon={<HiOutlineCircleStack />}
          title="Chunks"
          subtitle="Embeddings"
          value={stats.chunks}
        />

        <StatCard
          icon={<HiOutlineServerStack />}
          title="Vectors"
          subtitle="Stored in Qdrant"
          value={stats.vectors}
        />

      </div>

      <div className="dashboard-bottom">

        <div className="dashboard-panel">

          <h3>AI Configuration</h3>

          <div className="dashboard-info-row">
            <span>Provider</span>
            <strong>{stats.provider}</strong>
          </div>

          <div className="dashboard-info-row">
            <span>Embedding Model</span>
            <strong>{stats.embedding_model}</strong>
          </div>

        </div>

        <div className="dashboard-panel">

          <h3>Infrastructure</h3>

          <div className="dashboard-info-row">
            <span>Vector Database</span>
            <strong>{stats.vector_database}</strong>
          </div>

          <div className="dashboard-info-row">
            <span>Collection</span>
            <strong>{stats.collection_name}</strong>
          </div>

        </div>

      </div>

      <div className="dashboard-panel conversation-panel">

        <h3>
          <HiOutlineChatBubbleLeftRight />
          <span style={{ marginLeft: "10px" }}>
            Recent Conversations
          </span>
        </h3>

        {stats.recent_conversations &&
        stats.recent_conversations.length > 0 ? (

          <div className="conversation-list-dashboard">

            {stats.recent_conversations.map((title, index) => (

              <div
                className="conversation-card"
                key={`conversation-${index}`}
              >
                <div className="conversation-title">
                  {title}
                </div>
              </div>

            ))}

          </div>

        ) : (

          <p className="conversation-empty">
            No conversations available.
          </p>

        )}

      </div>

    </div>
  );
}
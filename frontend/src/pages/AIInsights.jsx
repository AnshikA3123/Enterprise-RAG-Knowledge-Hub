import { useEffect, useState } from "react";
import {
  HiOutlineBuildingOffice2,
  HiOutlineDocumentText,
  HiOutlineCircleStack,
  HiOutlineCpuChip,
  HiOutlineServerStack,
  HiOutlineShieldCheck,
} from "react-icons/hi2";

import { getAIInsights } from "../services/insightsApi";
import "../styles/AIInsights.css";

function StatCard({ icon, title, subtitle, value }) {
  return (
    <div className="insights-card">
      <div className="insights-card-header">
        <div className="insights-icon">
          {icon}
        </div>

        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="insights-card-value">
        {value}
      </div>
    </div>
  );
}

export default function AIInsights() {

  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInsights();
  }, []);

  async function loadInsights() {
    try {

      const data = await getAIInsights();

      console.log("AI Insights:", data);

      setInsights(data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading AI Insights...
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="dashboard-loading">
        Failed to load AI Insights.
      </div>
    );
  }

  const overview = insights.knowledge_overview;
  const infra = insights.infrastructure;
  const health = insights.system_health;

  return (

    <div className="dashboard-page">

      <div className="dashboard-title">
        <h2>AI Insights</h2>
        <p>
          Enterprise AI infrastructure, knowledge base health and intelligent analytics.
        </p>
      </div>

      <div className="dashboard-grid">

        <StatCard
          icon={<HiOutlineDocumentText />}
          title="Documents"
          subtitle="Knowledge Base"
          value={overview.documents}
        />

        <StatCard
          icon={<HiOutlineBuildingOffice2 />}
          title="Departments"
          subtitle="Organized Collections"
          value={overview.departments}
        />

        <StatCard
          icon={<HiOutlineCircleStack />}
          title="Chunks"
          subtitle="Embedded Vectors"
          value={overview.chunks}
        />

        <StatCard
          icon={<HiOutlineServerStack />}
          title="Indexed"
          subtitle="Indexed Documents"
          value={overview.indexed_documents}
        />

      </div>

      <div className="dashboard-bottom">

        <div className="dashboard-panel">

          <h3>
            <HiOutlineCpuChip />
            AI Infrastructure
          </h3>

          <div className="dashboard-info-row">
            <span>LLM Providers</span>

            <div className="llm-badges">

              {infra.llm_providers.map((provider) => (

                <span
                  key={provider}
                  className="llm-badge"
                >
                  {provider}
                </span>

              ))}

            </div>

          </div>

          <div className="dashboard-info-row">
            <span>Embedding Model</span>
            <strong>{infra.embedding_model}</strong>
          </div>

          <div className="dashboard-info-row">
            <span>Vector Database</span>
            <strong>{infra.vector_database}</strong>
          </div>

          <div className="dashboard-info-row">
            <span>Collection</span>
            <strong>{infra.collection_name}</strong>
          </div>

        </div>

        <div className="dashboard-panel">

          <h3>
            <HiOutlineShieldCheck />
            System Health
          </h3>

          <div className="dashboard-info-row">
            <span>Backend</span>
            <strong>{health.backend}</strong>
          </div>

          <div className="dashboard-info-row">
            <span>Knowledge Base</span>
            <strong>{health.knowledge_base}</strong>
          </div>

          <div className="dashboard-info-row">
            <span>Vector Database</span>
            <strong>{health.vector_database}</strong>
          </div>

          <div className="dashboard-info-row">
            <span>Embeddings</span>
            <strong>{health.embeddings}</strong>
          </div>

        </div>

      </div>

      <div className="dashboard-panel">

        <h3>Department Distribution</h3>

        <div className="department-grid">

          {insights.department_distribution.map((dept) => (

            <div
              key={dept.department}
              className="department-card"
            >

              <h4>{dept.department}</h4>

              <p>
                {dept.document_count} Documents
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>

  );
}
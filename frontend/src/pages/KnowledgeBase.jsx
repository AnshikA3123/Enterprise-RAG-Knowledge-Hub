import { useEffect, useState } from "react";
import {
  HiOutlineCircleStack,
  HiOutlineDocumentText,
  HiOutlineMagnifyingGlass,
} from "react-icons/hi2";

import { getKnowledgeBase } from "../services/knowledgeApi";
import "../styles/KnowledgeBase.css";

export default function KnowledgeBase() {
  const [knowledge, setKnowledge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadKnowledge();
  }, []);

  async function loadKnowledge() {
    try {
      const data = await getKnowledgeBase();
      setKnowledge(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="kb-loading">
        Loading Knowledge Base...
      </div>
    );
  }

  const filteredDocs = knowledge.documents.filter((doc) =>
    doc.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="kb-page">

      <div className="kb-header">
        <h2>Knowledge Base</h2>
        <p>
          Browse all indexed enterprise documents.
        </p>
      </div>

      <div className="kb-departments">

        {knowledge.departments.map((dept) => (
          <div
            key={dept.name}
            className="kb-department-card"
          >
            <HiOutlineCircleStack />

            <div>
              <h3>{dept.name}</h3>
              <p>{dept.document_count} Documents</p>
            </div>
          </div>
        ))}

      </div>

      <div className="kb-search">

        <HiOutlineMagnifyingGlass />

        <input
          type="text"
          placeholder="Search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      <div className="kb-document-list">

        {filteredDocs.map((doc) => (
          <div
            key={`${doc.department}-${doc.name}`}
            className="kb-document-card"
          >
            <div className="kb-document-left">

              <HiOutlineDocumentText />

              <div>

                <h3>{doc.name}</h3>

                <p>
                  {doc.department}
                </p>

              </div>

            </div>

            <div className="kb-document-right">

              <span className="kb-type">
                {doc.file_type}
              </span>

              <span>{doc.file_size}</span>

              <span
                className={
                  doc.indexed
                    ? "kb-status indexed"
                    : "kb-status"
                }
              >
                Indexed
              </span>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}
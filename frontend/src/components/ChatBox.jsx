import React, { useEffect, useRef } from "react";
import { HiOutlineSparkles, HiOutlineCircleStack, HiOutlineBolt, HiOutlineLockClosed } from "react-icons/hi2";
import Message from "./Message";
import Loading from "./Loading";
import "../styles/Chat.css";

const SUGGESTIONS = [
  "Summarize the Employee Handbook's leave policy",
  "What are the key clauses in our vendor contracts?",
  "List onboarding steps for new engineering hires",
  "What does the security compliance policy cover?",
];

function EmptyState({ onSuggestionClick }) {
  return (
    <div className="chat-empty-state">
      <div className="chat-empty-glow" aria-hidden="true" />
      <div className="chat-empty-icon">
        <HiOutlineSparkles aria-hidden="true" />
      </div>
      <h2>Ask your knowledge base anything</h2>
      <p>
        Every answer is grounded in your organization's documents, retrieved live from your
        vector index and cited by source and page.
      </p>

      <div className="chat-empty-features">
        <div className="chat-empty-feature">
          <HiOutlineCircleStack aria-hidden="true" />
          <span>Vector-grounded retrieval</span>
        </div>
        <div className="chat-empty-feature">
          <HiOutlineBolt aria-hidden="true" />
          <span>Low-latency responses</span>
        </div>
        <div className="chat-empty-feature">
          <HiOutlineLockClosed aria-hidden="true" />
          <span>Private, enterprise-only index</span>
        </div>
      </div>

      <div className="chat-suggestion-grid">
        {SUGGESTIONS.map((suggestion) => (
          <button
            type="button"
            key={suggestion}
            className="chat-suggestion-chip"
            onClick={() => onSuggestionClick(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

function ChatBox({ messages, isLoading, onSuggestionClick }) {
  const scrollAnchorRef = useRef(null);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  return (
    <div className="chat-box">
      {messages.length === 0 ? (
        <EmptyState onSuggestionClick={onSuggestionClick} />
      ) : (
        <div className="chat-message-list">
          {messages.map((message) => (
            <Message
              key={message.id}
              role={message.role}
              content={message.content}
              sources={message.sources}
              isError={message.isError}
            />
          ))}
          {isLoading && <Loading />}
          <div ref={scrollAnchorRef} />
        </div>
      )}
    </div>
  );
}

export default ChatBox;

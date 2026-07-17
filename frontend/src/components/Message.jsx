import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  HiOutlineClipboard,
  HiOutlineCheck,
  HiOutlineDocumentText,
  HiOutlineUser,
  HiOutlineSparkles,
  HiOutlineExclamationTriangle,
} from "react-icons/hi2";
import "../styles/Message.css";

function CodeBlock({ className, children, node, ...rest }) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const codeString = String(children).replace(/\n$/, "");

  if (!match) {
    return (
      <code className="inline-code" {...rest}>
        {children}
      </code>
    );
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      /* clipboard unavailable — fail silently */
    }
  };

  return (
    <div className="code-block">
      <div className="code-block-header">
        <span className="code-block-lang">{match ? match[1] : "text"}</span>
        <button type="button" className="code-block-copy" onClick={handleCopyCode}>
          {copied ? <HiOutlineCheck aria-hidden="true" /> : <HiOutlineClipboard aria-hidden="true" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="code-block-pre">
        <code className={className}>{codeString}</code>
      </pre>
    </div>
  );
}

function SourceCard({ source, index }) {
  return (
    <div className="source-card">
      <span className="source-card-tab">{String(index + 1).padStart(2, "0")}</span>
      <HiOutlineDocumentText className="source-card-icon" aria-hidden="true" />
      <div className="source-card-meta">
        <span className="source-card-file">{source.file}</span>
        {source.page !== undefined && source.page !== null && (
          <span className="source-card-page">Page {source.page}</span>
        )}
      </div>
    </div>
  );
}

function Message({ role, content, sources, isError }) {
  const [copied, setCopied] = useState(false);
  const isUser = role === "user";

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      /* clipboard unavailable — fail silently */
    }
  };

  return (
    <div className={`message-row ${isUser ? "message-row-user" : "message-row-ai"}`}>
      <div className={`message-avatar ${isUser ? "message-avatar-user" : "message-avatar-ai"}`}>
        {isUser ? (
          <HiOutlineUser aria-hidden="true" />
        ) : isError ? (
          <HiOutlineExclamationTriangle aria-hidden="true" />
        ) : (
          <HiOutlineSparkles aria-hidden="true" />
        )}
      </div>

      <div className="message-content-col">
        <div className="message-meta-line">
          <span className="message-author">{isUser ? "You" : "Knowledge Hub AI"}</span>
        </div>

        <div className={`message-bubble ${isUser ? "message-bubble-user" : "message-bubble-ai"} ${isError ? "message-bubble-error" : ""}`}>
          <div className="message-markdown">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code: CodeBlock,
                pre: ({ children }) => <>{children}</>,
              }}
            >
              {content}
            </ReactMarkdown>
          </div>

          {!isUser && !isError && (
            <button type="button" className="message-copy-btn" onClick={handleCopyMessage} aria-label="Copy response">
              {copied ? <HiOutlineCheck aria-hidden="true" /> : <HiOutlineClipboard aria-hidden="true" />}
            </button>
          )}
        </div>

        {!isUser && Array.isArray(sources) && sources.length > 0 && (
          <div className="source-card-grid">
            {sources.map((source, index) => (
              <SourceCard key={`${source.file}-${source.page}-${index}`} source={source} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Message;

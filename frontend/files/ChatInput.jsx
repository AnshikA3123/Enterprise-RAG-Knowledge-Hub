import React, { useEffect, useRef, useState } from "react";
import { HiPaperAirplane, HiOutlineTrash } from "react-icons/hi2";
import "../styles/Input.css";

const MAX_TEXTAREA_HEIGHT = 200;

function ChatInput({ onSend, isLoading, onClear, hasMessages }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  }, [value]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <div className="chat-input-dock">
      <form className="chat-input-shell" onSubmit={handleSubmit}>
        {hasMessages && (
          <button
            type="button"
            className="chat-input-clear"
            onClick={onClear}
            aria-label="Clear conversation"
            title="Clear conversation"
          >
            <HiOutlineTrash aria-hidden="true" />
          </button>
        )}

        <textarea
          ref={textareaRef}
          className="chat-input-textarea"
          placeholder="Ask about your knowledge base..."
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={isLoading}
        />

        <button
          type="submit"
          className="chat-input-send"
          disabled={isLoading || value.trim().length === 0}
          aria-label="Send message"
        >
          <HiPaperAirplane aria-hidden="true" />
        </button>
      </form>
      <p className="chat-input-hint">
        Enterprise AI Knowledge Hub can make mistakes. Verify critical information against source documents.
      </p>
    </div>
  );
}

export default ChatInput;

import React, { useCallback, useEffect, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";
import ChatBox from "./components/ChatBox.jsx";
import ChatInput from "./components/ChatInput.jsx";
import { sendChatMessage, checkSystemHealth } from "./services/api.js";
import "./styles/App.css";

const VIEW_LABELS = {
  dashboard: "Overview of your enterprise knowledge operations",
  chat: "Ask questions grounded in your organization's documents",
  "knowledge-base": "Manage vector collections and embeddings",
  documents: "Browse and manage ingested source documents",
  analytics: "Usage, latency, and retrieval quality metrics",
  settings: "Configure models, retrieval, and access controls",
};

let messageIdCounter = 0;
function nextMessageId() {
  messageIdCounter += 1;
  return `msg-${Date.now()}-${messageIdCounter}`;
}

function App() {
  const [activeView, setActiveView] = useState("chat");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBackendOnline, setIsBackendOnline] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function pollHealth() {
      const online = await checkSystemHealth();
      if (isMounted) setIsBackendOnline(online);
    }

    pollHealth();
    const interval = setInterval(pollHealth, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleSend = useCallback(async (question) => {
    const userMessage = { id: nextMessageId(), role: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const data = await sendChatMessage(question);
      const aiMessage = {
        id: nextMessageId(),
        role: "assistant",
        content: data?.answer ?? "No answer was returned by the knowledge base.",
        sources: data?.sources ?? [],
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsBackendOnline(true);
    } catch (error) {
      const errorMessage = {
        id: nextMessageId(),
        role: "assistant",
        content:
          "I couldn't reach the Enterprise AI Knowledge Hub backend at `127.0.0.1:8000`. Confirm the FastAPI service is running and try again.",
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsBackendOnline(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleClear = useCallback(() => {
    setMessages([]);
  }, []);

  const handleNavigate = useCallback((view) => {
    setActiveView(view);
    setIsSidebarOpen(false);
  }, []);

  return (
    <div className="app-shell">
      <div className="app-shell-backdrop" aria-hidden="true">
        <div className="backdrop-mesh backdrop-mesh-one" />
        <div className="backdrop-mesh backdrop-mesh-two" />
        <div className="backdrop-grid" />
      </div>

      <Sidebar
        activeView={activeView}
        onNavigate={handleNavigate}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="app-main">
        <Header
          viewLabel={VIEW_LABELS[activeView]}
          isBackendOnline={isBackendOnline}
          onMenuToggle={() => setIsSidebarOpen((prev) => !prev)}
        />

        <main className="app-content">
          <ChatBox messages={messages} isLoading={isLoading} onSuggestionClick={handleSend} />
          <ChatInput onSend={handleSend} isLoading={isLoading} onClear={handleClear} hasMessages={messages.length > 0} />
        </main>
      </div>
    </div>
  );
}

export default App;

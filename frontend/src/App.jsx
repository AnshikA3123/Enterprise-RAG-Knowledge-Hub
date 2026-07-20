import React, { useCallback, useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ChatBox from "./components/ChatBox";
import ChatInput from "./components/ChatInput";
import { sendChatMessage, checkSystemHealth } from "./services/api";
import "./styles/App.css";
import Dashboard from "./pages/Dashboard";
import KnowledgeBase from "./pages/KnowledgeBase";
import AIInsights from "./pages/AIInsights";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import {
  getConversations,
  getConversationMessages,
} from "./services/conversationApi";

const VIEW_LABELS = {
  dashboard: "Overview of your enterprise knowledge operations",
  chat: "Ask questions grounded in your organization's documents",
  "knowledge-base": "Manage vector collections and embeddings",
  insights: "AI infrastructure, knowledge base health and system insights",
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
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);

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

  useEffect(() => {
  async function loadConversations() {
    try {
      const data = await getConversations();

      setConversations(data);

      console.log("Loaded Conversations:", data);
    } catch (error) {
      console.error(error);
    }
  }
  loadConversations();
}, []);
  

  const handleSend = useCallback(async (question) => {
    const userMessage = {
      id: nextMessageId(),
      role: "user",
      content: question,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const data = await sendChatMessage(
        question,
        selectedConversation
      );

      // If backend created a new conversation,
      // remember it and refresh sidebar.
      if (!selectedConversation && data.conversation_id) {
        setSelectedConversation(data.conversation_id);

        const updatedConversations = await getConversations();
        setConversations(updatedConversations);
      }

      const aiMessage = {
        id: nextMessageId(),
        role: "assistant",
        content:
          data?.answer ??
          "No answer was returned by the knowledge base.",
        sources: data?.sources ?? [],
      };

      setMessages((prev) => [...prev, aiMessage]);

      setIsBackendOnline(true);

    } catch (error) {

      const errorMessage = {
        id: nextMessageId(),
        role: "assistant",
        content:
          "I couldn't reach the Enterprise AI Knowledge Hub backend at http://127.0.0.1:8000. Confirm the FastAPI service is running and try again.",
        isError: true,
      };

      setMessages((prev) => [...prev, errorMessage]);

      setIsBackendOnline(false);

    } finally {

      setIsLoading(false);

    }

  }, [selectedConversation]);
  const loadConversation = useCallback(async (conversationId) => {
  try {
    const data = await getConversationMessages(conversationId);

    const formattedMessages = data.map((message) => ({
      id: message.id,
      role: message.role,
      content: message.content,
      sources: message.sources
        ? JSON.parse(message.sources)
        : [],
    }));

    setMessages(formattedMessages);
    setSelectedConversation(conversationId);

  } catch (error) {
    console.error("Failed to load conversation:", error);
  }
}, []);

  const handleClear = useCallback(() => {
    setMessages([]);
    setSelectedConversation(null);
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
  conversations={conversations}
  selectedConversation={selectedConversation}
  onConversationClick={loadConversation}
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

  {activeView === "dashboard" && (
    <Dashboard />
  )}

  {activeView === "chat" && (
    <>
      <ChatBox
        messages={messages}
        isLoading={isLoading}
        onSuggestionClick={handleSend}
      />

      <ChatInput
        onSend={handleSend}
        isLoading={isLoading}
        onClear={handleClear}
        hasMessages={messages.length > 0}
      />
    </>
  )}

  {activeView === "knowledge-base" && (
    <KnowledgeBase />
  )}

  {activeView === "insights" && (
  <AIInsights />
)}

  {activeView === "analytics" && (
  <Analytics />
)}
  {activeView === "settings" && (
  <Settings />
)}
</main>
      </div>
    </div>
  );
}

export default App;
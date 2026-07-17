import React from "react";

import ReactDOM from "react-dom/client";

import App from "./App";

import "./styles/App.css";
import "./styles/Header.css";
import "./styles/Chat.css";
import "./styles/Message.css";
import "./styles/Input.css";
import "./styles/Loading.css";
import "./styles/Sidebar.css";

ReactDOM.createRoot(

    document.getElementById("root")

).render(

    <React.StrictMode>

        <App />

    </React.StrictMode>

);
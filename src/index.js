import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import AuthContextProvider from "./contexts/AuthContext";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
    <AuthContextProvider>
      <Router>
        <App />
      </Router>
    </AuthContextProvider>
);

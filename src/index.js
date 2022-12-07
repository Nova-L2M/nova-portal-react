import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import AuthContextProvider from "./contexts/AuthContext";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </StrictMode>
);

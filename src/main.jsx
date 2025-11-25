



import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import "./index.css";

//  Get Root Element Safely
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("❌ Root element not found. Make sure your index.html has <div id='root'></div>");
}

const root = createRoot(rootElement);

//  Render Application
root.render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);

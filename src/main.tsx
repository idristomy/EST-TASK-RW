import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Self-hosted AIESEC brand typeface (Lato) — loaded locally to avoid layout shift.
import "@fontsource/lato/300.css";
import "@fontsource/lato/400.css";
import "@fontsource/lato/700.css";
import "@fontsource/lato/900.css";
import "@fontsource/lato/400-italic.css";

import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

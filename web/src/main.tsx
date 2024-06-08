import React from "react";
import ReactDOM from "react-dom/client";
import { AppProvider } from "./providers/app-provider.tsx";
import { AppRoutes } from "./routes/index.tsx";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  </React.StrictMode>,
);

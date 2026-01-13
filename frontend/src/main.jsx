import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

/* ================= GOOGLE OAUTH SAFE SETUP ================= */
const rawGoogleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const googleClientId =
  typeof rawGoogleClientId === "string" ? rawGoogleClientId.trim() : "";

const isGoogleConfigured =
  Boolean(googleClientId) &&
  !["GOOGLE_CLIENT_ID", "YOUR_GOOGLE_CLIENT_ID_HERE"].includes(googleClientId);

if (!isGoogleConfigured && import.meta.env.DEV) {
  console.warn(
    "[EMS] Google Sign-In disabled: set VITE_GOOGLE_CLIENT_ID to a real OAuth Client ID."
  );
}

/* ================= APP TREE ================= */
const AppTree = (
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>
);

/* ================= RENDER ================= */
createRoot(document.getElementById("root")).render(
  <StrictMode>
    {isGoogleConfigured ? (
      <GoogleOAuthProvider clientId={googleClientId}>
        {AppTree}
      </GoogleOAuthProvider>
    ) : (
      AppTree
    )}
  </StrictMode>
);

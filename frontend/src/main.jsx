import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";

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
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{
          top: 20,
          zIndex: 99999,
        }}
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: "12px",
            fontSize: "15px",
            fontWeight: 600,
            padding: "14px 16px",
            minWidth: "320px",
            maxWidth: "92vw",
            boxShadow: "0 14px 34px rgba(15, 23, 42, 0.24)",
          },
          success: {
            iconTheme: {
              primary: "#166534",
              secondary: "#dcfce7",
            },
            style: {
              background: "#ecfdf3",
              color: "#14532d",
              border: "1px solid #86efac",
            },
          },
          error: {
            iconTheme: {
              primary: "#b91c1c",
              secondary: "#fee2e2",
            },
            style: {
              background: "#fef2f2",
              color: "#7f1d1d",
              border: "1px solid #fca5a5",
            },
          },
        }}
      />
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

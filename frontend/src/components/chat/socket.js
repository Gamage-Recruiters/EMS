// src/components/chat/socket.js  (or wherever it is)

import { io } from "socket.io-client";

const URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://your-production-url.com";

const getToken = () => {
  // Option 1: most reliable – read the separate accessToken key
  let token = localStorage.getItem("accessToken");

  // Option 2: fallback if you ever change storage pattern
  if (!token) {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        token = user?.accessToken || user?.token || null;
      } catch (e) {}
    }
  }

  return token;
};

let socket = null;

const initializeSocket = () => {
  const token = getToken();

  console.log(
    "Socket init → token status:",
    token ? `present (${token.substring(0, 10)}...)` : "MISSING"
  );

  if (!token) {
    console.warn(
      "No access token found in localStorage → socket won't authenticate"
    );
  }

  socket = io(URL, {
    withCredentials: true,
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    transports: ["polling", "websocket"],
    auth: {
      token: token || undefined, // send even if undefined (backend will reject gracefully)
    },
  });

  socket.on("connect", () => {
    console.log("Socket CONNECTED! ID:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection failed:", err.message);
    if (err.message.includes("Authentication")) {
      console.warn("Authentication rejected → likely invalid or expired token");
    }
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });

  // Try to connect if we have a token
  if (token) {
    socket.connect();
  }

  return socket;
};

// Run once on module load
initializeSocket();

// Safe getter
export const getSocket = () => {
  if (!socket) {
    initializeSocket();
  }
  return socket;
};

export default getSocket();

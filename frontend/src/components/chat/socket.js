// src/components/chat/socket.js

import { io } from "socket.io-client";

const URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://your-production-url.com";

const getToken = () => {
  let token = localStorage.getItem("accessToken");

  if (!token) {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        token = user?.accessToken || user?.token || null;
      } catch (e) {
        console.warn("Failed to parse user from localStorage:", e);
      }
    }
  }

  return token;
};

let socket = null;

export const initializeSocket = () => {
  const token = getToken();

  console.log(
    "Socket init → token status:",
    token ? `present (${token.substring(0, 10)}...)` : "MISSING",
  );

  if (!token) {
    console.warn("No access token found → socket won't authenticate");
  }

  // If socket already exists, disconnect old one
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  socket = io(URL, {
    withCredentials: true,
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    transports: ["polling", "websocket"],
    auth: {
      token: token || undefined,
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

  // Auto-connect if token exists
  if (token) {
    socket.connect();
  }

  return socket;
};

// Safe getter (always returns current socket, initializes if missing)
export const getSocket = () => {
  if (!socket) {
    initializeSocket();
  }
  return socket;
};

// Force reconnect (useful after login when token changes)
export const reconnectSocket = () => {
  console.log("Forcing socket reconnect...");
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  return initializeSocket();
};

// Optional: default export if you prefer
export default getSocket;

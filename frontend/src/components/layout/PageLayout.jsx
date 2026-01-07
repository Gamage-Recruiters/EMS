// src/components/layout/PageLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function PageLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, background: "#f6f7fb" }}>
        <Header />
        <div style={{ padding: 24 }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
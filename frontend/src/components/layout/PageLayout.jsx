import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function PageLayout() {
  return (
    <div className="flex h-screen overflow-hidden ">
      {/* Sidebar */}
      <div className="z-[9999]">
        <Sidebar />
      </div>

      {/* Main area */}
      <div className="flex flex-col flex-1 bg-[#f6f7fb]">
        {/* Header */}
        <div className="z-[9999]">
          <Header />
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

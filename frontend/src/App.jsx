import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PageLayout from "./components/layout/PageLayout";
import UserManagementPage from "./features/management/pages/UserManagementPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PageLayout />}>
          <Route index element={<Navigate to="/employees" replace />} />
          <Route path="/employees" element={<UserManagementPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

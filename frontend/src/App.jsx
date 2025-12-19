import { Navigate, Route, Routes } from "react-router-dom";
import DailyTaskSheet from "./pages/DailyTaskSheet.jsx";
import ProgressTracking from "./pages/ProgressTracking.jsx";
import TasksPage from "./pages/TasksPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/tasks" replace />} />
      <Route path="/tasks" element={<TasksPage />} />
      <Route path="/tasks/new" element={<DailyTaskSheet />} />
       
      <Route path="/progress" element={<ProgressTracking />} />
       {/* pm route  */}
      <Route path="/progress/pm" element={<ProgressTracking role="PM"/>} />
      

     {/* TL route */}
      <Route path="/progress/tl" element={<ProgressTracking role="TL"/>} />

      <Route path="*" element={<Navigate to="/tasks" replace />} />
    </Routes>
  );
}

export default App;

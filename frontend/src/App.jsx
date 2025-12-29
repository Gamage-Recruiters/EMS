import { Routes, Route } from 'react-router-dom'
import NavBar from './Components/NavBar.jsx'
import Home from './Pages/Home.jsx'
import DeveloperComplaint from './Pages/DeveloperComplaint.jsx'
import ExecutiveComplaint from './Pages/ExecutiveComplaint.jsx'
import Success from './Pages/Success.jsx'
import './App.css'
import Sidebar from './Components/Sidebar.jsx'

export default function App() {
  return (
    <>
      <NavBar /> 
      <Sidebar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/complaints/developer" element={<DeveloperComplaint />} />
          <Route path="/complaints/executive" element={<ExecutiveComplaint />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </div>
    </>
  )
}

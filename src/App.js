App.js

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import EmployeeList from "./pages/EmployeeList";
import CreateUpdateEmployee from "./pages/CreateUpdateEmployee";
import Leave from "./pages/Leave";
import Attendance from "./pages/Attendance";
import Performance from "./pages/Performance";
import Payroll from "./pages/Payroll";
import TaskManagement from "./pages/TaskManagement";
import LoanManagement from "./pages/LoanManagement";
import AssetManagement from "./pages/AssetManagement";
import AnnouncementManagement from "./pages/AnnouncementManagement"; // 👈 1. IMPORT ANNOUNCEMENT PAGE
import "./App.css";
import { Toaster } from "react-hot-toast";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar />
      <Routes>
        {/* Redirect logic based on auth status */}
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Task & Workflow Routes */}
        <Route path="/tasks" element={<TaskManagement />} />
        <Route path="/tasks/:employeeId" element={<TaskManagement />} />

        {/* Finance & Loan Routes */}
        <Route path="/loans" element={<LoanManagement />} />
        <Route path="/loans/:employeeId" element={<LoanManagement />} />

        {/* Inventory & Asset Routes */}
        <Route path="/assets" element={<AssetManagement />} />
        <Route path="/assets/:employeeId" element={<AssetManagement />} />

        {/* 👈 2. ADD ANNOUNCEMENT / BROADCAST ROUTES HERE */}
        <Route path="/announcements" element={<AnnouncementManagement />} />

        {/* HR & Employee Management Routes */}
        <Route path="/employees" element={<EmployeeList />} />
        <Route path="/create-employee" element={<CreateUpdateEmployee mode="create" />} />
        <Route path="/update-employee/:id" element={<CreateUpdateEmployee mode="edit" />} />
        <Route path="/leave" element={<Leave />} />
        <Route path="/leave/:employeeId" element={<Leave />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/attendance/:employeeId" element={<Attendance />} />
        <Route path="/performance" element={<Performance />} />
        <Route path="/performance/:employeeId" element={<Performance />} />
        <Route path="/payroll" element={<Payroll />} />
        <Route path="/payroll/:employeeId" element={<Payroll />} />
      </Routes>
    </Router>
  );
}

export default App;

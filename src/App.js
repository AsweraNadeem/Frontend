import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import EmployeeList from "./pages/EmployeeList";
import CreateUpdateEmployee from "./pages/CreateUpdateEmployee";
import "./App.css";
import { Toaster } from "react-hot-toast";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar />
      <Routes>
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employees" element={<EmployeeList />} />
        <Route path="/create-employee" element={<CreateUpdateEmployee mode="create" />} />
        <Route path="/update-employee/:id" element={<CreateUpdateEmployee mode="edit" />} />
      </Routes>
    </Router>
  );
}

export default App;

import { useState, useEffect } from "react";
import API from "../api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext"; // Pulling the ID from State

export default function TaskManagement() {
  const { auth } = useAuth(); // Access global auth data
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState({ title: "", description: "", priority: "Medium" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Grab the ID from your session state
    const employeeId = auth?.userId;

    if (!employeeId) {
      toast.error("User session missing. Please re-login.");
      return;
    }

    try {
      // 2. Attach the ID to the task data so MongoDB accepts it
      const res = await API.post("/tasks", { 
        ...task, 
        employeeId: employeeId 
      });
      
      setTasks([res.data, ...tasks]);
      toast.success("Task Created!");
      setTask({ title: "", description: "", priority: "Medium" });
    } catch (err) {
      toast.error("Failed to create task");
    }
  };

  return (
    <div className="p-8">
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <input 
          value={task.title} 
          onChange={(e) => setTask({...task, title: e.target.value})} 
          placeholder="Task Title" 
          className="block w-full border p-2"
        />
        <textarea 
          value={task.description} 
          onChange={(e) => setTask({...task, description: e.target.value})} 
          placeholder="Description" 
          className="block w-full border p-2"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Add Task
        </button>
      </form>
      {/* Task List Rendering logic here */}
    </div>
  );
}

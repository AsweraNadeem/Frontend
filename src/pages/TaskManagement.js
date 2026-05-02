import { useEffect, useState, useCallback } from "react";
import API from "../api";
import toast from "react-hot-toast";
import { Trash2, PlusCircle, CheckCircle2 } from "lucide-react";

export default function TaskManagement() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "Medium",
    status: "Pending",
  });

  // Fetch tasks for the dashboard
  const fetchTasks = useCallback(async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error("Failed to load tasks");
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. GET THE USER ID FROM LOCALSTORAGE (SAVED DURING LOGIN)
    const storedEmployeeId = localStorage.getItem("userId");

    if (!storedEmployeeId) {
      toast.error("Session expired. Please log in again.");
      return;
    }

    setLoading(true);
    try {
      // 2. SEND THE TASK DATA + THE EMPLOYEE ID
      const res = await API.post("/tasks", { 
        ...task, 
        employeeId: storedEmployeeId 
      });
      
      setTasks((prev) => [res.data, ...prev]);
      toast.success("Task created successfully");
      
      // Reset form
      setTask({ title: "", description: "", deadline: "", priority: "Medium", status: "Pending" });
    } catch (err) {
      // This catches the 500 validation error if the ID is missing
      const msg = err.response?.data?.message || "Task validation failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => (t._id || t.id) !== id));
      toast.success("Task deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle2 className="text-blue-600 h-8 w-8" />
          <h1 className="text-2xl font-bold text-gray-800">Task Management</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Create Task Form */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h2 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <PlusCircle size={18} /> Add New Task
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                placeholder="Task Title"
                className="w-full p-3 bg-white border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={task.title}
                onChange={(e) => setTask({ ...task, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Description"
                className="w-full p-3 bg-white border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                value={task.description}
                onChange={(e) => setTask({ ...task, description: e.target.value })}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-blue-400"
              >
                {loading ? "Processing..." : "Create Task"}
              </button>
            </form>
          </div>

          {/* Task List Section */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-semibold text-gray-700 mb-4">Your Tasks</h2>
            {tasks.length === 0 ? (
              <div className="text-center py-12 bg-white border-2 border-dashed rounded-xl">
                <p className="text-gray-400">No tasks found. Create one to get started.</p>
              </div>
            ) : (
              tasks.map((t) => (
                <div key={t._id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center hover:shadow-md transition">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{t.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{t.description}</p>
                    <span className="inline-block mt-2 text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold uppercase">
                      {t.priority}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleDelete(t._id)} 
                    className="ml-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

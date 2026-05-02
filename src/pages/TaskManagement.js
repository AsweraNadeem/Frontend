import { useEffect, useState, useCallback } from "react";
import API from "../api";
import toast from "react-hot-toast";
import { Trash2, PlusCircle, Clock } from "lucide-react";

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

  const fetchTasks = useCallback(async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      toast.error("Failed to load tasks");
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Get the ID we saved at Login
    const storedEmployeeId = localStorage.getItem("userId");

    if (!storedEmployeeId) {
      toast.error("Session expired. Please log in again.");
      return;
    }

    setLoading(true);
    try {
      // 2. Explicitly send the employeeId to the backend
      const res = await API.post("/tasks", { 
        ...task, 
        employeeId: storedEmployeeId 
      });
      
      setTasks((prev) => [res.data, ...prev]);
      toast.success("Task created successfully");
      setTask({ title: "", description: "", deadline: "", priority: "Medium", status: "Pending" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Task validation failed");
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
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-blue-600 text-white p-6 rounded-xl mb-6 shadow-md">
        <h1 className="text-2xl font-bold">Task Management</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm h-fit">
          <h2 className="font-bold mb-4">Create New Task</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              placeholder="Title"
              className="w-full p-2 border rounded"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Description"
              className="w-full p-2 border rounded"
              value={task.description}
              onChange={(e) => setTask({ ...task, description: e.target.value })}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded font-bold"
            >
              {loading ? "Saving..." : "Add Task"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {tasks.map((t) => (
            <div key={t._id} className="bg-white p-4 rounded-xl border flex justify-between items-center shadow-sm">
              <div>
                <h3 className="font-bold">{t.title}</h3>
                <p className="text-sm text-gray-500">{t.description}</p>
              </div>
              <button onClick={() => handleDelete(t._id)} className="text-red-400 hover:text-red-600">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

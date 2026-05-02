import { useEffect, useState, useCallback } from "react";
import API from "../api"; // Using your existing API utility
import toast from "react-hot-toast";
import { Trash2, PlusCircle, Clock, AlertCircle } from "lucide-react";

const priorityOptions = ["Low", "Medium", "High", "Urgent"];
const statusOptions = ["Pending", "In Progress", "Completed"];

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

  // 1. Fetch Tasks from Backend
  const fetchTasks = useCallback(async () => {
    try {
      const res = await API.get("/tasks"); // Ensure this route exists on your backend
      setTasks(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Failed to load tasks");
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  // 2. Create Task via API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.title.trim() || !task.description.trim()) {
      toast.error("Please fill in title and description");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/tasks", task);
      setTasks((prev) => [res.data, ...prev]); // Add new task to UI
      toast.success("Task created successfully");
      
      // Reset form
      setTask({
        title: "",
        description: "",
        deadline: "",
        priority: "Medium",
        status: "Pending",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating task");
    } finally {
      setLoading(false);
    }
  };

  // 3. Delete Task via API
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await API.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => t._id !== id)); // or t.id depending on your DB
      toast.success("Task deleted");
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <div className="mx-auto max-w-6xl px-4 py-8">
        
        {/* Header */}
        <div className="rounded-2xl bg-blue-600 p-8 text-white shadow-lg mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Clock className="h-8 w-8" /> Task Management
          </h1>
          <p className="opacity-90 mt-1">Assign and track team objectives</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 sticky top-6">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-blue-600" /> New Task
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-600">Title</label>
                  <input
                    name="title"
                    value={task.title}
                    onChange={handleChange}
                    className="w-full mt-1 px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Task name..."
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600">Deadline</label>
                  <input
                    type="date"
                    name="deadline"
                    value={task.deadline}
                    onChange={handleChange}
                    className="w-full mt-1 px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600">Priority</label>
                  <select
                    name="priority"
                    value={task.priority}
                    onChange={handleChange}
                    className="w-full mt-1 px-4 py-2 rounded-lg border border-slate-200 outline-none"
                  >
                    {priorityOptions.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600">Description</label>
                  <textarea
                    name="description"
                    value={task.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full mt-1 px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Details..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-md disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Create Task"}
                </button>
              </form>
            </div>
          </div>

          {/* List Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">Task List</h2>
                <span className="text-xs font-bold px-2 py-1 bg-slate-100 rounded text-slate-500">
                  {tasks.length} Total
                </span>
              </div>

              {tasks.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No tasks found. Create one to get started.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {tasks.map((t) => (
                    <div key={t._id || t.id} className="p-6 hover:bg-slate-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-slate-800 text-lg">{t.title}</h3>
                          <p className="text-sm text-slate-500 mt-1">{t.description}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold 
                          ${t.priority === 'Urgent' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                          {t.priority}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex gap-4 text-xs font-medium text-slate-400">
                          <span>📅 Due: {t.deadline || 'N/A'}</span>
                          <span>⏳ {t.status}</span>
                        </div>
                        <button
                          onClick={() => handleDelete(t._id || t.id)}
                          className="text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

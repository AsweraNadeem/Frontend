import { useEffect, useState, useCallback } from "react";
import API from "../api";
import toast from "react-hot-toast";
import { Trash2, PlusCircle, CheckCircle2, Calendar, Clock, User } from "lucide-react";

export default function TaskManagement() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [task, setTask] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    duration: "",
    taskType: "Development",
    assignee: "",
    priority: "Medium",
  });

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

  // FIX: Re-adding the missing handleDelete function
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await API.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => (t._id || t.id) !== id));
      toast.success("Task deleted successfully");
    } catch (err) {
      console.error("Delete Error:", err);
      toast.error("Failed to delete task");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const storedEmployeeId = localStorage.getItem("userId");

    if (!storedEmployeeId) {
      toast.error("Session expired. Please log in again.");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/tasks", { 
        ...task, 
        employeeId: storedEmployeeId 
      });
      
      setTasks((prev) => [res.data, ...prev]);
      toast.success("Task created and tracked!");
      
      setTask({ 
        title: "", description: "", date: "", startTime: "", 
        duration: "", taskType: "Development", assignee: "", priority: "Medium" 
      });
    } catch (err) {
      const msg = err.response?.data?.message || "Task validation failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle2 className="text-blue-600 h-8 w-8" />
          <h1 className="text-2xl font-bold text-gray-800">Task Tracking</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 h-fit">
            <h2 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <PlusCircle size={18} /> New Task Details
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                placeholder="Task Title"
                className="w-full p-3 bg-white border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={task.title}
                onChange={(e) => setTask({ ...task, title: e.target.value })}
                required
              />

              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <User className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
                  <input
                    placeholder="Assignee"
                    className="w-full pl-8 p-2 text-sm bg-white border rounded-lg outline-none"
                    value={task.assignee}
                    onChange={(e) => setTask({ ...task, assignee: e.target.value })}
                  />
                </div>
                <select 
                  className="w-full p-2 text-sm bg-white border rounded-lg outline-none"
                  value={task.taskType}
                  onChange={(e) => setTask({ ...task, taskType: e.target.value })}
                >
                  <option value="Development">Development</option>
                  <option value="Design">Design</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Testing">Testing</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  className="w-full p-2 text-sm bg-white border rounded-lg outline-none"
                  value={task.date}
                  onChange={(e) => setTask({ ...task, date: e.target.value })}
                  required
                />
                <input
                  type="time"
                  className="w-full p-2 text-sm bg-white border rounded-lg outline-none"
                  value={task.startTime}
                  onChange={(e) => setTask({ ...task, startTime: e.target.value })}
                  required
                />
              </div>

              <div className="relative">
                <Clock className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
                <input
                  placeholder="Duration (e.g. 2h 30m)"
                  className="w-full pl-8 p-2 text-sm bg-white border rounded-lg outline-none"
                  value={task.duration}
                  onChange={(e) => setTask({ ...task, duration: e.target.value })}
                />
              </div>

              <textarea
                placeholder="Description"
                className="w-full p-3 bg-white border rounded-lg outline-none"
                rows="2"
                value={task.description}
                onChange={(e) => setTask({ ...task, description: e.target.value })}
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md"
              >
                {loading ? "Saving..." : "Create Task"}
              </button>
            </form>
          </div>

          {/* List Section */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-semibold text-gray-700">Recent Tasks</h2>
            {tasks.length === 0 ? (
              <div className="text-center py-12 bg-white border-2 border-dashed rounded-xl">
                <p className="text-gray-400">No active tasks found.</p>
              </div>
            ) : (
              tasks.map((t) => (
                <div key={t._id || t.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center group">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded uppercase">{t.taskType}</span>
                      <h3 className="font-bold text-gray-800">{t.title}</h3>
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Calendar size={12}/> {t.date}</span>
                      <span className="flex items-center gap-1"><Clock size={12}/> {t.startTime} ({t.duration})</span>
                      <span className="flex items-center gap-1"><User size={12}/> {t.assignee}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(t._id || t.id)} 
                    className="text-gray-300 hover:text-red-500 p-2 transition-colors"
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

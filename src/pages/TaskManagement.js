import { useEffect, useState, useCallback } from "react";
import API from "../api";
import toast from "react-hot-toast";
import { Trash2, PlusCircle, CheckCircle2, Calendar, Clock, User, Tag } from "lucide-react";

export default function TaskManagement() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // 1. Updated state to include your new fieldss
  const [task, setTask] = useState({
    title: "",
    description: "",
    date: "",        // Calendar
    startTime: "",   // Time
    duration: "",    // Duration (e.g., "2 hours")
    taskType: "Development", // Type of task
    assignee: "",    // Assignee name
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const storedEmployeeId = localStorage.getItem("userId");

    if (!storedEmployeeId) {
      toast.error("Session expired. Please log in.");
      return;
    }

    setLoading(true);
    try {
      // 2. Sending all new fields to your backend
      const res = await API.post("/tasks", { 
        ...task, 
        employeeId: storedEmployeeId 
      });
      
      setTasks((prev) => [res.data, ...prev]);
      toast.success("Task created with time tracking!");
      
      // Reset form
      setTask({ 
        title: "", description: "", date: "", startTime: "", 
        duration: "", taskType: "Development", assignee: "", priority: "Medium" 
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Task validation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle2 className="text-blue-600 h-8 w-8" />
          <h1 className="text-2xl font-bold text-gray-800">Task Tracking System</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Create Task Form */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
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

              {/* Assignee & Task Type */}
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

              {/* Date & Start Time */}
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

              {/* Duration Tracking */}
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
                placeholder="Task Description"
                className="w-full p-3 bg-white border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                rows="2"
                value={task.description}
                onChange={(e) => setTask({ ...task, description: e.target.value })}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
              >
                {loading ? "Saving..." : "Create & Track Task"}
              </button>
            </form>
          </div>

          {/* Task List Section */}
          <div className="lg:col-span-2 space-y-4">
             {/* Task list items would go here, mapping through 'tasks' */}
             {tasks.map((t) => (
                <div key={t._id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div>
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
                    <button onClick={() => handleDelete(t._id)} className="text-gray-300 hover:text-red-500"><Trash2 size={18}/></button>
                  </div>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}

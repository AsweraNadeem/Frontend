import { useEffect, useState, useCallback } from "react";
import API from "../api";
import toast from "react-hot-toast";
import { Trash2, PlusCircle, LayoutList } from "lucide-react";

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

  // Fetching tasks from your Vercel backend
  const fetchTasks = useCallback(async () => {
    try {
      const res = await API.get("/tasks");
      // Ensure we handle arrays correctly if the backend returns one
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Could not load tasks from server");
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Sending only the task details. 
      // Ensure your backend 'modals/Task.js' has employeeId: { required: false }
      const res = await API.post("/tasks", task);
      
      setTasks((prev) => [res.data, ...prev]);
      toast.success("Task created successfully!");
      
      // Reset the form fields
      setTask({ 
        title: "", 
        description: "", 
        deadline: "", 
        priority: "Medium", 
        status: "Pending" 
      });
    } catch (err) {
      // If this triggers a 500 error, check your backend 'modals' validation
      const errorMsg = err.response?.data?.message || "Server validation failed";
      toast.error(errorMsg);
      console.log("Submit Error:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => (t._id || t.id) !== id));
      toast.success("Task removed");
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-blue-700 text-white p-8 rounded-2xl mb-8 shadow-lg flex items-center gap-4">
        <LayoutList size={32} />
        <div>
          <h1 className="text-3xl font-bold">Task Management</h1>
          <p className="text-blue-100 opacity-80 text-sm">Organize and track your project progress</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-fit">
          <div className="flex items-center gap-2 mb-6 text-gray-800">
            <PlusCircle size={20} className="text-blue-600" />
            <h2 className="font-bold text-lg">Create New Task</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                placeholder="What needs to be done?"
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50"
                value={task.title}
                onChange={(e) => setTask({ ...task, title: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                placeholder="Add more details..."
                rows="4"
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50"
                value={task.description}
                onChange={(e) => setTask({ ...task, description: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-md disabled:bg-blue-300 transform active:scale-95"
            >
              {loading ? "Saving to Cloud..." : "Add Task"}
            </button>
          </form>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
            Recent Tasks <span className="bg-gray-200 text-gray-600 text-xs py-1 px-2 rounded-full">{tasks.length}</span>
          </h2>
          
          {tasks.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl py-16 text-center">
              <p className="text-gray-400">No active tasks. Start by creating one!</p>
            </div>
          ) : (
            tasks.map((t) => (
              <div 
                key={t._id || t.id} 
                className="bg-white p-5 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{t.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">{t.description}</p>
                  <div className="flex gap-3 mt-3">
                    <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase ${
                      t.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {t.priority || 'Medium'}
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleDelete(t._id || t.id)} 
                  className="text-gray-300 hover:text-red-500 p-2 transition-colors rounded-lg hover:bg-red-50"
                  title="Delete Task"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

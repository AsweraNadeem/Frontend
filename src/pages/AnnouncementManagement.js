import React, { useState } from "react";
import API from "../api";
import { Megaphone, Send } from "lucide-react";
import { toast } from "react-hot-toast";

const AnnouncementManagement = () => {
  const [formData, setFormData] = useState({ title: "", message: "", priority: "Medium" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/announcements", formData);
      toast.success("Announcement broadcasted successfully!");
      setFormData({ title: "", message: "", priority: "Medium" });
    } catch (err) {
      toast.error("Failed to post announcement");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-10 bg-white shadow-xl rounded-3xl mt-10">
      <div className="flex items-center gap-3 mb-6">
        <Megaphone className="text-blue-600 w-8 h-8" />
        <h1 className="text-2xl font-bold text-slate-800">Create Broadcast</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
          <input
            type="text"
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
          <select 
            className="w-full p-3 border rounded-xl outline-none"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
          <textarea
            rows="4"
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            required
          ></textarea>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700">
          <Send size={18} /> Post Announcement
        </button>
      </form>
    </div>
  );
};

export default AnnouncementManagement;

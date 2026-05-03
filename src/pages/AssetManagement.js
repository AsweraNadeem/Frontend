import { useEffect, useState } from "react";
import API from "../api";
import { Monitor, Plus, Package, Hash, Tag, Save } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AssetManagement() {
  const [assets, setAssets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    assetName: "",
    assetType: "Laptop",
    serialNumber: "",
    condition: "New"
  });

  const employeeId = localStorage.getItem("userId");

  const fetchAssets = async () => {
    try {
      const res = await API.get(`/assets/employee/${employeeId}`);
      setAssets(res.data);
    } catch (err) {
      console.error("Failed to fetch assets");
    }
  };

  useEffect(() => {
    if (employeeId) fetchAssets();
  }, [employeeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Create the asset and assign it to yourself immediately
      await API.post("/assets/add", { ...formData, assignedTo: employeeId, status: 'Assigned' });
      toast.success("Asset added and assigned successfully!");
      setShowForm(false);
      setFormData({ assetName: "", assetType: "Laptop", serialNumber: "", condition: "New" });
      fetchAssets(); // Refresh the list
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add asset");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Monitor className="text-blue-600" /> Asset Management
        </h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition"
        >
          {showForm ? "Cancel" : <><Plus size={18} /> Add New Asset</>}
        </button>
      </div>

      {/* INSERT FORM */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border mb-8 grid md:grid-cols-2 gap-4 shadow-sm">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Asset Name</label>
            <input 
              required
              className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:border-blue-500"
              placeholder="e.g. MacBook Pro M3"
              value={formData.assetName}
              onChange={(e) => setFormData({...formData, assetName: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Asset Type</label>
            <select 
              className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:border-blue-500"
              value={formData.assetType}
              onChange={(e) => setFormData({...formData, assetType: e.target.value})}
            >
              <option value="Laptop">Laptop</option>
              <option value="Mobile">Mobile</option>
              <option value="Monitor">Monitor</option>
              <option value="Peripheral">Peripheral</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Serial Number</label>
            <input 
              required
              className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:border-blue-500"
              placeholder="Unique S/N"
              value={formData.serialNumber}
              onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Condition</label>
            <input 
              className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:border-blue-500"
              placeholder="New / Used / Good"
              value={formData.condition}
              onChange={(e) => setFormData({...formData, condition: e.target.value})}
            />
          </div>
          <button type="submit" className="md:col-span-2 bg-slate-800 text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-900 transition">
            <Save size={18} /> Save Asset to Inventory
          </button>
        </form>
      )}

      {/* ASSET DISPLAY */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.map((asset) => (
          <div key={asset._id} className="bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <Package className="text-blue-500" size={28} />
              <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                {asset.status}
              </span>
            </div>
            <h2 className="font-bold text-lg">{asset.assetName}</h2>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2 font-mono"><Hash size={14}/> {asset.serialNumber}</p>
              <p className="flex items-center gap-2"><Tag size={14}/> {asset.assetType}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

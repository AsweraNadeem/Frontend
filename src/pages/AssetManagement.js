import { useEffect, useState } from "react";
import API from "../api";
import { Monitor, cpu, Hash, CheckCircle } from "lucide-react";

export default function AssetManagement() {
  const [assets, setAssets] = useState([]);
  const employeeId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await API.get(`/assets/employee/${employeeId}`);
        setAssets(res.data);
      } catch (err) {
        console.error("Failed to fetch assets");
      }
    };
    if (employeeId) fetchAssets();
  }, [employeeId]);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Monitor className="text-blue-600" /> My Assigned Assets
      </h1>
      <div className="grid md:grid-cols-2 gap-6">
        {assets.map((asset) => (
          <div key={asset._id} className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-bold text-lg">{asset.assetName}</h2>
                <p className="text-sm text-gray-500 uppercase tracking-wider">{asset.assetType}</p>
              </div>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
                {asset.status}
              </span>
            </div>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2"><Hash size={14}/> S/N: {asset.serialNumber}</p>
              <p className="flex items-center gap-2"><CheckCircle size={14}/> Condition: {asset.condition}</p>
            </div>
          </div>
        ))}
        {assets.length === 0 && <p className="text-gray-400">No assets assigned to you yet.</p>}
      </div>
    </div>
  );
}

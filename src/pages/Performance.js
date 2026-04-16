import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import toast from "react-hot-toast";

export default function Performance() {
  const { employeeId: paramEmployeeId } = useParams();
  const [employeeId, setEmployeeId] = useState(paramEmployeeId || "");
  const [kpi1, setKpi1] = useState("");
  const [kpi2, setKpi2] = useState("");
  const [kpi3, setKpi3] = useState("");
  const [records, setRecords] = useState([]);

  // Calculate Performance Score (Average)
  const calculateScore = () => {
    const total =
      Number(kpi1 || 0) +
      Number(kpi2 || 0) +
      Number(kpi3 || 0);

    return (total / 3).toFixed(2);
  };

  // Fetch performance data
  const fetchPerformance = async () => {
    try {
      const res = await API.get("/performance");
      setRecords(res.data);
    } catch (err) {
      toast.error("Failed to load performance data");
    }
  };

  useEffect(() => {
    fetchPerformance();
  }, []);

  // Submit performance
  const handleSubmit = async (e) => {
    e.preventDefault();

    const score = calculateScore();

    try {
      await API.post("/performance", {
        employeeId,
        kpi1,
        kpi2,
        kpi3,
        score,
      });

      toast.success("Performance Saved");

      setEmployeeId("");
      setKpi1("");
      setKpi2("");
      setKpi3("");

      fetchPerformance();
    } catch (err) {
      toast.error("Error saving performance");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-indigo-600">
        Performance Management
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-3 bg-white p-5 rounded shadow"
      >
        <input
          type="text"
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className="border p-2 w-full"
          required
          readOnly={!!paramEmployeeId}
        />

        <input
          type="number"
          placeholder="KPI 1 (e.g. Work Quality)"
          value={kpi1}
          onChange={(e) => setKpi1(e.target.value)}
          className="border p-2 w-full"
          required
        />

        <input
          type="number"
          placeholder="KPI 2 (e.g. Attendance)"
          value={kpi2}
          onChange={(e) => setKpi2(e.target.value)}
          className="border p-2 w-full"
          required
        />

        <input
          type="number"
          placeholder="KPI 3 (e.g. Teamwork)"
          value={kpi3}
          onChange={(e) => setKpi3(e.target.value)}
          className="border p-2 w-full"
          required
        />

        {/* Live Score */}
        <div className="bg-gray-100 p-3 rounded">
          <strong>Performance Score: </strong> {calculateScore()}
        </div>

        <button className="bg-indigo-600 text-white px-4 py-2 rounded">
          Submit Evaluation
        </button>
      </form>

      {/* Table */}
      <table className="w-full mt-6 border">
        <thead>
          <tr className="bg-indigo-600 text-white">
            <th className="p-2">Employee</th>
            <th className="p-2">KPI 1</th>
            <th className="p-2">KPI 2</th>
            <th className="p-2">KPI 3</th>
            <th className="p-2">Score</th>
          </tr>
        </thead>

        <tbody>
          {records.map((item) => (
            <tr key={item._id} className="text-center border">
              <td>{item.employeeId}</td>
              <td>{item.kpi1}</td>
              <td>{item.kpi2}</td>
              <td>{item.kpi3}</td>
              <td className="font-bold text-green-600">
                {item.score}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
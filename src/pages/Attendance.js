import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import toast from "react-hot-toast";

export default function Attendance() {
  const { employeeId: paramEmployeeId } = useParams();
  const [employeeId, setEmployeeId] = useState(paramEmployeeId || "");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Present");
  const [records, setRecords] = useState([]);

  // Fetch attendance data
  const fetchAttendance = async () => {
    try {
      const res = await API.get("/attendance");
      setRecords(res.data);
    } catch (err) {
      toast.error("Failed to load attendance");
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  // Submit attendance
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/attendance", {
        employeeId,
        date,
        status,
      });

      toast.success("Attendance Marked");

      setEmployeeId("");
      setDate("");
      setStatus("Present");

      fetchAttendance(); // refresh table
    } catch (err) {
      toast.error("Error saving attendance");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">ATTENDANCE</h2>

      <form onSubmit={handleSubmit} className="space-y-3 bg-white p-5 rounded shadow">
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
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 w-full"
          required
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 w-full"
        >
          <option>Present</option>
          <option>Absent</option>
          <option>Late</option>
        </select>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>

      {/* Table */}
      <table className="w-full mt-6 border">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="p-2">Employee ID</th>
            <th className="p-2">Date</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>

        <tbody>
          {records.map((item) => (
            <tr key={item._id} className="text-center border">
              <td>{item.employeeId}</td>
              <td>{item.date}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

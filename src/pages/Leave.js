import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { User, Calendar, FileText, Clock } from "lucide-react";
import API from "../api";
import toast from "react-hot-toast";

export default function Leave() {
  const { employeeId: paramEmployeeId } = useParams();
  const [employeeId, setEmployeeId] = useState(paramEmployeeId || "");
  const [leaveType, setLeaveType] = useState("Casual");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);

  // Calculate Total Leave Days
  const calculateTotalDays = () => {
    if (fromDate && toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);
      if (start <= end) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive
        return diffDays;
      }
    }
    return 0;
  };

  // Fetch leave data
  const fetchLeaves = async () => {
    try {
      const res = await API.get("/leave");
      setLeaves(res.data);
    } catch (err) {
      toast.error("Failed to load leave data");
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // Submit leave
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/leave", {
        employeeId,
        leaveType,
        fromDate,
        toDate,
        reason,
      });

      toast.success("Leave Applied Successfully");

      if (!paramEmployeeId) setEmployeeId("");
      setFromDate("");
      setToDate("");
      setReason("");

      fetchLeaves();
    } catch (err) {
      console.error("Leave Error:", err);
      const errorMsg = err.response?.data?.message || "Error submitting leave";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-green-600 text-center">
          Leave Management System
        </h2>

        <div className="bg-white shadow-xl rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-semibold mb-6 text-gray-800">Apply for Leave</h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Employee ID */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee ID
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter Employee ID"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    required
                    readOnly={!!paramEmployeeId}
                  />
                </div>
              </div>

              {/* Leave Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leave Type
                </label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                >
                  <option>Casual</option>
                  <option>Sick</option>
                  <option>Annual</option>
                </select>
              </div>

              {/* From Date */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    required
                  />
                </div>
              </div>

              {/* To Date */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Leave
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  placeholder="Provide a brief reason for your leave request"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-500 focus:border-transparent transition resize-none"
                  rows="3"
                />
              </div>
            </div>

            {/* Total Days Display */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <Clock className="h-6 w-6 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-green-800">Total Leave Days</p>
                  <p className="text-2xl font-bold text-green-600">{calculateTotalDays()} days</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                "Apply for Leave"
              )}
            </button>
          </form>
        </div>

        {/* Leave Records Table */}
        <div className="bg-white shadow-xl rounded-2xl p-8">
          <h3 className="text-xl font-semibold mb-6 text-gray-800">Leave Records</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-green-600 text-white">
                  <th className="py-3 px-4 text-left rounded-tl-lg">Employee</th>
                  <th className="py-3 px-4 text-left">Type</th>
                  <th className="py-3 px-4 text-left">Dates</th>
                  <th className="py-3 px-4 text-left">Reason</th>
                  <th className="py-3 px-4 text-left rounded-tr-lg">Status</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 border-b border-gray-200">
                    <td className="py-3 px-4">{item.employeeId}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.leaveType === 'Casual' ? 'bg-blue-100 text-blue-800' :
                        item.leaveType === 'Sick' ? 'bg-red-100 text-red-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {item.leaveType}
                      </span>
                    </td>
                    <td className="py-3 px-4">{item.fromDate} - {item.toDate}</td>
                    <td className="py-3 px-4">{item.reason || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        item.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
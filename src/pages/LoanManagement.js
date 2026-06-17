import { useEffect, useState, useCallback } from "react";
import API from "../api";
import toast from "react-hot-toast";
import { Wallet, Send, History, FileText, Info, Calendar, CheckCircle2, XCircle } from "lucide-react";

export default function LoanManagement() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Simulation Toggle: Switch between true/false to manage admin testing flows directly
  const [isAdmin, setIsAdmin] = useState(false);

  const [loanRequest, setLoanRequest] = useState({
    loanType: "Personal",
    requestedAmount: "",
    loanPurpose: "",
    tenureMonths: "",
  });

  const employeeId = localStorage.getItem("userId");
  const employeeName = "Hamza"; // Ideally pull this from your auth state/context

  const fetchLoans = useCallback(async () => {
    try {
      const res = await API.get(`/loans/employee/${employeeId}`);
      setLoans(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error("Failed to load loan history");
    } finally {
      setFetching(false);
    }
  }, [employeeId]);

  useEffect(() => {
    if (employeeId) fetchLoans();
  }, [employeeId, fetchLoans]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employeeId) return toast.error("User session not found");

    setLoading(true);
    try {
      await API.post("/loans/apply", {
        ...loanRequest,
        employeeId,
        employeeName,
        requestedAmount: Number(loanRequest.requestedAmount),
        tenureMonths: Number(loanRequest.tenureMonths),
      });

      toast.success("Loan application submitted!");
      setLoanRequest({
        loanType: "Personal",
        requestedAmount: "",
        loanPurpose: "",
        tenureMonths: "",
      });
      fetchLoans();
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  // --- NEW: Dynamic Action Handler targeting your PUT /loans/approve/:id route ---
  const handleAdminAction = async (loanId, targetStatus) => {
    let payload = {
      approvalStatus: targetStatus,
      approverId: employeeId, // Simulating current user as the processing authority
    };

    if (targetStatus === "Disbursed" || targetStatus === "Approved") {
      const sanctioned = prompt("Enter Sanctioned Amount (PKR):");
      const rate = prompt("Enter Interest Rate (%):", "0");
      const startDate = prompt("Enter Repayment Start Date (YYYY-MM-DD):", "2026-07-01");

      if (!sanctioned || !rate || !startDate) {
        return toast.error("Sanctioned amount, interest rate, and start date are required!");
      }

      payload = {
        ...payload,
        sanctionedAmount: Number(sanctioned),
        interestRate: Number(rate),
        repaymentStartDate: startDate,
        approverRemarks: "Approved and authorized via workspace application.",
      };
    } else if (targetStatus === "Rules-Rejected" || targetStatus === "Rejected") {
      const remarks = prompt("Enter reason for rejection:");
      if (!remarks) return toast.error("Remarks are required to reject an application.");
      payload.approvalStatus = "Rejected";
      payload.approverRemarks = remarks;
    }

    try {
      // Calls your precise backend route schema
      await API.put(`/loans/approve/${loanId}`, payload);
      toast.success(`Loan state updated successfully to ${targetStatus}`);
      fetchLoans();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action authorization failed");
    }
  };

  // Maps database validation flags to clean UI components
  const getStatusColor = (status) => {
    switch (status) {
      case "Approved": return "bg-green-100 text-green-700";
      case "Rejected": return "bg-red-100 text-red-700";
      case "Disbursed": return "bg-teal-100 text-teal-700"; 
      case "Pending":
      default: return "bg-blue-100 text-blue-700";
    }
  };

  // Resolves the exact display label state conflict seen on your initial card UI
  const getFooterStatusText = (approvalStatus, fallbackStatus) => {
    if (approvalStatus === "Disbursed") return "Active";
    if (approvalStatus === "Approved") return "Approved / Scheduled";
    if (approvalStatus === "Rejected") return "Closed / Declined";
    return "Awaiting Review"; 
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      {/* Simulation Helper Control */}
      <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl mb-6 flex justify-between items-center text-xs">
        <span className="font-semibold text-gray-500 uppercase tracking-wider">Workspace Interface Mode:</span>
        <button 
          onClick={() => setIsAdmin(!isAdmin)} 
          className={`px-4 py-1.5 rounded-lg font-bold transition shadow-sm text-white ${isAdmin ? 'bg-purple-600' : 'bg-blue-600'}`}
        >
          {isAdmin ? "Switch to Employee View" : "Switch to Admin View"}
        </button>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <Wallet className="text-blue-600 h-8 w-8" />
        <h1 className="text-2xl font-bold text-gray-800">Loan Management</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Application Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <h2 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Send size={18} /> Apply for Loan
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-500 ml-1">Loan Type</label>
              <select
                className="w-full p-3 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={loanRequest.loanType}
                onChange={(e) => setLoanRequest({ ...loanRequest, loanType: e.target.value })}
              >
                <option value="Personal">Personal Loan</option>
                <option value="Home">Home Loan</option>
                <option value="Vehicle">Vehicle Loan</option>
                <option value="Medical">Medical Loan</option>
                <option value="Salary Advance">Salary Advance</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 ml-1">Requested Amount (PKR)</label>
              <input
                type="number"
                placeholder="e.g. 50000"
                className="w-full p-3 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={loanRequest.requestedAmount}
                onChange={(e) => setLoanRequest({ ...loanRequest, requestedAmount: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 ml-1">Tenure (Months)</label>
              <input
                type="number"
                placeholder="e.g. 12"
                className="w-full p-3 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={loanRequest.tenureMonths}
                onChange={(e) => setLoanRequest({ ...loanRequest, tenureMonths: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 ml-1">Purpose of Loan</label>
              <textarea
                placeholder="Describe why you need this loan..."
                className="w-full p-3 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                value={loanRequest.loanPurpose}
                onChange={(e) => setLoanRequest({ ...loanRequest, loanPurpose: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md disabled:bg-gray-400"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>

        {/* Loan History */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-semibold text-gray-700 flex items-center gap-2">
            <History size={18} /> Application History
          </h2>
          
          {fetching ? (
            <div className="animate-pulse space-y-4">
              {[1, 2].map((i) => <div key={i} className="h-24 bg-gray-100 rounded-xl"></div>)}
            </div>
          ) : loans.length === 0 ? (
            <div className="text-center py-12 bg-white border-2 border-dashed rounded-xl">
              <p className="text-gray-400">No loan applications found.</p>
            </div>
          ) : (
            loans.map((l) => (
              <div key={l._id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${getStatusColor(l.approvalStatus || "Pending")}`}>
                      {l.approvalStatus || "Pending"}
                    </span>
                    <h3 className="font-bold text-gray-800 mt-1">{l.loanType} Loan</h3>
                  </div>
                  <div className="text-right">
                    {/* Render targeted final sanctioned amount dynamically if calculation passes */}
                    <p className="text-lg font-bold text-blue-600">
                      PKR {((l.approvalStatus === "Approved" || l.approvalStatus === "Disbursed") && l.sanctionedAmount)
                        ? l.sanctionedAmount.toLocaleString() 
                        : l.requestedAmount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">{l.tenureMonths} Months</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-3 border-t border-gray-50 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={14}/> {new Date(l.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Info size={14}/> {getFooterStatusText(l.approvalStatus || "Pending", l.loanStatus)}
                  </span>
                  {l.emiAmount && (
                    <span className="flex items-center gap-1 font-semibold text-gray-700">
                      <FileText size={14}/> EMI: PKR {Number(l.emiAmount).toLocaleString()}
                    </span>
                  )}
                </div>
                
                {l.approverRemarks && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600 italic">
                    " {l.approverRemarks} "
                  </div>
                )}

                {/* --- Inline Admin Controls Panel --- */}
                {isAdmin && (l.approvalStatus === "Pending" || !l.approvalStatus) && (
                  <div className="mt-4 pt-3 border-t border-dashed border-gray-200 flex gap-2 justify-end">
                    <button
                      onClick={() => handleAdminAction(l._id, "Rules-Rejected")}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100 transition"
                    >
                      <XCircle size={14} /> Reject
                    </button>
                    <button
                      onClick={() => handleAdminAction(l._id, "Disbursed")}
                      className="flex items-center gap-1 px-3 py-1.5 bg-teal-600 text-white text-xs font-bold rounded-lg hover:bg-teal-700 transition shadow-sm"
                    >
                      <CheckCircle2 size={14} /> Disburse & Activate
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

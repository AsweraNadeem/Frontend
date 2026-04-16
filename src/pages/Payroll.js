import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import toast from "react-hot-toast";

export default function Payroll() {
  const { employeeId: paramEmployeeId } = useParams();
  const [employeeId, setEmployeeId] = useState(paramEmployeeId || "");
  const [basicSalary, setBasicSalary] = useState("");
  const [allowances, setAllowances] = useState("");
  const [deductions, setDeductions] = useState("");
  const [tax, setTax] = useState("");
  const [records, setRecords] = useState([]);

  // Calculate Net Salary
  const calculateSalary = () => {
    const net =
      Number(basicSalary || 0) +
      Number(allowances || 0) -
      Number(deductions || 0) -
      Number(tax || 0);

    return net;
  };

  // Fetch payroll data
  const fetchPayroll = async () => {
    try {
      const res = await API.get("/payroll");
      setRecords(res.data);
    } catch (err) {
      toast.error("Failed to load payroll data");
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, []);

  // Submit payroll
  const handleSubmit = async (e) => {
    e.preventDefault();

    const netSalary = calculateSalary();

    try {
      await API.post("/payroll", {
        employeeId,
        basicSalary,
        allowances,
        deductions,
        tax,
        netSalary,
      });

      toast.success("Payroll Generated");

      // Reset form
      setEmployeeId("");
      setBasicSalary("");
      setAllowances("");
      setDeductions("");
      setTax("");

      fetchPayroll();
    } catch (err) {
      toast.error("Error generating payroll");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-purple-600">
        Payroll Management
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
          placeholder="Basic Salary"
          value={basicSalary}
          onChange={(e) => setBasicSalary(e.target.value)}
          className="border p-2 w-full"
          required
        />

        <input
          type="number"
          placeholder="Allowances"
          value={allowances}
          onChange={(e) => setAllowances(e.target.value)}
          className="border p-2 w-full"
        />

        <input
          type="number"
          placeholder="Deductions"
          value={deductions}
          onChange={(e) => setDeductions(e.target.value)}
          className="border p-2 w-full"
        />

        <input
          type="number"
          placeholder="Tax"
          value={tax}
          onChange={(e) => setTax(e.target.value)}
          className="border p-2 w-full"
        />

        {/* Live Salary Display */}
        <div className="bg-gray-100 p-3 rounded">
          <strong>Net Salary: </strong> {calculateSalary()}
        </div>

        <button className="bg-purple-600 text-white px-4 py-2 rounded">
          Generate Payroll
        </button>
      </form>

      {/* Payroll Table */}
      <table className="w-full mt-6 border">
        <thead>
          <tr className="bg-purple-600 text-white">
            <th className="p-2">Employee</th>
            <th className="p-2">Basic</th>
            <th className="p-2">Allowances</th>
            <th className="p-2">Deductions</th>
            <th className="p-2">Tax</th>
            <th className="p-2">Net Salary</th>
          </tr>
        </thead>

        <tbody>
          {records.map((item) => (
            <tr key={item._id} className="text-center border">
              <td>{item.employeeId}</td>
              <td>{item.basicSalary}</td>
              <td>{item.allowances}</td>
              <td>{item.deductions}</td>
              <td>{item.tax}</td>
              <td className="font-bold text-green-600">
                {item.netSalary}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
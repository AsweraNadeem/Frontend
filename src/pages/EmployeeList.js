import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, Users, Mail, Phone } from "lucide-react";
import API from '../api'
import toast from "react-hot-toast";


export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await API.get("/employee/getAllEmployee");
        setEmployees(res.data.employees);
        setFilteredEmployees(res.data.employees);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEmployee();
  }, []);

  // Search
  useEffect(() => {
    let data = employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase()) ||
        emp.id.toString().includes(search)
    );
    setFilteredEmployees(data);
    setCurrentPage(1);
  }, [search, employees]);

  // Sorting function
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    const sortedData = [...filteredEmployees].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredEmployees(sortedData);
  };

  // Paging
  const totalPages = Math.ceil(filteredEmployees.length / pageSize);
  const paginatedData = filteredEmployees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );


  const handleDelete = async (id) => {
    try {
      const res = await API.delete(`/employee/deleteEmployee/${id}`);
      if (res.data.success) {
        const updatedEmployees = employees.filter((emp) => emp._id !== id);
        setEmployees(updatedEmployees);
        setFilteredEmployees(updatedEmployees);
        toast.success("Employee deleted successfully");
      }
    } catch (err) {
      toast.error("failed to delete")
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-xl rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <Users className="mr-3 h-8 w-8 text-blue-600" />
                Employee Management
              </h1>
             </div>
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <span className="text-sm font-medium text-blue-700">Total Employees: </span>
                <span className="text-lg font-bold text-blue-800">{filteredEmployees.length}</span>
              </div>
              <Link
                to="/create-employee"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center shadow-lg"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add Employee
              </Link>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white shadow-xl rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <tr>
                  <th className="py-4 px-6 text-left font-semibold">ID</th>
                  <th className="py-4 px-6 text-left font-semibold">Profile</th>
                  <th className="py-4 px-6 text-left font-semibold cursor-pointer hover:bg-blue-700 transition" onClick={() => handleSort("name")}>
                    Name {sortConfig.key === "name" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="py-4 px-6 text-left font-semibold cursor-pointer hover:bg-blue-700 transition" onClick={() => handleSort("email")}>
                    Email {sortConfig.key === "email" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="py-4 px-6 text-left font-semibold">Mobile</th>
                  <th className="py-4 px-6 text-left font-semibold">Gender</th>
                  <th className="py-4 px-6 text-left font-semibold">Course</th>
                  <th className="py-4 px-6 text-left font-semibold cursor-pointer hover:bg-blue-700 transition" onClick={() => handleSort("createdAt")}>
                    Join Date {sortConfig.key === "createdAt" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="py-4 px-6 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50 border-b border-gray-100 transition">
                    <td className="py-4 px-6 font-medium text-gray-900">{emp.id}</td>
                    <td className="py-4 px-6">
                      <img
                        src={`${process.env.REACT_APP_BASE_URL}/${emp.image.replace("\\", "/")}`}
                        alt={emp.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                      />
                    </td>
                    <td className="py-4 px-6 font-medium text-gray-900">{emp.name}</td>
                    <td className="py-4 px-6 text-blue-600 hover:text-blue-800 transition flex items-center">
                      <Mail className="mr-2 h-4 w-4" />
                      {emp.email}
                    </td>
                    <td className="py-4 px-6 text-gray-700 flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-gray-400" />
                      {emp.mobile}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        {emp.designation}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-700">{emp.gender}</td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                        {emp.course}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      {new Date(emp.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center space-x-2">
                        <Link
                          to={`/update-employee/${emp._id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit Employee"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          onClick={() => handleDelete(emp._id)}
                          title="Delete Employee"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {Math.min((currentPage - 1) * pageSize + 1, filteredEmployees.length)} to {Math.min(currentPage * pageSize, filteredEmployees.length)} of {filteredEmployees.length} employees
            </div>
            <div className="flex items-center space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-2 rounded-lg border transition ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
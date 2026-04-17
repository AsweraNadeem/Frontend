import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
  Mail,
  Phone,
} from "lucide-react";
import API from "../api";
import toast from "react-hot-toast";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(true);

  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "asc",
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const res = await API.get("/employee/getAllEmployee");
        setEmployees(res.data.employees);
        setFilteredEmployees(res.data.employees);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, []);

  // SEARCH
  useEffect(() => {
    const data = employees.filter((emp) => {
      const query = search.toLowerCase();
      return (
        emp.name.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.id.toString().includes(query)
      );
    });

    setFilteredEmployees(data);
    setCurrentPage(1);
  }, [search, employees]);

  // SORT
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });

    const sorted = [...filteredEmployees].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredEmployees(sorted);
  };

  // PAGINATION
  const totalPages = Math.ceil(filteredEmployees.length / pageSize);
  const paginatedData = filteredEmployees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // DELETE
  const handleDelete = async (id) => {
    try {
      const res = await API.delete(`/employee/deleteEmployee/${id}`);
      if (res.data.success) {
        const updated = employees.filter((emp) => emp._id !== id);
        setEmployees(updated);
        setFilteredEmployees(updated);
        toast.success("Employee deleted successfully");
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Users className="text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">
              Employee Management
            </h1>
          </div>

          <Link
            to="/create-employee"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl flex items-center gap-2 transition"
          >
            <Plus size={18} />
            Add Employee
          </Link>
        </div>

        {/* SEARCH */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" />
            <input
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Search by name, email, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">

            <table className="w-full text-sm text-left">
              <thead className="bg-blue-600 text-white sticky top-0">
                <tr>
                  <th className="p-4">ID</th>
                  <th>Profile</th>
                  <th className="cursor-pointer" onClick={() => handleSort("name")}>Name</th>
                  <th className="cursor-pointer" onClick={() => handleSort("email")}>Email</th>
                  <th>Mobile</th>
                  <th>Designation</th>
                  <th>Gender</th>
                  <th>Course</th>
                  <th className="cursor-pointer" onClick={() => handleSort("createdAt")}>
                    Join Date
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="10" className="text-center p-10 text-gray-500">
                      Loading employees...
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center p-10 text-gray-500">
                      No employees found
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((emp, index) => (
                    <tr
                      key={emp._id}
                      className={`border-b hover:bg-gray-50 transition ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="p-4 font-medium text-gray-700">
                        {emp.id}
                      </td>

                      <td>
                        <img
                          src={emp.image}
                          alt="profile"
                          className="w-10 h-10 rounded-full object-cover border"
                        />
                      </td>

                      <td className="font-medium text-gray-800">{emp.name}</td>

                      <td className="text-blue-600 flex items-center gap-2">
                        <Mail size={14} /> {emp.email}
                      </td>

                      <td className="flex items-center gap-2 text-gray-700">
                        <Phone size={14} /> {emp.mobile}
                      </td>

                      <td>
                        <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                          {emp.designation}
                        </span>
                      </td>

                      <td className="text-gray-700">{emp.gender}</td>

                      <td>
                        <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
                          {emp.course}
                        </span>
                      </td>

                      <td className="text-gray-600">
                        {new Date(emp.createdAt).toLocaleDateString()}
                      </td>

                      <td>
                        <div className="flex gap-3">
                          <Link to={`/update-employee/${emp._id}`}>
                            <Edit className="text-blue-600 hover:scale-110 transition" />
                          </Link>

                          <button onClick={() => handleDelete(emp._id)}>
                            <Trash2 className="text-red-600 hover:scale-110 transition" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex justify-between items-center p-4 border-t">
            <span className="text-sm text-gray-600">
              Page <b>{currentPage}</b> of <b>{totalPages}</b>
            </span>

            <div className="flex gap-2">
              <button
                className="p-2 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft />
              </button>

              <button
                className="p-2 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

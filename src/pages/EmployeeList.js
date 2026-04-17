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

  // ✅ FETCH DATA (with proper loading control)
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);

        const res = await API.get("/employee/getAllEmployee");

        const data = res.data.employees || [];

        setEmployees(data);
        setFilteredEmployees(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load employees");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, []);

  // SEARCH
  useEffect(() => {
    if (!employees.length) return;

    const query = search.toLowerCase();

    const data = employees.filter((emp) => {
      return (
        emp.name?.toLowerCase().includes(query) ||
        emp.email?.toLowerCase().includes(query) ||
        emp.id?.toString().includes(query)
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

        toast.success("Deleted successfully");
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="bg-white shadow rounded-2xl p-6 flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Users className="text-blue-600" />
            <h1 className="text-2xl font-bold">Employee Management</h1>
          </div>

          <Link
            to="/create-employee"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={18} />
            Add Employee
          </Link>
        </div>

        {/* SEARCH */}
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" />
            <input
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-hidden">

          <table className="w-full text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-4">ID</th>
                <th>Profile</th>
                <th onClick={() => handleSort("name")} className="cursor-pointer">Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Designation</th>
                <th>Gender</th>
                <th>Course</th>
                <th onClick={() => handleSort("createdAt")} className="cursor-pointer">
                  Join Date
                </th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {/* ✅ LOADING STATE (IMPORTANT FIX) */}
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="animate-pulse border-b">
                    <td className="p-4 text-gray-300">----</td>
                    <td>
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    </td>
                    <td className="text-gray-300">Loading...</td>
                    <td className="text-gray-300">Loading...</td>
                    <td className="text-gray-300">Loading...</td>
                    <td className="text-gray-300">---</td>
                    <td className="text-gray-300">---</td>
                    <td className="text-gray-300">---</td>
                    <td className="text-gray-300">---</td>
                    <td></td>
                  </tr>
                ))
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center p-10 text-gray-500">
                    No employees found
                  </td>
                </tr>
              ) : (
                paginatedData.map((emp) => (
                  <tr key={emp._id} className="border-b hover:bg-gray-50">

                    <td className="p-4">{emp.id}</td>

                    <td>
                      <img
                        src={emp.image}
                        className="w-10 h-10 rounded-full object-cover"
                        alt=""
                      />
                    </td>

                    <td className="font-medium">{emp.name}</td>

                    <td className="flex items-center gap-2 text-blue-600">
                      <Mail size={14} />
                      {emp.email}
                    </td>

                    <td className="flex items-center gap-2">
                      <Phone size={14} />
                      {emp.mobile}
                    </td>

                    <td>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                        {emp.designation}
                      </span>
                    </td>

                    <td>{emp.gender}</td>

                    <td>
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                        {emp.course}
                      </span>
                    </td>

                    <td>
                      {new Date(emp.createdAt).toLocaleDateString()}
                    </td>

                    <td>
                      <div className="flex gap-2">
                        <Link to={`/update-employee/${emp._id}`}>
                          <Edit className="text-blue-600" />
                        </Link>

                        <button onClick={() => handleDelete(emp._id)}>
                          <Trash2 className="text-red-600" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}

            </tbody>
          </table>

          {/* PAGINATION */}
          <div className="flex justify-between items-center p-4 border-t">
            <span>
              Page {currentPage} of {totalPages}
            </span>

            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft />
              </button>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p - 1)}
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

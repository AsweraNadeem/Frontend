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
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "asc",
  });

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

  // Sorting
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

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / pageSize);
  const paginatedData = filteredEmployees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="bg-white shadow-xl rounded-2xl p-6 mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center">
            <Users className="mr-3 text-blue-600" />
            Employee Management
          </h1>

          <Link
            to="/create-employee"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg flex items-center"
          >
            <Plus className="mr-2" />
            Add Employee
          </Link>
        </div>

        {/* Search */}
        <div className="bg-white shadow rounded-xl p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg w-full"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-4">ID</th>
                <th>Profile</th>
                <th onClick={() => handleSort("name")} className="cursor-pointer">Name</th>
                <th onClick={() => handleSort("email")} className="cursor-pointer">Email</th>
                <th>Mobile</th>
                <th>Designation</th> {/* ✅ ADDED */}
                <th>Gender</th>
                <th>Course</th>
                <th onClick={() => handleSort("createdAt")} className="cursor-pointer">Join Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((emp) => (
                <tr key={emp._id} className="border-b hover:bg-gray-50">

                  <td className="p-4">{emp.id}</td>

                  {/* Profile */}
                  <td>
                    <img
                      src={emp.image}
                      alt="profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>

                  <td>{emp.name}</td>

                  {/* Email */}
                  <td>
                    <div className="flex items-center text-blue-600">
                      <Mail className="mr-2 w-4 h-4" />
                      {emp.email}
                    </div>
                  </td>

                  {/* Mobile */}
                  <td>
                    <div className="flex items-center">
                      <Phone className="mr-2 w-4 h-4" />
                      {emp.mobile}
                    </div>
                  </td>

                  {/* ✅ DESIGNATION */}
                  <td>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                      {emp.designation}
                    </span>
                  </td>

                  {/* Gender */}
                  <td>{emp.gender}</td>

                  {/* Course */}
                  <td>
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                      {emp.course}
                    </span>
                  </td>

                  {/* Join Date */}
                  <td>
                    {new Date(emp.createdAt).toLocaleDateString()}
                  </td>

                  {/* Actions */}
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
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="p-4 flex justify-between items-center">
            <span>
              Page {currentPage} of {totalPages}
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft />
              </button>

              <button
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

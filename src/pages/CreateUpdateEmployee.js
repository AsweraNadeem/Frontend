import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User, Mail, Phone, Briefcase, Users, BookOpen, Upload, Save } from "lucide-react";
import API from '../api'
import toast from "react-hot-toast";

export default function CreateEmployee({ mode }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        designation: "",
        gender: "",
        course: "",
        image: null,
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                if (mode === "edit" && id) {
                    const res = await API.get(`/employee/getEmployeeById/${id}`);
                    setFormData(res?.data?.employee);
                }
            } catch (error) {
                console.error("Failed to fetch employee:", error.response?.data || error);
            }
        };

        fetchEmployee();
    }, [mode, id]);


    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === "checkbox") {
            setFormData((prev) => {
                const newCourses = checked
                    ? [...prev.course, value]
                    : prev.course.filter((c) => c !== value);
                return { ...prev, courses: newCourses };
            });
        } else if (type === "file") {
            setFormData((prev) => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            Object.keys(formData).forEach((key) => {
                if (key === "courses") {
                    formData.course.forEach((course) => data.append("courses", course));
                } else {
                    data.append(key, formData[key]);
                }
            });

            if (mode === "edit") {
              const res=  await API.put(`/employee/updateEmployee/${id}`, data, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                if(res?.data?.success){
                    toast.success("Employee updated successfully!");
                }
                
            } else {
              const res=  await API.post("/employee/addEmployee", data, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                if(res?.data?.success){
                    toast.success("Employee added successfully!");
                }
                
            }

            navigate("/employees");
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
            setErrors(error.response?.data?.errors || {});
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
                        <h2 className="text-3xl font-bold text-white">
                            {mode === "create" ? "Create New Employee" : "Update Employee"}
                        </h2>
                        <p className="text-blue-100 mt-2">
                            {mode === "create" ? "Add a new team member to organization" : "Modify employee information"}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Name */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter full name"
                                        className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        required
                                    />
                                </div>
                                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter email address"
                                        className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        required
                                    />
                                </div>
                                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                            </div>

                            {/* Mobile */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Mobile Number
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <input
                                        type="tel"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        placeholder="Enter mobile number"
                                        className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        required
                                    />
                                </div>
                                {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
                            </div>

                            {/* Designation */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Designation
                                </label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <select
                                        name="designation"
                                        value={formData.designation || ""}
                                        onChange={handleChange}
                                        className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        required
                                    >
                                        <option value="">Select Designation</option>
                                        <option value="HR">HR</option>
                                        <option value="Manager">Manager</option>
                                        <option value="Sales">Sales</option>
                                        <option value="Developer">Developer</option>
                                        <option value="Designer">Designer</option>
                                    </select>
                                </div>
                                {errors.designation && <p className="text-red-500 text-sm">{errors.designation}</p>}
                            </div>

                            {/* Gender */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Gender
                                </label>
                                <div className="flex items-center space-x-6">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="Male"
                                            checked={formData.gender === "Male"}
                                            onChange={handleChange}
                                            className="mr-2"
                                        />
                                        <span className="text-gray-700">Male</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="Female"
                                            checked={formData.gender === "Female"}
                                            onChange={handleChange}
                                            className="mr-2"
                                        />
                                        <span className="text-gray-700">Female</span>
                                    </label>
                                </div>
                                {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
                            </div>

                            {/* Course */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Course
                                </label>
                                <div className="space-y-2">
                                    {["MCA", "BCA", "BSC"].map((course) => (
                                        <label key={course} className="flex items-center">
                                            <input
                                                type="radio"
                                                name="course"
                                                value={course}
                                                checked={formData.course === course}
                                                onChange={handleChange}
                                                className="mr-2"
                                            />
                                            <span className="text-gray-700">{course}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.course && <p className="text-red-500 text-sm">{errors.course}</p>}
                            </div>

                            {/* Image Upload */}
                            <div className="md:col-span-2 lg:col-span-3 space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Profile Image
                                </label>
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <Upload className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleChange}
                                                name="image"
                                                className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            />
                                        </div>
                                        {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
                                    </div>

                                    {/* Preview */}
                                    {formData.image && (
                                        <div className="w-24 h-24 border-2 border-gray-200 rounded-lg overflow-hidden">
                                            <img
                                                src={
                                                    typeof formData.image === "string"
                                                        ? `${process.env.REACT_APP_BASE_URL}/${formData.image.replace("\\", "/")}`
                                                        : URL.createObjectURL(formData.image)
                                                }
                                                alt="Profile Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 flex items-center"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        {mode === "create" ? "Creating..." : "Updating..."}
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-5 w-5" />
                                        {mode === "create" ? "Create Employee" : "Update Employee"}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
};

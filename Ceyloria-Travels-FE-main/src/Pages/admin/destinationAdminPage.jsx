import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { FaTrash, FaEdit, FaMapMarkedAlt } from "react-icons/fa";
import { safeParseJSON } from "../../utils/jsonParser.js";

export default function DestinationAdminPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const axiosConfig = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${token}` },
    }),
    [token]
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/destinations`,
          axiosConfig
        );
        setCategories(res.data);
      } catch (err) {
        console.error(err);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            toast.error("Session expired. Please login again.");
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            navigate("/login");
        } else {
            toast.error("Failed to fetch destinations");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [axiosConfig, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/destinations/${id}`,
        axiosConfig
      );
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      toast.success("Category deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete category");
    }
  };

  if (loading) return <div className="p-10 text-white">Loading destinations...</div>;

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Destination Categories</h1>
          <p className="text-gray-400 mt-1">Manage destination collections (e.g., Shores, Cultural)</p>
        </div>
        <button
          onClick={() => navigate("/admin/add-destination-category")}
          className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-blue-600/20 flex items-center gap-2 transition"
        >
          <img src="/admin-add-icon.svg" alt="add" className="w-5 h-5" /> Add New Category
        </button>
      </div>

      {!categories.length ? (
        <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-12 text-center">
          <p className="text-white text-xl mb-4">No destination categories found.</p>
          <button
            onClick={() => navigate("/admin/add-destination-category")}
            className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-8 py-3 rounded-xl hover:shadow-lg hover:shadow-blue-600/20 flex items-center gap-2 transition mx-auto"
          >
            <img src="/admin-add-icon.svg" alt="add" className="w-5 h-5" /> Add First Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
                <div key={cat.id} className="bg-slate-900/50 rounded-2xl overflow-hidden border border-white/10 flex flex-col">
                    <div className="h-48 overflow-hidden relative group">
                        <img src={cat.image} alt={cat.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                        <div className="absolute bottom-4 left-4">
                            <h3 className="text-xl font-bold text-white">{cat.title}</h3>
                            <p className="text-xs text-slate-300">{cat.id}</p>
                        </div>
                    </div>
                    <div className="p-4 flex-grow">
                        <p className="text-sm text-slate-400 line-clamp-2">{cat.description}</p>
                        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                            <span className="bg-slate-700 px-2 py-1 rounded">{(safeParseJSON(cat.destinations) || []).length} Destinations</span>
                        </div>
                    </div>
                    <div className="p-4 border-t border-white/10 flex justify-end gap-2 bg-slate-900/40">
                        <Link
                            to={`/admin/update-destination-category/${cat.id}`}
                        className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                        >
                            <FaEdit />
                        </Link>
                        <button
                            onClick={() => handleDelete(cat.id)}
                            className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                        >
                            <FaTrash />
                        </button>
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { FaTrash, FaEdit } from "react-icons/fa";
import { safeParseJSON } from "../../utils/jsonParser.js";

export default function AccommodationsAdminPage() {
  const [accommodations, setAccommodations] = useState([]);
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
    const fetchAccommodations = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/accommodations`,
          axiosConfig
        );
        setAccommodations(res.data);
      } catch (err) {
        console.error(err);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("token");
          localStorage.removeItem("role"); // Clear role too
          navigate("/login");
        } else {
          toast.error("Failed to fetch accommodations");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAccommodations();
  }, [axiosConfig]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this accommodation?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/accommodations/${id}`,
        axiosConfig
      );
      setAccommodations((prev) => prev.filter((acc) => acc.id !== id));
      toast.success("Accommodation deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete accommodation");
    }
  };

  if (loading) return <div className="p-10 text-white">Loading accommodations...</div>;

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">All Accommodations</h1>
          <p className="text-gray-400 mt-1">Manage your hotels and accommodations</p>
        </div>
        <button
          onClick={() => navigate("/admin/add-accommodation")}
          className="bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-600 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
        >
          <FaEdit className="text-lg" /> Add New Hotel
        </button>
      </div>

      {!accommodations.length ? (
        <div className="bg-slate-800 rounded-lg p-12 text-center">
          <p className="text-white text-xl mb-4">No accommodations found.</p>
          <p className="text-gray-400 mb-6">Get started by adding your first hotel.</p>
          <button
            onClick={() => navigate("/admin/add-accommodation")}
            className="bg-[#cb007e] text-white px-8 py-3 rounded-lg hover:bg-[#a00063] flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold mx-auto"
          >
            <FaEdit className="text-lg" /> Add Your First Hotel
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accommodations.map((acc) => {
                const parsedImages = (safeParseJSON(acc.images) || []).filter(i => i && i.trim() !== "");
                return (
                <div key={acc.id} className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 flex flex-col">
                    <div className="h-48 overflow-hidden relative group">
                        <img src={parsedImages[0] || 'https://via.placeholder.com/400x300?text=No+Image'} alt={acc.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                        <div className="absolute bottom-4 left-4">
                            <h3 className="text-xl font-bold text-white line-clamp-1">{acc.name ?? "N/A"}</h3>
                            <p className="text-xs text-slate-300">{acc.type ?? "N/A"}</p>
                        </div>
                    </div>
                    <div className="p-4 flex-grow">
                        <p className="text-sm text-slate-400 line-clamp-2">{acc.description ?? "No description available."}</p>
                        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                            <span className="bg-slate-700 px-2 py-1 rounded">{acc.location ?? "N/A"}</span>
                            <span className="bg-[#cb007e]/20 text-[#cb007e] px-2 py-1 rounded border border-[#cb007e]/30 font-semibold">${(acc.pricePerNight ?? 0).toLocaleString()} / night</span>
                        </div>
                    </div>
                    <div className="p-4 border-t border-slate-700 flex justify-end gap-2 bg-slate-850">
                        <Link
                            to={`/admin/update-accommodation/${acc.id}`}
                            className="p-2 bg-[#cb007e]/20 text-[#cb007e] rounded-lg hover:bg-[#cb007e] hover:text-white transition-colors"
                        >
                            <FaEdit />
                        </Link>
                        <button
                            onClick={() => handleDelete(acc.id)}
                            className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                        >
                            <FaTrash />
                        </button>
                    </div>
                </div>
                );
            })}
        </div>
      )}
    </div>
  );}

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaEdit } from "react-icons/fa";
import { safeParseJSON } from "../../utils/jsonParser.js";

export default function PackageAdminPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Get JWT token from localStorage (assuming you store it there)
  const token = localStorage.getItem("token");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/packages`,
          axiosConfig
        );
        setPackages(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch packages");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/packages/${id}`,
        axiosConfig
      );
      setPackages((prev) => prev.filter((pkg) => pkg.id !== id));
      toast.success("Package deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete package");
    }
  };

  if (loading) return <div className="p-10 text-white">Loading packages...</div>;

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">All Packages</h1>
          <p className="text-gray-400 mt-1">Manage your tour packages</p>
        </div>
        <button
          onClick={() => navigate("/admin/add-package")}
          className="bg-[#cb007e] text-white px-6 py-3 rounded-lg hover:bg-[#a00063] flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
        >
          <FaEdit className="text-lg" /> Add New Package
        </button>
      </div>

      {!packages.length ? (
        <div className="bg-slate-800 rounded-lg p-12 text-center">
          <p className="text-white text-xl mb-4">No packages found.</p>
          <p className="text-gray-400 mb-6">Get started by adding your first package.</p>
          <button
            onClick={() => navigate("/admin/add-package")}
            className="bg-[#cb007e] text-white px-8 py-3 rounded-lg hover:bg-[#a00063] flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold mx-auto"
          >
            <FaEdit className="text-lg" /> Add Your First Package
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => {
                const parsedImages = safeParseJSON(pkg.images);
                const parsedCities = safeParseJSON(pkg.citiesCovered);

                return (
                  <div key={pkg.id} className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 flex flex-col">
                      <div className="h-48 overflow-hidden relative group">
                          <img src={parsedImages?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'} alt={pkg.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                          <div className="absolute bottom-4 left-4">
                              <h3 className="text-xl font-bold text-white line-clamp-1">{pkg.title}</h3>
                              <p className="text-xs text-slate-300">{pkg.duration}</p>
                          </div>
                      </div>
                      <div className="p-4 flex-grow">
                          <p className="text-sm text-slate-400 line-clamp-2">{parsedCities?.join(", ") || "No cities specified"}</p>
                          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                              <span className="bg-[#cb007e]/20 text-[#cb007e] px-2 py-1 rounded border border-[#cb007e]/30 font-semibold">${(pkg.price ?? 0).toLocaleString()}</span>
                          </div>
                      </div>
                    <div className="p-4 border-t border-slate-700 flex justify-end gap-2 bg-slate-850">
                        <Link
                            to={`/admin/package-admin/${pkg.id}`}
                            className="p-2 bg-[#cb007e]/20 text-[#cb007e] rounded-lg hover:bg-[#cb007e] hover:text-white transition-colors"
                        >
                            <FaEdit />
                        </Link>
                        <button
                            onClick={() => handleDelete(pkg.id)}
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
  );
}

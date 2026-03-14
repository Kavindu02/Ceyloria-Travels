import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import { safeParseJSON } from "../../utils/jsonParser.js";

export default function CuratedPackagesAdminPage() {
  const [packages, setPackages] = useState([]);
  const [curatedIds, setCuratedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");
  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allRes, curatedRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/packages`, axiosConfig),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/packages/curated`)
        ]);
        setPackages(allRes.data);
        setCuratedIds(curatedRes.data.map(p => p.id));
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleSelection = (id) => {
    if (curatedIds.includes(id)) {
      setCuratedIds(curatedIds.filter(i => i !== id));
    } else {
      if (curatedIds.length >= 3) {
        toast.error("You can only select up to 3 curated packages");
        return;
      }
      setCuratedIds([...curatedIds, id]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/packages/curated`,
        { packageIds: curatedIds },
        axiosConfig
      );
      toast.success("Curated packages updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update curated packages");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-white">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Curated Packages</h1>
          <p className="text-slate-400">Select exactly 3 packages to display in the "Curated Packages" section on the homepage.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-8 py-3 rounded-xl font-bold transition-all ${
            saving ? "bg-slate-700 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-600/20"
          }`}
        >
          {saving ? "Saving..." : "Save Selection"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => {
          const isSelected = curatedIds.includes(pkg.id);
          const parsedImages = safeParseJSON(pkg.images);
          const safeImage = parsedImages?.[0] || pkg.image;

          return (
            <div
              key={pkg.id}
              onClick={() => toggleSelection(pkg.id)}
              className={`relative cursor-pointer rounded-2xl border-2 transition-all p-4 ${
                isSelected 
                  ? "bg-teal-600/10 border-teal-500 shadow-xl" 
                  : "bg-slate-900 border-white/10 hover:border-white/30"
              }`}
            >
              <div className="absolute top-4 right-4 text-2xl">
                {isSelected ? (
                  <FaCheckCircle className="text-teal-500" />
                ) : (
                  <FaRegCircle className="text-slate-600" />
                )}
              </div>
              
              <div className="h-40 rounded-xl overflow-hidden mb-4 bg-slate-800">
                {safeImage ? (
                   <img 
                    src={safeImage} 
                    className="w-full h-full object-cover" 
                    alt={pkg.title} 
                    onError={(e) => { e.target.src = "/gallery/img1.jpg"; }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">No Image</div>
                )}
              </div>

              <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{pkg.title}</h3>
              <p className="text-sm text-slate-400 mb-2">{pkg.duration}</p>
              <p className="text-teal-400 font-bold">${pkg.price.toLocaleString()}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

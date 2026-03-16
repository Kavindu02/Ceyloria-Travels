import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import mediaUpload from "../../utils/mediaUpload"; // Supabase upload helper

const normalizeStringArray = (value) => {
  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : (value.trim() ? [value] : []);
    } catch {
      return value.trim() ? [value] : [];
    }
  }

  return [];
};

const normalizePackageArray = (value) => {
  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
};

export default function UpdateAccommodationAdminPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [acc, setAcc] = useState({
    name: "",
    type: "",
    location: "",
    pricePerNight: 0,
    fullBoardPrice: "",
    halfBoardPrice: "",
    existingPackages: [],
    amenities: [],
    images: [],
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Load accommodation by ID
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const token = localStorage.getItem("token");

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/accommodations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // Ensure amenities & images exist
        const data = res.data;
        const parsedPackages = normalizePackageArray(data.packages);

        const getBoardPrice = (label) => {
          const matched = parsedPackages.find((item) => {
            const boardType = String(item?.boardType || item?.type || item?.name || "").toLowerCase();
            return boardType.includes(label);
          });

          return matched ? String(Number(matched?.price ?? matched?.pricePerNight ?? 0) || 0) : "";
        };

        setAcc({
          name: data.name || "",
          type: data.type || "",
          location: data.location || "",
          pricePerNight: data.pricePerNight || 0,
          fullBoardPrice: getBoardPrice("full"),
          halfBoardPrice: getBoardPrice("half"),
          existingPackages: parsedPackages,
          amenities: normalizeStringArray(data.amenities),
          images: normalizeStringArray(data.images),
        });
      })
      .catch((err) => console.error("Error fetching accommodation:", err))
      .finally(() => setLoading(false));
  }, [id]);

  // Basic field change
  const handleChange = (field, value) => {
    setAcc((prev) => ({ ...prev, [field]: value }));
  };

  // Array field change (amenities, images)
  const handleArrayChange = (field, index, value) => {
    setAcc((prev) => {
      const updated = [...normalizeStringArray(prev[field])];
      updated[index] = value;
      return { ...prev, [field]: updated };
    });
  };

  // Add new element to array field
  const handleAddArrayField = (field) => {
    setAcc((prev) => ({
      ...prev,
      [field]: [...normalizeStringArray(prev[field]), ""],
    }));
  };

  // Upload single image
  const handleImageUpload = async (field, index, file) => {
    if (!file) return;
    try {
      setUploading(true);
      const url = await mediaUpload(file);
      setAcc((prev) => {
        const updated = [...normalizeStringArray(prev[field])];
        updated[index] = url;
        return { ...prev, [field]: updated };
      });
    } catch (err) {
      console.error("Image upload failed:", err);
      alert(err);
    } finally {
      setUploading(false);
    }
  };

  // Submit updated accommodation
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const fullBoardPrice = parseFloat(acc.fullBoardPrice) || 0;
      const halfBoardPrice = parseFloat(acc.halfBoardPrice) || 0;

      const preservedPackages = normalizePackageArray(acc.existingPackages).filter((item) => {
        const boardType = String(item?.boardType || item?.type || item?.name || "").toLowerCase();
        return !boardType.includes("full") && !boardType.includes("half");
      });

      const boardPackages = [];

      if (fullBoardPrice > 0) {
        boardPackages.push({
          boardType: "Full Board",
          price: fullBoardPrice,
          pricePerNight: fullBoardPrice,
        });
      }

      if (halfBoardPrice > 0) {
        boardPackages.push({
          boardType: "Half Board",
          price: halfBoardPrice,
          pricePerNight: halfBoardPrice,
        });
      }

      const payload = {
        ...acc,
        pricePerNight: parseFloat(acc.pricePerNight) || 0,
        amenities: normalizeStringArray(acc.amenities).filter(a => a && a.trim() !== ""),
        images: normalizeStringArray(acc.images).filter(img => img && img.trim() !== ""),
        packages: [...preservedPackages, ...boardPackages],
      };

      delete payload.fullBoardPrice;
      delete payload.halfBoardPrice;
      delete payload.existingPackages;

      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/accommodations/${id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Accommodation updated successfully!");
      navigate("/admin/hotels"); // Redirect to accommodations list
    } catch (err) {
      console.error("Update failed:", err);
      alert(err.response?.data?.message || "Failed to update accommodation");
    }
  };

  if (loading) return <div className="p-10 text-white">Loading accommodation...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-white">
      <button
        onClick={() => navigate("/admin/hotels")}
        className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors font-medium"
      >
        <FaArrowLeft /> Back to Hotels
      </button>

      <div>
        <h1 className="text-3xl font-bold">Edit Accommodation: {acc.name}</h1>
        <p className="text-slate-400">Update accommodation details and gallery</p>
      </div>
      <form onSubmit={handleSubmit} className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 space-y-6">
        {/* Name */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Name</label>
          <input
            type="text"
            value={acc.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full h-12 rounded-xl bg-slate-800 border border-white/10 px-4 text-white focus:border-teal-500 outline-none transition"
          />
        </div>

        {/* Type */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Type</label>
          <input
            type="text"
            value={acc.type}
            onChange={(e) => handleChange("type", e.target.value)}
            className="w-full h-12 rounded-xl bg-slate-800 border border-white/10 px-4 text-white focus:border-teal-500 outline-none transition"
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Location</label>
          <input
            type="text"
            value={acc.location}
            onChange={(e) => handleChange("location", e.target.value)}
            className="w-full h-12 rounded-xl bg-slate-800 border border-white/10 px-4 text-white focus:border-teal-500 outline-none transition"
          />
        </div>

        {/* Price per Night */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Main Price ($)</label>
          <input
            type="number"
            value={acc.pricePerNight}
            onChange={(e) => handleChange("pricePerNight", e.target.value)}
            className="w-full h-12 rounded-xl bg-slate-800 border border-white/10 px-4 text-white focus:border-teal-500 outline-none transition"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300">Full Board Price ($)</label>
            <input
              type="number"
              min="0"
              value={acc.fullBoardPrice}
              onChange={(e) => handleChange("fullBoardPrice", e.target.value)}
              className="w-full h-12 rounded-xl bg-slate-800 border border-white/10 px-4 text-white focus:border-teal-500 outline-none transition"
              placeholder="Enter full board price"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300">Half Board Price ($)</label>
            <input
              type="number"
              min="0"
              value={acc.halfBoardPrice}
              onChange={(e) => handleChange("halfBoardPrice", e.target.value)}
              className="w-full h-12 rounded-xl bg-slate-800 border border-white/10 px-4 text-white focus:border-teal-500 outline-none transition"
              placeholder="Enter half board price"
            />
          </div>
        </div>

        {/* Amenities */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Amenities</label>
          {normalizeStringArray(acc.amenities).map((item, idx) => (
            <input
              key={idx}
              type="text"
              value={item}
              onChange={(e) => handleArrayChange("amenities", idx, e.target.value)}
              className="w-full h-12 rounded-xl bg-slate-800 border border-white/10 px-4 text-white focus:border-teal-500 outline-none transition"
            />
          ))}
          <button
            type="button"
            onClick={() => handleAddArrayField("amenities")}
            className="text-xs bg-slate-800 border border-slate-700 hover:bg-slate-700 text-teal-400 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2"
          >
            <img src="/admin-add-icon.svg" alt="add" className="w-4 h-4" />
            Add Amenity
          </button>
        </div>

        {/* Images */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Images</label>
          {normalizeStringArray(acc.images).map((img, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={img}
                onChange={(e) => handleArrayChange("images", idx, e.target.value)}
                className="w-full h-12 rounded-xl bg-slate-800 border border-white/10 px-4 text-white focus:border-teal-500 outline-none transition"
                placeholder="Image URL"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload("images", idx, e.target.files[0])}
                className="px-2 py-2 rounded-lg text-sm bg-slate-800 border border-slate-700"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddArrayField("images")}
            className="text-xs bg-slate-800 border border-slate-700 hover:bg-slate-700 text-teal-400 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2"
          >
            <img src="/admin-add-icon.svg" alt="add" className="w-4 h-4" />
            Add Image
          </button>
          {uploading && <p className="text-yellow-400 mt-1">Uploading image...</p>}
        </div>

        <button
          type="submit"
          className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold text-lg hover:shadow-lg hover:shadow-blue-600/20 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          Update Accommodation
        </button>
      </form>
    </div>
  );
}

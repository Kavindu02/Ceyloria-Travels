import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import mediaUpload from "../../utils/mediaUpload"; 

export default function AddAccommodationAdminPage() {
  const navigate = useNavigate();

  const [acc, setAcc] = useState({
    name: "",
    type: "",
    location: "",
    pricePerNight: 0,
    fullBoardPrice: "",
    halfBoardPrice: "",
    amenities: [""],
    images: [],
  });

  const [uploading, setUploading] = useState(false);

  // Basic field change
  const handleChange = (field, value) => {
    setAcc(prev => ({ ...prev, [field]: value }));
  };

  // Array field change (amenities)
  const handleArrayChange = (field, index, value) => {
    const updated = [...acc[field]];
    updated[index] = value;
    setAcc(prev => ({ ...prev, [field]: updated }));
  };

  const handleAddArrayField = (field) => {
    setAcc(prev => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  // Handle image upload
  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    setUploading(true);

    try {
      const urls = [];
      for (let i = 0; i < files.length; i++) {
        const url = await mediaUpload(files[i]);
        urls.push(url);
      }
      setAcc(prev => ({ ...prev, images: [...prev.images, ...urls] }));
    } catch (err) {
      console.error("Upload error:", err);
      alert(err);
    } finally {
      setUploading(false);
    }
  };

  // Submit accommodation
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const fullBoardPrice = parseFloat(acc.fullBoardPrice) || 0;
      const halfBoardPrice = parseFloat(acc.halfBoardPrice) || 0;

      const packages = [];

      if (fullBoardPrice > 0) {
        packages.push({
          boardType: "Full Board",
          price: fullBoardPrice,
          pricePerNight: fullBoardPrice,
        });
      }

      if (halfBoardPrice > 0) {
        packages.push({
          boardType: "Half Board",
          price: halfBoardPrice,
          pricePerNight: halfBoardPrice,
        });
      }

      const payload = {
        ...acc,
        pricePerNight: parseFloat(acc.pricePerNight) || 0,
        amenities: acc.amenities.filter(a => a && a.trim() !== ""),
        images: acc.images.filter(img => img && img.trim() !== ""),
        packages,
      };

      delete payload.fullBoardPrice;
      delete payload.halfBoardPrice;

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/accommodations`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Accommodation added successfully!");
      navigate("/admin/hotels");
    } catch (err) {
      console.error("Error adding accommodation:", err);
      alert(err.response?.data?.message || "Failed to add accommodation");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => navigate("/admin/hotels")}
        className="text-slate-400 hover:text-white flex items-center gap-2 mb-6 transition-colors font-medium"
      >
        <FaArrowLeft /> Back to Hotels
      </button>

      <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Add New Accommodation</h1>
          <p className="text-slate-400 mt-1">Create and publish a new hotel listing</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

        {/* Name */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Name</label>
          <input
            type="text"
            value={acc.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full h-12 rounded-xl bg-slate-800 border border-white/10 px-4 text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition"
          />
        </div>

        {/* Type */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Type</label>
          <input
            type="text"
            value={acc.type}
            onChange={(e) => handleChange("type", e.target.value)}
            className="w-full h-12 rounded-xl bg-slate-800 border border-white/10 px-4 text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition"
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Location</label>
          <input
            type="text"
            value={acc.location}
            onChange={(e) => handleChange("location", e.target.value)}
            className="w-full h-12 rounded-xl bg-slate-800 border border-white/10 px-4 text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition"
          />
        </div>

        {/* Price per Night */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Main Price ($)</label>
          <input
            type="number"
            value={acc.pricePerNight}
            onChange={(e) => handleChange("pricePerNight", e.target.value)}
            className="w-full h-12 rounded-xl bg-slate-800 border border-white/10 px-4 text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition"
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
              className="w-full h-12 rounded-xl bg-slate-800 border border-white/10 px-4 text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition"
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
              className="w-full h-12 rounded-xl bg-slate-800 border border-white/10 px-4 text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition"
              placeholder="Enter half board price"
            />
          </div>
        </div>

        {/* Amenities */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Amenities</label>
          {acc.amenities.map((item, idx) => (
            <input
              key={idx}
              type="text"
              value={item}
              onChange={(e) => handleArrayChange("amenities", idx, e.target.value)}
              className="w-full h-12 rounded-xl bg-slate-800 border border-white/10 px-4 text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition"
            />
          ))}
          <button
            type="button"
            onClick={() => handleAddArrayField("amenities")}
            className="text-xs bg-slate-800 border border-white/10 hover:bg-slate-700 text-teal-400 px-3 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <img src="/admin-add-icon.svg" alt="add" className="w-4 h-4" />
            Add Amenity
          </button>
        </div>

        {/* Images */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-300">Images</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full text-sm text-slate-300 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:bg-slate-800 file:text-white hover:file:bg-slate-700"
          />
          {uploading && <p className="text-xs text-yellow-500">Uploading images...</p>}
          <div className="flex gap-2 flex-wrap mt-2">
            {acc.images.map((img, idx) => (
              <img key={idx} src={img} alt={`img-${idx}`} className="w-24 h-24 object-cover rounded-lg border border-white/10" />
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold text-lg hover:shadow-lg hover:shadow-blue-600/20 transition flex items-center justify-center gap-2"
        >
          <img src="/admin-add-icon.svg" alt="add" className="w-5 h-5" />
          Add Accommodation
        </button>
        </form>
      </div>
    </div>
  );
}

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import mediaUpload from "../../utils/mediaUpload"; // Supabase upload function
import { safeParseJSON } from "../../utils/jsonParser.js";

export default function UpdatePackage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Load package data
  useEffect(() => {
    if (!id) return;
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/packages/${id}`)
      .then(res => {
        const data = res.data;
        data.images = safeParseJSON(data.images);
        data.citiesCovered = safeParseJSON(data.citiesCovered);
        setPkg(data);
      })
      .catch(err => console.error("Error fetching package:", err));
  }, [id]);

  const handleChange = (field, value) => {
    setPkg(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    const updated = [...pkg[field]];
    updated[index] = value;
    setPkg(prev => ({ ...prev, [field]: updated }));
  };

  const handleAddArrayField = (field) => {
    setPkg(prev => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const handleImageUpload = async (field, index, file) => {
    if (!file) return;
    try {
      setUploading(true);
      const url = await mediaUpload(file);
      const updated = [...pkg[field]];
      updated[index] = url;
      setPkg(prev => ({ ...prev, [field]: updated }));
    } catch (err) {
      console.error("Image upload failed:", err);
      alert(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    axios
      .put(`${import.meta.env.VITE_BACKEND_URL}/packages/${id}`, pkg, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        alert("Package updated!");
        navigate("/admin/packages");
      })
      .catch(err => {
        console.error("Error updating package:", err);
        alert(err.response?.data?.message || "Update failed");
      });
  };

  if (!pkg) return <div className="p-10 text-white">Loading package...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-white">
      <button
        onClick={() => navigate("/admin/packages")}
        className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors font-medium"
      >
        <FaArrowLeft /> Back to Packages
      </button>

      <div>
        <h1 className="text-3xl font-bold">Edit Package: {pkg.title}</h1>
        <p className="text-slate-400">Update curated package details</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Title</label>
          <input
            type="text"
            value={pkg.title}
            onChange={e => handleChange("title", e.target.value)}
            className="w-full h-12 rounded-xl bg-slate-800 border border-white/10 px-4 text-white focus:border-teal-500 outline-none transition"
          />
        </div>

        {/* Short Description */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Short Description</label>
          <input
            type="text"
            value={pkg.shortDescription}
            onChange={e => handleChange("shortDescription", e.target.value)}
            className="w-full h-12 rounded-xl bg-slate-800 border border-white/10 px-4 text-white focus:border-teal-500 outline-none transition"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Description</label>
          <textarea
            value={pkg.description}
            onChange={e => handleChange("description", e.target.value)}
            className="w-full min-h-24 rounded-xl bg-slate-800 border border-white/10 p-4 text-white focus:border-teal-500 outline-none transition resize-none"
          />
        </div>

        {/* Price */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Price</label>
          <input
            type="number"
            value={pkg.price}
            onChange={e => handleChange("price", e.target.value)}
            className="w-full h-12 rounded-xl bg-slate-800 border border-white/10 px-4 text-white focus:border-teal-500 outline-none transition"
          />
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Duration</label>
          <input
            type="text"
            value={pkg.duration}
            onChange={e => handleChange("duration", e.target.value)}
            className="w-full h-12 rounded-xl bg-slate-800 border border-white/10 px-4 text-white focus:border-teal-500 outline-none transition"
          />
        </div>

        {/* Rating Text */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Rating Text (e.g. 4.9/5)</label>
          <input
            type="text"
            value={pkg.ratingText || "4.9/5"}
            onChange={(e) => handleChange("ratingText", e.target.value)}
            className="w-full h-12 rounded-xl bg-slate-800 border border-white/10 px-4 text-white focus:border-teal-500 outline-none transition"
            placeholder="e.g. 4.9/5"
          />
        </div>

        {/* Star Count */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Number of Stars (Select 1-5)</label>
          <select
            value={pkg.starCount || 5}
            onChange={(e) => handleChange("starCount", parseInt(e.target.value))}
            className="w-full h-12 rounded-xl bg-slate-800 border border-white/10 px-4 text-white focus:border-teal-500 outline-none transition"
          >
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
          </select>
        </div>

        {/* Cities Covered */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Cities Covered</label>
          {pkg.citiesCovered.map((city, idx) => (
            <input
              key={idx}
              type="text"
              value={city}
              onChange={e => handleArrayChange("citiesCovered", idx, e.target.value)}
              className="w-full h-12 rounded-xl bg-slate-800 border border-white/10 px-4 text-white focus:border-teal-500 outline-none transition"
            />
          ))}
          <button type="button" onClick={() => handleAddArrayField("citiesCovered")} className="text-xs bg-slate-800 border border-slate-700 hover:bg-slate-700 text-teal-400 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2"><img src="/admin-add-icon.svg" alt="add" className="w-4 h-4" />Add City</button>
        </div>

        {/* Images */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Images</label>
          {pkg.images.map((img, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={img}
                onChange={e => handleArrayChange("images", idx, e.target.value)}
                className="w-full h-12 rounded-xl bg-slate-800 border border-white/10 px-4 text-white focus:border-teal-500 outline-none transition"
                placeholder="Image URL"
              />
              <input
                type="file"
                accept="image/*"
                onChange={e => handleImageUpload("images", idx, e.target.files[0])}
                className="px-2 py-2 rounded-lg text-sm bg-slate-800 border border-slate-700"
              />
            </div>
          ))}
          <button type="button" onClick={() => handleAddArrayField("images")} className="text-xs bg-slate-800 border border-slate-700 hover:bg-slate-700 text-teal-400 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2"><img src="/admin-add-icon.svg" alt="add" className="w-4 h-4" />Add Image</button>
          {uploading && <p className="text-yellow-400 mt-1">Uploading image...</p>}
        </div>

        {/* Submit */}
        <button type="submit" className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold text-lg hover:shadow-lg hover:shadow-blue-600/20 transition disabled:opacity-50 flex items-center justify-center gap-2">
          Update Package
        </button>
      </form>
    </div>
  );
}

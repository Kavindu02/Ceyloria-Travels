import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import mediaUpload from "../../utils/mediaUpload";


export default function AddPackageAdminPage() {
  const navigate = useNavigate();
  const [pkg, setPkg] = useState({
    title: "",
    shortDescription: "",
    description: "",
    price: 0,
    duration: "",
    citiesCovered: [""],
    highlights: [""],
    inclusions: [""],
    exclusions: [""],
    images: [],
    ratingText: "4.9/5",
    starCount: 5,
  });

  const [uploading, setUploading] = useState(false);

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
      setPkg(prev => ({ ...prev, images: [...prev.images, ...urls] }));
    } catch (err) {
      console.error("Upload error:", err);
      alert(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/packages`, pkg, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("Package added successfully!");
        navigate("/admin/packages");
      })
      .catch((err) => {
        console.error("Error adding package:", err);
        alert(err.response?.data?.message || "Failed to add package");
      });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Add New Travel Package</h1>
          <p className="text-slate-400 mt-1">Create a curated package with complete trip details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Title</label>
          <input
            type="text"
            value={pkg.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full h-12 rounded-xl bg-slate-800 border border-white/10 px-4 text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition"
          />
        </div>

        {/* Short Description */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Short Description</label>
          <input
            type="text"
            value={pkg.shortDescription}
            onChange={(e) => handleChange("shortDescription", e.target.value)}
            className="w-full h-12 rounded-xl bg-slate-800 border border-white/10 px-4 text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Description</label>
          <textarea
            value={pkg.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full rounded-xl bg-slate-800 border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition resize-none"
            rows="4"
          />
        </div>

        {/* Price */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Price</label>
          <input
            type="number"
            value={pkg.price}
            onChange={(e) => handleChange("price", e.target.value)}
            className="w-full h-12 rounded-xl bg-slate-800 border border-white/10 px-4 text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition"
          />
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Duration</label>
          <input
            type="text"
            value={pkg.duration}
            onChange={(e) => handleChange("duration", e.target.value)}
            className="w-full h-12 rounded-xl bg-slate-800 border border-white/10 px-4 text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition"
          />
        </div>

        {/* Rating Text */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Rating Text (e.g. 4.9/5)</label>
          <input
            type="text"
            value={pkg.ratingText}
            onChange={(e) => handleChange("ratingText", e.target.value)}
            className="w-full h-12 rounded-xl bg-slate-800 border border-white/10 px-4 text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition"
            placeholder="e.g. 4.9/5"
          />
        </div>

        {/* Star Count */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Number of Stars (Select 1-5)</label>
          <select
            value={pkg.starCount}
            onChange={(e) => handleChange("starCount", parseInt(e.target.value))}
            className="w-full h-12 rounded-xl bg-slate-800 border border-white/10 px-4 text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition"
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
              onChange={(e) => handleArrayChange("citiesCovered", idx, e.target.value)}
              className="w-full h-12 rounded-xl bg-slate-800 border border-white/10 px-4 text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition"
            />
          ))}
          <button type="button" onClick={() => handleAddArrayField("citiesCovered")} className="text-xs bg-slate-800 border border-white/10 hover:bg-slate-700 text-teal-400 px-3 py-2 rounded-lg transition-colors">Add City</button>
        </div>

        {/* Highlights */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Highlights</label>
          {pkg.highlights.map((item, idx) => (
            <input
              key={idx}
              type="text"
              value={item}
              onChange={(e) => handleArrayChange("highlights", idx, e.target.value)}
              className="w-full h-12 rounded-xl bg-slate-800 border border-white/10 px-4 text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition"
            />
          ))}
          <button type="button" onClick={() => handleAddArrayField("highlights")} className="text-xs bg-slate-800 border border-white/10 hover:bg-slate-700 text-teal-400 px-3 py-2 rounded-lg transition-colors">Add Highlight</button>
        </div>

        {/* Inclusions */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Inclusions</label>
          {pkg.inclusions.map((item, idx) => (
            <input
              key={idx}
              type="text"
              value={item}
              onChange={(e) => handleArrayChange("inclusions", idx, e.target.value)}
              className="w-full h-12 rounded-xl bg-slate-800 border border-white/10 px-4 text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition"
            />
          ))}
          <button type="button" onClick={() => handleAddArrayField("inclusions")} className="text-xs bg-slate-800 border border-white/10 hover:bg-slate-700 text-teal-400 px-3 py-2 rounded-lg transition-colors">Add Inclusion</button>
        </div>

        {/* Exclusions */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Exclusions</label>
          {pkg.exclusions.map((item, idx) => (
            <input
              key={idx}
              type="text"
              value={item}
              onChange={(e) => handleArrayChange("exclusions", idx, e.target.value)}
              className="w-full h-12 rounded-xl bg-slate-800 border border-white/10 px-4 text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition"
            />
          ))}
          <button type="button" onClick={() => handleAddArrayField("exclusions")} className="text-xs bg-slate-800 border border-white/10 hover:bg-slate-700 text-teal-400 px-3 py-2 rounded-lg transition-colors">Add Exclusion</button>
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
            {pkg.images.map((img, idx) => (
              <img key={idx} src={img} alt={`img-${idx}`} className="w-24 h-24 object-cover rounded-lg border border-white/10" />
            ))}
          </div>
        </div>

          <button type="submit" className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors">Add Package</button>
        </form>
      </div>
    </div>
  );
}

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
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
    <div className="p-10 text-white">
      <h1 className="text-2xl font-bold">Edit Package: {pkg.title}</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        {/* Title */}
        <div>
          <label>Title</label>
          <input
            type="text"
            value={pkg.title}
            onChange={e => handleChange("title", e.target.value)}
            className="px-3 py-2 rounded text-black w-full"
          />
        </div>

        {/* Short Description */}
        <div>
          <label>Short Description</label>
          <input
            type="text"
            value={pkg.shortDescription}
            onChange={e => handleChange("shortDescription", e.target.value)}
            className="px-3 py-2 rounded text-black w-full"
          />
        </div>

        {/* Description */}
        <div>
          <label>Description</label>
          <textarea
            value={pkg.description}
            onChange={e => handleChange("description", e.target.value)}
            className="px-3 py-2 rounded text-black w-full"
          />
        </div>

        {/* Price */}
        <div>
          <label>Price</label>
          <input
            type="number"
            value={pkg.price}
            onChange={e => handleChange("price", e.target.value)}
            className="px-3 py-2 rounded text-black w-full"
          />
        </div>

        {/* Duration */}
        <div>
          <label>Duration</label>
          <input
            type="text"
            value={pkg.duration}
            onChange={e => handleChange("duration", e.target.value)}
            className="px-3 py-2 rounded text-black w-full"
          />
        </div>

        {/* Rating Text */}
        <div>
          <label>Rating Text (e.g. 4.9/5)</label>
          <input
            type="text"
            value={pkg.ratingText || "4.9/5"}
            onChange={(e) => handleChange("ratingText", e.target.value)}
            className="px-3 py-2 rounded text-black w-full"
            placeholder="e.g. 4.9/5"
          />
        </div>

        {/* Star Count */}
        <div>
          <label>Number of Stars (Select 1-5)</label>
          <select
            value={pkg.starCount || 5}
            onChange={(e) => handleChange("starCount", parseInt(e.target.value))}
            className="px-3 py-2 rounded text-black w-full bg-white"
          >
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
          </select>
        </div>

        {/* Cities Covered */}
        <div>
          <label>Cities Covered</label>
          {pkg.citiesCovered.map((city, idx) => (
            <input
              key={idx}
              type="text"
              value={city}
              onChange={e => handleArrayChange("citiesCovered", idx, e.target.value)}
              className="px-3 py-2 rounded text-black w-full mb-1"
            />
          ))}
          <button type="button" onClick={() => handleAddArrayField("citiesCovered")} className="bg-blue-600 px-2 py-1 rounded mt-1">Add City</button>
        </div>

        {/* Images */}
        <div>
          <label>Images</label>
          {pkg.images.map((img, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={img}
                onChange={e => handleArrayChange("images", idx, e.target.value)}
                className="px-3 py-2 rounded text-black w-full"
                placeholder="Image URL"
              />
              <input
                type="file"
                accept="image/*"
                onChange={e => handleImageUpload("images", idx, e.target.files[0])}
                className="px-2 py-1 rounded"
              />
            </div>
          ))}
          <button type="button" onClick={() => handleAddArrayField("images")} className="bg-blue-600 px-2 py-1 rounded mt-1">Add Image</button>
          {uploading && <p className="text-yellow-400 mt-1">Uploading image...</p>}
        </div>

        {/* Submit */}
        <button type="submit" className="px-4 py-2 bg-teal-600 rounded hover:bg-teal-700">
          Update Package
        </button>
      </form>
    </div>
  );
}

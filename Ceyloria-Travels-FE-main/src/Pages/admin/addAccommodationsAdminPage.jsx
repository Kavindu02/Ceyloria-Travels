import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import mediaUpload from "../../utils/mediaUpload"; // මේක file upload function එකයි

export default function AddAccommodationAdminPage() {
  const navigate = useNavigate();

  const [acc, setAcc] = useState({
    name: "",
    type: "",
    location: "",
    pricePerNight: 0,
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
      const payload = {
        ...acc,
        pricePerNight: parseFloat(acc.pricePerNight) || 0,
        amenities: acc.amenities.filter(a => a && a.trim() !== ""),
        images: acc.images.filter(img => img && img.trim() !== "")
      };

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
    <div className="p-10 text-white">
      <h1 className="text-2xl font-bold mb-4">Add New Accommodation</h1>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Name */}
        <div>
          <label>Name</label>
          <input
            type="text"
            value={acc.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="px-3 py-2 rounded text-black w-full"
          />
        </div>

        {/* Type */}
        <div>
          <label>Type</label>
          <input
            type="text"
            value={acc.type}
            onChange={(e) => handleChange("type", e.target.value)}
            className="px-3 py-2 rounded text-black w-full"
          />
        </div>

        {/* Location */}
        <div>
          <label>Location</label>
          <input
            type="text"
            value={acc.location}
            onChange={(e) => handleChange("location", e.target.value)}
            className="px-3 py-2 rounded text-black w-full"
          />
        </div>

        {/* Price per Night */}
        <div>
          <label>Price per Night ($)</label>
          <input
            type="number"
            value={acc.pricePerNight}
            onChange={(e) => handleChange("pricePerNight", e.target.value)}
            className="px-3 py-2 rounded text-black w-full"
          />
        </div>

        {/* Amenities */}
        <div>
          <label>Amenities</label>
          {acc.amenities.map((item, idx) => (
            <input
              key={idx}
              type="text"
              value={item}
              onChange={(e) => handleArrayChange("amenities", idx, e.target.value)}
              className="px-3 py-2 rounded text-black w-full mb-1"
            />
          ))}
          <button
            type="button"
            onClick={() => handleAddArrayField("amenities")}
            className="bg-blue-600 px-2 py-1 rounded mt-1"
          >
            Add Amenity
          </button>
        </div>

        {/* Images */}
        <div>
          <label>Images</label>
          <input type="file" multiple onChange={handleFileChange} className="text-black mb-2" />
          {uploading && <p>Uploading images...</p>}
          <div className="flex gap-2 flex-wrap mt-2">
            {acc.images.map((img, idx) => (
              <img key={idx} src={img} alt={`img-${idx}`} className="w-24 h-24 object-cover rounded" />
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-teal-600 rounded hover:bg-teal-700"
        >
          Add Accommodation
        </button>
      </form>
    </div>
  );
}

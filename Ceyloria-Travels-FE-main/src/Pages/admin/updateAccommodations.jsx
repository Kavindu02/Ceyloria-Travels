import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import mediaUpload from "../../utils/mediaUpload"; // Supabase upload helper

export default function UpdateAccommodationAdminPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [acc, setAcc] = useState({
    name: "",
    type: "",
    location: "",
    pricePerNight: 0,
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
        setAcc({
          name: data.name || "",
          type: data.type || "",
          location: data.location || "",
          pricePerNight: data.pricePerNight || 0,
          amenities: data.amenities || [],
          images: data.images || [],
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
      const updated = [...(prev[field] || [])];
      updated[index] = value;
      return { ...prev, [field]: updated };
    });
  };

  // Add new element to array field
  const handleAddArrayField = (field) => {
    setAcc((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), ""],
    }));
  };

  // Upload single image
  const handleImageUpload = async (field, index, file) => {
    if (!file) return;
    try {
      setUploading(true);
      const url = await mediaUpload(file);
      setAcc((prev) => {
        const updated = [...(prev[field] || [])];
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
      const payload = {
        ...acc,
        pricePerNight: parseFloat(acc.pricePerNight) || 0,
        amenities: (acc.amenities || []).filter(a => a && a.trim() !== ""),
        images: (acc.images || []).filter(img => img && img.trim() !== "")
      };

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
    <div className="p-10 text-white">
      <h1 className="text-2xl font-bold">Edit Accommodation: {acc.name}</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
          {(acc.amenities || []).map((item, idx) => (
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
          {(acc.images || []).map((img, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={img}
                onChange={(e) => handleArrayChange("images", idx, e.target.value)}
                className="px-3 py-2 rounded text-black w-full"
                placeholder="Image URL"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload("images", idx, e.target.files[0])}
                className="px-2 py-1 rounded"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddArrayField("images")}
            className="bg-blue-600 px-2 py-1 rounded mt-1"
          >
            Add Image
          </button>
          {uploading && <p className="text-yellow-400 mt-1">Uploading image...</p>}
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-teal-600 rounded hover:bg-teal-700"
        >
          Update Accommodation
        </button>
      </form>
    </div>
  );
}

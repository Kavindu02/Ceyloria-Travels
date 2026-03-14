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
    <div className="p-10 text-white">
      <h1 className="text-2xl font-bold">Add New Travel Package</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">

        {/* Title */}
        <div>
          <label>Title</label>
          <input
            type="text"
            value={pkg.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="px-3 py-2 rounded text-black w-full"
          />
        </div>

        {/* Short Description */}
        <div>
          <label>Short Description</label>
          <input
            type="text"
            value={pkg.shortDescription}
            onChange={(e) => handleChange("shortDescription", e.target.value)}
            className="px-3 py-2 rounded text-black w-full"
          />
        </div>

        {/* Description */}
        <div>
          <label>Description</label>
          <textarea
            value={pkg.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="px-3 py-2 rounded text-black w-full"
          />
        </div>

        {/* Price */}
        <div>
          <label>Price</label>
          <input
            type="number"
            value={pkg.price}
            onChange={(e) => handleChange("price", e.target.value)}
            className="px-3 py-2 rounded text-black w-full"
          />
        </div>

        {/* Duration */}
        <div>
          <label>Duration</label>
          <input
            type="text"
            value={pkg.duration}
            onChange={(e) => handleChange("duration", e.target.value)}
            className="px-3 py-2 rounded text-black w-full"
          />
        </div>

        {/* Rating Text */}
        <div>
          <label>Rating Text (e.g. 4.9/5)</label>
          <input
            type="text"
            value={pkg.ratingText}
            onChange={(e) => handleChange("ratingText", e.target.value)}
            className="px-3 py-2 rounded text-black w-full"
            placeholder="e.g. 4.9/5"
          />
        </div>

        {/* Star Count */}
        <div>
          <label>Number of Stars (Select 1-5)</label>
          <select
            value={pkg.starCount}
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
              onChange={(e) => handleArrayChange("citiesCovered", idx, e.target.value)}
              className="px-3 py-2 rounded text-black w-full mb-1"
            />
          ))}
          <button type="button" onClick={() => handleAddArrayField("citiesCovered")} className="bg-blue-600 px-2 py-1 rounded mt-1">Add City</button>
        </div>

        {/* Highlights */}
        <div>
          <label>Highlights</label>
          {pkg.highlights.map((item, idx) => (
            <input
              key={idx}
              type="text"
              value={item}
              onChange={(e) => handleArrayChange("highlights", idx, e.target.value)}
              className="px-3 py-2 rounded text-black w-full mb-1"
            />
          ))}
          <button type="button" onClick={() => handleAddArrayField("highlights")} className="bg-blue-600 px-2 py-1 rounded mt-1">Add Highlight</button>
        </div>

        {/* Inclusions */}
        <div>
          <label>Inclusions</label>
          {pkg.inclusions.map((item, idx) => (
            <input
              key={idx}
              type="text"
              value={item}
              onChange={(e) => handleArrayChange("inclusions", idx, e.target.value)}
              className="px-3 py-2 rounded text-black w-full mb-1"
            />
          ))}
          <button type="button" onClick={() => handleAddArrayField("inclusions")} className="bg-blue-600 px-2 py-1 rounded mt-1">Add Inclusion</button>
        </div>

        {/* Exclusions */}
        <div>
          <label>Exclusions</label>
          {pkg.exclusions.map((item, idx) => (
            <input
              key={idx}
              type="text"
              value={item}
              onChange={(e) => handleArrayChange("exclusions", idx, e.target.value)}
              className="px-3 py-2 rounded text-black w-full mb-1"
            />
          ))}
          <button type="button" onClick={() => handleAddArrayField("exclusions")} className="bg-blue-600 px-2 py-1 rounded mt-1">Add Exclusion</button>
        </div>

        {/* Images */}
        <div>
          <label>Images</label>
          <input type="file" multiple onChange={handleFileChange} className="text-black mb-2" />
          {uploading && <p>Uploading images...</p>}
          <div className="flex gap-2 flex-wrap mt-2">
            {pkg.images.map((img, idx) => (
              <img key={idx} src={img} alt={`img-${idx}`} className="w-24 h-24 object-cover rounded" />
            ))}
          </div>
        </div>

        <button type="submit" className="px-4 py-2 bg-teal-600 rounded hover:bg-teal-700">Add Package</button>
      </form>
    </div>
  );
}

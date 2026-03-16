import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { FaPlus, FaTrash, FaArrowLeft, FaCloudUploadAlt } from "react-icons/fa";
import mediaUpload from "../../utils/mediaUpload";
import { safeParseJSON } from "../../utils/jsonParser.js";

export default function UpdateDestinationCategory() {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token");
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Category State
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    tagline: "",
    description: "",
    image: "",
  });

  // Destinations State (Array)
  const [destinations, setDestinations] = useState([]);

  // Fetch Existing Data
  useEffect(() => {
    const fetchData = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/destinations/${id}`);
            const data = res.data;
            
            setFormData({
                id: data.id,
                title: data.title,
                tagline: data.tagline,
                description: data.description,
                image: data.image
            });
            setDestinations(safeParseJSON(data.destinations) || []);

        } catch (err) {
            console.error("Fetch error:", err);
            toast.error("Failed to fetch category details.");
            navigate("/admin/destinations");
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDestinationChange = (index, field, value) => {
    const newDestinations = [...destinations];
    newDestinations[index][field] = value;
    setDestinations(newDestinations);
  };

  const handleImageUpload = async (e, targetType, index = null) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const toastId = toast.loading("Uploading image...");

    try {
        const url = await mediaUpload(file);
        
        if (targetType === 'category') {
            setFormData(prev => ({ ...prev, image: url }));
        } else if (targetType === 'destination' && index !== null) {
            handleDestinationChange(index, "image", url);
        }
        
        toast.success("Image uploaded!", { id: toastId });
    } catch (err) {
        console.error("Upload failed:", err);
        toast.error("Upload failed. Please try again.", { id: toastId });
    } finally {
        setUploading(false);
    }
  };

  const addDestination = () => {
    if (destinations.length >= 10) {
      toast.error("Maximum 10 destinations allowed per category.");
      return;
    }
    setDestinations([...destinations, { title: "", description: "", image: "" }]);
  };

  const removeDestination = (index) => {
    if (destinations.length === 1) {
        toast.error("At least one destination is required.");
        return;
    }
    const newDestinations = destinations.filter((_, i) => i !== index);
    setDestinations(newDestinations);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    // Basic Validation
    if (!formData.id || !formData.title || !formData.image) {
        toast.error("Please fill in all required category fields.");
        setSaving(false);
        return;
    }

    const validDestinations = destinations.filter(d => d.title && d.description && d.image);
    if (validDestinations.length === 0) {
        toast.error("Please add at least one valid destination.");
        setSaving(false);
        return;
    }

    const payload = {
        ...formData,
        destinations: validDestinations
    };

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/destinations/${id}`, // Uses objectId from params
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Destination Category updated successfully!");
      navigate("/admin/destinations");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update category");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-white">Loading details...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button
        onClick={() => navigate("/admin/destinations")}
                className="text-slate-400 hover:text-white flex items-center gap-2 mb-6 transition-colors font-medium"
      >
        <FaArrowLeft /> Back to Destinations
      </button>

    <div className="bg-slate-900/50 rounded-2xl p-8 shadow-xl border border-white/10">
        <h1 className="text-3xl font-bold text-white mb-8">Edit Destination Category</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* --- Category Details Section --- */}
          <div className="space-y-6 border-b border-slate-800 pb-8">
            <h2 className="text-xl font-semibold text-teal-400">1. Category Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Unique ID</label>
                    <input
                        type="text"
                        name="id"
                        value={formData.id}
                        onChange={handleChange}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Tagline</label>
                <input
                    type="text"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    required
                />
            </div>

            {/* Category Image Upload */}
            <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                    Hero Image
                    {uploading && <span className="ml-2 text-yellow-500 text-xs">(Uploading...)</span>}
                </label>
                
                <div className="flex items-start gap-4">
                    {/* Preview */}
                    {formData.image ? (
                        <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-slate-700 group">
                            <img src={formData.image} alt="Hero" className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-32 h-20 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center text-slate-500">
                           <span className="text-xs">No Image</span>
                        </div>
                    )}

                    {/* Input */}
                    <div className="flex-1">
                        <label className="cursor-pointer bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-colors">
                            <FaCloudUploadAlt /> 
                            <span>{formData.image ? "Change Image" : "Upload Image"}</span>
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, 'category')} 
                                className="hidden" 
                                disabled={uploading}
                            />
                        </label>
                    </div>
                </div>
            </div>
          </div>

          {/* --- Destinations Section --- */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-teal-400">2. Destinations ({destinations.length}/10)</h2>
                <button
                    type="button"
                    onClick={addDestination}
                    className="text-xs bg-slate-800 border border-slate-700 hover:bg-slate-700 text-teal-400 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2"
                >
                    <img src="/admin-add-icon.svg" alt="add" className="w-4 h-4" /> Add Destination
                </button>
            </div>

            <div className="space-y-4">
                {destinations.map((dest, index) => (
                    <div key={index} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 relative group">
                        <div className="absolute top-4 right-4 opacity-100">
                             <button
                                type="button"
                                onClick={() => removeDestination(index)}
                                className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                                title="Remove Destination"
                             >
                                <FaTrash />
                             </button>
                        </div>
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Destination #{index + 1}</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={dest.title}
                                        onChange={(e) => handleDestinationChange(index, "title", e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:border-teal-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Description</label>
                                    <textarea
                                        value={dest.description}
                                        onChange={(e) => handleDestinationChange(index, "description", e.target.value)}
                                        rows="4"
                                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:border-teal-500 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Destination Image Upload */}
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-2">Destination Image</label>
                                
                                <div className="space-y-3">
                                    {dest.image ? (
                                        <div className="relative w-full h-32 rounded-lg overflow-hidden border border-slate-700">
                                            <img src={dest.image} alt="Dest" className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="w-full h-32 bg-slate-900 rounded-lg border border-slate-700 border-dashed flex items-center justify-center text-slate-600">
                                            <span className="text-xs">Preview Area</span>
                                        </div>
                                    )}
                                    
                                    <label className="block w-full cursor-pointer bg-slate-900 border border-slate-700 hover:border-teal-500 text-slate-400 hover:text-white px-3 py-2 rounded text-xs text-center transition-colors">
                                        {uploading ? "Uploading..." : (dest.image ? "Change Image" : "Upload Image")}
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, 'destination', index)} 
                                            className="hidden" 
                                            disabled={uploading}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex justify-end">
                        <button
              type="submit"
              disabled={saving || uploading}
                            className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold text-lg hover:shadow-lg hover:shadow-blue-600/20 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
                            {saving ? "Saving..." : "Update Category"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaPlus, FaTrash, FaArrowLeft, FaCloudUploadAlt } from "react-icons/fa";
import mediaUpload from "../../utils/mediaUpload";

const normalizeItems = (items) => {
    if (Array.isArray(items)) {
        return items
            .filter((item) => item && typeof item === "object")
            .map((item) => ({
                title: item.title || "",
                description: item.description || "",
                image: item.image || "",
            }));
    }

    if (typeof items === "string") {
        try {
            const parsed = JSON.parse(items);
            return normalizeItems(parsed);
        } catch {
            return [];
        }
    }

    if (items && typeof items === "object") {
        return [{
            title: items.title || "",
            description: items.description || "",
            image: items.image || "",
        }];
    }

    return [];
};

export default function UpdateActivity() {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        category: "Water Sports",
        tagline: "",
        description: "",
        image: "",
    });

    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const res = await axios.get(import.meta.env.VITE_BACKEND_URL + `/activities/${id}`);
                const data = res.data;
                
                setFormData({
                    title: data.title || "",
                    category: data.category || "Water Sports",
                    tagline: data.tagline || "",
                    description: data.description || "",
                    image: data.image || "",
                });
                
                setItems(normalizeItems(data.items));
            } catch (err) {
                console.error("Error fetching activity:", err);
                toast.error("Failed to load activity data");
                navigate("/admin/activities");
            } finally {
                setLoading(false);
            }
        };
        fetchActivity();
    }, [id, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...normalizeItems(items)];
        if (!newItems[index]) {
            newItems[index] = { title: "", description: "", image: "" };
        }
        newItems[index][field] = value;
        setItems(newItems);
    };

    const handleImageUpload = async (e, targetType, index = null) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const toastId = toast.loading("Uploading image...");

        try {
            const url = await mediaUpload(file);
            
            if (targetType === 'main') {
                setFormData(prev => ({ ...prev, image: url }));
            } else if (targetType === 'item' && index !== null) {
                handleItemChange(index, "image", url);
            }
            
            toast.success("Image uploaded!", { id: toastId });
        } catch (err) {
            console.error("Upload failed:", err);
            toast.error("Upload failed. Please try again.", { id: toastId });
        } finally {
            setUploading(false);
        }
    };

    const addItem = () => {
        if (normalizeItems(items).length >= 10) {
            toast.error("Maximum 10 items allowed per activity.");
            return;
        }
        setItems([...normalizeItems(items), { title: "", description: "", image: "" }]);
    };

    const removeItem = (index) => {
        const currentItems = normalizeItems(items);
        if (currentItems.length === 1) {
            toast.error("At least one item is required.");
            return;
        }
        const newItems = currentItems.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);

        const validItems = normalizeItems(items).filter(it => it.title && it.description && it.image);
        if (validItems.length === 0) {
            toast.error("Please add at least one valid item with an image.");
            setUpdating(false);
            return;
        }

        const payload = {
            ...formData,
            items: validItems
        };

        try {
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/activities/${id}`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Activity updated successfully!");
            navigate("/admin/activities");
        } catch (err) {
            console.error("Error updating activity:", err);
            toast.error("Failed to update activity");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="p-10 text-white text-center">Loading activity data...</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <button
                onClick={() => navigate("/admin/activities")}
                className="text-slate-400 hover:text-white flex items-center gap-2 mb-6 transition-colors font-medium"
            >
                <FaArrowLeft /> Back to Activities
            </button>

            <div className="bg-slate-900/50 rounded-2xl p-8 shadow-2xl border border-white/10">
                <h1 className="text-3xl font-black text-white mb-8 tracking-tight">Update Activity Collection</h1>

                <form onSubmit={handleSubmit} className="space-y-10">
                    
                    {/* --- Activity Overview --- */}
                    <div className="space-y-6 border-b border-white/5 pb-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm">1</div>
                             <h2 className="text-xl font-bold text-white">General Overview</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Activity Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:border-teal-500 outline-none transition-all placeholder:text-slate-600"
                                    placeholder="e.g. Whale Watching Adventures"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:border-teal-500 outline-none transition-all"
                                    required
                                >
                                    <option value="Water Sports">Water Sports</option>
                                    <option value="Adventure">Adventure</option>
                                    <option value="Nature">Nature</option>
                                    <option value="Cultural">Cultural</option>
                                    <option value="Wellness">Wellness</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Tagline</label>
                            <input
                                type="text"
                                name="tagline"
                                value={formData.tagline}
                                onChange={handleChange}
                                className="w-full bg-slate-800 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:border-teal-500 outline-none transition-all placeholder:text-slate-600"
                                placeholder="A short, catchy phrase about this activity..."
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                className="w-full bg-slate-800 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-teal-500 outline-none transition-all placeholder:text-slate-600 resize-none"
                                placeholder="Describe the overall experience..."
                                required
                            />
                        </div>

                        {/* Main Cover Image */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-1">
                                Hero Cover Image
                                {uploading && <span className="ml-2 text-yellow-500 text-[10px] normal-case tracking-normal animate-pulse">(Uploading...)</span>}
                            </label>
                            
                            <div className="flex items-center gap-6 p-4 bg-slate-800/30 rounded-2xl border border-white/5">
                                {formData.image ? (
                                    <div className="relative w-40 h-24 rounded-xl overflow-hidden shadow-lg border border-white/10">
                                        <img src={formData.image} alt="Hero" className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-40 h-24 bg-slate-800 rounded-xl border border-white/5 flex items-center justify-center text-slate-600 italic text-xs">
                                        Preview Area
                                    </div>
                                )}

                                <div className="flex-1">
                                    <label className="cursor-pointer bg-white/5 border border-white/10 hover:bg-white/10 text-white px-5 py-2.5 rounded-xl inline-flex items-center gap-2 transition-all font-bold text-sm">
                                        <FaCloudUploadAlt className="text-teal-400" /> 
                                        <span>{formData.image ? "Replace Image" : "Upload Image"}</span>
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, 'main')} 
                                            className="hidden" 
                                            disabled={uploading}
                                        />
                                    </label>
                                    <p className="text-[10px] text-slate-500 mt-2 font-medium">Recommended size: 1920x1080px</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- Activity Items --- */}
                    <div className="space-y-8">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm">2</div>
                                <h2 className="text-xl font-bold text-white">Activity Timeline / Highlights ({normalizeItems(items).length})</h2>
                            </div>
                            <button
                                type="button"
                                onClick={addItem}
                                className="text-xs bg-slate-800 border border-slate-700 hover:bg-slate-700 text-teal-400 px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <img src="/admin-add-icon.svg" alt="add" className="w-4 h-4" /> Add Highlight
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {normalizeItems(items).map((it, index) => (
                                <div key={index} className="bg-slate-800/20 p-6 md:p-8 rounded-[2rem] border border-white/5 relative group transition-all hover:bg-slate-800/30">
                                    <button
                                        type="button"
                                        onClick={() => removeItem(index)}
                                        className="absolute top-6 right-6 p-2.5 text-slate-600 hover:text-red-500 transition-colors bg-slate-900/50 rounded-xl hover:bg-red-500/10"
                                        title="Remove"
                                    >
                                        <FaTrash size={14} />
                                    </button>

                                    <div className="flex flex-col md:flex-row gap-8">
                                        {/* Item Image */}
                                        <div className="w-full md:w-56 space-y-3">
                                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 border border-white/5 shadow-inner">
                                                {it.image ? (
                                                    <img src={it.image} alt="Itm" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-700 font-bold text-[10px] uppercase tracking-tighter">
                                                        No Image Selected
                                                    </div>
                                                )}
                                            </div>
                                            <label className="block w-full cursor-pointer bg-slate-900/50 border border-white/10 hover:border-teal-500 text-slate-400 hover:text-white px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-center transition-all">
                                                {uploading ? "Uploading..." : "Upload Photo"}
                                                <input 
                                                    type="file" 
                                                    accept="image/*"
                                                    onChange={(e) => handleImageUpload(e, 'item', index)} 
                                                    className="hidden" 
                                                    disabled={uploading}
                                                />
                                            </label>
                                        </div>

                                        {/* Item Text */}
                                        <div className="flex-1 space-y-4 pt-2">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Highlight Title</label>
                                                <input
                                                    type="text"
                                                    value={it.title}
                                                    onChange={(e) => handleItemChange(index, "title", e.target.value)}
                                                    className="w-full bg-transparent border-b border-white/10 pb-2 text-xl font-bold text-white focus:border-teal-500 outline-none transition-all placeholder:text-slate-700"
                                                    placeholder="e.g. Early Morning Departure"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Detail Description</label>
                                                <textarea
                                                    value={it.description}
                                                    onChange={(e) => handleItemChange(index, "description", e.target.value)}
                                                    rows="3"
                                                    className="w-full bg-transparent border border-white/10 rounded-xl p-3 text-slate-400 text-sm focus:border-teal-500 outline-none resize-none transition-all placeholder:text-slate-700 leading-relaxed"
                                                    placeholder="Briefly describe this moment or sub-activity..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="pt-10 border-t border-white/5 flex justify-end">
                        <button
                            type="submit"
                            disabled={updating || uploading}
                            className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold text-lg hover:shadow-lg hover:shadow-blue-600/20 transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {updating ? "Saving Changes..." : "Update Activity"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

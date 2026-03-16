import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { RiDeleteBin6Line, RiEdit2Line, RiAddLine } from "react-icons/ri";

export default function ActivityAdminPage() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchActivities = async () => {
        try {
            const res = await axios.get(import.meta.env.VITE_BACKEND_URL + "/activities");
            setActivities(res.data);
        } catch (err) {
            console.error("Error fetching activities:", err);
            toast.error("Failed to load activities");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    const deleteActivity = async (id, title) => {
        if (!confirm(`Are you sure you want to delete activity: ${title}?`)) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(import.meta.env.VITE_BACKEND_URL + `/activities/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Activity deleted successfully");
            fetchActivities();
        } catch (err) {
            console.error("Error deleting activity:", err);
            toast.error("Failed to delete activity");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Manage Activities</h1>
                    <p className="text-slate-400">View and manage your travel activities</p>
                </div>
                <Link
                    to="/admin/add-activity"
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-600/20 transition"
                >
                    <img src="/admin-add-icon.svg" alt="add" className="w-5 h-5" />
                    Add New Activity
                </Link>
            </div>

            <div className="bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden">
                {loading ? (
                    <div className="p-10 text-center text-slate-400">Loading activities...</div>
                ) : activities.length === 0 ? (
                    <div className="p-10 text-center text-slate-400">No activities found. Start by adding one!</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-800 text-slate-300 text-sm uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Image</th>
                                    <th className="px-6 py-4 font-semibold">Title</th>
                                    <th className="px-6 py-4 font-semibold">Category</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {activities.map((activity) => (
                                    <tr key={activity.id} className="hover:bg-white/5 transition">
                                        <td className="px-6 py-4">
                                            <img
                                                src={activity.image}
                                                alt={activity.title}
                                                className="w-16 h-12 object-cover rounded-lg"
                                            />
                                        </td>
                                        <td className="px-6 py-4 font-medium text-white">{activity.title}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-teal-500/10 text-teal-400 text-xs font-bold rounded-full">
                                                {activity.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    to={`/admin/update-activity/${activity.id}`}
                                                    className="p-2 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg transition"
                                                >
                                                    <RiEdit2Line />
                                                </Link>
                                                <button
                                                    onClick={() => deleteActivity(activity.id, activity.title)}
                                                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition"
                                                >
                                                    <RiDeleteBin6Line />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

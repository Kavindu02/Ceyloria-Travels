import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MapPin, Compass, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { safeParseJSON } from "../utils/jsonParser.js";

const ActivityDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/activities/${id}`);
                if (!res.ok) throw new Error("Activity not found");
                const data = await res.json();
                setActivity(data);
            } catch (err) {
                console.error("Error fetching activity:", err);
                toast.error("Failed to load activity details");
                navigate("/activities");
            } finally {
                setLoading(false);
            }
        };

        fetchActivity();
        window.scrollTo(0, 0);
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#cc007e]"></div>
            </div>
        );
    }

    if (!activity) return null;

    return (
        <section className="animate-fade-in pb-20 bg-gray-50 min-h-screen font-sans selection:bg-[#cc007e] selection:text-white">

            {/* --- IMMERSIVE HERO SECTION --- */}
            <div className="relative h-[70vh] w-full overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={activity.image}
                        alt={activity.title}
                        className="w-full h-full object-cover animate-subtle-zoom"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900/76 via-gray-900/40 to-gray-200/15" />
                </div>

                <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-end pb-6 md:pb-10">
                    <div className="max-w-4xl space-y-6 animate-fade-in-up translate-y-20 md:translate-y-28">
                        <div className="flex items-center gap-3">
                            <span className="px-4 py-1.5 bg-[#cc007e] text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-[#cc007e]/20">
                                {activity.category}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-none drop-shadow-2xl">
                            {activity.title}
                        </h1>
                        <p className="text-xl md:text-2xl text-[#cc007e] font-light italic border-l-4 border-[#cc007e]/80 pl-6 max-w-2xl">
                            {activity.tagline}
                        </p>
                        <p className="text-white/95 drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] max-w-2xl text-lg leading-relaxed pt-4 font-light">
                            {activity.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* --- SHOWCASE / TRAVEL GUIDE LAYOUT --- */}
            <div className="container mx-auto px-6 mt-14 relative z-20 space-y-24 pb-24">

                {/* Loop through items (Sub-activities) */}
                {(safeParseJSON(activity.items) || []).length > 0 ? (
                    (safeParseJSON(activity.items) || []).map((item, index) => (
                        <div
                            key={index}
                            className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
                        >
                            {/* Image Side */}
                            <div className="w-full lg:w-1/2 group">
                                <div className="relative aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl transition-all duration-700 hover:shadow-3xl border border-white/10">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="h-full w-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                    {/* Decorative Badge */}
                                    <div className={`absolute top-8 ${index % 2 !== 0 ? 'right-8' : 'left-8'} bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-500`}>
                                        <Compass className="text-white drop-shadow-md" size={32} />
                                    </div>

                                    {/* Floating Label */}
                                    <div className={`absolute bottom-8 ${index % 2 !== 0 ? 'left-8' : 'right-8'} bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500`}>
                                        <span className="text-gray-900 font-black text-sm uppercase tracking-widest flex items-center gap-2">
                                            <MapPin size={14} className="text-[#cc007e]" /> Discover
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Content Side */}
                            <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left">
                                <div className="space-y-4">
                                    <span className="inline-block px-4 py-1.5 rounded-full bg-[#cc007e]/10 text-[#cc007e] text-[10px] font-black uppercase tracking-widest border border-[#cc007e]/20">
                                        Highlight {index + 1}
                                    </span>
                                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight tracking-tight">
                                        {item.title}
                                    </h2>
                                    <div className="h-1.5 w-24 bg-[#cc007e] rounded-full mx-auto lg:mx-0 shadow-lg shadow-[#cc007e]/20" />
                                </div>

                                <p className="text-lg md:text-xl text-gray-500 leading-relaxed font-light">
                                    {item.description}
                                </p>

                                {/* Action Button */}
                                <div className="pt-6">
                                    <Link
                                        to="/contact"
                                        className="inline-flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:bg-[#cc007e] hover:shadow-2xl hover:shadow-[#cc007e]/30 hover:-translate-y-1 active:scale-95 group/btn"
                                    >
                                        Enquire Now
                                        <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-20 text-center bg-white rounded-[3rem] shadow-xl border border-gray-100">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Compass size={40} className="text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Activities coming soon</h3>
                        <p className="text-gray-500">We're curating the best experiences for you.</p>
                    </div>
                )}
            </div>





        </section>
    );
};

export default ActivityDetail;

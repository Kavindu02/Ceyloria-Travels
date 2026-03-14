import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, Search, Star, Clock, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ---------------------- REUSABLE ANIMATION COMPONENT ----------------------
const Reveal = ({ children, className = "", delay = 0, direction = "up" }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    let observer;
    const currentElement = domRef.current;

    if (currentElement) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1, rootMargin: "50px" }
      );

      observer.observe(currentElement);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, []);

  const getTransform = () => {
    if (!isVisible) {
      if (direction === "up") return "translate-y-20 opacity-0";
      if (direction === "left") return "-translate-x-20 opacity-0";
      if (direction === "right") return "translate-x-20 opacity-0";
    }
    return "translate-y-0 translate-x-0 opacity-100";
  };

  return (
    <div
      ref={domRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out transform ${getTransform()} ${className}`}
    >
      {children}
    </div>
  );
};

const Activities = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const fontHead = "font-['Playfair_Display',_serif]";

  const fetchActivities = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/activities`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setActivities(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
      setError("Unable to load activities. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
    window.scrollTo(0, 0);
  }, []);

  const filteredActivities = (activities || []).filter(activity => {
    const title = activity?.title || "";
    const category = activity?.category || "";
    const search = searchTerm.toLowerCase();
    return title.toLowerCase().includes(search) || category.toLowerCase().includes(search);
  });

  return (
    <div className="bg-[#faf9f6] selection:bg-[#c8007b] selection:text-white overflow-x-hidden min-h-screen">

      {/* --- HERO SECTION --- */}
      <div className="relative h-[65vh] md:h-[75vh] w-full bg-black overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://res.cloudinary.com/dicvgtusz/image/upload/f_webp,q_auto:low/v1772526396/theres-no-taming-rapids-only-going-with-flow-shot-group-young-male-friends-white-water-rafting_rd0fxv.jpg"
            alt="Sri Lanka Activities"
            className="w-full h-full object-cover animate-subtle-zoom opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        </div>

        <div className="relative z-20 container mx-auto px-6 text-center">
          <Reveal direction="up">
            <span className="text-cyan-400 font-bold tracking-[0.4em] uppercase text-xs block mb-6 px-1">Experience The Island</span>
            <h1 className={`${fontHead} text-5xl md:text-7xl lg:text-8xl text-white leading-tight mb-8 drop-shadow-2xl`}>
              Adventure <br /> <span className="italic text-cyan-200">Awaits</span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed">
              Dive into the heart of Sri Lanka. From thrilling expeditions to tranquil rejuvenation, discover experiences that stay with you forever.
            </p>
          </Reveal>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <section className="relative py-24 px-6 md:px-12 lg:px-24">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#c8007b]/5 rounded-full blur-[100px] -z-10" />

        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-[#c8007b] font-bold tracking-[0.3em] uppercase text-xs block mb-4">( EXPLORE ACTIVITIES )</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-12 tracking-tight">
                Discover Your Spirit.
              </h2>

              {/* Search Bar (Floating Style) */}
              <div className="max-w-2xl mx-auto mb-20 relative group">
                <div className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#c8007b] transition-colors">
                  <Search size={22} />
                </div>
                <input
                  type="text"
                  placeholder="Search for adventures (e.g. Surfing, Hiking, Culture)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-100 rounded-full pl-16 pr-8 py-6 shadow-sm outline-none focus:ring-4 focus:ring-[#c8007b]/5 focus:border-[#c8007b]/20 focus:bg-white transition-all font-medium text-lg placeholder-gray-400"
                />
              </div>
            </div>
          </Reveal>

          {/* --- ACTIVITY GRID (Bento Style) --- */}
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 border-4 border-neutral-100 border-t-[#c8007b] rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400 font-medium">Loading adventures...</p>
            </div>
          ) : error ? (
            <div className="py-20 text-center">
              <p className="text-red-500 font-bold text-xl">{error}</p>
              <button onClick={fetchActivities} className="mt-4 text-[#c8007b] hover:underline font-bold">Try refreshing</button>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="py-20 text-center">
              <div className="bg-neutral-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                <Search size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">No results found</h3>
              <p className="text-gray-400 mt-2">Try searching for something else like "Water Sports" or "Culture"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredActivities.map((activity, i) => {
                return (
                  <Reveal key={activity.id} delay={i % 3 * 100} direction="up">
                    <div
                      className="group relative bg-white rounded-[40px] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-700 border border-gray-200 flex flex-col h-[520px] cursor-pointer"
                      onClick={() => navigate(`/activity/${activity.id}`)}
                    >
                      {/* --- Image Section --- */}
                      <div className="relative h-2/3 overflow-hidden bg-gray-100">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-90 group-hover:opacity-70 transition-opacity duration-500" />
                        <img
                          src={activity.image}
                          alt={activity.title}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                        />

                        {/* Category Badge */}
                        <div className="absolute top-6 left-6 z-20">
                          <div className="bg-white/10 backdrop-blur-md text-white text-[10px] font-bold px-4 py-2 rounded-full border border-white/20 uppercase tracking-widest">
                            {activity.category}
                          </div>
                        </div>

                        {/* Location Badge (if available, otherwise use a generic 'Sri Lanka') */}
                        <div className="absolute bottom-6 left-6 z-20">
                          <div className="bg-black/20 backdrop-blur-sm text-white text-[10px] font-bold px-4 py-2 rounded-full flex items-center gap-2 border border-white/10 uppercase tracking-widest">
                            <MapPin size={12} className="text-cyan-400" />
                            {activity.location || "Sri Lanka"}
                          </div>
                        </div>
                      </div>

                      {/* --- Content Section --- */}
                      <div className="p-10 flex flex-col flex-grow relative bg-white">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#c8007b] transition-colors duration-300">
                          {activity.title}
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-8 font-light">
                          {activity.tagline}
                        </p>

                        <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-neutral-400 text-[10px] font-bold uppercase tracking-widest">
                            <Clock size={12} /> Flexible Schedule
                          </div>
                          <div className="w-12 h-12 bg-neutral-900 text-white rounded-full flex items-center justify-center group-hover:bg-[#c8007b] group-hover:scale-110 transition-all duration-500 shadow-lg">
                            <ArrowRight size={20} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </section>


    </div>
  );
};

export default Activities;

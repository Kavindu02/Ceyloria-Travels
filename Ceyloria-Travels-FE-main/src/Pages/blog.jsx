import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, Search, Calendar, Clock, Tag, User } from "lucide-react";
import Gallery from "../components/Gallery";

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

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fontHead = "font-['Playfair_Display',_serif]";

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/blogs`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setBlogPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
      setError("Unable to load blogs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
    window.scrollTo(0, 0);
  }, []);

  const filteredPosts = (blogPosts || []).filter(post => {
    const title = post?.title || "";
    const category = post?.category || "";
    const search = searchTerm.toLowerCase();
    return title.toLowerCase().includes(search) || category.toLowerCase().includes(search);
  });

  return (
    <div className="bg-white selection:bg-[#c8007b] selection:text-white overflow-x-hidden min-h-screen">

      {/* --- HERO SECTION --- */}
      <div className="relative h-[65vh] md:h-[75vh] w-full bg-black overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://res.cloudinary.com/dicvgtusz/image/upload/f_webp,q_auto:low/v1772526598/mihintale-anuradhapura-sri-lanka-dusk_zz7rbm.jpg"
            alt="Ceyloria Travel Journal"
            className="w-full h-full object-cover animate-subtle-zoom opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        </div>

        <div className="relative z-20 container mx-auto px-6 text-center">
          <Reveal direction="up">
            <span className="text-cyan-400 font-bold tracking-[0.4em] uppercase text-xs block mb-6 px-1">Island Stories</span>
            <h1 className={`${fontHead} text-5xl md:text-7xl lg:text-8xl text-white leading-tight mb-8 drop-shadow-2xl`}>
              Ceyloria <br /> <span className="italic text-cyan-200">Journal</span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed">
              Your ultimate guide to uncovering the hidden gems, culture, and stories of Sri Lanka.
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
              <span className="text-[#c8007b] font-bold tracking-[0.3em] uppercase text-xs block mb-4">( OUR EDITORIALS )</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-12 tracking-tight">
                Latest from the Journal.
              </h2>

              {/* Search Bar (Floating Style) */}
              <div className="max-w-2xl mx-auto mb-20 relative group">
                <div className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#c8007b] transition-colors">
                  <Search size={22} />
                </div>
                <input
                  type="text"
                  placeholder="Search stories, destinations, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-100 rounded-full pl-16 pr-8 py-6 shadow-sm outline-none focus:ring-4 focus:ring-[#c8007b]/5 focus:border-[#c8007b]/20 focus:bg-white transition-all font-medium text-lg placeholder-gray-400"
                />
              </div>
            </div>
          </Reveal>

          {/* --- BLOG GRID (Bento Style) --- */}
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 border-4 border-neutral-100 border-t-[#c8007b] rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400 font-medium">Loading our stories...</p>
            </div>
          ) : error ? (
            <div className="py-20 text-center">
              <p className="text-red-500 font-bold text-xl">{error}</p>
              <button onClick={fetchBlogs} className="mt-4 text-[#c8007b] hover:underline font-bold">Try refreshing</button>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="py-20 text-center">
              <div className="bg-neutral-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                <Search size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">No stories found</h3>
              <p className="text-gray-400 mt-2">Try searching for something else like "Colombo" or "Hiking"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14">
              {filteredPosts.map((post, i) => {
                return (
                  <Reveal key={post.id} delay={i % 3 * 100} direction="up">
                    <div
                      className="group relative bg-white flex flex-col cursor-pointer transition-all duration-700 h-full"
                      onClick={() => window.location.href = post.path || `/blog/${post.id}`}
                    >
                      {/* --- Image Section --- */}
                      <div className="relative overflow-hidden rounded-[40px] shadow-sm group-hover:shadow-2xl transition-all duration-700 h-[350px] mb-8">
                        <img
                          src={post.image || "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a"}
                          alt={post.title}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />

                        {/* Category Badge */}
                        <div className="absolute top-6 left-6">
                          <div className="bg-white/90 backdrop-blur-md text-gray-900 text-[10px] font-bold px-4 py-2 rounded-full border border-white/20 uppercase tracking-widest shadow-sm">
                            {post.category || "Journal"}
                          </div>
                        </div>
                      </div>

                      {/* --- Content Section --- */}
                      <div className="flex flex-col flex-grow">
                        <div className="flex items-center gap-4 text-neutral-400 text-[10px] font-bold uppercase tracking-widest mb-6 px-1">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={12} className="text-[#c8007b]" />
                            {post.date || "Oct 24, 2024"}
                          </span>
                          <span className="w-1 h-1 bg-neutral-200 rounded-full" />
                          <span className="flex items-center gap-1.5">
                            <Clock size={12} className="text-[#c8007b]" />
                            {post.readTime || "5 min read"}
                          </span>
                        </div>

                        <h3 className={`${fontHead} text-2xl font-bold text-gray-900 mb-6 group-hover:text-[#c8007b] transition-colors duration-300 leading-tight px-1`}>
                          {post.title}
                        </h3>

                        <p className="text-neutral-500 text-base leading-relaxed line-clamp-3 font-light mb-8 lg:mb-10 px-1">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50 px-1">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center overflow-hidden border border-neutral-50 group-hover:border-[#c8007b]/30 transition-colors">
                              <User size={18} className="text-neutral-400" />
                            </div>
                            <span className="text-xs font-bold text-neutral-900 tracking-wide">Journalist</span>
                          </div>

                          <div className="flex items-center gap-2 text-[#c8007b] font-bold text-[10px] uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform duration-500">
                            Read More <ArrowRight size={14} />
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

{/* --- GALLERY SECTION (ALWAYS SHOWS ELLA, COLOMBO, GALLE, ANURADHAPURA) --- */}
      <section className="py-24 bg-white relative border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex flex-col items-center mb-16 gap-2">
            <span className="text-[#b80072] font-bold tracking-[0.3em] uppercase text-xs">( DESTINATIONS )</span>
            <h2 className="text-4xl md:text-5xl lg:text-[48px] font-bold text-gray-900 mb-4 leading-[1.1] tracking-tight text-center">
              Must-Visit Destinations
            </h2>
            <p className="text-gray-500 max-w-2xl text-base md:text-lg font-light leading-relaxed text-center">
              Explore the beauty of Sri Lanka through our top picks. These destinations are always worth discovering!
            </p>
          </div>
          <div className="w-full">
            <Gallery />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;

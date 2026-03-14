import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Star,
  Share2,
  Check,
  ChevronLeft,
  ShieldCheck,
  Home,
  Users,
  Wifi,
  Wind,
  Coffee,
  Minus,
  Plus,
  ArrowRight,
  Info,
  Clock
} from 'lucide-react';
import { safeParseJSON } from '../../utils/jsonParser.js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const BUCKET_NAME = "images";

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
      if (direction === "up") return "translate-y-10 opacity-0";
      if (direction === "left") return "-translate-x-10 opacity-0";
      if (direction === "right") return "translate-x-10 opacity-0";
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

// --- Helper for images ---
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  let targetImage = Array.isArray(imagePath) ? imagePath.find(Boolean) : imagePath;
  if (typeof targetImage === 'object' && targetImage !== null) {
    targetImage = targetImage.url || targetImage.src || targetImage.path || targetImage.name || null;
  }
  if (!targetImage || typeof targetImage !== 'string') return null;
  targetImage = targetImage.replace(/\\/g, '/');
  if (/^(https?:|data:|blob:)/i.test(targetImage)) return targetImage;
  if (targetImage.startsWith('/') || targetImage.includes('/storage/')) return targetImage;
  if (!SUPABASE_URL) return targetImage;
  const base = SUPABASE_URL.replace(/\/$/, '');
  const imgPath = String(targetImage).replace(/^\//, '');
  return `${base}/storage/v1/object/public/${BUCKET_NAME}/${imgPath}`;
};

const AccommodationOverviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fontHead = "font-['Playfair_Display',_serif]";

  // State
  const [accommodation, setAccommodation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Booking Calculation State
  const [selectedDays, setSelectedDays] = useState(1);
  const [selectedRooms, setSelectedRooms] = useState(1);

  useEffect(() => {
    const fetchAccommodation = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/accommodations/${id}`);
        if (!res.ok) throw new Error('Failed to load accommodation');
        const data = await res.json();
        setAccommodation(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    if (id) fetchAccommodation();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-16 h-16 border-4 border-neutral-100 border-t-[#c8007b] rounded-full animate-spin"></div>
    </div>
  );

  if (!accommodation) return <div className="p-8 text-center bg-white min-h-screen pt-32">Accommodation not found</div>;

  // Image Logic
  const parsedImages = safeParseJSON(accommodation.images) || [];
  const images = (Array.isArray(parsedImages) ? parsedImages : [parsedImages]).filter(img => img && String(img).trim() !== "");
  const mainImage = getImageUrl(images[selectedImageIndex]);

  // Price Calculation
  const pricePerNight = accommodation.pricePerNight || 0;
  const totalPrice = pricePerNight * selectedDays * selectedRooms;

  return (
    <div className="bg-white selection:bg-[#c8007b] selection:text-white overflow-x-hidden min-h-screen pb-16">

      {/* --- HERO IMAGE SECTION --- */}
      <div className="relative h-[60vh] md:h-[70vh] w-full bg-black overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={mainImage || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"}
            alt={accommodation.name}
            className="w-full h-full object-cover animate-subtle-zoom opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
        </div>

        <div className="relative z-20 container mx-auto px-6 h-full flex flex-col justify-end pb-12">
          <Reveal direction="up">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 text-white/70 hover:text-white transition-all mb-8 uppercase tracking-[0.2em] text-[10px] font-bold"
            >
              <ChevronLeft size={16} /> Back to Listings
            </button>
            <h1 className={`${fontHead} text-4xl md:text-6xl lg:text-7xl text-white mb-4 drop-shadow-2xl max-w-4xl`}>
              {accommodation.name}
            </h1>
            <div className="flex items-center gap-6 text-cyan-400 font-bold text-sm tracking-widest uppercase">
              <span className="flex items-center gap-2"><MapPin size={16} className="text-[#c8007b]" /> {accommodation.location || "Sri Lanka"}</span>
              <span className="w-1 h-1 bg-white/30 rounded-full" />
              <span className="flex items-center gap-2 text-white">
                <Star size={16} fill="#c8007b" className="text-[#c8007b]" /> {accommodation.rating || "4.8"} Rated
              </span>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">

          {/* --- LEFT COLUMN: GALLERY & CONTENT --- */}
          <div className="lg:col-span-12 xl:col-span-8 space-y-16">
            {/* Dynamic Thumbnails Grid */}
            <Reveal direction="up">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative aspect-[4/3] rounded-[30px] overflow-hidden cursor-pointer transition-all duration-500 border-2 ${selectedImageIndex === idx ? 'border-[#c8007b] scale-[0.98]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Description & Tabs */}
            <div className="space-y-12">
              <div className="flex gap-8 border-b border-neutral-100 overflow-x-auto scrollbar-hide">
                {['Overview', 'Amenities', 'Details'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`pb-4 text-[10px] font-bold uppercase tracking-[0.3em] transition-all relative ${activeTab === tab.toLowerCase()
                        ? 'text-[#c8007b]'
                        : 'text-neutral-400 hover:text-neutral-900'
                      }`}
                  >
                    {tab}
                    {activeTab === tab.toLowerCase() && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c8007b] rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              <div className="min-h-[300px]">
                {activeTab === 'overview' && (
                  <Reveal direction="up" className="space-y-8">
                    <h3 className={`${fontHead} text-3xl font-bold text-gray-900`}>A Sanctuary of Perfection.</h3>
                    <p className="text-neutral-500 leading-relaxed text-lg font-light">
                      {accommodation.description || "Experience comfort and luxury at its finest. Our property offers a unique blend of modern sophistication and island charm."}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-neutral-50">
                      <div className="flex items-center gap-5 group">
                        <div className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center text-[#c8007b] group-hover:bg-[#c8007b] group-hover:text-white transition-all">
                          <Wifi size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">Complimentary Connectivity</p>
                          <p className="text-xs text-neutral-400">High-speed wireless internet</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-5 group">
                        <div className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center text-[#c8007b] group-hover:bg-[#c8007b] group-hover:text-white transition-all">
                          <Wind size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">Climate Excellence</p>
                          <p className="text-xs text-neutral-400">Full air-conditioning control</p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                )}

                {activeTab === 'amenities' && (
                  <Reveal direction="up" className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {(() => {
                      const parsedAmenities = safeParseJSON(accommodation.amenities) || [];
                      const displayAmenities = parsedAmenities.length > 0 
                        ? parsedAmenities 
                        : ["Private Pool", "24/7 Butler", "Ocean View", "Mini Bar", "Designer Beds", "Smart Home Tech"];
                      
                      return displayAmenities.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-5 rounded-[20px] bg-neutral-50/50 border border-neutral-100 group hover:border-[#c8007b]/20 transition-all">
                          <div className="w-2 h-2 rounded-full bg-[#c8007b]" />
                          <span className="text-gray-900 font-bold text-sm">{item}</span>
                        </div>
                      ));
                    })()}
                  </Reveal>
                )}

                {activeTab === 'details' && (
                  <Reveal direction="up" className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-[30px] bg-neutral-900 text-white">
                      <p className="text-[#c8007b] font-bold text-[10px] tracking-widest uppercase mb-4">Space</p>
                      <h4 className={`${fontHead} text-3xl mb-4`}>{accommodation.roomType || "Signature Suite"}</h4>
                      <p className="text-white/60 font-light text-sm italic">Designed for ultimate tranquility.</p>
                    </div>
                    <div className="p-8 rounded-[30px] border border-neutral-100">
                      <p className="text-neutral-400 font-bold text-[10px] tracking-widest uppercase mb-4">Capacity</p>
                      <h4 className={`${fontHead} text-3xl text-gray-900`}>{accommodation.maxGuests || 2} Preferred Guests</h4>
                      <div className="mt-8 flex items-center gap-3 text-neutral-400 text-xs">
                        <Clock size={14} className="text-[#c8007b]" /> Check-in: 2:00 PM • Checkout: 12:00 PM
                      </div>
                    </div>
                  </Reveal>
                )}
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: BOOKING BOX --- */}
          <div className="lg:col-span-12 xl:col-span-4">
            <Reveal direction="up" className="sticky top-32">
              <div className="bg-white rounded-[40px] border border-neutral-100 shadow-3xl p-10 space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#c8007b]/5 rounded-full -mr-16 -mt-16 blur-2xl" />

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest mb-1">Starting From</p>
                    <h4 className="text-4xl font-black text-gray-900">${pricePerNight} <span className="text-sm font-light text-neutral-400">/ night</span></h4>
                  </div>
                  <button className="p-3 rounded-2xl bg-neutral-50 text-neutral-400 hover:text-[#c8007b] transition-all">
                    <Share2 size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">Residency Duration</label>
                    <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-[20px] border border-neutral-100">
                      <button onClick={() => setSelectedDays(Math.max(1, selectedDays - 1))} className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-900 hover:bg-[#c8007b] hover:text-white transition-all">
                        <Minus size={18} />
                      </button>
                      <span className="font-bold text-xl">{selectedDays} Nights</span>
                      <button onClick={() => setSelectedDays(selectedDays + 1)} className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-900 hover:bg-[#c8007b] hover:text-white transition-all">
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">Number of Suites</label>
                    <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-[20px] border border-neutral-100">
                      <button onClick={() => setSelectedRooms(Math.max(1, selectedRooms - 1))} className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-900 hover:bg-[#c8007b] hover:text-white transition-all">
                        <Minus size={18} />
                      </button>
                      <span className="font-bold text-xl">{selectedRooms} Rooms</span>
                      <button onClick={() => setSelectedRooms(selectedRooms + 1)} className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-900 hover:bg-[#c8007b] hover:text-white transition-all">
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-neutral-50">
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-neutral-400 font-bold text-sm">Total Investment</span>
                    <span className="text-3xl font-black text-[#c8007b]">${totalPrice.toLocaleString()}</span>
                  </div>

                  <button
                    onClick={() => navigate('/contact')}
                    className="w-full h-20 bg-neutral-900 hover:bg-[#c8007b] text-white rounded-[24px] font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all duration-500 group shadow-2xl shadow-neutral-900/20 active:scale-95"
                  >
                    Book Your Stay <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 pt-2">
                  <ShieldCheck size={14} className="text-[#c8007b]" />
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Guaranteed Best Rates</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>



    </div>
  );
};

export default AccommodationOverviewPage;

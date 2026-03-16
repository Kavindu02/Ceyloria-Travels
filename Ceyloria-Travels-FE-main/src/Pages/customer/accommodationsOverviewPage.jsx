import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Star,
  Share2,
  Check,
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
  const mainImage = getImageUrl(images[selectedImageIndex] || images[0]);

  // Price Calculation
  const pricePerNight = accommodation.pricePerNight || 0;
  const totalPrice = pricePerNight * selectedDays * selectedRooms;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: accommodation.name,
          text: `Check out this accommodation: ${accommodation.name}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      if (error?.name !== 'AbortError') {
        console.error('Sharing failed:', error);
      }
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans text-gray-800 pb-16 pt-20 selection:bg-[#c8007b] selection:text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-4">
            <Reveal direction="up">
              <div className="aspect-[4/3] w-full bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 relative group">
                <img
                  src={mainImage || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"}
                  alt={accommodation.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </Reveal>

            {images.length > 1 && (
              <Reveal direction="up">
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === idx ? 'border-[#c8007b] ring-2 ring-[#c8007b]/20' : 'border-transparent opacity-70 hover:opacity-100'}`}
                    >
                      <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </Reveal>
            )}
          </div>

          <div className="lg:col-span-5">
            <Reveal direction="up" className="sticky top-8">
              <div className="mb-6 border-b border-gray-100 pb-6">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 text-[#c8007b] text-sm font-semibold">
                    <MapPin size={16} />
                    <span className="bg-[#c8007b]/10 text-[#c8007b] text-xs px-2 py-0.5 rounded-full font-semibold">
                      {accommodation.location || "Sri Lanka"}
                    </span>
                  </div>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-[#c8007b] transition-colors"
                    title="Share Accommodation"
                  >
                    <Share2 size={20} />
                  </button>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 leading-tight">
                  {accommodation.name}
                </h1>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-yellow-500 font-bold">
                    <Star size={16} fill="currentColor" />
                    <span>{accommodation.rating || "4.8"}</span>
                  </div>
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-500">Premium Stay</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Starting From</p>
                    <h4 className="text-4xl font-black text-gray-900">${pricePerNight} <span className="text-sm font-light text-gray-500">/ night</span></h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-3">
                    <label className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Residency Duration</label>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <button onClick={() => setSelectedDays(Math.max(1, selectedDays - 1))} className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-900 hover:bg-[#c8007b] hover:text-white transition-all">
                        <Minus size={16} />
                      </button>
                      <span className="font-bold text-base">{selectedDays} Nights</span>
                      <button onClick={() => setSelectedDays(selectedDays + 1)} className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-900 hover:bg-[#c8007b] hover:text-white transition-all">
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Number of Suites</label>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <button onClick={() => setSelectedRooms(Math.max(1, selectedRooms - 1))} className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-900 hover:bg-[#c8007b] hover:text-white transition-all">
                        <Minus size={16} />
                      </button>
                      <span className="font-bold text-base">{selectedRooms} Rooms</span>
                      <button onClick={() => setSelectedRooms(selectedRooms + 1)} className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-900 hover:bg-[#c8007b] hover:text-white transition-all">
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-500 font-semibold text-sm">Total Investment</span>
                    <span className="text-3xl font-black text-[#c8007b]">${totalPrice.toLocaleString()}</span>
                  </div>

                  <button
                    onClick={() => navigate('/contact')}
                    className="w-full bg-[#c8007b] hover:bg-[#a30065] text-white text-lg font-bold py-4 rounded-xl shadow-lg shadow-[#c8007b]/30 transition-transform active:scale-95 flex items-center justify-center gap-2"
                  >
                    Book Your Stay <ArrowRight size={20} />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <ShieldCheck size={14} className="text-green-600" />
                  <span>Guaranteed Best Rates</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="mt-16 md:mt-24 border-t border-gray-100 pt-8">
          <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
            {['Overview', 'Amenities', 'Details'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-6 py-4 font-bold text-sm uppercase tracking-wide border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.toLowerCase()
                    ? 'border-[#c8007b] text-[#c8007b]'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="max-w-4xl min-h-[300px]">
            {activeTab === 'overview' && (
              <Reveal direction="up" className="space-y-8">
                <h3 className={`${fontHead} text-3xl font-bold text-gray-900`}>A Sanctuary of Perfection.</h3>
                <p className="text-gray-600 leading-relaxed text-lg font-light">
                  {accommodation.description || "Experience comfort and luxury at its finest. Our property offers a unique blend of modern sophistication and island charm."}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-100">
                  <div className="flex items-center gap-5 group">
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-[#c8007b] group-hover:bg-[#c8007b] group-hover:text-white transition-all">
                      <Wifi size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Complimentary Connectivity</p>
                      <p className="text-xs text-gray-500">High-speed wireless internet</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 group">
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-[#c8007b] group-hover:bg-[#c8007b] group-hover:text-white transition-all">
                      <Wind size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Climate Excellence</p>
                      <p className="text-xs text-gray-500">Full air-conditioning control</p>
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
                    <div key={idx} className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 border border-gray-100 group hover:border-[#c8007b]/20 transition-all">
                      <div className="w-2 h-2 rounded-full bg-[#c8007b]" />
                      <span className="text-gray-900 font-semibold text-sm">{item}</span>
                    </div>
                  ));
                })()}
              </Reveal>
            )}

            {activeTab === 'details' && (
              <Reveal direction="up" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl bg-gray-900 text-white">
                  <p className="text-[#c8007b] font-bold text-xs tracking-wide uppercase mb-3">Space</p>
                  <h4 className={`${fontHead} text-3xl mb-3`}>{accommodation.roomType || "Signature Suite"}</h4>
                  <p className="text-white/70 font-light text-sm italic">Designed for ultimate tranquility.</p>
                </div>
                <div className="p-6 rounded-xl border border-gray-100">
                  <p className="text-gray-500 font-bold text-xs tracking-wide uppercase mb-3">Capacity</p>
                  <h4 className={`${fontHead} text-3xl text-gray-900`}>{accommodation.maxGuests || 2} Preferred Guests</h4>
                  <div className="mt-6 flex items-center gap-3 text-gray-500 text-xs">
                    <Clock size={14} className="text-[#c8007b]" /> Check-in: 2:00 PM • Checkout: 12:00 PM
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccommodationOverviewPage;

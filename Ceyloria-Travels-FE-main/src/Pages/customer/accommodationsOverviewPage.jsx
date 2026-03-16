import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  MapPin,
  Star,
  Share2,
  ShieldCheck,
  ArrowRight
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
  const bookingSectionRef = useRef(null);

  // State
  const [accommodation, setAccommodation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    contactNumber: '',
    date: '',
    boardType: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const parsedPackages = safeParseJSON(accommodation.packages) || [];
  const packageList = Array.isArray(parsedPackages) ? parsedPackages : [];

  const extractBoardPrice = (label) => {
    const matched = packageList.find((item) => {
      const boardType = String(item?.boardType || item?.type || item?.name || "").toLowerCase();
      return boardType.includes(label);
    });

    if (!matched) return 0;

    return Number(matched?.price ?? matched?.pricePerNight ?? 0) || 0;
  };

  const fullBoardPrice = extractBoardPrice("full");
  const halfBoardPrice = extractBoardPrice("half");

  const handleBookingChange = (field, value) => {
    setBookingForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/accommodation-booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accommodationName: accommodation?.name || '',
          name: bookingForm.name,
          contactNumber: bookingForm.contactNumber,
          date: bookingForm.date,
          boardType: bookingForm.boardType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to send booking inquiry');
      }

      alert('Inquiry sent successfully!');
      setBookingForm({
        name: '',
        contactNumber: '',
        date: '',
        boardType: '',
      });
    } catch (error) {
      alert(error.message || 'Failed to send booking inquiry');
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const handleScrollToBookingForm = () => {
    bookingSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
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
                    <h4 className="text-4xl font-black text-gray-900">${pricePerNight}</h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Full Board</p>
                    <p className="text-2xl font-black text-[#c8007b] mt-2">
                      {fullBoardPrice > 0 ? `$${fullBoardPrice.toLocaleString()}` : "Not available"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Half Board</p>
                    <p className="text-2xl font-black text-[#c8007b] mt-2">
                      {halfBoardPrice > 0 ? `$${halfBoardPrice.toLocaleString()}` : "Not available"}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-500 font-semibold text-sm">Base Rate</span>
                    <span className="text-3xl font-black text-[#c8007b]">${pricePerNight.toLocaleString()}</span>
                  </div>

                  <button
                    onClick={handleScrollToBookingForm}
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

        <div ref={bookingSectionRef} className="mt-16 border-t border-gray-100 pt-10 flex justify-center">
          <Reveal direction="up" className="w-full max-w-4xl">
            <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl shadow-gray-200/60">
              <div className="absolute -top-28 -right-24 h-64 w-64 rounded-full bg-[#c8007b]/10 blur-3xl" />
              <div className="absolute -bottom-28 -left-24 h-64 w-64 rounded-full bg-cyan-200/20 blur-3xl" />

              <div className="relative p-6 md:p-10">
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#c8007b] font-bold mb-3">Accommodation Inquiry</p>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-2">
                  {accommodation?.name || 'Selected Accommodation'}
                </h2>
                <p className="text-gray-500 text-sm md:text-base mb-8">
                  Fill in your details and we will send your request instantly.
                </p>

                <form onSubmit={handleBookingSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Name</label>
                      <input
                        type="text"
                        value={bookingForm.name}
                        onChange={(e) => handleBookingChange('name', e.target.value)}
                        required
                        className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 focus:border-[#c8007b] focus:ring-2 focus:ring-[#c8007b]/20 outline-none transition"
                        placeholder="Enter your name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Contact Number</label>
                      <input
                        type="tel"
                        value={bookingForm.contactNumber}
                        onChange={(e) => handleBookingChange('contactNumber', e.target.value)}
                        required
                        className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 focus:border-[#c8007b] focus:ring-2 focus:ring-[#c8007b]/20 outline-none transition"
                        placeholder="Enter contact number"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Date</label>
                      <input
                        type="date"
                        value={bookingForm.date}
                        onChange={(e) => handleBookingChange('date', e.target.value)}
                        required
                        className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 focus:border-[#c8007b] focus:ring-2 focus:ring-[#c8007b]/20 outline-none transition"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Board Type</label>
                      <select
                        value={bookingForm.boardType}
                        onChange={(e) => handleBookingChange('boardType', e.target.value)}
                        required
                        className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 focus:border-[#c8007b] focus:ring-2 focus:ring-[#c8007b]/20 outline-none transition"
                      >
                        <option value="">Select board type</option>
                        <option value="Full Board">Full Board</option>
                        <option value="Half Board">Half Board</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-[#c8007b] to-[#a30065] text-white font-bold tracking-wide hover:shadow-lg hover:shadow-[#c8007b]/30 transition disabled:opacity-60"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                  </button>
                </form>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
};

export default AccommodationOverviewPage;

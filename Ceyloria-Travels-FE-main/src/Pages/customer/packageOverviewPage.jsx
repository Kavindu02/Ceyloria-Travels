import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Clock,
  Star,
  Heart,
  Share2,
  Check,
  ChevronRight,
  ShieldCheck,
  Plane,
  Calendar,
  Info,
  ArrowRight,
} from "lucide-react";
import { safeParseJSON } from "../../utils/jsonParser.js";
import TravelCard from "../../components/TravelCard.jsx";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const BUCKET_NAME = "images";

// Helper for images
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  let targetImage = Array.isArray(imagePath)
    ? imagePath.find(Boolean)
    : imagePath;
  if (typeof targetImage === "object" && targetImage !== null) {
    targetImage =
      targetImage.url ||
      targetImage.src ||
      targetImage.path ||
      targetImage.name ||
      null;
  }
  if (!targetImage || typeof targetImage !== "string") return null;
  targetImage = targetImage.replace(/\\/g, "/");
  if (/^(https?:|data:|blob:)/i.test(targetImage)) return targetImage;
  if (targetImage.startsWith("/") || targetImage.includes("/storage/"))
    return targetImage;
  if (!SUPABASE_URL) return targetImage;
  const base = SUPABASE_URL.replace(/\/$/, "");
  const imgPath = String(targetImage).replace(/^\//, "");
  return `${base}/storage/v1/object/public/${BUCKET_NAME}/${imgPath}`;
};

const PackageOverviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const bookingSectionRef = useRef(null);
  const [package_, setPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [recommendedPackages, setRecommendedPackages] = useState([]);
  const [bookingForm, setBookingForm] = useState({
    packageName: "",
    name: "",
    contactNumber: "",
    date: "",
    adults: 1,
    kids: 0,
    infants: 0,
  });
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/packages/${id}`,
        );
        if (!res.ok) throw new Error("Failed to load package");
        const data = await res.json();
        setPackage(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    if (id) fetchPackage();
  }, [id]);

  useEffect(() => {
    if (package_?.title) {
      setBookingForm((prev) => ({
        ...prev,
        packageName: package_.title,
      }));
    }
  }, [package_?.title]);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/packages`);
        if (!res.ok) return;
        const data = await res.json();
        // Filter out the current package
        const otherPackages = data.filter((p) => String(p.id) !== String(id));
        // Shuffle the array
        const shuffled = otherPackages.sort(() => 0.5 - Math.random());
        // Pick top 3
        setRecommendedPackages(shuffled.slice(0, 3));
      } catch (err) {
        console.error("Failed to load recommended packages:", err);
      }
    };
    if (id) fetchRecommended();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cc007e]"></div>
      </div>
    );
  if (!package_)
    return <div className="p-8 text-center">Package not found</div>;

  const images = safeParseJSON(package_.images);
  const mainImage = getImageUrl(images[selectedImageIndex] || images[0]);

  // Normalize citiesCovered
  const parsedCities = safeParseJSON(package_.citiesCovered);
  const cities = Array.isArray(parsedCities)
    ? parsedCities.map((c) => String(c).trim()).filter(Boolean)
    : [];

  const itinerary = safeParseJSON(package_.itinerary);
  const highlights = safeParseJSON(package_.highlights);

  const handleBookingChange = (field, value) => {
    setBookingForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleScrollToBookingForm = () => {
    bookingSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingBooking(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/package-booking`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            packageName: bookingForm.packageName || package_?.title || "",
            name: bookingForm.name,
            contactNumber: bookingForm.contactNumber,
            date: bookingForm.date,
            adults: Number(bookingForm.adults) || 0,
            kids: Number(bookingForm.kids) || 0,
            infants: Number(bookingForm.infants) || 0,
          }),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Failed to send package inquiry");
      }

      alert("Package inquiry sent successfully!");
      setBookingForm((prev) => ({
        packageName: package_?.title || prev.packageName,
        name: "",
        contactNumber: "",
        date: "",
        adults: 1,
        kids: 0,
        infants: 0,
      }));
    } catch (error) {
      alert(error.message || "Failed to send package inquiry");
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans text-gray-800 pb-16 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* --- LEFT COLUMN: IMAGE GALLERY --- */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Image */}
            <div className="aspect-[4/3] w-full bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 relative group">
              <img
                src={mainImage}
                alt={package_.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-gray-800 shadow-sm">
                Best Seller
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === idx ? "border-[#cc007e] ring-2 ring-[#cc007e]/20" : "border-transparent opacity-70 hover:opacity-100"}`}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* --- RIGHT COLUMN: PRODUCT DETAILS (BUY BOX) --- */}
          <div className="lg:col-span-5">
            <div className="sticky top-8">
              {/* Header Info */}
              <div className="mb-6 border-b border-gray-100 pb-6">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 text-[#cc007e] text-sm font-semibold">
                    <MapPin size={16} />
                    {cities.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {cities.map((c, idx) => (
                          <span
                            key={idx}
                            className="bg-[#cc007e]/10 text-[#cc007e] text-xs px-2 py-0.5 rounded-full font-semibold"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    ) : (
                      "Sri Lanka"
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator
                            .share({
                              title: package_.title,
                              text: `Check out this travel package: ${package_.title}`,
                              url: window.location.href,
                            })
                            .catch(console.error);
                        } else {
                          navigator.clipboard.writeText(window.location.href);
                          alert("Link copied to clipboard!");
                        }
                      }}
                      className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-[#cc007e] transition-colors"
                      title="Share Package"
                    >
                      <Share2 size={20} />
                    </button>
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 leading-tight">
                  {package_.title}
                </h1>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-yellow-500 font-bold">
                    <Star size={16} fill="currentColor" />
                    <span>4.9</span>
                  </div>
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-500">120+ Bookings</span>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="space-y-6">
                <div>
                  <p className="text-gray-500 text-sm mb-1">
                    Starting price per person
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-gray-900">
                      $ {package_.price?.toLocaleString()}
                    </span>
                    <span className="text-sm text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                      Available Now
                    </span>
                  </div>
                </div>

                {/* Quick Specs Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-3">
                    <Clock className="text-[#cc007e]" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 uppercase">
                        Duration
                      </p>
                      <p className="font-semibold text-gray-900">
                        {package_.duration}
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-3">
                    <Plane className="text-[#cc007e]" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Type</p>
                      <p className="font-semibold text-gray-900">
                        All Inclusive
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleScrollToBookingForm}
                    className="w-full bg-[#cc007e] hover:bg-[#a30065] text-white text-lg font-bold py-4 rounded-xl shadow-lg shadow-[#cc007e]/30 transition-transform active:scale-95 flex items-center justify-center gap-2"
                  >
                    Book Now <ArrowRight size={20} />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <ShieldCheck size={14} className="text-green-600" />
                  <span>Free cancellation up to 48 hours before trip</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- BOTTOM SECTION: TABS --- */}
        <div
          ref={bookingSectionRef}
          className="mt-16 md:mt-24 border-t border-gray-100 pt-8"
        >
          {/* Tabs Header */}
          <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
            {["Overview", "Itinerary", "Inclusions", "Reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-6 py-4 font-bold text-sm uppercase tracking-wide border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.toLowerCase()
                    ? "border-[#cc007e] text-[#cc007e]"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Tab Content */}
            <div className="lg:col-span-8 max-w-4xl">
              {activeTab === "overview" && (
                <div className="space-y-6 animate-fadeIn">
                  <h3 className="text-2xl font-bold text-gray-900">
                    About this Package
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {package_.description ||
                      package_.shortDescription ||
                      "Experience the best of Sri Lanka with this carefully curated package."}
                  </p>

                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Covered Cities
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {cities.length > 0 ? (
                        cities.map((c, idx) => (
                          <span
                            key={idx}
                            className="bg-[#cc007e]/10 text-[#cc007e] px-3 py-1 rounded-full text-sm font-semibold"
                          >
                            {c}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">Sri Lanka</span>
                      )}
                    </div>
                  </div>

                  <div className="bg-[#cc007e]/5 p-6 rounded-xl border border-[#cc007e]/20">
                    <h4 className="font-bold text-[#cc007e] mb-2 flex items-center gap-2">
                      <Info size={18} /> Why travelers love this
                    </h4>
                    <ul className="space-y-2 text-[#cc007e]/80">
                      <li>
                        • Verified local guides ensuring authentic experiences
                      </li>
                      <li>
                        • Hassle-free transportation in air-conditioned vehicles
                      </li>
                      <li>• Hand-picked accommodation rated 4 stars and above</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === "itinerary" && (
                <div className="space-y-8 animate-fadeIn">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Day by Day Schedule
                  </h3>
                  {itinerary?.map((day, idx) => (
                    <div key={idx} className="flex gap-4 md:gap-6 group">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-[#cc007e]/10 text-[#cc007e] font-bold flex items-center justify-center shrink-0 group-hover:bg-[#cc007e] group-hover:text-white transition-colors">
                          {idx + 1}
                        </div>
                        <div className="h-full w-0.5 bg-gray-100 my-2 group-last:hidden"></div>
                      </div>
                      <div className="pb-8 group-last:pb-0">
                        <h4 className="text-lg font-bold text-gray-900 mb-2">
                          {day.title}
                        </h4>
                        <p className="text-gray-600 leading-relaxed">
                          {day.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "inclusions" && (
                <div className="animate-fadeIn">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    What's Included
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {highlights?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100"
                      >
                        <Check className="text-green-500 shrink-0" size={20} />
                        <span className="text-gray-700 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="animate-fadeIn text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                  <Star size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">
                    No reviews yet
                  </h3>
                  <p className="text-gray-500">
                    Be the first to book this exclusive package!
                  </p>
                </div>
              )}
            </div>

            {/* Booking Form (Right Side) */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-[11px] uppercase tracking-[0.24em] text-[#cc007e] font-bold mb-2">
                  Package Booking
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mb-5">
                  Book This Package
                </h3>

                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Package
                    </label>
                    <input
                      type="text"
                      value={bookingForm.packageName}
                      readOnly
                      className="w-full h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={bookingForm.name}
                      onChange={(e) => handleBookingChange("name", e.target.value)}
                      required
                      className="w-full h-11 rounded-lg border border-gray-200 bg-white px-3 text-gray-900 focus:border-[#cc007e] focus:ring-2 focus:ring-[#cc007e]/20 outline-none"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      value={bookingForm.contactNumber}
                      onChange={(e) =>
                        handleBookingChange("contactNumber", e.target.value)
                      }
                      required
                      className="w-full h-11 rounded-lg border border-gray-200 bg-white px-3 text-gray-900 focus:border-[#cc007e] focus:ring-2 focus:ring-[#cc007e]/20 outline-none"
                      placeholder="Enter contact number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={bookingForm.date}
                      onChange={(e) => handleBookingChange("date", e.target.value)}
                      required
                      className="w-full h-11 rounded-lg border border-gray-200 bg-white px-3 text-gray-900 focus:border-[#cc007e] focus:ring-2 focus:ring-[#cc007e]/20 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Adults
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={bookingForm.adults}
                        onChange={(e) => handleBookingChange("adults", e.target.value)}
                        required
                        className="w-full h-11 rounded-lg border border-gray-200 bg-white px-3 text-gray-900 focus:border-[#cc007e] focus:ring-2 focus:ring-[#cc007e]/20 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Kids
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={bookingForm.kids}
                        onChange={(e) => handleBookingChange("kids", e.target.value)}
                        required
                        className="w-full h-11 rounded-lg border border-gray-200 bg-white px-3 text-gray-900 focus:border-[#cc007e] focus:ring-2 focus:ring-[#cc007e]/20 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Infants
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={bookingForm.infants}
                        onChange={(e) =>
                          handleBookingChange("infants", e.target.value)
                        }
                        required
                        className="w-full h-11 rounded-lg border border-gray-200 bg-white px-3 text-gray-900 focus:border-[#cc007e] focus:ring-2 focus:ring-[#cc007e]/20 outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingBooking}
                    className="w-full h-12 rounded-xl bg-[#cc007e] hover:bg-[#a30065] text-white font-bold transition disabled:opacity-60"
                  >
                    {isSubmittingBooking ? "Sending..." : "Send Booking Inquiry"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* --- RECOMMENDED PACKAGES --- */}
        {recommendedPackages.length > 0 && (
          <div className="mt-16 md:mt-24 border-t border-gray-100 pt-16">
            <div className="text-center mb-12">
              <span className="text-[#cc007e] font-bold tracking-[0.2em] uppercase text-xs block mb-3">
                Discover More
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                You Might Also Like
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recommendedPackages.map((pkg) => {
                const parsedCities = safeParseJSON(pkg.citiesCovered);
                return (
                  <div key={pkg.id} className="h-full">
                    <TravelCard
                      image={pkg.images}
                      title={pkg.title}
                      location={parsedCities?.join(", ")}
                      duration={pkg.duration}
                      description={pkg.shortDescription}
                      price={pkg.price}
                      ratingText={pkg.ratingText}
                      starCount={pkg.starCount}
                      id={pkg.id}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageOverviewPage;

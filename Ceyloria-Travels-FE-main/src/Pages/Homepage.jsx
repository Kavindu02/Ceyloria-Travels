import { useState, useEffect, useRef } from "react";
import { MapPin, ArrowRight, Compass } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Gallery from "../components/Gallery";
import CuratedPackageCard from "../components/CuratedPackageCard";
import CeyloriaLoader from "../components/loader";

// Module-level fetch cache — survives component remounts, fetches only once
const _cache = { latest: null, curated: null, latestPromise: null, curatedPromise: null };

// ---------------------- FONTS & GLOBAL STYLES ----------------------
const fontHead = "font-['Playfair_Display',_serif]";
const fontBody = "font-['DM_Sans',_sans-serif]";

// ---------------------- REUSABLE ANIMATION COMPONENT ----------------------
const Reveal = ({ children, className = "", delay = 0, direction = "up" }) => {
  const [isVisible, setVisible] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const currentElement = domRef.current;
    if (!currentElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          requestAnimationFrame(() => setVisible(true));
          observer.unobserve(currentElement);
        }
      },
      { threshold: 0.05, rootMargin: "0px" }
    );

    observer.observe(currentElement);
    return () => observer.unobserve(currentElement);
  }, []);

  const getTransform = () => {
    if (!isVisible) {
      if (direction === "up") return "translate-y-4 opacity-0";
      if (direction === "left") return "-translate-x-4 opacity-0";
      if (direction === "right") return "translate-x-4 opacity-0";
    }
    return "translate-y-0 translate-x-0 opacity-100";
  };

  return (
    <div
      ref={domRef}
      onTransitionEnd={() => setIsDone(true)}
      style={{
        transitionDelay: `${delay}ms`,
        willChange: isDone ? 'auto' : 'transform, opacity',
      }}
      className={`transition-[transform,opacity] duration-700 ease-out transform-gpu ${getTransform()} ${className}`}
    >
      {children}
    </div>
  );
};


// ---------------------- DATA ----------------------
const heroSlides = [
  { image: "/gallery/maligawa.png", title: "Temple Of Tooth", subtitle: "Sacred temple of the Tooth Relic", location: "Kandy" },
  { image: "/gallery/sigiriya.png", title: "Sigiriya Fortress", subtitle: "Ancient wonders meet natural beauty", location: "Central Province" },
  { image: "/gallery/ninearch.png", title: "Nine Arch Bridge", subtitle: "Iconic bridge in lush tea country", location: "Ella" },
  { image: "/gallery/colombo2.png", title: "Colombo City", subtitle: "Relax by the scenic coastline", location: "Colombo" },
];

const journeySlides = [
  {
    src: "https://res.cloudinary.com/dicvgtusz/image/upload/q_auto,f_webp/v1772084172/chathura-anuradha-subasinghe-40uQmE9Zq8g-unsplash_fnkyow.jpg",
    title: "Temple of Tooth",
    desc: "Experience the sacred temple of the Tooth Relic in Kandy."
  },
  {
    src: "https://res.cloudinary.com/dicvgtusz/image/upload/q_auto,f_webp/v1772084175/demodara-nine-arch-bridge-ella-sri-lanka.jpg_1_1_2_urimmw.jpg",
    title: "Train Journeys",
    desc: "Discover misty mountains and the iconic Nine Arch Bridge."
  },
  {
    src: "https://res.cloudinary.com/dz0hl3qmz/image/upload/v1773581114/iceland-landscape-beautiful-waterscape_1_ehrskb.jpg",
    title: "Whale Watching",
    desc: "Relax by the pristine beaches and go whale watching."
  },
  // New slides
  {
    src: "https://res.cloudinary.com/dz0hl3qmz/image/upload/v1773579214/indian-leopard-nature-habitat-leopard-resting-rock-wildlife-scene_eqnodk.jpg",
    title: "Leopards & Wildlife",
    desc: "Spot majestic leopards and elephants in Sri Lanka's wild national parks."
  },
  {
    src: "https://res.cloudinary.com/dz0hl3qmz/image/upload/v1773579481/kevin-olson-ib1INtxbXc8-unsplash_os7vv4.jpg",
    title: "Surfing",
    desc: "Ride the waves on Sri Lanka's world-famous surfing beaches."
  },
  {
    src: "https://res.cloudinary.com/dz0hl3qmz/image/upload/v1773579770/tea-plantations-sri-lanka-near-reservoir_qv6zrf.jpg",
    title: "Tea Plantation Experiences",
    desc: "Wander through lush tea plantations and discover the art of Ceylon tea."
  },
];

const packages = [
  { title: "Cultural Triangle", desc: "Explore ancient cities, temples, and UNESCO World Heritage sites across Sri Lanka's cultural heartland.", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80", days: "5 Days", people: "2-8" },
  { title: "Coastal Retreat", desc: "Relax on pristine beaches, enjoy water sports, and witness stunning ocean sunsets.", image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&q=80", days: "7 Days", people: "2-6" },
  { title: "Hill Country Escape", desc: "Journey through tea plantations, misty mountains, and colonial-era towns.", image: "https://images.unsplash.com/photo-1608481337062-4093bf3ed404?auto=format&fit=crop&w=800&q=80", days: "4 Days", people: "2-10" },
];

const categories = [
  { name: "Popular Beaches", image: "/beach.png", locations: [{ x: 35, y: 95, label: "Mirissa" }, { x: 65, y: 35, label: "Marble Beach" }, { x: 25, y: 89, label: "Hikkaduwa" }, { x: 84, y: 75, label: "Arugam Bay" }] },
  { name: "Wildlife & Nature", image: "/wildlife.png", locations: [{ x: 25, y: 29, label: "Wilpattu" }, { x: 77, y: 83, label: "Yala" }] },
  { name: "Adventure", image: "/adventure.png", locations: [{ x: 40, y: 75, label: "Kithulgala" }, { x: 60, y: 80, label: "Flying Ravana" }] },
  { name: "History & Culture", image: "/culture.png", locations: [{ x: 45, y: 63, label: "Sigiriya" }, { x: 55, y: 48, label: "Polonnaruwa" }, { x: 45, y: 38, label: "Anuradhapura" }] },
  { name: "Lesser Travelled", image: "/lessertraveled.png", locations: [{ x: 38, y: 97, label: "Polhena" }, { x: 38, y: 80, label: "Rathnapura" }] },
  { name: "Gastronomy", image: "/food.png", locations: [{ x: 22, y: 74, label: "Colombo" }, { x: 55, y: 70, label: "Mahiyanganaya" }] },
];

const galleryList = ["/gallery/img1.jpg", "/gallery/img2.jpg", "/gallery/img3.jpg", "/gallery/img4.jpg", "/gallery/img5.jpg", "/gallery/img6.jpg"];

export default function HomePage() {
  // Existing States
  const [activeCategory, setActiveCategory] = useState(null);
  const [journeyCurrent, setJourneyCurrent] = useState(0);
  const [latestPackages, setLatestPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Artificial delay to show the beautiful loader
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);
  const [curatedPackages, setCuratedPackages] = useState([]);

  // Router Navigation
  const navigate = useNavigate();

  // Ref for Captured Moments section
  const capturedMomentsRef = useRef(null);
  const videoRef = useRef(null);
  const packagesRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: packagesRef,
    offset: ["start end", "end start"]
  });
  const packageY = useTransform(scrollYProgress, [0, 1], ["-30%", "30%"]);

  const scrollToCapturedMoments = () => {
    capturedMomentsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Journey Slider Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setJourneyCurrent((prev) => prev === journeySlides.length - 1 ? 0 : prev + 1);
    }, 6000); // 6 seconds per slide
    return () => clearInterval(timer);
  }, []);

  // Fetch packages — uses module-level cache so re-mounts don't re-fetch
  useEffect(() => {
    let cancelled = false;

    // Latest packages
    if (_cache.latest) {
      setLatestPackages(_cache.latest);
    } else {
      if (!_cache.latestPromise) {
        _cache.latestPromise = fetch(`${import.meta.env.VITE_BACKEND_URL}/packages`)
          .then(res => { if (!res.ok) throw new Error(`Server error: ${res.status}`); return res.json(); })
          .then(data => {
            if (!Array.isArray(data)) throw new Error('Invalid packages data');
            const sorted = data.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            _cache.latest = sorted.slice(0, 3);
            return _cache.latest;
          })
          .catch(err => { _cache.latestPromise = null; if (import.meta.env.DEV) console.warn('[HomePage] failed to fetch packages:', err); });
      }
      _cache.latestPromise.then(data => { if (!cancelled && data) setLatestPackages(data); });
    }

    // Curated packages
    if (_cache.curated) {
      setCuratedPackages(_cache.curated);
    } else {
      if (!_cache.curatedPromise) {
        _cache.curatedPromise = fetch(`${import.meta.env.VITE_BACKEND_URL}/packages/curated`)
          .then(res => { if (!res.ok) throw new Error(`Server error: ${res.status}`); return res.json(); })
          .then(data => { _cache.curated = data; return data; })
          .catch(err => { _cache.curatedPromise = null; if (import.meta.env.DEV) console.warn('[HomePage] failed to fetch curated packages:', err); });
      }
      _cache.curatedPromise.then(data => { if (!cancelled && data) setCuratedPackages(data); });
    }

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let observer;
    const currentVideo = videoRef.current;
    if (currentVideo) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              currentVideo.play().catch(e => {});
            } else {
              if (currentVideo) currentVideo.pause();
            }
          });
        },
        { threshold: 0.01 }
      );
      observer.observe(currentVideo);
    }
    return () => {
      if (observer && currentVideo) observer.unobserve(currentVideo);
    };
  }, []);

  return (
    <div className={`bg-white text-gray-900 ${fontBody} selection:bg-blue-600 selection:text-white`}>
      <AnimatePresence>
        {isLoading && <CeyloriaLoader key="main-loader" />}
      </AnimatePresence>

      {/* ---------------------- 1. HERO SECTION ---------------------- */}
      <div className="relative w-full h-screen overflow-hidden bg-neutral-200">
        {/* Background Video */}
        <div className="absolute inset-0 bg-neutral-100 z-0">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            disablePictureInPicture
            preload="auto"
            poster="https://res.cloudinary.com/dz0hl3qmz/video/upload/q_auto,f_auto,so_0/v1773637258/Ceyloria_travels_03_fz0aor.jpg"
            className="absolute inset-0 w-full h-full object-cover brightness-115 contrast-110"
            style={{ filter: 'brightness(1.10) contrast(1.08)' }}
          >
            <source src="https://res.cloudinary.com/dz0hl3qmz/video/upload/v1773637258/Ceyloria_travels_03_fz0aor.mp4" type="video/mp4" />
          </video>
        </div>
        {/* Gradient Overlays for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-black/0 z-10 pointer-events-none" />

        <div className="absolute inset-0 z-20 flex flex-col justify-end pb-40 md:pb-24 px-6 md:px-16 lg:px-24">
          <div className="max-w-6xl">
            <h1 className={`${fontHead} text-4xl sm:text-6xl md:text-7xl lg:text-[8rem] xl:text-[9rem] leading-[0.95] md:leading-[0.9] mb-5 md:mb-7 drop-shadow-2xl tracking-tight`}>
              {["Discover", "The", "Paradise"].map((word, i) => (
                <span
                  key={i}
                  className={`inline-block mr-2 md:mr-4 animate-slide-up hover:text-cyan-200 transition-colors cursor-default ${word === "Paradise" ? "text-[#a5f3fc]" : "text-white"}`}
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  {word}
                </span>
              ))}
            </h1>

            <div className="mt-4 md:mt-8">
              <div className="animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                <div className="border-l-[3px] md:border-l-4 border-[#c8007b] pl-4 md:pl-6 py-1 md:py-2">
                  <p className="text-base sm:text-lg md:text-xl text-white/95 font-light max-w-2xl leading-relaxed drop-shadow-md mb-6 md:mb-8 pointer-events-none">
                    Immerse yourself in the magic of island life. From golden shores to ancient misty peaks, your unforgettable journey starts right here.
                  </p>

                  <div className="opacity-0 animate-[fadeUp_0.8s_ease-out_forwards]" style={{ animationDelay: '700ms' }}>
                    <Link to="/destinations" className="group relative overflow-hidden bg-white text-gray-900 px-6 py-3 md:px-8 md:py-4 rounded-full font-bold transition-all hover:bg-gray-50 hover:scale-105 active:scale-95 w-fit flex items-center shadow-[0_0_30px_rgba(255,255,255,0.25)] pointer-events-auto">
                      <span className="relative z-10 flex items-center gap-2 md:gap-3 text-xs md:text-sm tracking-widest uppercase">
                        Start Exploring <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* ---------------------- WHY CHOOSE US (New Design) ---------------------- */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-white relative overflow-hidden font-sans">
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-stretch gap-12 lg:gap-8 xl:gap-12">

            {/* Column 1: Left Content & Button */}
            <div className="flex flex-col justify-between w-full lg:w-1/3">
              <Reveal direction="left">
                <span className="text-[#b80072] font-bold tracking-[0.3em] uppercase text-xs block mb-4 mt-4 lg:mt-0">( WHY CHOOSE US )</span>
                <h2 className="text-3xl md:text-4xl lg:text-[40px] font-bold text-gray-900 leading-tight mb-6 mt-4">
                  <span className="text-[#c8007b]">Why Choose Ceyloria</span> for Your Dream Sri Lanka Journey?
                </h2>
                <p className="text-gray-500 mb-8 leading-relaxed">
                  “Ceyloria Travels transforms Sri Lanka trips into unforgettable journeys with expert planning, authentic
experiences, and personalized service.”
                </p>

                <ul className="space-y-4 mb-10">
                  {['Expert Local Knowledge', 'Customized Travel Experiences', 'Reliable & Trusted Service', 'Transparent & Competitive Pricing','Professional Drivers & Guides','24/7 Customer Support'].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-gray-900 font-bold">
                      <ArrowRight className="w-5 h-5 text-gray-900 stroke-[3]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>

              {/* Dark Box Button */}
              <Reveal direction="up" delay={200}>
                <div className="bg-[#1f1f1f] text-white p-10 rounded-[40px] rounded-tl-xl w-full max-w-[320px] flex flex-col justify-between mt-auto">
                  <h3 className="text-3xl font-bold mb-8 leading-tight">Ready to craft<br />your trip?</h3>
                  
                  {/* New Styled Button */}
                  <Link to="/plan-my-trip" className="group relative overflow-hidden bg-white text-gray-900 px-6 py-3 md:px-8 md:py-4 rounded-full font-bold transition-all hover:bg-gray-50 hover:scale-105 active:scale-95 w-fit flex items-center shadow-[0_0_30px_rgba(255,255,255,0.25)] pointer-events-auto mt-4">
                    <span className="relative z-10 flex items-center gap-2 md:gap-3 text-xs md:text-sm tracking-widest uppercase">
                      Plan My Trip <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </span>
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* Column 2: Middle Image Pill */}
            <div className="w-full lg:w-1/3 flex justify-center relative py-12 lg:py-0">
              <Reveal delay={100}>
                {/* White background pill for spacing */}
                <div className="relative w-full max-w-[350px] aspect-[6/10] rounded-[200px] bg-white p-2 md:p-4 mt-8 lg:mt-0">
                  <div className="w-full h-full rounded-[200px] overflow-hidden shadow-sm border border-gray-100 group">
                    <img src="https://res.cloudinary.com/dicvgtusz/image/upload/q_auto,f_webp/v1772084173/jalitha-hewage-Dw2QYtzSNn0-unsplash_dhz5dj.jpg" alt="Traveler" loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                </div>
                {/* Badge */}
                <div style={{ willChange: 'transform' }} className="absolute top-0 lg:-top-4 left-4 lg:-left-6 w-36 h-36 bg-[#1f1f1f] rounded-full flex flex-col items-center justify-center text-white shadow-md z-20 animate-floating">
                  <span className="text-4xl font-black mb-1">25+</span>
                  <span className="text-xs font-bold text-center leading-tight">Years<br />Experienced</span>
                </div>
              </Reveal>
            </div>

            {/* Column 3: Right Top Image & Bottom Content */}
            <div className="w-full lg:w-1/3 flex flex-col justify-start gap-4">
              {/* Image */}
              <Reveal direction="right">
                <div className="w-full aspect-[4/3] rounded-tl-[100px] rounded-br-[100px] rounded-tr-2xl rounded-bl-2xl overflow-hidden shadow-sm border border-gray-100 group">
                  <img src="https://res.cloudinary.com/dz0hl3qmz/image/upload/v1773575432/hendrik-cornelissen-jpTT_SAU034-unsplash_rwnj8g.jpg" alt="Destination" loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
              </Reveal>

              {/* Text area */}
              <Reveal direction="up" delay={200}>
                <div>
                  <h2 className="text-4xl lg:text-[44px] font-bold text-gray-900 mb-6 leading-tight tracking-tight">
                    Gateway <span className="font-light italic text-gray-600">to</span><br />Unforgettable<br />Journeys.
                  </h2>
                  <p className="text-gray-500 leading-relaxed text-sm">
                    Ceyloria Travels is your trusted partner for discovering the beauty, culture, and adventure of Sri Lanka. From
golden beaches to misty mountains and ancient heritage sites, we design journeys that turn your travel
dreams into unforgettable memories.

                  </p>
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </section>


      {/* ---------------------- 6. PACKAGES ---------------------- */}
      <section ref={packagesRef} className="py-24 px-6 md:px-16 lg:px-24 relative z-10 rounded-t-[3rem] min-h-[400px] flex items-center bg-black overflow-hidden">
        {/* Background Image with Parallax Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden rounded-t-[3rem]">
          <motion.img
            src="https://res.cloudinary.com/dicvgtusz/image/upload/f_webp,q_auto:low/v1772527550/scenic-view-mountains-against-sky_1_vltiso.jpg"
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            style={{ y: packageY, willChange: 'transform' }}
            className="w-full h-full object-cover opacity-50 scale-150"
          />
          <div className="absolute inset-0 bg-black/40 z-[1]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 w-full text-center">
          <Reveal>
            <div className="flex flex-col items-center mb-12 gap-2">
              <span className="text-white font-bold tracking-[0.3em] uppercase text-xs">( PACKAGES )</span>
              <h2 className={`${fontHead} text-5xl md:text-6xl text-white drop-shadow-md`}>Popular Packages</h2>
              <div className="w-16 h-1 bg-[#a40165] rounded-full mt-2 mb-2"></div>
              <p className="text-neutral-200 max-w-2xl text-base md:text-lg font-light leading-relaxed">“Discover Sri Lanka through our most popular journeys, combining culture, nature, wildlife, and
unforgettable experiences.”</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {((curatedPackages && curatedPackages.length > 0) ? curatedPackages : (latestPackages.length > 0 ? latestPackages : packages)).slice(0, 3).map((pkg, idx) => (
              <Reveal key={pkg.id || idx} delay={idx * 150}>
                <CuratedPackageCard pkg={pkg} />
              </Reveal>
            ))}
          </div>

          {/* View All Packages Button */}
          <Reveal delay={400} direction="up">
            <div className="mt-16 flex justify-center">
              <Link
                to="/packages"
                className="group relative px-10 py-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] text-white font-bold tracking-[0.2em] uppercase text-xs hover:bg-white/10 hover:border-white/20 transition-all duration-500 shadow-2xl overflow-hidden active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative z-10 flex items-center gap-4">
                  Explore All Packages 
                  <div className="bg-[#a40165] p-1.5 rounded-full group-hover:translate-x-2 transition-transform duration-500">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>


      {/* ---------------------- ABOUT US (Redesigned) ---------------------- */}
      <section className="py-24 lg:py-32 px-6 md:px-12 lg:px-24 bg-white relative overflow-hidden font-sans flex items-center min-h-[700px]">
        {/* Background Shadow/Watermark Image */}
        <img
          src="/logo.png"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="absolute top-40 left-1/2 -translate-x-1/2 md:top-0 md:left-auto md:translate-x-0 md:right-[5%] h-full w-[130%] md:w-[65%] object-contain z-0 opacity-[0.14] pointer-events-none select-none"
        />

        <div className="max-w-7xl mx-auto relative z-10 w-full mt-10 md:mt-0">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

            {/* Left Side: Images */}
            <Reveal direction="left">
              <div className="relative w-full lg:w-[500px] aspect-square flex items-center justify-center mt-10 lg:mt-0">
                {/* Main Image Container */}
                <div className="w-[85%] h-[90%] rounded-[40px] overflow-hidden relative z-10 mr-auto border border-gray-100 group">
                  <img
                    src="https://res.cloudinary.com/dicvgtusz/image/upload/q_auto,f_webp/v1772084174/sarmat-batagov-cuZbrYoimv8-unsplash_cnarh7.jpg"
                    alt="Travelers"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Overlapping Image Container */}
                <div className="absolute top-1/2 -translate-y-1/2 -right-4 lg:-right-12 w-[55%] aspect-[3/4] rounded-[30px] overflow-hidden border-[10px] border-white bg-gray-100 z-20 shadow-md group">
                  <img
                    src="https://res.cloudinary.com/dicvgtusz/image/upload/q_auto,f_webp/v1772084175/55_zt76hl.jpg"
                    alt="Sri Lanka landscape"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              </div>
            </Reveal>

            {/* Right Side: Content */}
            <Reveal direction="right" delay={200}>
              <div className="flex flex-col lg:pl-10">
                <span className="text-[#b80072] font-bold tracking-[0.3em] uppercase text-xs mb-6 block">( ABOUT US )</span>

                <h2 className="text-4xl md:text-5xl lg:text-[48px] font-bold text-gray-900 mb-8 leading-[1.1] tracking-tight">
                  Discover the True Essence of <span className="font-light italic text-gray-500">Island Life</span> in Sri Lanka
                </h2>

                <p className="text-gray-500 text-lg leading-relaxed mb-10">
                 We are a Sri Lanka-based, locally-owned travel company dedicated to crafting unforgettable adventures for
travelers from around the world. Founded with a simple mission to showcase the real island life beyond the
usual tourist paths we connect you with authentic experiences, hidden gems, and the heart of Ceylon.

                </p>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                  {/* Feature 1 */}
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-3 rounded-2xl shrink-0">
                      <svg className="w-6 h-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-1">100%</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">Local Expertise</p>
                    </div>
                  </div>

                  {/* Feature 2 */}
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-3 rounded-2xl shrink-0">
                      <svg className="w-6 h-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-1">5k+</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">Happy Travelers</p>
                    </div>
                  </div>
                </div>

                <div className="w-full h-px bg-gray-200 mb-10"></div>

                {/* Bottom Row */}
                <div className="flex flex-wrap items-center gap-8">
                  <Link to="/about" className="bg-[#1f1f1f] hover:bg-black transition-colors text-white py-4 px-8 rounded-full font-bold flex items-center gap-3 group w-fit">
                    Discover More
                    <ArrowRight className="w-5 h-5 bg-white text-[#1f1f1f] rounded-full p-1 group-hover:translate-x-1 transition-transform" />
                  </Link>

                </div>

              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ---------------------- 3. GALLERY ---------------------- */}
      <section ref={capturedMomentsRef} className="py-24 bg-white relative border-t border-gray-100">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex flex-col items-center mb-16 gap-2">
            <span className="text-[#b80072] font-bold tracking-[0.3em] uppercase text-xs">( GALLERY )</span>
            <h2 className="text-4xl md:text-5xl lg:text-[48px] font-bold text-gray-900 mb-4 leading-[1.1] tracking-tight text-center">
              Captured Moments
            </h2>
            <p className="text-gray-500 max-w-2xl text-base md:text-lg font-light leading-relaxed text-center">
              Explore the beauty of Sri Lanka through our lens. A glimpse into the unforgettable experiences waiting for you.
            </p>
          </div>
          <div className="w-full">
            <Gallery images={galleryList} />
          </div>
        </div>
      </section>

      {/* ---------------------- 4. FEATURED: SIGIRIYA (Premium Redesign) ---------------------- */}
      <section className="py-24 md:py-32 px-6 md:px-16 lg:px-24 bg-neutral-50 relative overflow-hidden">
        {/* Elegant Background Accents */}
        <div className="absolute top-0 right-0 w-[40%] h-full bg-[#fdfbf7] z-0 rounded-bl-[100px] shadow-sm hidden lg:block"></div>
        <div className="absolute bottom-20 left-10 w-64 h-64 z-0 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(253,230,138,0.3) 0%, rgba(253,230,138,0) 70%)' }}></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

            {/* Left Side: Single Prominent Image */}
            <div className="w-full lg:w-1/2 relative h-[500px] lg:h-[650px] flex items-center justify-center">
              <Reveal direction="left" className="w-full h-full relative">

                {/* Main Large Image */}
                <div className="absolute inset-0 w-full h-full rounded-[40px] overflow-hidden shadow-2xl group z-10">
                  <img
                    src="https://res.cloudinary.com/dicvgtusz/image/upload/q_auto,f_webp/v1772085595/aboutsigiriya_1_o5gwsv.png"
                    alt="Sigiriya Fortress"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                </div>

                {/* Floating Badge 1 */}
                <div className="absolute top-10 -left-4 lg:-left-8 bg-white/95 p-5 lg:p-6 rounded-2xl shadow-xl border border-white/50 z-30 transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                  <div className="flex flex-col items-center">
                    <span className="block text-4xl font-light text-[#c8007b] mb-1">5th</span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Century AD</span>
                  </div>
                </div>

                {/* Floating Badge 2 */}
                <div className="absolute bottom-10 right-0 lg:-right-8 bg-[#1f1f1f]/95 p-4 lg:p-5 rounded-2xl shadow-2xl border border-white/10 z-30 transform hover:-translate-y-2 transition-transform duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <Compass className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                      <span className="block text-white text-lg font-bold drop-shadow-md">200m High</span>
                      <span className="text-[10px] text-neutral-300 uppercase tracking-widest drop-shadow-sm">Elevation</span>
                    </div>
                  </div>
                </div>

              </Reveal>
            </div>

            {/* Right Side: Elegant Content */}
            <div className="w-full lg:w-1/2 lg:pl-10">
              <Reveal direction="right" delay={200}>

                {/* Premium Label */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-px bg-[#c8007b]"></div>
                  <span className="text-[#c8007b] text-xs font-bold uppercase tracking-[0.3em]">UNESCO World Heritage</span>
                </div>

                {/* Main Heading */}
                <h2 className={`${fontHead} text-5xl md:text-6xl lg:text-7xl text-gray-900 mb-6 leading-[1.1] tracking-tight`}>
                  The Lion Rock <br />
                  <span className="italic text-gray-400 font-light">Fortress</span>
                </h2>

                {/* Divider */}
                <div className="w-20 h-1 bg-gradient-to-r from-[#c8007b] to-transparent mb-8 rounded-full"></div>

                {/* Description */}
                <p className="text-lg text-gray-600 mb-8 leading-relaxed font-light">
                  Sigiriya is one of the most valuable historical monuments of Sri Lanka. Referred by locals as the Eighth Wonder of the World, this ancient palace and fortress complex has significant archaeological importance and attracts thousands of tourists every year.
                </p>

                {/* Stats Section with sleek design */}
                <div className="flex gap-12 my-10 border-l-2 border-amber-500 pl-6 py-2">
                  <div className="flex flex-col">
                    <span className="text-4xl font-light text-gray-900 mb-1">1,200</span>
                    <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Steps to Top</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-4xl font-light text-gray-900 mb-1">1982</span>
                    <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Inscribed Year</span>
                  </div>
                </div>

                {/* Premium Button */}
                <div className="mt-12">
                  <Link
                    to="/sigiriyafortress"
                    className="inline-flex items-center gap-4 text-white bg-gray-900 px-8 py-4 rounded-full font-medium hover:bg-[#c8007b] transition-colors duration-300 group shadow-[0_10px_20px_-10px_rgba(0,0,0,0.5)]"
                  >
                    <span>Read Full Story</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* ---------------------- 5. THE JOURNEY (Modern Slider) ---------------------- */}
      <section className="relative w-full h-[90vh] md:h-screen bg-neutral-900 overflow-hidden flex flex-col justify-end mb-12 md:mb-24 rounded-b-[2.5rem] lg:rounded-b-[4rem]">
        {journeySlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === journeyCurrent ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          >
            <div className={`relative w-full h-full transform-gpu transition-opacity duration-1000 ease-in-out`}>
              <img src={slide.src} alt={slide.title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 pointer-events-none"></div>
            </div>

            <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-end pb-32 px-6 md:px-16 lg:px-24">
              <div className="max-w-4xl pointer-events-auto">
                <span className="text-cyan-400 font-bold tracking-[0.3em] uppercase text-xs block mb-4 animate-fade-in-up">The Journey</span>
                <h3 className={`${fontHead} text-5xl md:text-7xl lg:text-8xl text-white leading-tight mb-6 drop-shadow-xl animate-slide-up`}>
                  {slide.title}
                </h3>
                <p className="text-xl text-neutral-200 font-light max-w-2xl leading-relaxed border-l-2 border-cyan-400 pl-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                  {slide.desc}
                </p>
                  {/* Activity Page Redirect Button */}
                  <div className="mt-8">
                    <Link
                      to="/activities"
                      className="inline-flex items-center gap-4 text-white bg-[#c8007b] hover:bg-[#a40165] px-8 py-4 rounded-full font-medium shadow-[0_10px_20px_-10px_rgba(0,0,0,0.15)] transition-colors duration-300 group"
                    >
                      <span className="text-lg md:text-xl font-semibold">Explore Activities</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slider Controls */}
        <div className="absolute bottom-12 left-6 md:left-24 z-30 flex items-center gap-6 w-full max-w-xs md:max-w-md">
          <div className="flex gap-2 w-full">
            {journeySlides.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setJourneyCurrent(idx)}
                className="group relative h-1 flex-1 bg-white/20 cursor-pointer overflow-hidden rounded-full"
              >
                <div
                  key={idx === journeyCurrent ? `anim-${journeyCurrent}` : `idle-${idx}`}
                  className={`absolute top-0 left-0 h-full bg-cyan-400 w-full origin-left ${idx === journeyCurrent ? "animate-progress-fill opacity-100" : "opacity-0 scale-x-0"}`}
                />
              </div>
            ))}
          </div>
          <span className="text-white/50 text-sm font-bold tracking-widest min-w-[3rem]">
            0{journeyCurrent + 1} / 0{journeySlides.length}
          </span>
        </div>
      </section>


    </div>
  );
}


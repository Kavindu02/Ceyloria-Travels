import React, { useState, useEffect, useMemo, useRef } from 'react';
import TravelCard from '../../components/TravelCard';
import {
  Search,
  Filter,
  X,
  Calendar,
  Clock,
  Plus,
  Minus,
  SlidersHorizontal,
  MapPin,
  DollarSign,
  ChevronLeft,
  ArrowRight
} from 'lucide-react';
import { safeParseJSON } from '../../utils/jsonParser.js';

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

const PackagesPage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const fontHead = "font-['Playfair_Display',_serif]";

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('All');
  const [selectedDate, setSelectedDate] = useState('');
  const [priceRange, setPriceRange] = useState(5000);
  const [selectedDays, setSelectedDays] = useState('All');
  const [selectedNights, setSelectedNights] = useState('All');

  const [maxPriceLimit, setMaxPriceLimit] = useState(5000);
  const [availableLocations, setAvailableLocations] = useState([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/packages`);
        if (!res.ok) throw new Error('Failed to load packages');
        const data = await res.json();

        setPackages(data);

        const locations = new Set();
        let highestPrice = 0;

        data.forEach(pkg => {
          const parsedCities = safeParseJSON(pkg.citiesCovered);
          parsedCities?.forEach(c => locations.add(c));
          if (pkg.price > highestPrice) highestPrice = pkg.price;
        });

        setAvailableLocations([...locations]);
        setMaxPriceLimit(highestPrice + 500);
        setPriceRange(highestPrice + 500);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Something went wrong');
        setLoading(false);
      }
    };
    fetchPackages();
    window.scrollTo(0, 0);
  }, []);

  const filteredPackages = useMemo(() => {
    return packages.filter(pkg => {
      const matchesSearch =
        pkg.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase());

      const parsedCities = safeParseJSON(pkg.citiesCovered);
      const matchesDestination =
        selectedDestination === 'All' ||
        parsedCities?.includes(selectedDestination);

      const matchesPrice = pkg.price <= priceRange;

      const matchesDate =
        !selectedDate || new Date(pkg.startDate) >= new Date(selectedDate);

      // Duration Filter (e.g., "7 Days / 6 Nights" or "3 Days")
      const durationStr = (pkg.duration || "").toLowerCase();
      
      const matchesDays = selectedDays === 'All' || 
        durationStr.includes(`${selectedDays} day`) || 
        durationStr.includes(`${selectedDays}day`);
        
      const matchesNights = selectedNights === 'All' || 
        durationStr.includes(`${selectedNights} night`) || 
        durationStr.includes(`${selectedNights}night`);

      return matchesSearch && matchesDestination && matchesPrice && matchesDate && matchesDays && matchesNights;
    });
  }, [packages, searchTerm, selectedDestination, priceRange, selectedDate, selectedDays, selectedNights]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDestination('All');
    setSelectedDate('');
    setPriceRange(maxPriceLimit);
    setSelectedDays('All');
    setSelectedNights('All');
  };

  return (
    <div className="bg-[#faf9f6] selection:bg-[#c8007b] selection:text-white min-h-screen pb-20 overflow-x-hidden">

      {/* --- HERO SECTION --- */}
      <div className="relative h-[60vh] lg:h-[70vh] w-full bg-black overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://res.cloudinary.com/dicvgtusz/image/upload/f_webp,q_auto:low/v1772524211/elephants-bathing-river-pinnawala-elephant-orphanage-sri-lanka_1_kd8kad.jpg"
            alt="Sri Lanka Experience"
            className="w-full h-full object-cover animate-subtle-zoom opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        </div>

        <div className="relative z-20 container mx-auto px-6 text-center">
          <Reveal direction="up">
            <span className="text-cyan-400 font-bold tracking-[0.4em] uppercase text-xs block mb-6">Curated Journeys</span>
            <h1 className={`${fontHead} text-5xl md:text-7xl lg:text-8xl text-white leading-tight mb-8 drop-shadow-2xl`}>
              Island <span className="italic text-cyan-200">Collections</span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed">
              Discover bespoke travel packages specifically designed to showcase the refined beauty of Sri Lanka.
            </p>
          </Reveal>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <section className="relative py-24 px-6 md:px-12 lg:px-24">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#c8007b]/5 rounded-full blur-[100px] -z-10" />

        <div className="max-w-7xl mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">

            {/* --- FILTER SIDEBAR --- */}
            <aside className={`lg:col-span-3 fixed lg:static inset-0 bg-white lg:bg-transparent z-50 lg:z-auto transition-transform duration-500 ease-in-out overflow-y-auto lg:overflow-visible ${showMobileFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
              <div className="h-full p-8 lg:p-0 lg:sticky lg:top-32">

                {/* Mobile Header */}
                <div className="lg:hidden flex justify-between items-center mb-12">
                  <h3 className={`${fontHead} text-2xl`}>Refine Search</h3>
                  <button onClick={() => setShowMobileFilters(false)} className="p-3 bg-neutral-50 rounded-full text-neutral-400">
                    <X size={24} />
                  </button>
                </div>

                <Reveal direction="up" className="space-y-12">
                  {/* Search Group */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold tracking-widest text-[#c8007b] uppercase">Keywords</p>
                    <div className="relative group/input">
                      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within/input:text-[#c8007b] transition-colors" />
                      <input
                        type="text"
                        placeholder="Colombo, Nature, etc..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-100 rounded-[20px] pl-12 pr-4 py-4 outline-none focus:bg-white focus:border-[#c8007b]/20 transition-all font-medium text-sm"
                      />
                    </div>
                  </div>

                  {/* Destination Group */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold tracking-widest text-[#c8007b] uppercase">Destination</p>
                    <div className="relative group/input">
                      <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within/input:text-[#c8007b] transition-colors" />
                      <select
                        className="w-full appearance-none bg-neutral-50 border border-neutral-100 rounded-[20px] pl-12 pr-4 py-4 outline-none focus:bg-white focus:border-[#c8007b]/20 transition-all font-medium text-sm cursor-pointer"
                        value={selectedDestination}
                        onChange={e => setSelectedDestination(e.target.value)}
                      >
                        <option value="All">All Regions</option>
                        {availableLocations.map(loc => <option key={loc}>{loc}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Days Filter */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold tracking-widest text-[#c8007b] uppercase">Days</p>
                    <div className="flex items-center justify-between bg-neutral-50 border border-neutral-100 rounded-[20px] px-4 py-3">
                      <button
                        onClick={() => setSelectedDays(prev => prev === 'All' ? 'All' : (prev > 1 ? prev - 1 : 'All'))}
                        className="p-2 hover:bg-white rounded-full transition-colors text-neutral-400 hover:text-[#c8007b]"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="font-bold text-sm text-gray-900">
                        {selectedDays === 'All' ? 'All Days' : `${selectedDays} Day${selectedDays > 1 ? 's' : ''}`}
                      </span>
                      <button
                        onClick={() => setSelectedDays(prev => prev === 'All' ? 1 : prev + 1)}
                        className="p-2 hover:bg-white rounded-full transition-colors text-neutral-400 hover:text-[#c8007b]"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Nights Filter */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold tracking-widest text-[#c8007b] uppercase">Nights</p>
                    <div className="flex items-center justify-between bg-neutral-50 border border-neutral-100 rounded-[20px] px-4 py-3">
                      <button
                        onClick={() => setSelectedNights(prev => prev === 'All' ? 'All' : (prev > 1 ? prev - 1 : 'All'))}
                        className="p-2 hover:bg-white rounded-full transition-colors text-neutral-400 hover:text-[#c8007b]"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="font-bold text-sm text-gray-900">
                        {selectedNights === 'All' ? 'All Nights' : `${selectedNights} Night${selectedNights > 1 ? 's' : ''}`}
                      </span>
                      <button
                        onClick={() => setSelectedNights(prev => prev === 'All' ? 1 : prev + 1)}
                        className="p-2 hover:bg-white rounded-full transition-colors text-neutral-400 hover:text-[#c8007b]"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Price Group */}
                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                      <p className="text-[10px] font-bold tracking-widest text-[#c8007b] uppercase">Max Budget</p>
                      <span className="text-xl font-black text-gray-900">${priceRange}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={maxPriceLimit}
                      value={priceRange}
                      onChange={e => setPriceRange(+e.target.value)}
                      className="w-full h-1.5 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-[#c8007b]"
                    />
                  </div>

                  <button onClick={clearFilters} className="text-[10px] font-bold text-neutral-400 hover:text-[#c8007b] uppercase tracking-widest transition-colors flex items-center gap-2">
                    <X size={14} /> Clear All Filters
                  </button>
                </Reveal>
              </div>
            </aside>

            {/* --- RESULTS GRID --- */}
            <main className="lg:col-span-9">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-12">
                <button onClick={() => setShowMobileFilters(true)} className="w-full flex items-center justify-between p-6 bg-neutral-900 text-white rounded-[30px] font-bold uppercase tracking-widest text-xs">
                  <span>Refine Collections</span>
                  <SlidersHorizontal size={18} />
                </button>
              </div>

              {loading ? (
                <div className="py-20 text-center">
                  <div className="w-16 h-16 border-4 border-neutral-100 border-t-[#c8007b] rounded-full animate-spin mx-auto mb-6"></div>
                  <p className="font-bold text-neutral-400 uppercase tracking-widest text-[10px]">Curating Experiences...</p>
                </div>
              ) : error ? (
                <div className="py-20 text-center">
                  <p className="text-red-500 font-bold text-xl">{error}</p>
                </div>
              ) : filteredPackages.length === 0 ? (
                <div className="py-20 text-center space-y-6">
                  <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto text-neutral-300">
                    <Search size={32} />
                  </div>
                  <h3 className={`${fontHead} text-3xl text-gray-900`}>No collections found.</h3>
                  <p className="text-neutral-400">Try adjusting your filters to find your perfect island escape.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
                  {filteredPackages.map((pkg, i) => {
                    const parsedCities = safeParseJSON(pkg.citiesCovered);
                    return (
                      <Reveal key={pkg.id} delay={i % 2 * 100} direction="up">
                        <div className="group relative">
                          <TravelCard
                            image={pkg.images}
                            title={pkg.title}
                            location={parsedCities?.join(', ')}
                            duration={pkg.duration}
                            description={pkg.shortDescription}
                            price={pkg.price}
                            ratingText={pkg.ratingText}
                            starCount={pkg.starCount}
                            id={pkg.id}
                          />
                        </div>
                      </Reveal>
                    );
                  })}
                </div>
              )}
            </main>
          </div>
        </div>
      </section>



    </div>
  );
};

export default PackagesPage;

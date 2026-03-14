import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, MapPin, Compass, Star, ArrowDown, Clock, History, ChevronRight, Play } from 'lucide-react';

const AnuradhapuraPage = () => {
  // --- Custom Hook for Scroll Animations ---
  const useElementOnScreen = (options) => {
    const containerRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const observer = new IntersectionObserver((entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) setIsVisible(true);
      }, options);

      if (containerRef.current) observer.observe(containerRef.current);

      return () => {
        if (containerRef.current) observer.unobserve(containerRef.current);
      };
    }, [containerRef, options]);

    return [containerRef, isVisible];
  };

  // --- Scroll Progress Bar Logic ---
  const [scrollProgress, setScrollProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll));
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="font-sans text-stone-800 bg-stone-50 selection:bg-amber-200 selection:text-amber-900 overflow-x-hidden">

      {/* Sticky Progress Bar */}
      <div className="fixed top-0 left-0 h-1 bg-amber-600 z-50 transition-all duration-300 ease-out" style={{ width: `${scrollProgress * 100}%` }} />

      {/* ==================== 1. CINEMATIC HERO SECTION ==================== */}
      <div className="relative h-[95vh] w-full overflow-hidden group">

        {/* Background Image with Slow Parallax Scale */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://res.cloudinary.com/dicvgtusz/image/upload/f_auto,q_auto,w_1920,c_limit/v1772096815/ruwanwelisaya-stupa-anuradhapura-sri-lanka_1_o936af.jpg"
            alt="Anuradhapura Ruwanwelisaya Stupa"
            className="w-full h-full object-cover object-center animate-subtle-zoom"
            style={{
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              imageRendering: 'auto',
              filter: 'contrast(1.05) saturate(1.05) brightness(1.02)', // subtle clarity boost
            }}
            loading="eager"
            fetchpriority="high"
            decoding="sync"
          />
          {/* Cinematic Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-stone-900/90 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Navigation / Header Area (Simulated) */}
        {/* Navigation / Header Area (Simulated) - Removed */}

        {/* Hero Content - Bottom Aligned & Modern */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-16 z-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">

            {/* Title Block */}
            <div className="lg:col-span-8 animate-slide-up">
              <span className="inline-block px-3 py-1 mb-4 border border-white/30 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase text-white backdrop-blur-md">
                The Sacred City
              </span>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-white leading-[0.9] tracking-tighter mb-6">
                Anuradha<span className="text-amber-500 italic">pura</span>
              </h1>
              <p className="text-lg md:text-xl text-stone-200 font-light max-w-2xl leading-relaxed border-l-2 border-amber-500 pl-6">
                The first capital. A testament to a civilization that mastered stone and water while the rest of the world slept.
              </p>
            </div>

            {/* Interactive Play/Explore Block - Removed */}
            <div className="lg:col-span-4 flex justify-start lg:justify-end pb-2">
            </div>
          </div>
        </div>
      </div>

      {/* ==================== 2. ELEGANT STATS STRIP ==================== */}
      <div className="bg-stone-900 text-white py-12 px-6 border-b border-stone-800">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x divide-stone-800/50">
          {[
            { label: "Established", value: "4th Century BC", icon: History },
            { label: "Reign", value: "1,300 Years", icon: Clock },
            { label: "Status", value: "UNESCO Site", icon: Star },
            { label: "Location", value: "North Central", icon: MapPin },
          ].map((stat, idx) => (
            <div key={idx} className="pl-4 md:pl-8 group cursor-default">
              <stat.icon className="w-5 h-5 text-amber-600 mb-3 group-hover:animate-bounce" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 mb-1">{stat.label}</p>
              <p className="text-xl md:text-2xl font-serif text-stone-100">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ==================== 3. NARRATIVE & MAP (Asymmetrical Layout) ==================== */}
      <section className="py-32 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="relative">
          {/* Decorative Background Text */}
          <div className="absolute -top-20 -left-20 text-[12rem] font-serif text-stone-100 select-none opacity-50 z-0 leading-none">
            KINGDOM
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Image/Map Side (Spans 7 columns) */}
            <div className="lg:col-span-7 relative group">
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl transition-transform duration-700 hover:scale-[1.01]">
                <img
                  src="/srilanka-map.png"
                  alt="Map of Sri Lanka"
                  className="w-full h-auto object-cover  transition-all duration-1000"
                />
                {/* Animated Pin */}
                <div className="absolute top-[38%] left-[45%] translate-x-[-50%] translate-y-[-50%]">
                  <span className="relative flex h-8 w-8">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-8 w-8 bg-amber-500 border-4 border-white shadow-lg"></span>
                  </span>
                  <div className="absolute left-10 top-1 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-4 group-hover:translate-x-0">
                    You are here
                  </div>
                </div>
              </div>
            </div>

            {/* Text Side (Overlaps visually on large screens) */}
            <div className="lg:col-span-5 lg:-ml-20 mt-8 lg:mt-0">
              <div className="bg-white/90 backdrop-blur-xl p-8 md:p-12 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-white/50">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-12 h-[1px] bg-amber-600"></span>
                  <span className="text-amber-600 text-xs font-bold uppercase tracking-widest">The Origin Story</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-serif text-stone-900 leading-tight mb-6">
                  Where History is <br /><span className="italic text-stone-400">Etched in Stone.</span>
                </h2>
                <div className="space-y-4 text-stone-600 font-light leading-relaxed">
                  <p>
                    Anuradhapura was not merely a city; it was a hydraulic civilization that defied the engineering limitations of the ancient world.
                  </p>
                  <p>
                    Reigning for over a millennium, 117 rulers built magnificent palaces and stupas smaller in size only to the pyramids of Giza. Today, the ruins whisper tales of a golden era.
                  </p>
                </div>
                <div className="mt-8 pt-8 border-t border-stone-100 flex items-center gap-4">
                  <div className="bg-amber-50 p-3 rounded-full text-amber-600">
                    <Compass size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-stone-400">Travel Distance</p>
                    <p className="font-serif text-lg text-stone-800">205 km from Colombo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 4. FEATURED EXPERIENCES (Modern Cards) ==================== */}
      <section className="bg-white py-32 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-amber-600 font-bold uppercase tracking-widest text-xs mb-3 block">Curated Exploration</span>
              <h2 className="text-4xl md:text-6xl font-serif text-stone-900">Iconic Landmarks</h2>
            </div>
            {/* <div className="flex gap-2">
                <button className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-900 hover:text-white transition-all"><ArrowRight className="rotate-180" size={18}/></button>
                <button className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-900 hover:text-white transition-all"><ArrowRight size={18}/></button>
            </div> */}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ExperienceCard
              img="/pagesPhotos/anuradhapura/SriMahaBodhiya.png"
              title="Sri Maha Bodhiya"
              subtitle="The Sacred Fig Tree"
              desc="The oldest living human-planted tree in the world, a direct sapling from the Bodhi tree under which the Buddha attained enlightenment."
            />
            <ExperienceCard
              img="/pagesPhotos/anuradhapura/RuwanweliMahaSeya.png"
              title="Ruwanweli Seya"
              subtitle="The Great Stupa"
              desc="A marvel of ancient engineering, this bubble-shaped stupa enshrines the largest collection of relics of the Buddha."
            />
            <ExperienceCard
              img="/pagesPhotos/anuradhapura/Mihintale.png"
              title="Mihintale"
              subtitle="The Cradle of Buddhism"
              desc="A mountain peak believed to be the meeting point between the Buddhist monk Mahinda and King Devanampiyatissa."
            />
          </div>
        </div>
      </section>

      {/* ==================== 5. ANURADHAPURA BLOG CONTENT ==================== */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="prose prose-stone prose-lg max-w-none blog-content font-light text-stone-600 leading-relaxed">
          <h2>The Dawn of a Civilization: Exploring Anuradhapura</h2>
          <p>
            To walk through <strong>Anuradhapura</strong> is to walk through the very foundations of Sri Lankan history. As the first established capital of ancient Ceylon, this sacred city functioned as the political and religious heartbeat of the island for over a millennium. Today, it stands as a sprawling complex of architectural marvels, ancient hydraulic systems, and towering stupas that whisper tales of a glorious past.
          </p>

          <img src="/pagesPhotos/anuradhapura/hero.png" alt="Ruwanwelisaya Stupa at Sunrise" />

          <h3>A Masterclass in Ancient Engineering</h3>
          <p>
            Long before modern machinery, the engineers of Anuradhapura were masters of stone and water. The city is dotted with massive artificial lakes—known as <em>wewas</em>—that irrigate the dry plains even today. The intricate network of canals and bathing pools, such as the exquisite <strong>Kuttam Pokuna (Twin Ponds)</strong>, showcase an understanding of hydrology and aesthetics that remains staggering.
          </p>
          <p>
            But it is the colossal masonry that truly defines the skyline. The brick stupas (or dagobas) of Anuradhapura were among the tallest structures in the ancient world, rivaled only by the Pyramids of Giza. Standing before the gleaming white dome of the <strong>Ruwanwelisaya</strong>, one cannot help but feel dwarfed by the sheer scale of devotion poured into its construction by King Dutugemunu in 140 BC.
          </p>

          <blockquote>
            "Anuradhapura is not just ruins in the jungle; it is a living, breathing pilgrimage site where history and faith are inextricably intertwined."
          </blockquote>

          <h3>The Sacred Fig Tree: Sri Maha Bodhiya</h3>
          <p>
            At the spiritual epicenter of the city lies the <strong>Jaya Sri Maha Bodhi</strong>. Planted in 288 BC, it is the oldest living human-planted tree in the world with a documented history. Grown from a cutting of the original Bodhi tree in Bodh Gaya (under which the Buddha attained enlightenment), it was brought to Sri Lanka by Sanghamitta Theri, the daughter of Emperor Ashoka.
          </p>
          <p>
            Surrounded by golden railings and fluttering prayer flags, the tree draws thousands of white-clad pilgrims daily. The scent of lotus flowers and burning incense fills the air, creating an atmosphere of profound tranquility.
          </p>

          <h3>Essential Tips for Your Visit</h3>
          <ul>
            <li><strong>Dress Code:</strong> As a highly sacred city, modest clothing is strictly enforced. Shoulders and knees must be covered, and white attire is preferred.</li>
            <li><strong>Timing:</strong> The dry zone heat can be intense. Plan to explore the ruins early in the morning or late in the afternoon. Sunsets near the stupas are particularly magical.</li>
            <li><strong>Getting Around:</strong> The archaeological park is vast. Renting a bicycle is one of the best ways to navigate between the scattered ruins under the shade of ancient trees.</li>
          </ul>

          <p>
            Whether you are an archaeology enthusiast, a spiritual seeker, or simply a traveler looking to connect with the soul of Sri Lanka, Anuradhapura offers a journey back in time that is as humbling as it is awe-inspiring.
          </p>
        </div>
      </section>




    </div>
  );
};

// --- Helper Component for Experience Cards (Cleaner Code) ---
const ExperienceCard = ({ img, title, subtitle, desc }) => (
  <div className="group relative h-[600px] rounded-[2rem] overflow-hidden cursor-pointer">
    <img
      src={img}
      alt={title}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

    <div className="absolute bottom-0 left-0 w-full p-8 md:p-10 flex flex-col justify-end h-full">
      <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
        <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{subtitle}</p>
        <h3 className="text-3xl font-serif text-white mb-4">{title}</h3>
        <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-500">
          <p className="text-stone-300 text-sm font-light leading-relaxed mb-6 opacity-0 group-hover:opacity-100 transition-opacity delay-200 duration-500">
            {desc}
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default AnuradhapuraPage;
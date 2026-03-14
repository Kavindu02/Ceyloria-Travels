import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, MapPin, Compass, Star, ArrowDown, Clock, Anchor, ChevronRight, Ship, Waves } from 'lucide-react';

const GallePage = () => {
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
    <div className="font-sans text-stone-800 bg-stone-50 selection:bg-yellow-200 selection:text-yellow-900 overflow-x-hidden">

      {/* Sticky Progress Bar */}
      <div className="fixed top-0 left-0 h-1 bg-yellow-600 z-50 transition-all duration-300 ease-out" style={{ width: `${scrollProgress * 100}%` }} />

      {/* ==================== 1. CINEMATIC HERO SECTION ==================== */}
      <div className="relative h-[95vh] w-full overflow-hidden group">

        {/* Background Image with Slow Parallax Scale */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://res.cloudinary.com/dicvgtusz/image/upload/f_auto,q_auto,w_1920,c_limit/v1772084172/beautiful-white-lighthouse-fort-galle-sri-lanka.jpg_1_1_awg0e3.jpg"
            alt="Galle Lighthouse"
            loading="eager"
            fetchpriority="high"
            decoding="sync"
            className="w-full h-full object-cover object-center animate-subtle-zoom"
            style={{
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              imageRendering: 'auto',
              filter: 'contrast(1.05) saturate(1.05) brightness(1.02)', // subtle clarity boost
            }}
          />

          {/* HIGH-QUALITY CINEMATIC OVERLAYS */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-stone-900/70"></div>
          <div className="absolute inset-0 bg-black/5"></div>
        </div>


        {/* Navigation / Header Area (Simulated) */}
        {/* Navigation / Header Area (Simulated) - Removed */}

        {/* Hero Content - Bottom Aligned & Modern */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-16 z-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">

            {/* Title Block */}
            <div className="lg:col-span-8 animate-slide-up">
              <span className="inline-block px-3 py-1 mb-4 border border-white/30 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase text-white backdrop-blur-md">
                The Fortified Port
              </span>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-white leading-[0.9] tracking-tighter mb-6">
                Gal<span className="text-yellow-500 italic">le</span>
              </h1>
              <p className="text-lg md:text-xl text-stone-200 font-light max-w-2xl leading-relaxed border-l-2 border-yellow-500 pl-6">
                Where colonial ramparts guard stories of spice traders and seafarers. A living fortress where cobblestone streets whisper tales of Portuguese, Dutch, and British empires.
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
            { label: "Established", value: "16th Century", icon: Clock },
            { label: "Fort Built", value: "1663 AD", icon: Anchor },
            { label: "Status", value: "UNESCO Site", icon: Star },
            { label: "Location", value: "Southern Coast", icon: MapPin },
          ].map((stat, idx) => (
            <div key={idx} className="pl-4 md:pl-8 group cursor-default">
              <stat.icon className="w-5 h-5 text-yellow-600 mb-3 group-hover:animate-bounce" />
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
            FORT
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Image/Map Side (Spans 7 columns) */}
            <div className="lg:col-span-7 relative group">
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl transition-transform duration-700 hover:scale-[1.01]">
                <img
                  src="/srilanka-map.png"
                  alt="Map of Sri Lanka"
                  className="w-full h-auto object-cover transition-all duration-1000"
                />
                {/* Animated Pin */}
                <div className="absolute top-[90%] left-[30%] translate-x-[-50%] translate-y-[-50%]">
                  <span className="relative flex h-8 w-8">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-8 w-8 bg-yellow-500 border-4 border-white shadow-lg"></span>
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
                  <span className="w-12 h-[1px] bg-yellow-600"></span>
                  <span className="text-yellow-600 text-xs font-bold uppercase tracking-widest">Maritime Heritage</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-serif text-stone-900 leading-tight mb-6">
                  Where History Meets <br /><span className="italic text-stone-400">the Indian Ocean.</span>
                </h2>
                <div className="space-y-4 text-stone-600 font-light leading-relaxed">
                  <p>
                    Galle Fort stands as one of Asia's best-preserved colonial fortresses, a testament to European maritime power in the East. Built by the Portuguese and extensively fortified by the Dutch, its massive ramparts enclose a living city.
                  </p>
                  <p>
                    Today, the fort's narrow lanes are lined with boutique hotels, art galleries, and cafés housed in restored colonial buildings. The lighthouse, churches, and museums tell stories of merchants and empires that shaped the spice trade.
                  </p>
                </div>
                <div className="mt-8 pt-8 border-t border-stone-100 flex items-center gap-4">
                  <div className="bg-yellow-50 p-3 rounded-full text-yellow-600">
                    <Compass size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-stone-400">Travel Distance</p>
                    <p className="font-serif text-lg text-stone-800">116 km from Colombo</p>
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
              <span className="text-yellow-600 font-bold uppercase tracking-widest text-xs mb-3 block">Historical Landmarks</span>
              <h2 className="text-4xl md:text-6xl font-serif text-stone-900">Colonial Treasures</h2>
            </div>
            {/* <div className="flex gap-2">
                <button className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-900 hover:text-white transition-all"><ArrowRight className="rotate-180" size={18}/></button>
                <button className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-900 hover:text-white transition-all"><ArrowRight size={18}/></button>
            </div> */}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ExperienceCard
              img="/pagesPhotos/galle/gallelighthouse.png"
              title="Fort Ramparts"
              subtitle="Sunset Walks"
              desc="Walk along the massive Dutch fortifications at sunset, where the Indian Ocean crashes against ancient stone walls, offering breathtaking views."
            />
            <ExperienceCard
              img="/pagesPhotos/galle/rumassala.png"
              title="Rumassala"
              subtitle="The Cradle of Buddhism"
              desc="A scenic forested hill with rich biodiversity and stunning ocean views, known for its peaceful atmosphere and mythical Ramayana links."
            />
            <ExperienceCard
              img="/pagesPhotos/galle/hikkaduwabeach.png"
              title="Hikkaduwa Beach"
              subtitle="The Soul of the Coast"
              desc="A vibrant coastal spot known for its golden sands, clear waters, and colorful coral reefs perfect for snorkeling, surfing, and watching stunning sunsets."
            />
          </div>
        </div>
      </section>

      {/* ==================== 5. GALLE BLOG CONTENT ==================== */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="prose prose-stone prose-lg max-w-none blog-content font-light text-stone-600 leading-relaxed">
          <h2>A Timeless Fortress: The Charm of Galle</h2>
          <p>
            Walking through the arched stone gates of <strong>Galle Fort</strong> is like crossing the threshold into another era. While the rest of the southern coast dances to the rhythm of crashing waves and surf culture, this UNESCO World Heritage site exists in a beautifully preserved bubble of colonial history, art, and slow tropical living.
          </p>

          <img src="/pagesPhotos/galle/gallelighthouse.png" alt="Galle Lighthouse at Sunset" />

          <h3>Ramparts and Romance</h3>
          <p>
            The story of Galle is written in its walls. Originally built by the Portuguese in 1588 and extensively fortified by the Dutch during the 17th century, the massive coral and granite ramparts have protected the city for over four hundred years—even withstanding the devastating 2004 tsunami.
          </p>
          <p>
            Today, these walls serve as the city’s favorite promenade. A late afternoon walk along the ramparts is a Galle ritual. Join local families flying kites, young couples watching the sunset, and adventurous cliff-jumpers leaping into the Indian Ocean below Flag Rock. The iconic white lighthouse, framed by towering palm trees, provides the perfect backdrop for this daily tropical theatre.
          </p>

          <blockquote>
            "Galle Fort is not a museum piece; it is a living, breathing community where centuries of architecture cradle a vibrant contemporary culture."
          </blockquote>

          <h3>Cobblestones and Courtyards</h3>
          <p>
            Inside the walls, the grid-like streets (designed by the Dutch) are a joy to get lost in. Ancient merchant houses with red-tiled roofs and deep verandas have been lovingly restored into incredible boutique hotels, chic cafes, and contemporary art galleries.
          </p>
          <p>
            Take a stroll down Pedlar Street to browse for Ceylon sapphires, hand-woven lace, or vintage posters. Stop by the Dutch Reformed Church, whose floor is paved with gravestones from the old cemetery, offering a poignant glimpse into the lives of early European settlers.
          </p>

          <h3>Essential Tips for Your Visit</h3>
          <ul>
            <li><strong>Timing:</strong> The fort gets incredibly hot during midday. Explore early in the morning or late in the afternoon, reserving the hottest hours for a prolonged, lazy lunch in a shaded courtyard.</li>
            <li><strong>Beyond the Fort:</strong> While the fort is captivating, don't miss the surrounding area. Unawatuna's crescent-shaped beach is just a short tuk-tuk ride away, offering great swimming and snorkeling.</li>
            <li><strong>Culinary Delights:</strong> Galle’s dining scene is arguably the best outside of Colombo. Expect incredible seafood, refined Sri Lankan fusion, and world-class gelato.</li>
          </ul>

          <p>
            Galle offers a coastal experience unlike any other in Sri Lanka—one where the elegance of European architecture meets the irresistible warmth of the tropics. It is a place that demands you slow down, sip a gin and tonic, and simply soak it all in.
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
        <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{subtitle}</p>
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

export default GallePage;
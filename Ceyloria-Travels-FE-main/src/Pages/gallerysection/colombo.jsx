import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, MapPin, Compass, Star, ArrowDown, Clock, Building2, ChevronRight, Waves, Coffee, ShoppingBag } from 'lucide-react';

const ColomboPage = () => {
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
            src="https://res.cloudinary.com/dicvgtusz/image/upload/f_auto,q_auto,w_1920,c_limit/v1772096814/colombo-city-skyline-sri-lanka_mvto77.jpg"
            alt="Colombo City Skyline"
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
                The Vibrant Capital
              </span>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-white leading-[0.9] tracking-tighter mb-6">
                Colo<span className="text-yellow-500 italic">mbo</span>
              </h1>
              <p className="text-lg md:text-xl text-stone-200 font-light max-w-2xl leading-relaxed border-l-2 border-yellow-500 pl-6">
                Where colonial elegance meets contemporary energy. A coastal metropolis that pulses with life, culture, and endless possibilities.
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
            { label: "Population", value: "5.6 Million", icon: Building2 },
            { label: "Founded", value: "5th Century", icon: Clock },
            { label: "Coastline", value: "Indian Ocean", icon: Waves },
            { label: "Status", value: "Commercial Hub", icon: Star },
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
            CAPITAL
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
                <div className="absolute top-[75%] left-[22%] translate-x-[-50%] translate-y-[-50%]">
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
                  <span className="text-yellow-600 text-xs font-bold uppercase tracking-widest">Gateway to Paradise</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-serif text-stone-900 leading-tight mb-6">
                  Where East Meets <br /><span className="italic text-stone-400">West by the Sea.</span>
                </h2>
                <div className="space-y-4 text-stone-600 font-light leading-relaxed">
                  <p>
                    Colombo is a city of contrasts—where colonial architecture stands beside gleaming skyscrapers, and ancient temples coexist with trendy rooftop bars.
                  </p>
                  <p>
                    As the commercial capital and largest city, Colombo serves as the gateway to Sri Lanka's treasures while offering its own unique blend of culture, cuisine, and coastal charm.
                  </p>
                </div>
                <div className="mt-8 pt-8 border-t border-stone-100 flex items-center gap-4">
                  <div className="bg-yellow-50 p-3 rounded-full text-yellow-600">
                    <Compass size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-stone-400">Location</p>
                    <p className="font-serif text-lg text-stone-800">Western Coast</p>
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
              <span className="text-yellow-600 font-bold uppercase tracking-widest text-xs mb-3 block">Must-Visit Districts</span>
              <h2 className="text-4xl md:text-6xl font-serif text-stone-900">Urban Highlights</h2>
            </div>
            {/* <div className="flex gap-2">
                <button className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-900 hover:text-white transition-all"><ArrowRight className="rotate-180" size={18}/></button>
                <button className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-900 hover:text-white transition-all"><ArrowRight size={18}/></button>
            </div> */}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ExperienceCard
              img="/pagesPhotos/colombo/galleface.png"
              title="Galle Face"
              subtitle="Oceanfront Promenade"
              desc="A sprawling ocean-side urban park where locals gather to fly kites, enjoy street food, and watch spectacular sunsets over the Indian Ocean."
            />
            <ExperienceCard
              img="/pagesPhotos/colombo/pettah.png"
              title="Pettah Market"
              subtitle="Bustling Bazaar"
              desc="Dive into the sensory overload of Colombo's most vibrant market district, where centuries-old trading traditions continue in narrow, crowded streets."
            />
            <ExperienceCard
              img="/pagesPhotos/colombo/lotustower.png"
              title="Lotus Tower"
              subtitle="Modern Icon"
              desc="South Asia's tallest tower offers breathtaking 360-degree views of the city, combining cutting-edge design with Sri Lankan architectural inspiration."
            />
          </div>
        </div>
      </section>

      {/* ==================== 5. COLOMBO BLOG CONTENT ==================== */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="prose prose-stone prose-lg max-w-none blog-content font-light text-stone-600 leading-relaxed">
          <h2>The Heartbeat of the Island: Discovering Colombo</h2>
          <p>
            Often dismissed as merely a transit point, <strong>Colombo</strong> is an essential piece of the Sri Lankan puzzle. It's a city where the island's many cultures, religions, and histories converge into a vibrant, chaotic, and utterly charming mosaic. From the red dirt of the bustling Pettah market to the polished floors of colonial boutique hotels, Colombo is a city of delightful contradictions.
          </p>

          <img src="/pagesPhotos/colombo/galleface.png" alt="Sunset at Galle Face Green" />

          <h3>A Stroll Through Fort and Pettah</h3>
          <p>
            The chronological layers of Colombo are best explored on foot. Start in the <strong>Fort district</strong>, the historical center defined by grand Portuguese, Dutch, and British colonial architecture. Walking past the stoic Old Parliament Building or the red-brick facade of the Cargills main store feels like stepping onto a 19th-century movie set.
          </p>
          <p>
            As you cross over into <strong>Pettah</strong>, the energy shifts instantly. This is the commercial vein of the city. Narrow streets are organized by trade—one street dedicated entirely to fabrics, another to gold jewelry, and others to aromatic spices. The air is thick with the scent of cinnamon and the sounds of merchants negotiating deals. Don't miss the striking red-and-white candy-striped exterior of the Jami Ul-Alfar Mosque standing proudly amid the chaos.
          </p>

          <blockquote>
            "Colombo doesn't politely introduce itself; it overwhelms your senses in the best possible way, demanding you experience it rather than just observe it."
          </blockquote>

          <h3>The Culinary Capital</h3>
          <p>
            If you leave Colombo without indulging in its street food, you haven't truly visited. As the sun sets, head to <strong>Galle Face Green</strong>. This vast oceanfront promenade is flanked by luxury hotels on one side and crashing waves on the other. Dozens of food carts light up, offering everything from crispy <em>isso vadai</em> (lentil and prawn fritters) to the iconic Sri Lankan <em>kottu roti</em>, prepared with rhythmic, musical chopping on hot iron griddles.
          </p>
          <p>
            Beyond street food, Colombo boasts a rapidly evolving dining scene. Hidden behind unsassuming walls in leafy Colombo 7 (Cinnamon Gardens), you'll find chic cafes housed in restored heritage villas, offering world-class coffees featuring Ceylon's finest beans.
          </p>

          <h3>Essential Tips for Your Visit</h3>
          <ul>
            <li><strong>Sunset Drinks:</strong> For the best views of the Indian Ocean, grab a drink at one of the rooftop bars in the city, or opt for classic colonial elegance at the Galle Face Hotel's historic terrace.</li>
            <li><strong>Getting Around:</strong> Three-wheelers (tuk-tuks) are the lifeblood of Colombo transport. Always ensure they use the meter, or use local ride-hailing apps like PickMe for hassle-free travel.</li>
            <li><strong>Oasis in the City:</strong> Need a break from the noise? Viharamahadevi Park offers a lush green escape right in the city center, complete with giant bats sleeping in the canopy and a stunning golden Buddha statue.</li>
          </ul>

          <p>
            Take the time to peel back the layers of this coastal metropolis. You'll find that the true magic of Colombo lies not in its monuments, but in the irrepressible energy of its people and its streets.
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

export default ColomboPage;
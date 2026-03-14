import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, MapPin, Compass, Star, ArrowDown, Clock, Mountain, ChevronRight, Train, Leaf } from 'lucide-react';

const EllaPage = () => {
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
            src="https://res.cloudinary.com/dicvgtusz/image/upload/f_auto,q_auto,w_1920,c_limit/v1772084175/demodara-nine-arch-bridge-ella-sri-lanka.jpg_1_1_2_urimmw.jpg"
            alt="Nine Arch Bridge Ella"
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
                The Hill Country Gem
              </span>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-white leading-[0.9] tracking-tighter mb-6">
                El<span className="text-yellow-500 italic">la</span>
              </h1>
              <p className="text-lg md:text-xl text-stone-200 font-light max-w-2xl leading-relaxed border-l-2 border-yellow-500 pl-6">
                Where mist-kissed mountains meet endless tea estates. A paradise suspended between earth and sky, where every sunrise paints a new masterpiece.
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
            { label: "Elevation", value: "1,041 meters", icon: Mountain },
            { label: "Climate", value: "Cool & Misty", icon: Leaf },
            { label: "Famous For", value: "Nine Arch Bridge", icon: Train },
            { label: "Location", value: "Badulla District", icon: MapPin },
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
            PEAKS
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
                <div className="absolute top-[75%] left-[48%] translate-x-[-50%] translate-y-[-50%]">
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
                  <span className="text-yellow-600 text-xs font-bold uppercase tracking-widest">Nature's Sanctuary</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-serif text-stone-900 leading-tight mb-6">
                  Where Clouds Touch <br /><span className="italic text-stone-400">Mountain Tops.</span>
                </h2>
                <div className="space-y-4 text-stone-600 font-light leading-relaxed">
                  <p>
                    Nestled in the heart of Sri Lanka's hill country, Ella is a small town with a big personality. Surrounded by rolling green hills dotted with tea plantations, it offers some of the most breathtaking views on the island.
                  </p>
                  <p>
                    From hiking Little Adam's Peak to catching the sunrise at Ella Rock, every corner reveals nature's artistry. The iconic Nine Arch Bridge stands as a testament to colonial engineering amidst lush jungle.
                  </p>
                </div>
                <div className="mt-8 pt-8 border-t border-stone-100 flex items-center gap-4">
                  <div className="bg-yellow-50 p-3 rounded-full text-yellow-600">
                    <Compass size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-stone-400">Travel Distance</p>
                    <p className="font-serif text-lg text-stone-800">200 km from Colombo</p>
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
              <span className="text-yellow-600 font-bold uppercase tracking-widest text-xs mb-3 block">Adventure Awaits</span>
              <h2 className="text-4xl md:text-6xl font-serif text-stone-900">Natural Wonders</h2>
            </div>
            {/* <div className="flex gap-2">
                <button className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-900 hover:text-white transition-all"><ArrowRight className="rotate-180" size={18}/></button>
                <button className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-900 hover:text-white transition-all"><ArrowRight size={18}/></button>
            </div> */}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ExperienceCard
              img="/pagesPhotos/ella/ninearch.png"
              title="Nine Arch Bridge"
              subtitle="Colonial Marvel"
              desc="An architectural masterpiece built entirely of stone and brick during British colonial times, surrounded by verdant forest and tea plantations."
            />
            <ExperienceCard
              img="/pagesPhotos/ella/littleadamspeak.png"
              title="Little Adam's Peak"
              subtitle="Scenic Hike"
              desc="An easy yet rewarding trek offering panoramic views of Ella Gap and the surrounding mountains, perfect for sunrise or sunset."
            />
            <ExperienceCard
              img="/pagesPhotos/ella/ravanafalls.png"
              title="Ravana Falls"
              subtitle="Cascading Beauty"
              desc="A stunning waterfall that flows year-round, named after the legendary King Ravana from the ancient Indian epic Ramayana."
            />
          </div>
        </div>
      </section>

      {/* ==================== 5. ELLA BLOG CONTENT ==================== */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="prose prose-stone prose-lg max-w-none blog-content font-light text-stone-600 leading-relaxed">
          <h2>Up in the Clouds: The Magic of Ella</h2>
          <p>
            There is a very specific type of air in <strong>Ella</strong>. It’s crisp, cool, and carries the faint, sweet scent of Ceylon tea. Nestled high in the central highlands of Sri Lanka, this small mountain town has captured the hearts of travelers worldwide, evolving from a sleepy village into the island's premier eco-tourism hub.
          </p>

          <img src="/pagesPhotos/ella/ninearch.png" alt="Train crossing the Nine Arch Bridge" />

          <h3>The Golden Hour at the Nine Arch Bridge</h3>
          <p>
            Perhaps no image is more synonymous with the Sri Lankan hill country than the <strong>Nine Arch Bridge</strong> (Demodara). Commissioned under the British but constructed entirely by local builders using only stone, brick, and cement (without a single piece of steel), it stands as a colossal architectural triumph amidst the dense jungle.
          </p>
          <p>
            The true magic happens just after dawn. As the morning mist begins to lift from the tea bushes, the whistle of the iconic blue train echoes through the valley. Watching the train slowly curve over the bridge while the rising sun paints the stone arches in shades of gold is an experience that borders on cinematic.
          </p>

          <blockquote>
            "Ella doesn't ask you to rush. It invites you to sit, sip a cup of world-class tea, and watch the clouds roll through the mountain gaps."
          </blockquote>

          <h3>Trails and Tales</h3>
          <p>
            Ella is a hiker’s paradise, offering trails that reward every level of effort. For a breathtaking yet accessible trek, <strong>Little Adam’s Peak</strong> is ideal. The path meanders through working tea estates before ascending to a ridge that offers panoramic 360-degree views of the Ella Gap—a dramatic cleft in the mountains that allows you to see all the way to the southern plains on a clear day.
          </p>
          <p>
            For the more adventurous, the hike up <strong>Ella Rock</strong> is a rite of passage. It requires navigating along the active railway tracks (a thrillingly common practice in Sri Lanka) before a steep climb through eucalyptus forests. The summit provides a dramatic, plunging view of the valley below.
          </p>

          <h3>Essential Tips for Your Visit</h3>
          <ul>
            <li><strong>The Train Journey:</strong> The train ride from Kandy to Ella is frequently described as the most scenic in the world. Book tickets well in advance, and try to get a seat on the right side of the train for the best views.</li>
            <li><strong>Weather:</strong> The weather in the mountains is notoriously unpredictable. Always carry a light rain jacket, even if the morning starts off bright and sunny.</li>
            <li><strong>Local Flavors:</strong> After a long hike, refuel with a traditional Sri Lankan rice and curry at one of the family-run <em>mateys</em> (small cafes) in town. The highland vegetables here are extraordinarily fresh.</li>
          </ul>

          <p>
            Ella is the kind of place where days effortlessly slip into weeks. Between the cascading waterfalls, the emerald tea fields, and the incredibly laid-back atmosphere, it remains the undisputed crown jewel of Sri Lanka's high country.
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

export default EllaPage;
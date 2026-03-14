import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, MapPin, Compass, Star, ArrowDown, Clock, Castle, ChevronRight, Crown, Mountain } from 'lucide-react';

const SigiriyaPage = () => {
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
            src="https://res.cloudinary.com/dicvgtusz/image/upload/f_auto,q_auto,w_1920,c_limit/v1772098597/sigiriya-lion-rock-ancient-rock-fortress-dambulla-central-province-sri-lanka_1_ubrc3t.jpg"
            alt="Sigiriya Lion Rock Fortress"
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

        {/* Hero Content - Bottom Aligned & Modern */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-16 z-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">

            {/* Title Block */}
            <div className="lg:col-span-8 animate-slide-up">
              <span className="inline-block px-3 py-1 mb-4 border border-white/30 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase text-white backdrop-blur-md">
                The Lion Rock Fortress
              </span>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-white leading-[0.9] tracking-tighter mb-6">
                Sigiri<span className="text-yellow-500 italic">ya</span>
              </h1>
              <p className="text-lg md:text-xl text-stone-200 font-light max-w-2xl leading-relaxed border-l-2 border-yellow-500 pl-6">
                An ancient palace built atop a 200-meter rock. Where ambition met the sky, and a king's vision became an eternal marvel of human achievement.
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
            { label: "Built", value: "5th Century AD", icon: Clock },
            { label: "Height", value: "200 meters", icon: Mountain },
            { label: "Status", value: "UNESCO Site", icon: Star },
            { label: "Location", value: "Matale District", icon: MapPin },
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
            FORTRESS
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
                <div className="absolute top-[42%] left-[45%] translate-x-[-50%] translate-y-[-50%]">
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
                  <span className="text-yellow-600 text-xs font-bold uppercase tracking-widest">The Sky Palace</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-serif text-stone-900 leading-tight mb-6">
                  Where Kings Ruled <br /><span className="italic text-stone-400">From the Clouds.</span>
                </h2>
                <div className="space-y-4 text-stone-600 font-light leading-relaxed">
                  <p>
                    Built by King Kashyapa in the 5th century, Sigiriya is a remarkable fusion of nature and human ingenuity. This towering rock fortress served as both a royal citadel and a monastery.
                  </p>
                  <p>
                    The site features ancient frescoes, the famous Mirror Wall covered in ancient graffiti, and sophisticated water gardens that still function today. It stands as one of the best-preserved examples of ancient urban planning.
                  </p>
                </div>
                <div className="mt-8 pt-8 border-t border-stone-100 flex items-center gap-4">
                  <div className="bg-yellow-50 p-3 rounded-full text-yellow-600">
                    <Compass size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-stone-400">Travel Distance</p>
                    <p className="font-serif text-lg text-stone-800">169 km from Colombo</p>
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
              <span className="text-yellow-600 font-bold uppercase tracking-widest text-xs mb-3 block">Explore The Wonder</span>
              <h2 className="text-4xl md:text-6xl font-serif text-stone-900">Ancient Marvels</h2>
            </div>
            {/* <div className="flex gap-2">
                <button className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-900 hover:text-white transition-all"><ArrowRight className="rotate-180" size={18}/></button>
                <button className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-900 hover:text-white transition-all"><ArrowRight size={18}/></button>
            </div> */}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ExperienceCard
              img="/pagesPhotos/sigiriya/frescoes.png"
              title="Sigiriya Frescoes"
              subtitle="Ancient Art"
              desc="Marvel at the 5th-century paintings of celestial maidens on the rock face, showcasing the artistic mastery of ancient Sri Lankan civilization."
            />
            <ExperienceCard
              img="/pagesPhotos/sigiriya/mirrorwall.png"
              title="Mirror Wall"
              subtitle="Historical Graffiti"
              desc="Walk alongside the polished wall that once gleamed like a mirror, now adorned with centuries-old poetry and inscriptions from ancient visitors."
            />
            <ExperienceCard
              img="/pagesPhotos/sigiriya/watergardens.png"
              title="Water Gardens"
              subtitle="Ancient Engineering"
              desc="Explore the sophisticated hydraulic systems and geometric water gardens that demonstrate advanced 5th-century engineering and urban planning."
            />
          </div>
        </div>
      </section>

      {/* ==================== 5. SIGIRIYA BLOG CONTENT ==================== */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="prose prose-stone prose-lg max-w-none blog-content font-light text-stone-600 leading-relaxed">
          <h2>The Eighth Wonder of the World: Ascending Sigiriya</h2>
          <p>
            Rising abruptly and dramatically from the flat plains of Sri Lanka’s dry zone, <strong>Sigiriya</strong> (Lion Rock) is a sight that defies logic. How, in the 5th century AD, did an ambitious king construct a sprawling palace, complete with sophisticated water gardens and exquisite frescoes, atop a sheer 200-meter column of rock?
          </p>

          <img src="/pagesPhotos/sigiriya/frescoes.png" alt="The Sigiriya Maidens Frescoes" />

          <h3>A Story of Betrayal and Brilliance</h3>
          <p>
            The history of Sigiriya is as dramatic as its geology. It was built by King Kashyapa, who seized the throne by burying his father alive and driving his brother into exile. Deeply fearful of his brother's eventual return, Kashyapa relocated the capital and built his impregnable "sky palace" atop this massive monolith.
          </p>
          <p>
            Despite his paranoia, Kashyapa was a man of profound artistic vision. The climb begins through the meticulously symmetrical <strong>Water Gardens</strong>, showcasing an understanding of hydraulic engineering that continues to baffle modern scientists. The fountains here still work during the rainy season, driven by ancient underground channels.
          </p>

          <blockquote>
            "Sigiriya is the ultimate monument to human ambition—a place where architectural genius and intense paranoia collided to create unparalleled beauty."
          </blockquote>

          <h3>The Mirror Wall and the Maidens</h3>
          <p>
            Halfway up the rock face, a spiral staircase leads to a sheltered cave housing the world-famous <strong>Sigiriya Frescoes</strong>. Once covering the entire western face of the rock, these vivid paintings of celestial maidens (or perhaps Kashyapa’s concubines) offer a breathtaking glimpse into ancient Sinhalese artistry.
          </p>
          <p>
            Just beyond the frescoes lies the <strong>Mirror Wall</strong>. Originally coated in a glaze so highly polished that the king could see his reflection, it is now covered in ancient graffiti. Visitors from the 6th to 14th centuries left poems expressing their awe at the maidens and the palace, creating one of the world's oldest surviving guestbooks.
          </p>

          <h3>Essential Tips for Your Visit</h3>
          <ul>
            <li><strong>Beat the Heat:</strong> The climb involves about 1,200 steps and there is virtually no shade on the summit. Arrive right when the gates open at 7:00 AM, or go late in the afternoon (around 3:30 PM).</li>
            <li><strong>The Lion Paws:</strong> The final ascent begins at a mid-level terrace guarded by two massive stone lion paws—the only remnants of what was once a gigantic brick lion head through which visitors had to walk.</li>
            <li><strong>Pidurangala Rock:</strong> For the best view <em>of</em> Sigiriya itself, hike the neighboring Pidurangala Rock for sunrise. It’s cheaper, less crowded, and offers a stunning vantage point of the fortress blending into the jungle.</li>
          </ul>

          <p>
            Standing on the terraced summit where Kashyapa once ruled, with 360-degree views of the emerald jungle stretching to the horizon, one must admit: the usurper king certainly knew how to build a legacy.
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

export default SigiriyaPage;
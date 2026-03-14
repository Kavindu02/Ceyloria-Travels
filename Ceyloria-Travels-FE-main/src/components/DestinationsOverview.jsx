import React from "react";
import { ArrowRight, MapPin } from "lucide-react";
import { safeParseJSON } from "../utils/jsonParser.js";

// ---------------------- REUSABLE ANIMATION COMPONENT ----------------------
const Reveal = ({ children, className = "", delay = 0, direction = "up" }) => {
  const [isVisible, setVisible] = React.useState(false);
  const domRef = React.useRef();

  React.useEffect(() => {
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
      if (direction === "up") return "translate-y-20 opacity-0";
      if (direction === "left") return "-translate-x-20 opacity-0";
      if (direction === "right") return "translate-x-20 opacity-0";
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

const DestinationsOverview = ({ categoryData, onSelectCategory }) => {
  const fontHead = "font-['Playfair_Display',_serif]";

  return (
    <div className="bg-[#faf9f6] overflow-hidden">
      {/* --- HERO SECTION --- */}
      <div className="relative h-[65vh] md:h-[75vh] w-full bg-black overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://res.cloudinary.com/dicvgtusz/image/upload/f_webp,q_auto:low/v1772526131/high-angle-view-woman-mountain-against-sky_xln5zm.jpg"
            alt="Sri Lanka Destinations"
            className="w-full h-full object-cover animate-subtle-zoom opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        </div>

        <div className="relative z-20 container mx-auto px-6 text-center">
          <Reveal direction="up">
            <span className="text-cyan-400 font-bold tracking-[0.4em] uppercase text-xs block mb-6 px-1">Discover Paradise</span>
            <h1 className={`${fontHead} text-5xl md:text-7xl lg:text-8xl text-white leading-tight mb-8 drop-shadow-2xl`}>
              Island <br /> <span className="italic text-cyan-200">Wonders</span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed">
              From misty mountains to golden shores, explore the most iconic experiences across the pearl of the Indian Ocean.
            </p>
          </Reveal>
        </div>
      </div>

      {/* --- CATEGORY OVERVIEW VIEW --- */}
      <section className="relative py-24 px-6 md:px-12 lg:px-24">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#c8007b]/5 rounded-full blur-[100px] -z-10" />

        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-20">
              <span className="text-[#c8007b] font-bold tracking-[0.3em] uppercase text-xs block mb-4">( OUR COLLECTIONS )</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
                Select Your Journey.
              </h2>
              <div className="w-20 h-1 bg-[#c8007b] mx-auto rounded-full" />
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {categoryData.map((cat, i) => (
              <Reveal key={cat.id} delay={i * 100} direction="up">
                <div
                  className="group relative bg-white rounded-[40px] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-700 border border-gray-200 flex flex-col h-[520px] cursor-pointer"
                  onClick={() => onSelectCategory(cat)}
                >
                  {/* --- Image Section --- */}
                  <div className="relative h-2/3 overflow-hidden bg-gray-100">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out"
                    />

                    {/* Floating Badge */}
                    <div className="absolute bottom-6 left-6 z-20">
                      <div className="bg-white/10 backdrop-blur-md text-white text-[10px] font-bold px-4 py-2 rounded-full flex items-center gap-2 border border-white/20 uppercase tracking-widest">
                        <MapPin size={12} className="text-cyan-400" />
                        {(safeParseJSON(cat.destinations) || []).length} Locations
                      </div>
                    </div>
                  </div>

                  {/* --- Content Section --- */}
                  <div className="p-10 flex flex-col flex-grow relative bg-white">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#c8007b] transition-colors duration-300">
                      {cat.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-8 font-light">
                      {cat.tagline}
                    </p>

                    {/* --- Footer Section --- */}
                    <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
                        View Collection
                      </span>
                      <div className="w-12 h-12 bg-neutral-900 text-white rounded-full flex items-center justify-center group-hover:bg-[#c8007b] group-hover:scale-110 transition-all duration-500 shadow-lg">
                        <ArrowRight size={20} />
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>



    </div>
  );
};

export default DestinationsOverview;

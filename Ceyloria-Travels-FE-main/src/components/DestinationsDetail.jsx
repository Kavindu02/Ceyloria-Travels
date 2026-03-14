import React from "react";
import { ChevronLeft, MapPin, Compass, ArrowRight } from "lucide-react";
import { safeParseJSON } from "../utils/jsonParser.js";
import DestinationContactForm from "./DestinationContactForm.jsx";

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

const DestinationsDetail = ({ selectedCategory, onBack }) => {
  const fontHead = "font-['Playfair_Display',_serif]";

  return (
    <div className="bg-[#faf9f6] min-h-screen">
      {/* --- IMMERSIVE HERO SECTION --- */}
      <div className="relative h-[70vh] w-full bg-black overflow-hidden flex items-center">
        <div className="absolute inset-0">
          <img
            src={selectedCategory.image}
            alt={selectedCategory.title}
            className="w-full h-full object-cover animate-subtle-zoom opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        </div>

        <div className="relative z-20 container mx-auto px-6 md:px-12 lg:px-24">
          <Reveal direction="up">
            <button
              onClick={onBack}
              className="group flex items-center gap-3 text-white/70 hover:text-white transition-all mb-12 uppercase tracking-[0.2em] text-xs font-bold"
            >
              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white transition-all">
                <ChevronLeft size={16} />
              </div>
              Back to Overview
            </button>

            <div className="max-w-4xl space-y-6">
              <h1 className={`${fontHead} text-5xl md:text-7xl lg:text-8xl text-white tracking-tight leading-none drop-shadow-2xl`}>
                {selectedCategory.title}
              </h1>
              <p className="text-xl md:text-2xl text-cyan-400 font-light italic border-l-4 border-[#c8007b] pl-6 max-w-2xl">
                {selectedCategory.tagline}
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      {/* --- SHOWCASE / TRAVEL GUIDE LAYOUT --- */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#faf9f6] relative">
        {/* Decorative background element */}
        <div className="absolute top-[20%] left-0 w-[400px] h-[400px] bg-[#c8007b]/5 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-[20%] right-0 w-[400px] h-[400px] bg-cyan-400/5 rounded-full blur-[100px] -z-10" />

        <div className="max-w-7xl mx-auto space-y-32 md:space-y-48">
          {(safeParseJSON(selectedCategory.destinations) || []).map((dest, index) => (
            <div
              key={dest.id}
              className={`flex flex-col lg:flex-row items-center gap-16 lg:gap-24 ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
            >
              {/* Image Side */}
              <Reveal direction={index % 2 === 0 ? "left" : "right"} className="w-full lg:w-1/2">
                <div className="relative group">
                  {/* Image Container with Overflow Hidden */}
                  <div className="relative aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl transition-all duration-700 hover:shadow-[#c8007b]/10">
                    <img
                      src={dest.image}
                      alt={dest.title}
                      className="h-full w-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:opacity-0 transition-opacity duration-700" />
                  </div>

                </div>
              </Reveal>

              {/* Content Side */}
              <div className="w-full lg:w-1/2 space-y-8">
                <Reveal direction={index % 2 === 0 ? "right" : "left"} delay={200}>
                  <div className="space-y-4">
                    <span className="inline-block px-4 py-1 rounded-full bg-[#c8007b]/10 text-[#c8007b] text-[10px] font-black uppercase tracking-[0.3em]">
                      Must Visit
                    </span>
                    <h2 className={`${fontHead} text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight`}>
                      {dest.title}
                    </h2>
                    <div className="h-1.5 w-24 bg-[#c8007b] rounded-full" />
                  </div>

                  <p className="text-lg md:text-xl text-gray-500 leading-relaxed font-light py-4">
                    {dest.description}
                  </p>

                  <div className="flex flex-wrap gap-8 pt-8 text-gray-400 font-bold text-xs border-t border-gray-100 mt-8 tracking-[0.1em] uppercase">
                    <div className="flex items-center gap-3 group/item">
                      <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center text-[#c8007b] group-hover/item:bg-[#c8007b] group-hover/item:text-white transition-all">
                        <Compass size={16} />
                      </div>
                      <span>Scenic Views</span>
                    </div>
                    <div className="flex items-center gap-3 group/item">
                      <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center text-[#c8007b] group-hover/item:bg-[#c8007b] group-hover/item:text-white transition-all">
                        <MapPin size={16} />
                      </div>
                      <span>Top Location</span>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- CONTACT FORM SECTION --- */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#faf9f6]">
        <div className="max-w-7xl mx-auto">
          <DestinationContactForm availableDestinations={safeParseJSON(selectedCategory.destinations) || []} />
        </div>
      </section>
    </div>
  );
};

export default DestinationsDetail;

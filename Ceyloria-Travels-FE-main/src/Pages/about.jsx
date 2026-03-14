import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, Target, Globe, Award, ShieldCheck, Heart, Smile, Clock, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

// ---------------------- FONTS & GLOBAL STYLES ----------------------
const fontHead = "font-['Playfair_Display',_serif]";
const fontBody = "font-['DM_Sans',_sans-serif]";

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

const About = () => {
  return (
    <div className={`bg-white text-gray-900 ${fontBody} selection:bg-blue-600 selection:text-white overflow-x-hidden`}>

      {/* ---------------------- 1. HERO SECTION (Dark & Bold) ---------------------- */}
      <section className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden bg-black flex items-center justify-center">
        {/* Background Image with Parallax-like Zoom */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://res.cloudinary.com/dicvgtusz/image/upload/q_auto,f_webp/v1772084172/beautiful-white-lighthouse-fort-galle-sri-lanka.jpg_1_1_awg0e3.jpg"
            alt="About Ceyloria"
            className="w-full h-full object-cover opacity-60 animate-subtle-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        </div>

        <div className="relative z-20 container mx-auto px-6 text-center">
          <Reveal direction="up">
            <span className="text-cyan-400 font-bold tracking-[0.4em] uppercase text-xs block mb-6 animate-fade-in-up">The Ceyloria Story</span>
            <h1 className={`${fontHead} text-5xl md:text-7xl lg:text-8xl text-white leading-tight mb-8 drop-shadow-2xl`}>
              We Create <br /> <span className="italic text-cyan-200">Extraordinary</span> Journeys
            </h1>
            <p className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed">
              Unveiling the hidden soul of Sri Lanka through personalized travel experiences that stay with you forever.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------------- 2. OUR STORY (Asymmetrical Image Layout) ---------------------- */}
      <section className="py-24 lg:py-32 px-6 md:px-12 lg:px-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

            {/* Left Side: Images (Mirroring the "About Us" on Homepage) */}
            <Reveal direction="left" className="w-full lg:w-1/2">
              <div className="relative w-full aspect-square flex items-center justify-center">
                {/* Main Pill Image */}
                <div className="w-[85%] h-[95%] rounded-[200px] overflow-hidden relative z-10 mr-auto border border-gray-100 group shadow-lg">
                  <img
                    src="https://res.cloudinary.com/dicvgtusz/image/upload/q_auto,f_webp/v1772084175/55_zt76hl.jpg"
                    alt="Travelers in Sri Lanka"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                </div>

                {/* Overlapping Floating Element */}
                <div className="absolute -bottom-6 -right-4 lg:-right-8 w-[50%] aspect-[4/5] rounded-[30px] overflow-hidden border-[8px] border-white bg-gray-100 z-20 shadow-2xl group">
                  <img
                    src="https://res.cloudinary.com/dicvgtusz/image/upload/q_auto,f_webp/v1772084174/sarmat-batagov-cuZbrYoimv8-unsplash_cnarh7.jpg"
                    alt="Sri Lanka Nature"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                </div>

                {/* Floating Experience Badge (Animated) */}
                <div className="absolute top-12 -left-6 bg-[#1f1f1f] text-white p-6 rounded-full shadow-xl z-30 animate-floating flex flex-col items-center justify-center w-32 h-32">
                  <span className="text-3xl font-black mb-1">25+</span>
                  <span className="text-[10px] uppercase font-bold text-center leading-tight">Years Of<br />Excellence</span>
                </div>
              </div>
            </Reveal>

            {/* Right Side: Narrative */}
            <div className="w-full lg:w-1/2">
              <Reveal direction="right" delay={200}>
                <span className="text-[#c8007b] font-bold tracking-[0.3em] uppercase text-xs block mb-6 px-1">( WHO WE ARE )</span>
                <h2 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-gray-900 mb-8 leading-[1.1] tracking-tight">
                  Crafting Memories <br /> <span className="font-light italic text-gray-500">Since Day One</span>
                </h2>
                <div className="space-y-6">
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Ceyloria is a trusted travel company based in Sri Lanka, dedicated to providing unforgettable travel experiences. We specialize in well-planned, comfortable, and personalized travel solutions that allow our clients to explore the true beauty of Sri Lanka with ease and confidence.
                  </p>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    From carefully curated tour packages to reliable accommodation, transportation, and guided services, we ensure every journey is smooth, safe, and memorable.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8 mt-12 pt-12 border-t border-gray-100">
                  <div>
                    <h4 className="text-4xl font-light text-gray-900 mb-1">100%</h4>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Local Expertise</p>
                  </div>
                  <div>
                    <h4 className="text-4xl font-light text-gray-900 mb-1">5k+</h4>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Happy Travelers</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------- 3. MISSION & VISION (Modern Minimalist Cards) ---------------------- */}
      <section className="py-24 bg-gray-50/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-24 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12">

            {/* Mission */}
            <Reveal direction="up" className="flex-1">
              <div className="bg-white p-12 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-[100px] -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-110 z-0" />
                <div className="relative z-10">
                  <div className="bg-white w-20 h-20 rounded-2xl flex items-center justify-center mb-10 shadow-lg shadow-purple-900/5 text-[#c8007b]">
                    <Target size={40} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    To provide high-quality, reliable, and customized travel services that exceed customer expectations while showcasing the rich culture, natural beauty, and unique experiences Sri Lanka has to offer.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Vision */}
            <Reveal direction="up" delay={200} className="flex-1">
              <div className="bg-[#1f1f1f] p-12 rounded-[40px] shadow-2xl hover:shadow-cyan-900/20 transition-all duration-500 group relative overflow-hidden h-full text-white">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[100px] -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-110 z-0" />
                <div className="relative z-10">
                  <div className="bg-white/10 backdrop-blur-md w-20 h-20 rounded-2xl flex items-center justify-center mb-10 text-cyan-400">
                    <Globe size={40} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-3xl font-bold mb-6">Our Vision</h3>
                  <p className="text-neutral-400 leading-relaxed text-lg">
                    To become a leading travel brand in Sri Lanka, recognized for excellence, affordability, and outstanding customer service, while building long-lasting relationships with travelers globally.
                  </p>
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ---------------------- 4. WHY CHOOSE CEYLORIA (Features) ---------------------- */}
      <section className="py-24 lg:py-32 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-16 md:mb-24">
              <span className="text-gray-900 font-bold tracking-[0.3em] uppercase text-xs block mb-4">( WHY CHOOSE CEYLORIA )</span>
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 mb-8 tracking-tight">
                Setting the <br /> Standard for Excellence.
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            {/* 1. Customized Packages - Large Feature Primary Card */}
            <Reveal direction="up" className="lg:col-span-3 lg:row-span-2">
              <div className="h-full bg-[#1f1f1f] text-white p-10 rounded-[40px] flex flex-col justify-between group overflow-hidden relative shadow-xl hover:shadow-2xl transition-all duration-500">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#c8007b]/10 rounded-full -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-125" />
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 text-[#c8007b]">
                    <Heart size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-3xl font-bold mb-6">Customized <br />Packages</h3>
                  <p className="text-neutral-400 text-lg leading-relaxed max-w-xs">
                    Tailored tour packages designed specifically to match your needs and travel style. We believe every traveler is unique.
                  </p>
                </div>
                <div className="relative z-10 mt-12 flex items-center gap-2 text-cyan-400 font-bold text-sm tracking-widest uppercase opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  Read More <ArrowRight size={16} />
                </div>
              </div>
            </Reveal>

            {/* 2. Transparent Pricing */}
            <Reveal direction="up" delay={100} className="lg:col-span-3">
              <div className="bg-neutral-50 p-8 rounded-[40px] border border-gray-100 flex flex-col md:flex-row gap-6 items-center group hover:bg-white hover:shadow-xl transition-all duration-500">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gray-900 shadow-sm border border-gray-100 group-hover:bg-[#c8007b] group-hover:text-white transition-all duration-500 flex-shrink-0">
                  <ShieldCheck size={28} strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Transparent Pricing</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Affordable rates with zero hidden costs. We value honesty above all.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* 3. Friendly Service */}
            <Reveal direction="up" delay={200} className="lg:col-span-3">
              <div className="bg-neutral-50 p-8 rounded-[40px] border border-gray-100 flex flex-col md:flex-row gap-6 items-center group hover:bg-white hover:shadow-xl transition-all duration-500">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gray-900 shadow-sm border border-gray-100 group-hover:bg-[#c8007b] group-hover:text-white transition-all duration-500 flex-shrink-0">
                  <Smile size={28} strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Friendly Service</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Professional and warm service that makes you feel at home.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* 4. Local Expertise */}
            <Reveal direction="up" delay={300} className="lg:col-span-2">
              <div className="bg-neutral-50 p-8 rounded-[40px] border border-gray-100 h-full group hover:bg-white hover:shadow-xl transition-all duration-500 text-center flex flex-col items-center">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-gray-900 mb-6 shadow-sm border border-gray-100 group-hover:bg-[#c8007b] group-hover:text-white transition-all duration-500">
                  <Globe size={24} strokeWidth={1.5} />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">Local Expertise</h4>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Strong local knowledge combined with international standards.
                </p>
              </div>
            </Reveal>

            {/* 5. 24/7 Support */}
            <Reveal direction="up" delay={400} className="lg:col-span-2">
              <div className="bg-neutral-50 p-8 rounded-[40px] border border-gray-100 h-full group hover:bg-white hover:shadow-xl transition-all duration-500 text-center flex flex-col items-center">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-gray-900 mb-6 shadow-sm border border-gray-100 group-hover:bg-[#c8007b] group-hover:text-white transition-all duration-500">
                  <Clock size={24} strokeWidth={1.5} />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">24/7 Support</h4>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Round-the-clock support throughout your journey.
                </p>
              </div>
            </Reveal>

            {/* 6. Trusted Guides */}
            <Reveal direction="up" delay={500} className="lg:col-span-2">
              <div className="bg-neutral-50 p-8 rounded-[40px] border border-gray-100 h-full group hover:bg-white hover:shadow-xl transition-all duration-500 text-center flex flex-col items-center">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-gray-900 mb-6 shadow-sm border border-gray-100 group-hover:bg-[#c8007b] group-hover:text-white transition-all duration-500">
                  <Award size={24} strokeWidth={1.5} />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">Trusted Guides</h4>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Expert guides who know every corner history of the island.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------------- 5. CLOSING CTA (Join the Adventure) ---------------------- */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-white">
        <Reveal>
          <div className="bg-[#1f1f1f] rounded-[60px] p-12 md:p-24 relative overflow-hidden min-h-[500px] flex items-center justify-center text-center">
            {/* Decorative Overlay Image */}
            <div className="absolute inset-0 z-0">
              <img src="https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1920&q=80" className="w-full h-full object-cover opacity-20" alt="CTA BG" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1f1f1f] via-transparent to-transparent opacity-80" />
            </div>

            <div className="relative z-10 max-w-3xl">
              <h2 className={`${fontHead} text-4xl md:text-6xl text-white mb-8 leading-tight`}>
                Your Island <span className="italic text-[#c8007b]">Odyssey</span> Begins with Confidence.
              </h2>
              <p className="text-neutral-400 text-lg md:text-xl mb-12 font-light leading-relaxed">
                Whether it's an adventure or a soul-searching retreat, let us guide you through the magic of Sri Lanka.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link to="/contact" className="bg-[#c8007b] text-white px-10 py-5 rounded-full font-bold transition-all hover:bg-black hover:scale-105 active:scale-95 flex items-center gap-3">
                  Contact Us <ArrowRight size={20} />
                </Link>
                <Link to="/destinations" className="text-white border-b border-white/30 pb-1 hover:border-cyan-400 hover:text-cyan-400 transition-all font-bold tracking-widest uppercase text-xs">
                  Explore Destinations
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>


    </div>
  );
};

export default About;

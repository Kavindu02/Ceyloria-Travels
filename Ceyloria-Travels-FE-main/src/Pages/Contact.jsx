import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Mail,
  Phone,
  Users,
  Globe,
  Plane,
  ChevronRight,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

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

// Styled Input Component
const PremiumInput = ({ type, name, placeholder, value, onChange, required = false, label, icon: Icon, min }) => (
  <div className="group relative">
    <label className="absolute -top-2.5 left-4 bg-[#faf9f6] px-2 text-[10px] font-bold text-[#c8007b] tracking-wider uppercase z-10 transition-all group-focus-within:text-[#c8007b]">
      {label} {required && <span className="text-[#c8007b]">*</span>}
    </label>
    <div className="relative overflow-hidden rounded-[20px] border border-gray-200 bg-white shadow-sm transition-all duration-300 focus-within:shadow-md focus-within:border-[#c8007b]/30">
      <div className="flex items-center">
        {Icon && (
          <div className="pl-5 text-gray-400 group-focus-within:text-[#c8007b] transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          min={min}
          className={`w-full bg-transparent px-5 py-4 text-gray-900 placeholder-gray-400 outline-none transition-all ${Icon ? 'pl-3' : ''} font-medium text-sm`}
        />
      </div>
    </div>
  </div>
);

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "", email: "", country: "", phone: "",
    adults: "0", kids: "0", infants: "0",
    arrivalDate: "", departureDate: "", message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const fontHead = "font-['Playfair_Display',_serif]";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Inquiry Sent Successfully!", {
          duration: 4000,
          position: "top-center",
          style: { background: "#c8007b", color: "#fff", fontWeight: "600", borderRadius: "100px", padding: '12px 24px' },
          iconTheme: { primary: '#fff', secondary: '#c8007b' }
        });

        setSubmitStatus({
          type: "success",
          message: "Inquiry Sent Successfully! We will contact you shortly.",
        });

        setFormData({
          name: "", email: "", country: "", phone: "",
          adults: "0", kids: "0", infants: "0",
          arrivalDate: "", departureDate: "", message: "",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send inquiry.");
      }
    } catch (error) {
      toast.error(`❌ ${error.message}`, {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#111",
          color: "#fff",
          fontWeight: "600",
          borderRadius: "0.75rem",
        },
      });

      setSubmitStatus({
        type: "error",
        message: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#faf9f6] selection:bg-[#c8007b] selection:text-white overflow-x-hidden min-h-screen">

      {/* --- HERO SECTION --- */}
      <div className="relative h-[65vh] md:h-[75vh] w-full bg-black overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://res.cloudinary.com/dicvgtusz/image/upload/v1773506700/view-hands-holding-smartphone_1_pw4cve.jpg"
            alt="Contact Ceyloria"
            className="w-full h-full object-cover scale-110 animate-subtle-zoom opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        </div>

        <div className="relative z-20 container mx-auto px-6 text-center">
          <Reveal direction="up">
            <span className="text-cyan-400 font-bold tracking-[0.4em] uppercase text-xs block mb-6 px-1">Connect With Us</span>
            <h1 className={`${fontHead} text-5xl md:text-7xl lg:text-8xl text-white leading-tight mb-8 drop-shadow-2xl`}>
              Design Your <br /> <span className="italic text-cyan-200">Destiny</span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed">
              Experience the untamed beauty of Sri Lanka with bespoke itineraries crafted specifically for your soul.
            </p>
          </Reveal>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <section className="relative py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">

            {/* --- LEFT: CONTACT INFO --- */}
            <div className="lg:col-span-4 space-y-10 lg:sticky lg:top-32">
              <Reveal direction="up">
                <div className="bg-[#0f172a] text-white p-12 rounded-[40px] shadow-2xl relative overflow-hidden group">
                  {/* Decorative blobs */}
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#c8007b]/20 rounded-full blur-[80px]" />
                  <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-400/10 rounded-full blur-[80px]" />

                  <div className="relative z-10">
                    <span className="text-cyan-400 font-bold tracking-widest text-[10px] uppercase mb-4 block">Official Support</span>
                    <h2 className={`${fontHead} text-3xl md:text-4xl mb-8`}>Reach Out.</h2>

                    <div className="space-y-8">
                      <div className="flex gap-6 group/item cursor-pointer">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover/item:bg-[#c8007b] group-hover/item:border-[#c8007b] transition-all duration-500">
                          <MapPin size={24} className="text-cyan-400 group-hover/item:text-white" />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Our Studio</p>
                          <p className="text-gray-200 group-hover/item:text-white transition-colors">Sri Mahinda Dharma MW,<br /> Colombo 09.</p>
                        </div>
                      </div>

                      <div className="flex gap-6 group/item cursor-pointer">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover/item:bg-[#c8007b] group-hover/item:border-[#c8007b] transition-all duration-500">
                          <Mail size={24} className="text-cyan-400 group-hover/item:text-white" />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Send a Message</p>
                          <p className="text-gray-200 group-hover/item:text-white transition-colors">sdksolutions01@gmail.com</p>
                        </div>
                      </div>

                      <div className="flex gap-6 group/item cursor-pointer">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover/item:bg-[#c8007b] group-hover/item:border-[#c8007b] transition-all duration-500">
                          <Phone size={24} className="text-cyan-400 group-hover/item:text-white" />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">24/7 Hotline</p>
                          <p className="text-gray-200 group-hover/item:text-white transition-colors">+94 742216579</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-16 pt-8 border-t border-white/10 flex items-center justify-between">
                      <div className="flex flex-col items-center">
                        <span className="text-2xl font-black text-cyan-400">24/7</span>
                        <span className="text-[8px] uppercase tracking-[0.3em] text-gray-500 mt-1">Ready</span>
                      </div>
                      <div className="h-8 w-[1px] bg-white/10" />
                      <div className="flex flex-col items-center">
                        <span className="text-2xl font-black text-[#c8007b]">100%</span>
                        <span className="text-[8px] uppercase tracking-[0.3em] text-gray-500 mt-1">Bespoke</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Mini Map */}
              <Reveal direction="up" delay={200}>
                <div className="h-64 rounded-[40px] overflow-hidden shadow-md border border-gray-200 group relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.8531201589485!2d80.8971553!3d7.370355000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae4a1f866a065d5%3A0x2a2b73cfba3781e2!2sDumbara%20attale(kalugala)!5e0!3m2!1sen!2slk!4v1773583650500!5m2!1sen!2slk"
                    className="w-full h-full transition-all duration-1000"
                    allowFullScreen
                    loading="lazy"
                    style={{ border: 0 }}
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="absolute inset-0 pointer-events-none border-[12px] border-white/10 rounded-[40px]" />
                </div>
              </Reveal>
            </div>

            {/* --- RIGHT: FORM --- */}
            <div className="lg:col-span-8">
              <Reveal direction="up">
                <div className="bg-white rounded-[40px] p-10 md:p-16 shadow-md border border-gray-200 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-[2s]">
                    <Plane size={240} className="-rotate-12" />
                  </div>

                  <div className="mb-14">
                    <span className="text-[#c8007b] font-bold tracking-[0.3em] uppercase text-[10px] block mb-4">( CONCIERGE SERVICE )</span>
                    <h2 className={`${fontHead} text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight`}>
                      Craft Your Story.
                    </h2>
                    <p className="text-gray-500 max-w-xl font-light leading-relaxed">
                      Share your vision with our island specialists. We will design an exclusive itinerary tailored to your most refined desires.
                    </p>
                  </div>

                  {submitStatus?.type === "success" ? (
                    <div className="bg-transparent py-10 flex items-center justify-center min-h-[500px]">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        className="max-w-md w-full bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100 p-12 text-center"
                      >
                        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-10">
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-green-100">
                            <CheckCircle className="w-10 h-10 text-green-500" strokeWidth={1.5} />
                          </div>
                        </div>
                        <h2 className={`${fontHead} text-4xl text-gray-900 mb-6 font-medium`}>Request Received!</h2>
                        <p className="text-gray-500 mb-12 leading-relaxed text-lg font-light">
                          Thank you for reaching out, <span className="font-semibold text-gray-800">{formData.name}</span>. Our travel experts are carefully reviewing your preferences and will craft the perfect itinerary for your requested journey. We'll be in touch with you shortly at <span className="font-medium text-[#c8007b]">{formData.email}</span>.
                        </p>
                        <Link to="/" className="inline-flex items-center justify-center w-full py-5 bg-[#1a1a1a] text-white font-bold rounded-full hover:bg-black transition-all duration-300 transform hover:scale-[1.02] shadow-xl shadow-gray-200">
                          Return to Home
                        </Link>
                      </motion.div>
                    </div>
                  ) : (
                    <>
                    {submitStatus?.type === 'error' && (
                      <div className="mb-10 p-5 rounded-2xl border bg-red-50/50 border-red-100 text-red-800 text-sm font-medium">
                        {submitStatus.message}
                      </div>
                    )}
                    
                    <form className="space-y-12" onSubmit={submitForm}>
                    {/* Phase 1: Identity */}
                    <div className="space-y-8">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#c8007b]/10 text-[#c8007b] flex items-center justify-center text-[10px] font-black underline underline-offset-4">01</div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">The Travelers Identity</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <PremiumInput name="name" label="Full Name" placeholder="e.g. Kasun Fernando" value={formData.name} onChange={handleChange} required />
                        <PremiumInput name="email" label="Email Address" type="email" placeholder="hello@ceyloria.com" value={formData.email} onChange={handleChange} icon={Mail} required />
                        <PremiumInput name="country" label="Your Residence" placeholder="e.g. United Kingdom" value={formData.country} onChange={handleChange} icon={Globe} required />
                        <PremiumInput name="phone" label="Quick Connectivity" placeholder="+94 77 123 4567" value={formData.phone} onChange={handleChange} icon={Phone} required />
                      </div>
                    </div>

                    {/* Phase 2: Logistics */}
                    <div className="space-y-8 pt-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#c8007b]/10 text-[#c8007b] flex items-center justify-center text-[10px] font-black underline underline-offset-4">02</div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Journey Logistics</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <PremiumInput name="arrivalDate" label="Island Arrival" type="date" value={formData.arrivalDate} onChange={handleChange} required />
                        <PremiumInput name="departureDate" label="Island Farewell" type="date" value={formData.departureDate} onChange={handleChange} required />
                      </div>

                      {/* Traveling Party */}
                      <div className="bg-[#faf9f6] rounded-[30px] p-8 border border-gray-100">
                        <div className="flex items-center gap-3 mb-8">
                          <Users size={16} className="text-[#c8007b]" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900">Your Traveling Party</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                          {['Adults', 'Kids', 'Infants'].map((type) => (
                            <div key={type} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center hover:border-[#c8007b]/30 transition-colors group/counter">
                              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-3">{type}</span>
                              <input
                                type="number"
                                name={type.toLowerCase()}
                                value={formData[type.toLowerCase()]}
                                onChange={handleChange}
                                min="0"
                                className="w-full text-center text-3xl font-black text-gray-900 outline-none bg-transparent"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Phase 3: The Vision */}
                    <div className="space-y-8 pt-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#c8007b]/10 text-[#c8007b] flex items-center justify-center text-[10px] font-black underline underline-offset-4">03</div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">The Island Vision</h4>
                      </div>
                      <div className="group relative">
                        <label className="absolute -top-2.5 left-4 bg-[#faf9f6]/0 px-2 text-[10px] font-bold text-[#c8007b] tracking-wider uppercase z-10">
                          Special Requests & Notes
                        </label>
                        <textarea
                          name="message"
                          rows="5"
                          placeholder="Tell us about your dream trip... favorite activities, food preferences, or specific things you MUST see."
                          value={formData.message}
                          onChange={handleChange}
                          className="w-full bg-[#faf9f6] rounded-[30px] border border-gray-200 p-8 text-gray-900 placeholder-gray-400 outline-none focus:bg-white focus:border-[#c8007b]/30 focus:shadow-md transition-all resize-none font-medium text-sm leading-relaxed"
                        />
                      </div>
                    </div>

                    {/* Submit Area */}
                    <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-gray-50">
                      <p className="text-[10px] text-gray-400 font-medium tracking-wide max-w-[200px] text-center md:text-left">
                        We respect your privacy. Our inquiry process is secure and spam-free.
                      </p>

                      <button
                        onClick={submitForm}
                        disabled={isSubmitting}
                        className="group relative overflow-hidden bg-black text-white pl-10 pr-6 py-5 rounded-full shadow-2xl hover:shadow-[#c8007b]/20 transition-all duration-500 disabled:opacity-50 w-full md:w-auto"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-4 font-bold tracking-widest uppercase text-xs">
                          {isSubmitting ? 'Dispatching...' : 'Initiate Design'}
                          <div className="bg-[#c8007b] p-2 rounded-full group-hover:translate-x-1.5 transition-transform duration-500">
                            <ChevronRight size={16} />
                          </div>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#c8007b] to-[#ff009d] opacity-0 group-hover:opacity-10 transition-opacity" />
                      </button>
                    </div>
                  </form>
                  </>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}

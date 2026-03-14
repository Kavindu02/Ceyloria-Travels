import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Mail, Phone, Users, Globe, ChevronRight, Plus, X } from 'lucide-react';

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
          type={type || "text"}
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

export default function DestinationContactForm({ availableDestinations }) {
  const [formData, setFormData] = useState({
    name: "", email: "", country: "", phone: "",
    adults: "0", kids: "0", infants: "0",
    arrivalDate: "", departureDate: "", message: "",
  });

  const [selectedDestinations, setSelectedDestinations] = useState([""]); // Start with 1 empty selection

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const fontHead = "font-['Playfair_Display',_serif]";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDestinationChange = (index, value) => {
    const newDestinations = [...selectedDestinations];
    newDestinations[index] = value;
    setSelectedDestinations(newDestinations);
  };

  const addDestinationSlot = () => {
    setSelectedDestinations([...selectedDestinations, ""]);
  };

  const removeDestinationSlot = (index) => {
    if (selectedDestinations.length > 1) {
      const newDestinations = [...selectedDestinations];
      newDestinations.splice(index, 1);
      setSelectedDestinations(newDestinations);
    } else {
      setSelectedDestinations([""]); // Just clear it if it's the last one
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Format final message to include destinations
    const destString = selectedDestinations.filter(d => d.trim()).join(", ");
    let finalMessage = formData.message || "";
    if (destString) {
      finalMessage += `\n\n--- Selected Destinations ---\n${destString}`;
    }

    const payload = { ...formData, message: finalMessage };

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/blogs/inquire`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("✅ Inquiry Sent Successfully!", {
          duration: 4000,
          position: "top-center",
          style: { background: "#c8007b", color: "#fff", fontWeight: "600", borderRadius: "0.75rem" }
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
        setSelectedDestinations([""]);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send inquiry.");
      }
    } catch (error) {
      toast.error(`❌ ${error.message}`, {
        duration: 4000,
        position: "top-center",
        style: { background: "#111", color: "#fff", fontWeight: "600", borderRadius: "0.75rem" }
      });

      setSubmitStatus({ type: "error", message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#faf9f6] rounded-[40px] p-8 md:p-14 shadow-lg border border-gray-100 relative mt-24 max-w-5xl mx-auto overflow-hidden">
      <Reveal direction="up">
        <div className="mb-14 text-center md:text-left">
          <span className="text-[#c8007b] font-bold tracking-[0.3em] uppercase text-[10px] block mb-4">
            ( DESTINATIONS INQUIRY )
          </span>
          <h2 className={`${fontHead} text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight`}>
            Start Your Journey.
          </h2>
          <p className="text-gray-500 max-w-xl font-light leading-relaxed mx-auto md:mx-0">
            Tell us about the destinations you wish to explore. Select your desired spots and customize your itinerary.
          </p>
        </div>

        {submitStatus && (
          <div className={`mb-10 p-5 rounded-2xl border ${submitStatus.type === 'success'
              ? 'bg-green-50/50 border-green-100 text-green-800'
              : 'bg-red-50/50 border-red-100 text-red-800'
            } text-sm font-medium`}>
            {submitStatus.message}
          </div>
        )}

        <form className="space-y-12" onSubmit={submitForm}>
          
          {/* Phase 1: Identity */}
          <div className="space-y-8 border-b border-gray-200 pb-12">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#c8007b]/10 text-[#c8007b] flex items-center justify-center text-[10px] font-black underline underline-offset-4">01</div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">The Travelers Identity</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <PremiumInput name="name" label="Full Name" placeholder="e.g. Kasun Fernando" value={formData.name} onChange={handleChange} required />
              <PremiumInput name="email" label="Email Address" type="email" placeholder="hello@ceyloria.com" value={formData.email} onChange={handleChange} icon={Mail} required />
              <PremiumInput name="country" label="Your Residence" placeholder="e.g. United Kingdom" value={formData.country} onChange={handleChange} icon={Globe} required />
              <PremiumInput name="phone" label="Quick Connectivity" placeholder="+94 77 123 4567" value={formData.phone} onChange={handleChange} icon={Phone} required />
            </div>
          </div>

          {/* New Phase: Destinations */}
          <div className="space-y-8 border-b border-gray-200 pb-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#c8007b]/10 text-[#c8007b] flex items-center justify-center text-[10px] font-black underline underline-offset-4">02</div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Destinations</h4>
              </div>
              <button
                type="button"
                onClick={addDestinationSlot}
                className="flex items-center gap-2 bg-[#c8007b]/10 hover:bg-[#c8007b]/20 text-[#c8007b] px-4 py-2 rounded-full font-bold text-xs tracking-wider transition-colors"
              >
                <Plus size={14} /> Add Spot
              </button>
            </div>
            
            <div className="flex flex-col gap-4">
              {selectedDestinations.map((dest, index) => (
                <div key={index} className="flex items-center gap-3 group relative">
                    <div className="relative overflow-hidden rounded-[20px] border border-gray-200 bg-white shadow-sm transition-all duration-300 focus-within:border-[#c8007b]/30 w-full flex-1">
                      <select 
                        className="w-full bg-transparent px-5 py-4 text-gray-900 outline-none appearance-none font-medium text-sm cursor-pointer"
                        value={dest}
                        onChange={(e) => handleDestinationChange(index, e.target.value)}
                      >
                        <option value="" disabled>-- Select a Destination --</option>
                        {availableDestinations?.map(opt => (
                           typeof opt === 'string' ? 
                            <option key={opt} value={opt}>{opt}</option> :
                            <option key={opt.id} value={opt.title}>{opt.title}</option>
                        ))}
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <ChevronRight size={16} className="rotate-90" />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDestinationSlot(index)}
                      className="p-3 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors flex-shrink-0"
                      title="Remove Spot"
                    >
                      <X size={18} />
                    </button>
                </div>
              ))}
            </div>
          </div>


          {/* Phase 3: Logistics */}
          <div className="space-y-8 border-b border-gray-200 pb-12 pt-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#c8007b]/10 text-[#c8007b] flex items-center justify-center text-[10px] font-black underline underline-offset-4">03</div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Journey Logistics</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <PremiumInput name="arrivalDate" label="Island Arrival" type="date" value={formData.arrivalDate} onChange={handleChange} required />
              <PremiumInput name="departureDate" label="Island Farewell" type="date" value={formData.departureDate} onChange={handleChange} required />
            </div>

            {/* Traveling Party */}
            <div className="bg-white rounded-[30px] p-8 border border-gray-100 shadow-sm mt-6">
              <div className="flex items-center gap-3 mb-8">
                <Users size={16} className="text-[#c8007b]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900">Your Traveling Party</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {['Adults', 'Kids', 'Infants'].map((type) => (
                  <div key={type} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col items-center hover:border-[#c8007b]/30 transition-colors group/counter">
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

          {/* Phase 4: The Vision */}
          <div className="space-y-8 pt-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#c8007b]/10 text-[#c8007b] flex items-center justify-center text-[10px] font-black underline underline-offset-4">04</div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">The Island Vision</h4>
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
                className="w-full bg-white rounded-[30px] border border-gray-200 p-8 text-gray-900 placeholder-gray-400 outline-none focus:border-[#c8007b]/30 focus:shadow-md transition-all resize-none font-medium text-sm leading-relaxed"
              />
            </div>
          </div>

          {/* Submit Area */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative overflow-hidden bg-black text-white px-10 py-5 rounded-full shadow-xl hover:shadow-[#c8007b]/20 transition-all duration-500 disabled:opacity-50 w-full sm:w-auto ml-auto"
            >
              <span className="relative z-10 flex items-center justify-center gap-3 font-bold tracking-widest uppercase text-xs">
                {isSubmitting ? 'Dispatching...' : 'Initiate Design'}
                <div className="bg-[#c8007b] p-1.5 rounded-full group-hover:translate-x-1.5 transition-transform duration-500">
                  <ChevronRight size={14} />
                </div>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#c8007b] to-[#ff009d] opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>
          </div>
        </form>
      </Reveal>
    </div>
  );
}

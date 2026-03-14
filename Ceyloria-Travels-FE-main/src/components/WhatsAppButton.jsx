import { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { X } from "lucide-react";

export default function WhatsAppButton() {
  const [showPopup, setShowPopup] = useState(false);
  const phoneNumber = "0742216579";
  // Format for wa.me link: remove leading 0 and add country code (assuming Sri Lanka +94)
  const formattedNumber = `94${phoneNumber.substring(1)}`;
  const whatsappUrl = `https://wa.me/${formattedNumber}`;

  useEffect(() => {
    // Show popup after a short delay
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {/* Popup Message */}
      {showPopup && (
        <div className="mb-4 mr-2 bg-white text-slate-800 p-4 rounded-xl shadow-2xl relative w-64 animate-fade-in-up border border-slate-100">
          <button 
            onClick={() => setShowPopup(false)}
            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"
          >
            <X size={16} />
          </button>
          <div className="flex items-start gap-3">
            <div className="bg-green-100 p-2 rounded-full text-green-600 mt-1">
              <FaWhatsapp size={16} />
            </div>
            <div>
              <p className="font-bold text-sm">Need Help?</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Chat with us on WhatsApp for quick support!</p>
            </div>
          </div>
          {/* Tail triangle */}
          <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white rotate-45 border-b border-r border-slate-100"></div>
        </div>
      )}

      {/* Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#25D366] text-white p-3 rounded-full shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.23)] hover:-translate-y-1 transition-all duration-300 group flex items-center justify-center relative"
      >
        <FaWhatsapp className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
        
        {/* Ping animation effect behind the button */}
        <span className="absolute inset-0 rounded-full border-2 border-[#25D366] animate-ping opacity-75 hidden group-hover:block"></span>
      </a>
    </div>
  );
}

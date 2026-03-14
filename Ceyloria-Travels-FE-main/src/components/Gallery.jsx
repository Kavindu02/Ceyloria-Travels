import React from "react";
import { useNavigate } from "react-router-dom";

const galleryItems = [
  { id: 1, title: "Colombo", img: "https://res.cloudinary.com/dicvgtusz/image/upload/q_auto,f_webp/v1772084176/tharoushan-kandarajah-KtDXt7DyfVM-unsplash_yhkhrb.jpg", size: "md:col-span-1 md:row-span-1", link: "/colombo" },
  { id: 2, title: "Anuradhapura", img: "https://res.cloudinary.com/dicvgtusz/image/upload/q_auto,f_webp/v1772084173/Anuradhapura_mqhimc.jpg", size: "md:col-span-1 md:row-span-1", link: "/anuradhapura" },
  { id: 3, title: "Galle", img: "https://res.cloudinary.com/dicvgtusz/image/upload/q_auto,f_webp/v1772084173/shainee-fernando-RdZ6t41NmE0-unsplash_l0vc3l.jpg", size: "md:col-span-1 md:row-span-2", link: "/galle" },
  { id: 4, title: "Ella", img: "https://res.cloudinary.com/dicvgtusz/image/upload/q_auto,f_webp/v1772084175/demodara-nine-arch-bridge-ella-sri-lanka.jpg_1_1_2_urimmw.jpg", size: "md:col-span-2 md:row-span-1", link: "/ella" },
];

const Gallery = () => {
  const navigate = useNavigate();

  const handleNavigation = (link) => {
    if (link) {
      navigate(link);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="w-full py-4">
      <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[300px] gap-6">
        {galleryItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleNavigation(item.link)}
            className={`relative overflow-hidden rounded-[40px] cursor-pointer group shadow-sm hover:shadow-xl transition-shadow duration-300 transform-gpu ${item.size}`}
          >
            {/* Background Image */}
            <img
              src={item.img}
              alt={item.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

            {/* Bottom Content */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <div className="transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
                <h2 className="text-white text-3xl font-bold mb-3 tracking-tight drop-shadow-md">
                  {item.title}
                </h2>

                <div className="flex items-center text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="font-bold text-xs uppercase tracking-widest mr-3">Explore Destination</span>
                  <svg className="w-6 h-6 bg-white text-black p-1.5 rounded-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Top Right Floating Icon */}
            <div className="absolute top-6 right-6 w-12 h-12 bg-white/25 border border-white/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300">
              <svg className="w-5 h-5 text-white transform -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
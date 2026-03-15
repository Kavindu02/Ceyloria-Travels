import React from 'react';
import { MapPin, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { safeParseJSON } from '../utils/jsonParser.js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const BUCKET_NAME = "images";

const getImageUrl = (imagePath) => {
  if (!imagePath) return "/gallery/img1.jpg";
  let targetImage = Array.isArray(imagePath) ? imagePath[0] : imagePath;
  if (!targetImage || typeof targetImage !== 'string') return "/gallery/img1.jpg";
  if (/^(https?:|data:|blob:)/i.test(targetImage)) return targetImage;
  if (targetImage.startsWith('/') || targetImage.includes('/storage/')) return targetImage;
  if (!SUPABASE_URL) return targetImage;
  const base = SUPABASE_URL.replace(/\/$/, '');
  const imgPath = String(targetImage).replace(/^\//, '');
  return `${base}/storage/v1/object/public/${BUCKET_NAME}/${imgPath}`;
};

const CuratedPackageCard = ({ pkg }) => {
  const navigate = useNavigate();
  const images = safeParseJSON(pkg.images || pkg.image);
  const imageUrl = getImageUrl(images);

  return (
    <div
      onClick={() => navigate(`/package-overview/${pkg.id}`)}
      className="backdrop-blur-2xl bg-gradient-to-br from-white/20 via-white/5 to-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] ring-1 ring-white/20 border border-white/10 group cursor-pointer transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex flex-col h-full relative"
    >
      {/* Inner Glow/Highlight for "Liquid" feel */}
      <div className="absolute inset-0 rounded-[2.5rem] pointer-events-none bg-gradient-to-tr from-white/10 to-transparent opacity-50"></div>
      
      {/* Image Section */}
      <div className="relative h-[240px] overflow-hidden m-5 rounded-[2rem] z-10">
        <img
          src={imageUrl}
          alt={pkg.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
        />
      </div>

      {/* Content Section */}
      <div className="px-9 pb-9 pt-2 flex flex-col flex-grow z-10">
        <div className="flex justify-between items-start mb-5">
          <h3 className="font-['Playfair_Display',_serif] text-2xl text-white group-hover:text-[#cc007e] transition-colors leading-tight drop-shadow-sm">
            {pkg.title}
          </h3>
          <div className="flex items-center gap-1.5 text-neutral-300">
            <MapPin className="w-4 h-4 text-[#cc007e] drop-shadow-[0_0_8px_rgba(204,0,126,0.5)]" />
            <span className="text-xs font-medium tracking-tight">{safeParseJSON(pkg.citiesCovered)?.[0] || "Sri Lanka"}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-col gap-1">
            <span className="text-neutral-300 text-xs font-bold uppercase tracking-widest opacity-70">Duration</span>
            <span className="text-white text-sm font-medium">{pkg.duration}</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-neutral-300 text-xs font-bold uppercase tracking-widest opacity-70">Rating</span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
              <span className="text-sm font-bold text-white">{pkg.ratingText || "4.9/5"}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-auto">
          <div className="flex flex-col">
            <span className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70">Starting From</span>
            <span className="text-white text-3xl font-black tracking-tighter drop-shadow-md">
              US${pkg.price}
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20 group-hover:bg-[#cc007e] group-hover:border-[#cc007e] shadow-xl transition-all duration-500 group-hover:scale-110">
            <ArrowRight className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CuratedPackageCard;

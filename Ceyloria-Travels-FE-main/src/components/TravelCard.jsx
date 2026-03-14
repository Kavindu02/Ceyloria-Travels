import React, { useState } from 'react';
import { MapPin, Clock, ArrowRight, ImageOff, Sparkles, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { safeParseJSON } from '../utils/jsonParser.js';

// 1. Get Supabase URL from your Environment Variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

// 2. ⚠️ CONFIG: Ensure this matches your Supabase Storage Bucket name exactly
const BUCKET_NAME = "images"; 

// --- Helper Function to Generate URL ---
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;

  // Pick first useful value if an array was passed
  let targetImage = Array.isArray(imagePath) ? imagePath.find(Boolean) : imagePath;

  // If it's an object, try a set of common properties
  if (typeof targetImage === 'object' && targetImage !== null) {
    targetImage = targetImage.url || targetImage.src || targetImage.path || targetImage.name || targetImage.key || targetImage.filename || targetImage.fileName || null;
  }

  if (!targetImage || typeof targetImage !== 'string') return null;

  // Normalize Windows backslashes to forward slashes
  targetImage = targetImage.replace(/\\/g, '/');

  // External absolute URLs (including data: and blob:)
  if (/^(https?:|data:|blob:)/i.test(targetImage)) return targetImage;

  // If the path is already absolute (starts with /) or contains storage path, return as-is
  if (targetImage.startsWith('/') || targetImage.includes('/storage/')) return targetImage;

  // If SUPABASE_URL is missing, return the filename as-is (may resolve from public folder)
  if (!SUPABASE_URL) {
    if (import.meta.env.DEV) console.warn('[TravelCard] VITE_SUPABASE_URL not set; using image value as-is:', targetImage);
    return targetImage;
  }

  // Normalize slashes and construct Supabase public storage URL
  const base = SUPABASE_URL.replace(/\/$/, '');
  const imgPath = String(targetImage).replace(/^\//, '');
  return `${base}/storage/v1/object/public/${BUCKET_NAME}/${imgPath}`;
};

const TravelCard = ({ 
  image, 
  title, 
  location, 
  duration, 
  description, 
  price, 
  oldPrice, 
  isSale,
  ratingText,
  starCount,
  onDetailsClick,
  id
}) => {
  
  // Use safeParseJSON so MySQL stringified arrays are parsed safely
  let images = safeParseJSON(image);
  images = Array.isArray(images) ? images : [images].filter(Boolean);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [imgError, setImgError] = useState(false);
  const finalImageSrc = getImageUrl(images[currentIdx]);
  const navigate = useNavigate();

  const handleExplore = () => {
    if (onDetailsClick) {
      onDetailsClick();
    } else if (id) {
      navigate(`/package-overview/${id}`);
    }
  };

  // Reset index when `image` prop changes
  React.useEffect(() => {
    setCurrentIdx(0);
    setImgError(false);
  }, [image]);

  // If current candidate yields no URL, advance to next available
  React.useEffect(() => {
    if (Array.isArray(images) && currentIdx < images.length && !getImageUrl(images[currentIdx])) {
      if (currentIdx < images.length - 1) {
        setCurrentIdx((i) => i + 1);
      } else {
        setImgError(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx, image]);

  return (
    <div className="group relative bg-white rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100 flex flex-col h-full">
      
      {/* --- Image Container --- */}
      <div className="relative h-72 overflow-hidden bg-gray-100">
        
        {/* Gradient Overlay for Text Contrast (if needed) */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* 1. The Image Tag */}
        {finalImageSrc && !imgError ? (
          <img 
            src={finalImageSrc} 
            alt={title} 
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
            onError={(e) => {
              if (import.meta.env.DEV) console.warn('[TravelCard] image failed to load:', { image, finalImageSrc, currentIdx, errorEvent: e });
              // Try the next candidate if available
              if (currentIdx < images.length - 1) {
                setCurrentIdx((i) => i + 1);
                setImgError(false);
              } else {
                setImgError(true);
              }
            }}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
            <ImageOff size={48} className="mb-2 opacity-50" />
            <span className="text-xs font-bold uppercase tracking-widest opacity-50">Image Unavailable</span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
             {/* Location Badge (Glassmorphism) */}
            <div className="bg-white/90 backdrop-blur-md text-gray-800 text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-sm border border-white/50">
                <MapPin size={14} className="text-blue-600" />
                <span className="uppercase tracking-wide line-clamp-1 max-w-[120px]">{location}</span>
            </div>

            {/* Sale Badge (Gradient) */}
            {isSale && (
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg animate-pulse flex items-center gap-1">
                <Sparkles size={12} /> Sale
            </div>
            )}
        </div>

        {/* Duration Badge (Floating Bottom Left) */}
        <div className="absolute bottom-4 left-4 z-20">
             <div className="bg-gray-900/80 backdrop-blur-sm text-white px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold shadow-lg border border-white/10">
                <Clock size={14} className="text-cyan-400" />
                {duration}
            </div>
        </div>
      </div>

      {/* --- Content Section --- */}
      <div className="p-8 flex flex-col flex-grow relative">
        {/* Title */}
        <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-[#c8007b] transition-colors leading-tight line-clamp-1">
          {title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(starCount || 5)].map((_, i) => (
            <Star 
              key={i} 
              className="w-4 h-4 text-yellow-500 fill-current" 
            />
          ))}
          <span className="text-sm font-bold text-gray-900 ml-1">{ratingText || "4.9/5"}</span>
        </div>

        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-2">
          {description}
        </p>

        {/* --- Footer Section --- */}
        <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between gap-4">
          
          {/* Price Block */}
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1">Starting From</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-gray-900 tracking-tight">
                ${price}
              </span>
              {oldPrice && (
                <span className="text-sm text-gray-400 line-through font-medium">
                  ${oldPrice}
                </span>
              )}
            </div>
          </div>

          {/* Premium Button */}
          <button 
            onClick={handleExplore}
            className="relative overflow-hidden group/btn bg-gray-900 text-white pl-6 pr-5 py-3 rounded-full font-bold text-sm shadow-lg shadow-gray-900/20 transition-all hover:shadow-gray-900/40 hover:-translate-y-1"
          >
            <span className="relative z-10 flex items-center gap-2">
              Explore
              <div className="bg-white/20 p-1 rounded-full group-hover/btn:translate-x-1 transition-transform">
                <ArrowRight size={14} />
              </div>
            </span>
            {/* Hover Gradient */}
            <div className="absolute inset-0 bg-[#c8007b] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default TravelCard;

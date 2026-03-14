import React, { useState, useEffect } from 'react';
import { MapPin, Home, ArrowRight, ImageOff, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { safeParseJSON } from '../utils/jsonParser.js';

// 1. Get Supabase URL from your Environment Variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

// 2. CONFIG: Ensure this matches your Supabase Storage Bucket name exactly
const BUCKET_NAME = "images"; 

// --- Helper Function to Generate URL (Identical to TravelCard) ---
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

  // If SUPABASE_URL is missing, return the filename as-is
  if (!SUPABASE_URL) return targetImage;

  // Normalize slashes and construct Supabase public storage URL
  const base = SUPABASE_URL.replace(/\/$/, '');
  const imgPath = String(targetImage).replace(/^\//, '');
  return `${base}/storage/v1/object/public/${BUCKET_NAME}/${imgPath}`;
};

const AccommodationCard = ({ accommodation }) => {
  const navigate = useNavigate();

  // --- 1. Destructure Data from Mongoose Schema ---
  const { 
    id, 
    name, 
    location, 
    type, 
    description, 
    images, 
    packages, 
    isAvailable 
  } = accommodation || {};

  const parsedImages = safeParseJSON(images) || [];
  const parsedPackages = safeParseJSON(packages) || [];

  // --- 2. Calculate "Starting From" Price ---
  // STARTING FROM PRICE logic: Prefer root pricePerNight, else min of packages
  const startingPrice = accommodation.pricePerNight || (parsedPackages && parsedPackages.length > 0 
    ? Math.min(...parsedPackages.map(p => p.pricePerNight)) 
    : null);

  // --- 3. Image Handling Logic ---
  const [currentIdx, setCurrentIdx] = useState(0);
  const [imgError, setImgError] = useState(false);
  
  // Ensure we have an array to work with
  const imageList = Array.isArray(parsedImages) ? parsedImages : [parsedImages].filter(Boolean);
  const finalImageSrc = getImageUrl(imageList[currentIdx]);

  const handleExplore = () => {
    // Navigate to details page using the MongoDB id
    navigate(`/accommodation-overview/${ id }`);
  };

  // Reset state when the accommodation prop updates
  useEffect(() => {
    setCurrentIdx(0);
    setImgError(false);
  }, [accommodation]);

  // Fallback loop: if current image fails, try the next one
  useEffect(() => {
    if (imageList.length > 0 && currentIdx < imageList.length && !getImageUrl(imageList[currentIdx])) {
      if (currentIdx < imageList.length - 1) {
        setCurrentIdx((i) => i + 1);
      } else {
        setImgError(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx, imageList]);

  return (
    <div className="group relative bg-white rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100 flex flex-col h-full">
      
      {/* --- Image Section --- */}
      <div className="relative h-72 overflow-hidden bg-gray-100">
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Image Tag */}
        {finalImageSrc && !imgError ? (
          <img 
            src={finalImageSrc} 
            alt={name} 
            className={`w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out ${!isAvailable ? 'grayscale' : ''}`}
            onError={() => {
              if (currentIdx < imageList.length - 1) {
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
            {/* Location Badge */}
            <div className="bg-white/90 backdrop-blur-md text-gray-800 text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-sm border border-white/50">
                <MapPin size={14} className="text-blue-600" />
                <span className="uppercase tracking-wide line-clamp-1 max-w-[120px]">{location}</span>
            </div>

            {/* Status Badge (Available/Booked) */}
            <div className={`px-3 py-1.5 rounded-full uppercase text-[10px] font-black tracking-wider shadow-lg flex items-center gap-1 ${isAvailable ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                {isAvailable ? (
                    <> <CheckCircle size={12} /> Available </>
                ) : (
                    <> <XCircle size={12} /> Booked </>
                )}
            </div>
        </div>

        {/* Type Badge (e.g., Hotel, Villa) - Replaces Duration */}
        <div className="absolute bottom-4 left-4 z-20">
             <div className="bg-gray-900/80 backdrop-blur-sm text-white px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold shadow-lg border border-white/10">
                <Home size={14} className="text-cyan-400" />
                <span className="capitalize">{type}</span>
            </div>
        </div>
      </div>

      {/* --- Content Section --- */}
      <div className="p-8 flex flex-col flex-grow relative">
        {/* Title */}
        <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight line-clamp-1">
          {name}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-2">
          {description || "Enjoy a comfortable stay with premium amenities at this location."}
        </p>

        {/* --- Footer Section --- */}
        <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between gap-4">
          
          {/* Price Block */}
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1">
                Per Night From
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-gray-900 tracking-tight">
                {startingPrice ? `$${startingPrice}` : <span className="text-lg text-gray-400">Ask</span>}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <button 
            onClick={handleExplore}
            disabled={!isAvailable}
            className={`relative overflow-hidden group/btn text-white pl-6 pr-5 py-3 rounded-full font-bold text-sm shadow-lg transition-all 
                ${isAvailable 
                    ? 'bg-gray-900 shadow-gray-900/20 hover:shadow-gray-900/40 hover:-translate-y-1 cursor-pointer' 
                    : 'bg-gray-400 cursor-not-allowed opacity-80'
                }`}
          >
            <span className="relative z-10 flex items-center gap-2">
              {isAvailable ? 'Details' : 'Unavailable'}
              {isAvailable && (
                  <div className="bg-white/20 p-1 rounded-full group-hover/btn:translate-x-1 transition-transform">
                    <ArrowRight size={14} />
                  </div>
              )}
            </span>
            {/* Hover Gradient */}
            {isAvailable && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-400 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
            )}
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default AccommodationCard;

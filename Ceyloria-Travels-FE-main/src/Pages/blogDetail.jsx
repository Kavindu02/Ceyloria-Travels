import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, User, Clock, Share2, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { safeParseJSON } from "../utils/jsonParser.js";

const fontHead = "font-['Playfair_Display',_serif]";
const fontBody = "font-['DM_Sans',_sans-serif]";


const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: post?.title || "Ceyloria Journal",
      text: post?.excerpt || "Check out this story from Ceyloria Journal",
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        return;
      }

      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/blogs/${id}`);
        const data = await res.json();
        setPost(data);
      } catch (error) {
        console.error("Error fetching blog post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Post not found</h2>
          <Link to="/blogs" className="text-blue-600 hover:underline">Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans text-stone-800 bg-stone-50 selection:bg-amber-200 selection:text-amber-900 overflow-x-hidden">
      {/* ==================== 1. CINEMATIC HERO SECTION ==================== */}
      <div className="relative h-[85vh] md:h-[95vh] w-full overflow-hidden group mb-0">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={post.image || "https://images.unsplash.com/photo-1608481337062-4093bf3ed404"}
            alt={post.title}
            className="w-full h-full object-cover animate-subtle-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-stone-900/90 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-16 z-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 gap-8 items-end">
            <div className="animate-slide-up">
              <span className="inline-block px-3 py-1 mb-4 border border-white/30 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase text-white backdrop-blur-md">
                {post.category || 'Journal'}
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-8xl font-serif text-white leading-[0.9] tracking-tighter mb-6">
                {post.title}
              </h1>
              <p className="text-lg md:text-xl text-stone-200 font-light max-w-2xl leading-relaxed border-l-2 border-amber-500 pl-6 line-clamp-2">
                {post.excerpt}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== 2. ELEGANT STATS STRIP ==================== */}
      <div className="bg-stone-900 text-white py-10 px-6 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-8 md:gap-16 items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-stone-800 flex items-center justify-center text-amber-500 font-serif text-xl border border-stone-700">
              {post.author ? post.author.charAt(0) : 'C'}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 mb-1">Author</p>
              <p className="text-lg font-serif text-stone-100">{post.author || 'Ceyloria Team'}</p>
            </div>
          </div>

          <div className="h-10 w-[1px] bg-stone-800/50 hidden md:block"></div>

          <div className="flex items-center gap-4">
            <Calendar className="w-8 h-8 text-amber-600" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 mb-1">Published</p>
              <p className="text-lg font-serif text-stone-100">
                {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently'}
              </p>
            </div>
          </div>

          <div className="flex-1"></div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-amber-500 transition-colors"
            >
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>
      </div>

      {/* ==================== 3. NARRATIVE LAYOUT ==================== */}
      <section className="py-24 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="relative">
          {/* Decorative Background Text */}
          <div className="absolute -top-20 -left-10 text-[6rem] md:text-[10rem] font-serif text-stone-200 select-none opacity-50 z-0 leading-none whitespace-nowrap overflow-hidden w-full blur-sm">
            JOURNAL
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">

            {/* Visual Anchor (Left Side) - Only show if post has image */}
            <div className="lg:col-span-4 hidden lg:block sticky top-32 h-fit">
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl h-[400px]">
                <img
                  src={post.image || "/pagesPhotos/anuradhapura/spa.png"}
                  alt="Story Visual"
                  className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-amber-900/20 mix-blend-multiply"></div>
              </div>
            </div>

            {/* Text Content (Right Side) */}
            <div className="lg:col-span-8">
              <div className="bg-white/90 backdrop-blur-xl p-8 md:p-12 lg:p-16 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-white/50">
                {(() => {
                  const safelyParsedImages = safeParseJSON(post.images) || [];
                  return (
                    <>
                      <div className="flex items-center gap-3 mb-10">
                        <span className="w-12 h-[1px] bg-amber-600"></span>
                        <span className="text-amber-600 text-xs font-bold uppercase tracking-widest">Curated Exploration</span>
                      </div>

                <div className="prose prose-stone prose-lg max-w-none blog-content font-light text-stone-600 leading-relaxed quill-content break-words">
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>

                {/* Additional Images Section */}
                {safelyParsedImages.length > 0 && (
                  <div className="mt-16 pt-12 border-t border-stone-200">
                    <div className="flex items-center gap-3 mb-8">
                      <span className="w-8 h-[1px] bg-amber-600"></span>
                      <h4 className="font-serif text-2xl text-stone-800">Visual Gallery</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {safelyParsedImages.map((imgUrl, idx) => (
                        <div key={idx} className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg group">
                          <img
                            src={imgUrl}
                            alt={`Gallery image ${idx + 1}`}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-stone-900/20 group-hover:bg-transparent transition-colors duration-500"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </section>



    </div>
  );
};

export default BlogDetail;

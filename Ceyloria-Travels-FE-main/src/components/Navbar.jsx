import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle Scroll Effect — throttled with rAF to avoid per-pixel re-renders
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? "bg-black/95 border-b border-white/10 shadow-lg"
          : "bg-black/60 md:bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-6 xl:px-12 h-16 md:h-20 flex items-center justify-between flex-nowrap">
        <Link to="/" className="relative z-50 flex items-center group shrink-0">
          <img
            src="/logo.png"
            alt="Ceyloria Logo"
            className="w-auto h-24 md:h-28 lg:h-32 object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation */}
        <ul
          className={`hidden lg:flex items-center gap-1 xl:gap-2 text-white/90 font-medium text-[15px] xl:text-[18px] flex-nowrap rounded-full px-4 py-2 transition-all duration-300 ${
            scrolled || menuOpen
              ? "bg-transparent border border-transparent shadow-none backdrop-blur-0"
              : "bg-white/10 border border-white/20 shadow-[0_8px_24px_rgba(0,0,0,0.2)] backdrop-blur-md"
          }`}
        >
          {[
            "Home",
            "About",
            "Destinations",
            "Activities",
            "Packages",
            "Accommodations",
            "Blogs",
            "Contact",
          ].map((item) => {
            const linkPath = item === "Home" ? "/" : `/${item.toLowerCase()}`;
            const isActive =
              item === "Home"
                ? location.pathname === "/"
                : location.pathname.startsWith(linkPath);

            return (
              <li key={item} className="shrink-0">
                <Link
                  to={linkPath}
                  className={`relative hover:text-[#ffd21f] transition-colors py-2 px-1.5 xl:px-2 group whitespace-nowrap block ${isActive ? "text-[#ffd21f]" : ""}`}
                >
                  {item === "Contact" ? "Contact Us" : item}
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-[#ffd21f] transition-all duration-300 ${isActive ? "w-[80%]" : "w-0 group-hover:w-[80%]"}`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right Section: Search & CTA */}
        <div className="hidden md:flex items-center gap-2 xl:gap-6 flex-nowrap shrink-0">
          <Link
            to="/plan-my-trip"
            className="px-5 py-2.5 bg-white text-black text-[15px] font-bold rounded-full hover:bg-[#ffd21f] hover:text-gray-900 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[#ffd21f]/50"
          >
            Plan My Trip
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden z-50 relative p-2 text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className="relative">
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "100vh" }}
              exit={{ opacity: 0, height: 0 }}
              className="fixed inset-0 top-0 bg-black z-40 flex flex-col pt-24 px-6 md:hidden overflow-y-auto"
            >
            {/* Background Image for Mobile Menu - Faint */}
            <div className="absolute inset-0 z-0 opacity-60 select-none pointer-events-none">
                <img 
                    src="https://res.cloudinary.com/dicvgtusz/image/upload/f_webp,q_auto:low/v1772084175/demodara-nine-arch-bridge-ella-sri-lanka.jpg_1_1_2_urimmw.jpg" 
                    alt="" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black to-black" />
            </div>

            {/* Mobile Links */}
            <nav className="flex flex-col gap-6 relative z-10">
              {[
                "Home",
                "Destinations",
                "Activities",
                "Packages",
                "Accommodations",
                "About",
                "Blogs",
                "Contact",
                "Plan My Trip",
              ].map((item, idx) => {
                const linkPath =
                  item === "Home" ? "/"
                  : item === "Plan My Trip" ? "/plan-my-trip"
                  : `/${item.toLowerCase()}`;
                const isActive =
                  item === "Home"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(linkPath);

                return (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Link
                      to={linkPath}
                      onClick={() => setMenuOpen(false)}
                      className={`text-2xl font-bold flex flex-col items-start w-max ${isActive ? "text-[#ffd21f]" : item === "Contact" ? "text-[#ae046d]" : item === "Plan My Trip" ? "text-[#c8007b]" : "text-white"}`}
                    >
                      {item === "Contact" ? "Contact Us" : item}
                      <span
                        className={`block h-0.5 bg-[#ae046d] transition-all duration-300 ${isActive ? "w-full mt-1" : "w-0"}`}
                      />
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

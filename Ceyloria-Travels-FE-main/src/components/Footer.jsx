import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Linkedin,
  ArrowRight,
  Send,
} from "lucide-react";

import { FaPinterest } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-0 w-full text-gray-200 overflow-hidden bg-black">
      {/* Background Image - Faint/Subtle */}
      <img
        src="https://res.cloudinary.com/dicvgtusz/image/upload/f_webp,q_auto:low/v1772084175/demodara-nine-arch-bridge-ella-sri-lanka.jpg_1_1_2_urimmw.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-50 pointer-events-none select-none z-0"
      />
      {/* Modern Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/20 z-[1]"></div>

      <div className="relative z-10 mx-auto w-11/12 max-w-7xl pt-12 pb-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3 items-start">

          {/* Column 1: Brand & Contact */}
          <div className="space-y-6 px-3">
            <Link to="/" className="inline-block group">
              <img
                src="/logo.png"
                alt="Ceyloria Logo"
                className="w-auto h-24 md:h-28 object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            <p className="text-sm leading-relaxed text-gray-400">
              Discover the beauty of Sri Lanka with curated tours and unforgettable experiences.
            </p>

            <div className="space-y-4 pt-2">
              <ContactItem icon={MapPin} text="No 52, Dumbaragama, Kalugala, Sri Lanka" />
              <ContactItem icon={Phone} text="0714818180" />
              <ContactItem icon={Mail} text="info@ceyloriatravels.com" />
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="px-3 flex flex-col items-start md:items-center justify-center">
            <h3 className="mb-6 text-lg font-semibold text-white text-left md:text-center">Explore</h3>
            <ul className="space-y-3 text-left md:text-center">
              <FooterLink to="/" label="Home" />
              <FooterLink to="/destinations" label="Destinations" />
              <FooterLink to="/activities" label="Activities" />
              <FooterLink to="/packages" label="Packages" />
              <FooterLink to="/accommodations" label="Accommodations" />
              <FooterLink to="/blogs" label="Blogs" />
              <FooterLink to="/about" label="About Us" />
            </ul>
          </div>


          {/* Column 4: Newsletter & Social */}
          <div className="space-y-6 px-3">
            <div className="space-y-6 px-3">
              <p className="mb-4 text-sm text-gray-400">Subscribe for latest tour updates.</p>
              <div className="flex w-full items-center rounded-lg bg-white/10 p-1 backdrop-blur-md ring-1 ring-white/20 focus-within:ring-blue-600 transition-all">
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-gray-400 outline-none"
                />
                <button className="rounded-md bg-blue-600 p-2 text-white hover:bg-blue-500 transition-colors">
                  <Send size={18} />
                </button>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Follow Us</h3>
              <div className="flex gap-4">
                <SocialIcon Icon={Facebook} href="https://www.facebook.com/profile.php?id=61579233837714" />
                <SocialIcon Icon={Instagram} href="https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.instagram.com%2Fceyloriatravels%3Ffbclid%3DIwZXh0bgNhZW0CMTAAYnJpZBExSG9hZ1VjQk1EVVN5SkV3NXNydGMGYXBwX2lkEDIyMjAzOTE3ODgyMDA4OTIAAR45UFIu1JUfravTLVcxTme7I-CG2fkTwSW9PSG5KuUtpE_ZkV0_kbnMXTq1xg_aem_jAas6l3mBuedKxTqPSsSXQ&h=AT6dCRs_0BBFwZmoTGXfy84M2SmYeU2d_ZhP0gEj4tfAfsKLbXgU7LOlsdmazYV-nCYjehlgrqxwIc7IQ20j3mAHvhc0SKRQ398BQesoDWDJzLKPquz6QaGWEkTn5Jom0DmE9uPjsXHF_yifHKeO" />
                <SocialIcon Icon={Linkedin} href="https://l.facebook.com/l.php?u=https%3A%2F%2Flinkedin.com%2Fin%2Fhttps%253A%252F%252Fwww.linkedin.com%252Fcompany%252Fceyloria-travels%252F%3Ffbclid%3DIwZXh0bgNhZW0CMTAAYnJpZBExSG9hZ1VjQk1EVVN5SkV3NXNydGMGYXBwX2lkEDIyMjAzOTE3ODgyMDA4OTIAAR7Mr8o2EDusP64yCujJS318ujK7INdtxuwUpa2JLBU1h8BMIBx3QxyeFhazpw_aem_p0aNCM9jlzAyw5w1sTRxRA&h=AT5AU0pe3uzKdQQq4G7ZeWemRRCvp0e1sjTN12cm7B9J7IPnaBEhfQ6_I7a7v6nStMGg119krho2u3S5ItKuz31D6UUL2jBnC7I9FALA7PgTGP93V3S8si9ZYElaQe_4GwJAcfvvsnUE-vZ5PQcn" />
                <SocialIcon Icon={FaPinterest} href="https://l.facebook.com/l.php?u=https%3A%2F%2Fpinterest.com%2Fceyloriatravels%252F%3Ffbclid%3DIwZXh0bgNhZW0CMTAAYnJpZBExSG9hZ1VjQk1EVVN5SkV3NXNydGMGYXBwX2lkEDIyMjAzOTE3ODgyMDA4OTIAAR7InOMwVfRi9RNHG4qtW94Y8otg2e1vqSsNAZkrKpIT63T5XObsvULMScob0A_aem_fPsdZVCVYoPMEMX5TJ9PLg&h=AT7Yc-Zp8axpUrERL4yfhKpeWylTzOr26uVk6Ok3DoXJlXpI0giUgZTXs8-N7yC6gg9r0UEg9zv6gQcp1PJkVWusXl6Mpl8NUCK1MIJIqnquMMjVNBmqfHg147eWn7AL5f2JKHk9QdoeFwyeEPGc/" />
                

              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-16 border-t border-white/10 pt-8 
flex flex-col md:flex-row 
items-center justify-center 
gap-4 text-sm text-gray-500 text-center">

          <p>© {currentYear} <b>Ceyloria.</b> All rights reserved.</p>

        </div>

      </div>
    </footer>
  );
}

/* --- Helper Components for Cleaner Code --- */

function ContactItem({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-3 group cursor-default">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/40 ring-1 ring-white/10 text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
        <Icon size={17} />
      </div>
      <p className="text-sm leading-6 text-gray-300 group-hover:text-white transition-colors">{text}</p>
    </div>
  );
}

function FooterLink({ to, label }) {
  return (
    <li>
      <Link
        to={to}
        className="group flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-blue-600" />
        <span className="group-hover:translate-x-1 transition-transform duration-300">{label}</span>
      </Link>
    </li>
  );
}

function SocialIcon({ Icon, href }) {
  return (
    <a
      href={href}
      className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-300"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon size={20} />
    </a>
  );
}

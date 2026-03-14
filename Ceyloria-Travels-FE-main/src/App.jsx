import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./Pages/Homepage";
import Blog from "./Pages/blog";
import BlogDetail from "./Pages/blogDetail";
import Activities from "./Pages/Activities";
import ActivityDetail from "./Pages/ActivityDetail";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AnuradhapuraPage from "./Pages/gallerysection/anuradhapura";
import AdminPage from "./Pages/adminpage";
import ColomboPage from "./Pages/gallerysection/colombo";
import EllaPage from "./Pages/gallerysection/ella";
import GallePage from "./Pages/gallerysection/galle";
import SigiriyaPage from "./Pages/gallerysection/sigiriyafortress";
import LoginPage from "./Pages/loginPage";
import RegisterPage from "./Pages/registerPage";
import Contact from "./Pages/Contact";
import PlanMyTrip from "./Pages/PlanMyTrip";
import PackagesPage from "./Pages/customer/PackagesPage";
import PackageOverviewPage from "./Pages/customer/packageOverviewPage";
import AccommodationsPage from "./Pages/customer/accommodationsPage";
import AccommodationOverviewPage from "./Pages/customer/accommodationsOverviewPage";
import About from "./Pages/about";
import Destinations from "./Pages/Destinations";
import ScrollToTop from "./components/ScrollToTop";
import SearchResults from "./Pages/SearchResults";
import LanguageSwitcher from "./components/LanguageSwitcher";
import WhatsAppButton from "./components/WhatsAppButton";

export default function App() {
  const location = useLocation();

  // Check if current route is admin panel
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col">

      {/* Toast Notifications */}
      <Toaster />

      {/* Navbar — hidden on admin panel */}
      {!isAdminRoute && <Navbar />}

      {/* Language Switcher */}
      {!isAdminRoute && <LanguageSwitcher />}

      {/* WhatsApp Button */}
      {!isAdminRoute && <WhatsAppButton />}

      {/* Scroll to top instantly on route change */}
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/anuradhapura" element={<AnuradhapuraPage />} />
        <Route path="/colombo" element={<ColomboPage />} />
        <Route path="/ella" element={<EllaPage />} />
        <Route path="/galle" element={<GallePage />} />
        <Route path="/sigiriyafortress" element={<SigiriyaPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/plan-my-trip" element={<PlanMyTrip />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/package-overview/:id" element={<PackageOverviewPage />} />
        <Route path="/accommodations" element={<AccommodationsPage />} />
        <Route path="/accommodation-overview/:id" element={<AccommodationOverviewPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/destinations/:category" element={<Destinations />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blogs" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/activity/:id" element={<ActivityDetail />} />
      </Routes>

      {/* Footer — hidden on admin panel */}
      {!isAdminRoute && <Footer />}

    </div>
  );
}
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

// Icons
import { RiAdminFill } from "react-icons/ri";
import { HiMenu, HiX } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import { FaUsers, FaHotel, FaMapMarkedAlt } from "react-icons/fa";
import { IoMdHome } from "react-icons/io";
import { FiLogOut } from "react-icons/fi";
import { RiArticleLine } from "react-icons/ri";

// Pages
import AdminAdminPage from "./admin/adminAdminPage";
import PackageAdminPage from "./admin/packageAdminPage";
import UpdatePackage from "./admin/updatePackage"; // ✅ real packages page
import AddPackageAdminPage from "./admin/addPackageAdminPage";
import AccommodationsAdminPage from "./admin/accommodationsAdminPage"; // ✅ Real Hotels Page
import AddAccommodationAdminPage from "./admin/addAccommodationsAdminPage";
import UpdateAccommodation from "./admin/updateAccommodations";
import BlogAdminPage from "./admin/blogAdminPage";
import AddBlogAdminPage from "./admin/addBlogAdminPage";
import UpdateBlog from "./admin/updateBlog";
import DestinationAdminPage from "./admin/destinationAdminPage"; // [NEW]
import AddDestinationCategory from "./admin/addDestinationCategory";
import UpdateDestinationCategory from "./admin/updateDestinationCategory"; // [NEW] // [NEW]
import ActivityAdminPage from "./admin/activityAdminPage";
import AddActivityAdminPage from "./admin/addActivityAdminPage";
import UpdateActivity from "./admin/updateActivity";
import CuratedPackagesAdminPage from "./admin/CuratedPackagesAdminPage";

// Placeholder pages
const UsersPage = () => (
  <div className="p-10 text-white">Users Page (Coming Soon)</div>
);

/* ================= Sidebar Link ================= */
function SidebarLink({ to, icon: Icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      end
      onClick={onClick}
      className={({ isActive }) =>
        [
          "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all",
          "text-slate-400 hover:text-white hover:bg-teal-500/10",
          isActive ? "text-white bg-teal-600/20 border border-teal-500/20" : "",
        ].join(" ")
      }
    >
      {Icon && <Icon className="text-xl" />}
      <span>{label}</span>
    </NavLink>
  );
}

/* ================= Dashboard Hero ================= */
function DashboardHero() {
  const cards = [
    { label: "Manage Admins", to: "/admin/admins", icon: RiAdminFill },
    { label: "Users", to: "/admin/users", icon: FaUsers },
    { label: "Packages", to: "/admin/packages", icon: FaMapMarkedAlt },
    { label: "Hotels", to: "/admin/hotels", icon: FaHotel },
    { label: "Activities", to: "/admin/activities", icon: FaMapMarkedAlt },
    { label: "Blogs", to: "/admin/blogs", icon: RiArticleLine },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-teal-500 to-blue-600 p-[1px]">
        <div className="rounded-2xl bg-slate-900 p-8 text-white">
          <h1 className="text-3xl font-bold">Travel Admin Dashboard</h1>
          <p className="text-teal-200 mt-2">
            Manage destinations, bookings and users
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((c) => (
          <NavLink
            key={c.label}
            to={c.to}
            className="rounded-2xl bg-slate-800 hover:bg-slate-700 p-6 flex gap-4 items-center"
          >
            <div className="text-2xl text-teal-400">
              <c.icon />
            </div>
            <div>
              <p className="text-xs text-slate-400">Go to</p>
              <p className="font-bold text-white">{c.label}</p>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

/* ================= MAIN ADMIN PAGE ================= */
export default function AdminPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* 🔐 Admin Auth State */
  const [status, setStatus] = useState(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) return "not-admin";
    if (role === "admin") return "admin";
    return "loading";
  });

  /* 🔍 Server check only if needed */
  useEffect(() => {
    if (status !== "loading") return;

    const token = localStorage.getItem("token");

    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) =>
        setStatus(res.data.role === "admin" ? "admin" : "not-admin"),
      )
      .catch(() => setStatus("not-admin"));
  }, [status]);

  /* 🚫 Redirect non-admin */
  useEffect(() => {
    if (status === "not-admin") {
      toast.error("Please login to access the admin panel.");
      navigate("/login");
    }
  }, [status, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    toast.success("Logged out");
    navigate("/");
  };

  if (status === "loading")
    return <div className="p-10 text-white">Checking Admin Access...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Topbar */}
      <header className="border-b border-white/10 bg-slate-900">
        <div className="h-16 flex items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 bg-slate-800 rounded"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <HiX /> : <HiMenu />}
            </button>
            <h2 className="text-xl font-bold">Admin Panel</h2>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/")}
              className="px-3 py-1.5 bg-slate-800 rounded flex items-center gap-2"
            >
              <IoMdHome /> Home
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-red-600 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="grid md:grid-cols-[250px_1fr] gap-5 p-6">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? "block" : "hidden"} md:block`}>
          <div className="bg-slate-900 rounded-2xl p-5 space-y-2">
            <SidebarLink to="/admin" icon={MdDashboard} label="Dashboard" />
            <SidebarLink to="/admin/admins" icon={RiAdminFill} label="Admins" />
            {/* <SidebarLink to="/admin/users" icon={FaUsers} label="Users" /> */}
            <SidebarLink
              to="/admin/packages"
              icon={FaMapMarkedAlt}
              label="Packages"
            />
            <SidebarLink to="/admin/curated-packages" icon={FaMapMarkedAlt} label="Curated Selection" />
            <SidebarLink to="/admin/hotels" icon={FaHotel} label="Hotels" />
            <SidebarLink
              to="/admin/destinations"
              icon={FaMapMarkedAlt}
              label="Destinations"
            />{" "}
            <SidebarLink
              to="/admin/activities"
              icon={FaMapMarkedAlt}
              label="Activities"
            />
            {/* [NEW] */}
            <SidebarLink to="/admin/blogs" icon={RiArticleLine} label="Blogs" />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-red-600/20"
            >
              <FiLogOut className="text-xl" />
              Logout
            </button>
          </div>
        </aside>

        {/* Content */}
        <main>
          <Routes>
            <Route index element={<DashboardHero />} />
            <Route path="admins" element={<AdminAdminPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="packages" element={<PackageAdminPage />} />{" "}
            {/* ✅ Real PackagesPage */}
            <Route path="hotels" element={<AccommodationsAdminPage />} />{" "}
            {/* ✅ Real Hotels Page */}
            <Route path="package-admin/:id" element={<UpdatePackage />} />
            <Route path="add-package" element={<AddPackageAdminPage />} />
            <Route
              path="add-accommodation"
              element={<AddAccommodationAdminPage />}
            />
            <Route
              path="update-accommodation/:id"
              element={<UpdateAccommodation />}
            />
            <Route path="blogs" element={<BlogAdminPage />} />
            <Route path="add-blog" element={<AddBlogAdminPage />} />
            <Route path="update-blog/:id" element={<UpdateBlog />} />
            <Route
              path="destinations"
              element={<DestinationAdminPage />}
            />{" "}
            {/* [NEW] */}
            <Route
              path="add-destination-category"
              element={<AddDestinationCategory />}
            />{" "}
            {/* [NEW] */}
            <Route
              path="update-destination-category/:id"
              element={<UpdateDestinationCategory />}
            />
            <Route path="activities" element={<ActivityAdminPage />} />
            <Route path="add-activity" element={<AddActivityAdminPage />} />
            <Route path="update-activity/:id" element={<UpdateActivity />} />
            <Route path="curated-packages" element={<CuratedPackagesAdminPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { RiAdminFill, RiLockPasswordLine, RiDeleteBin6Line } from "react-icons/ri";

export default function AddAdminPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [admins, setAdmins] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);

  // =====================================
  // FETCH EXISTING ADMINS
  // =====================================
  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "/users/admins",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAdmins(res.data);
    } catch (err) {
      console.error("Error fetching admins:", err);
      toast.error("Failed to load admins");
    } finally {
      setLoadingAdmins(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // =====================================
  // DELETE ADMIN
  // =====================================
  const deleteAdmin = async (id, email) => {
    if (!confirm(`Are you sure you want to delete admin: ${email}?`)) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        import.meta.env.VITE_BACKEND_URL + `/users/admin/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Admin deleted successfully");
      fetchAdmins(); // refresh list
    } catch (err) {
      console.error("Error deleting admin:", err);
      toast.error(err.response?.data?.message || "Failed to delete admin");
    }
  };

  // =====================================
  // CREATE NEW ADMIN
  // =====================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in");
      window.location.href = "/login";
      return;
    }

    try {
      setIsLoading(true);

      await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/users/create-admin",
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Admin created successfully!");
      setEmail("");

      fetchAdmins(); // Refresh list
    } catch (err) {
      console.error("Error adding admin:", err);
      toast.error(err.response?.data?.message || "Failed to add admin");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-[90vh] pt-10 px-4 text-white">

      {/* ============================
          EXISTING ADMIN LIST
      ============================= */}
      <div className="w-full max-w-3xl mb-10 p-6 rounded-2xl bg-slate-900/60 border border-white/10">
        <h2 className="text-xl font-bold mb-4">Existing Admins</h2>

        {loadingAdmins ? (
          <p>Loading admins...</p>
        ) : admins.length === 0 ? (
          <p>No admins found.</p>
        ) : (
          <div className="space-y-3">
            {admins.map((admin) => (
              <div
                key={admin.id}
                className="p-3 bg-slate-800 rounded-xl flex justify-between items-center"
              >
                {/* Admin Info */}
                <div>
                  <p className="font-semibold">{admin.email}</p>
                  <p className="text-sm text-slate-400">
                    {admin.firstName} {admin.lastName}
                  </p>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => deleteAdmin(admin.id, admin.email)}
                  className="p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
                >
                  <RiDeleteBin6Line className="text-xl" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ============================
          CREATE ADMIN FORM
      ============================= */}
      <div className="w-full max-w-lg bg-slate-900/50 border border-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-xl bg-teal-500/20 text-teal-400">
            <RiAdminFill className="text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">New Administrator</h2>
            <p className="text-slate-400 text-sm">Create a new admin account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="text-sm font-semibold text-slate-300">
              Admin Email Address *
            </label>
            <input
              type="email"
              placeholder="admin@travelsite.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 rounded-xl bg-slate-800 border border-white/10 px-4 mt-2 text-white"
              required
            />
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 text-sm">
            <RiLockPasswordLine className="text-lg" />
            <p>
              Default password will be <span className="font-mono">admin123</span>.  
              Ask the new admin to change it after login.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="h-12 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Admin"}
          </button>
        </form>

        <Link to="/admin" className="block text-center mt-6 text-slate-400 underline">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

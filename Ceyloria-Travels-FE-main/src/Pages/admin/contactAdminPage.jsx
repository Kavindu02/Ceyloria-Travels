import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { MdDelete, MdEmail } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function ContactAdminPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch contacts
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/contacts`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data) {
        setContacts(Array.isArray(response.data) ? response.data : response.data.data || []);
        toast.success("✅ Contacts loaded successfully!", {
          duration: 2000,
          style: {
            background: "#10b981",
            color: "#fff",
            fontWeight: "600",
            borderRadius: "0.75rem",
          },
        });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("❌ Failed to load contacts", {
        duration: 2000,
        style: {
          background: "#ef4444",
          color: "#fff",
          fontWeight: "600",
          borderRadius: "0.75rem",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/contacts/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setContacts(contacts.filter((c) => c.id !== id));
      setSelectedContact(null);

      toast.success("✅ Contact deleted successfully!", {
        duration: 2000,
        style: {
          background: "#10b981",
          color: "#fff",
          fontWeight: "600",
          borderRadius: "0.75rem",
        },
      });
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("❌ Failed to delete contact", {
        duration: 2000,
        style: {
          background: "#ef4444",
          color: "#fff",
          fontWeight: "600",
          borderRadius: "0.75rem",
        },
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AiOutlineLoading3Quarters className="text-4xl animate-spin text-teal-400 mx-auto mb-4" />
          <p className="text-slate-400">Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-slate-900/50 border border-white/10 p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Contact Inquiries</h1>
            <p className="text-slate-400 mt-1">Manage customer contact submissions</p>
          </div>
          <div className="bg-slate-800 border border-white/10 rounded-lg px-4 py-2">
            <p className="text-teal-400 font-bold text-lg">{contacts.length}</p>
            <p className="text-sm text-slate-400">Total Inquiries</p>
          </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contacts List */}
        <div className="lg:col-span-2">
          {contacts.length === 0 ? (
            <div className="bg-slate-800 rounded-2xl p-8 text-center">
              <p className="text-slate-400">No contact inquiries yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                    selectedContact?.id === contact.id
                      ? "bg-teal-600/20 border-teal-500 shadow-lg shadow-teal-500/20"
                      : "bg-slate-800 border-slate-700 hover:border-teal-500/50 hover:bg-slate-700"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-white font-bold">{contact.name}</h3>
                      <p className="text-teal-300 text-sm flex items-center gap-2 mt-1">
                        <MdEmail className="text-lg" /> {contact.email}
                      </p>
                      <p className="text-slate-400 text-sm mt-1">
                        📍 {contact.country} • 📞 {contact.phone}
                      </p>
                      <p className="text-slate-500 text-xs mt-2">
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block bg-blue-600/20 text-blue-600 text-xs px-3 py-1 rounded-full font-semibold">
                        {contact.adults + contact.kids + contact.infants} Guests
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact Details */}
        <div className="lg:col-span-1">
          {selectedContact ? (
            <div className="bg-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-bold text-white mb-6">Inquiry Details</h2>

              {/* Personal Info */}
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold">Name</p>
                  <p className="text-white font-semibold">{selectedContact.name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold">Email</p>
                  <p className="text-teal-300 break-all">{selectedContact.email}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold">Phone</p>
                  <p className="text-white">{selectedContact.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold">Country</p>
                  <p className="text-white">{selectedContact.country}</p>
                </div>
              </div>

              {/* Travel Details */}
              <div className="border-t border-slate-700 pt-4 space-y-3">
                <h3 className="text-sm font-bold text-teal-300">Travel Details</h3>

                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-slate-700/50 p-3 rounded-lg text-center">
                    <p className="text-xs text-slate-400">Adults</p>
                    <p className="text-2xl font-bold text-white">{selectedContact.adults}</p>
                  </div>
                  <div className="bg-slate-700/50 p-3 rounded-lg text-center">
                    <p className="text-xs text-slate-400">Kids</p>
                    <p className="text-2xl font-bold text-white">{selectedContact.kids}</p>
                  </div>
                  <div className="bg-slate-700/50 p-3 rounded-lg text-center">
                    <p className="text-xs text-slate-400">Infants</p>
                    <p className="text-2xl font-bold text-white">{selectedContact.infants}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold mb-2">Arrival Date</p>
                  <p className="text-white bg-slate-700/50 p-2 rounded">
                    {new Date(selectedContact.arrivalDate).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold mb-2">Departure Date</p>
                  <p className="text-white bg-slate-700/50 p-2 rounded">
                    {new Date(selectedContact.departureDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Message */}
              <div className="border-t border-slate-700 pt-4 space-y-2">
                <p className="text-xs text-slate-400 uppercase font-semibold">Message</p>
                <div className="bg-slate-700/50 p-3 rounded-lg min-h-24 max-h-32 overflow-y-auto">
                  <p className="text-slate-200 text-sm whitespace-pre-wrap">
                    {selectedContact.message}
                  </p>
                </div>
              </div>

              {/* Timestamps */}
              <div className="border-t border-slate-700 pt-4 text-xs text-slate-400 space-y-1">
                <p>📅 Received: {new Date(selectedContact.createdAt).toLocaleString()}</p>
                {selectedContact.updatedAt && (
                  <p>✏️ Updated: {new Date(selectedContact.updatedAt).toLocaleString()}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <a
                  href={`mailto:${selectedContact.email}`}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
                >
                  <MdEmail /> Reply
                </a>
                <button
                  onClick={() => deleteContact(selectedContact.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
                >
                  <MdDelete /> Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-800 rounded-2xl p-6 text-center text-slate-400">
              <p>Select a contact to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

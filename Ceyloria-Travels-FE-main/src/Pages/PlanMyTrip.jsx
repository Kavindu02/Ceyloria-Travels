import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Users, DollarSign, Home, Activity, CheckCircle, ChevronRight, ChevronLeft, Send, Compass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";

export default function PlanMyTrip() {
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        // Step 1: Basic Trip Details
        destination: "",
        travelDates: { start: "", end: "", flexible: false },
        travelers: { adults: 2, children: 0, infants: 0 },
        // Step 2: Budget & Preferences
        budgetRange: "",
        accommodationType: "",
        travelPace: "",
        // Step 3: Trip Style
        interests: [],
        occasion: "",
        dietaryReqs: "",
        transportPref: "",
        message: "",
        // Step 4: Contact Details
        fullName: "",
        email: "",
        phone: "",
    });

    const updateForm = (section, field, value) => {
        if (section) {
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    const toggleInterest = (interest) => {
        setFormData(prev => {
            const current = [...prev.interests];
            if (current.includes(interest)) {
                return { ...prev, interests: current.filter(i => i !== interest) };
            } else {
                return { ...prev, interests: [...current, interest] };
            }
        });
    };

    const nextStep = () => {
        // Basic validation before moving next
        if (step === 1 && !formData.destination) {
            toast.error("Please tell us your destination.");
            return;
        }
        if (step === 2 && (!formData.budgetRange || !formData.accommodationType)) {
            toast.error("Please select a budget and accommodation preference.");
            return;
        }
        if (step === 4 && (!formData.fullName || !formData.email)) {
            toast.error("Please provide your name and email.");
            return;
        }
        setStep(s => Math.min(s + 1, 4));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const prevStep = () => {
        setStep(s => Math.max(s - 1, 1));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const submitPlan = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/plan-trip`, formData);
            setSubmitting(false);
            setSubmitted(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error) {
            console.error("Failed to submit plan:", error);
            toast.error("Failed to send request. Please try again later.");
            setSubmitting(false);
        }
    };

    // --- Animations ---
    const pageVariants = {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-stone-50 pt-36 md:pt-40 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-stone-200 p-10 text-center"
                >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-serif text-stone-800 mb-4">Request Received!</h2>
                    <p className="text-stone-600 mb-8 leading-relaxed">
                        Thank you for reaching out, {formData.fullName}. Our travel experts are carefully reviewing your preferences and will craft the perfect itinerary for your trip to {formData.destination}. We'll be in touch with you shortly at {formData.email}.
                    </p>
                    <Link to="/" className="inline-flex items-center justify-center px-8 py-3 bg-stone-900 text-white font-medium rounded-full hover:bg-amber-600 transition-colors">
                        Return to Home
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50 pt-36 md:pt-40 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Header Page */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-serif text-stone-800 mb-4 flex items-center justify-center gap-3">
                        <Compass className="text-amber-500 w-8 h-8 md:w-10 md:h-10" />
                        Plan Your Dream Trip
                    </h1>
                    <p className="text-stone-500 text-lg">Tell us about your perfect getaway, and we’ll design a custom itinerary just for you.</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-stone-200 rounded-full z-0"></div>
                        <div 
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-amber-500 rounded-full z-0 transition-all duration-500"
                            style={{ width: `${((step - 1) / 3) * 100}%` }}
                        ></div>
                        
                        {[1, 2, 3, 4].map(num => (
                            <div 
                                key={num} 
                                className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${step >= num ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 'bg-white text-stone-400 border-2 border-stone-200'}`}
                            >
                                {step > num ? <CheckCircle className="w-5 h-5" /> : num}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-3 text-xs font-semibold text-stone-400">
                        <span className={step >= 1 ? "text-stone-800" : ""}>Basics</span>
                        <span className={`text-center ${step >= 2 ? "text-stone-800" : ""}`}>Budget</span>
                        <span className={`text-center ${step >= 3 ? "text-stone-800" : ""}`}>Style</span>
                        <span className={`text-right ${step >= 4 ? "text-stone-800" : ""}`}>Contact</span>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-100 overflow-hidden">
                    <div className="p-8 md:p-12">
                        <AnimatePresence mode="wait">
                            {/* Step 1: Basics */}
                            {step === 1 && (
                                <motion.div key="step1" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
                                    <div>
                                        <h3 className="text-2xl font-serif text-stone-800 mb-2">1. The Basics</h3>
                                        <p className="text-stone-500">Where do you want to go and when?</p>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-sm font-semibold text-stone-700 mb-2 flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-amber-500" /> Destination
                                            </label>
                                            <input 
                                                type="text" 
                                                placeholder="e.g. Sri Lanka, Maldives, Europe..." 
                                                value={formData.destination}
                                                onChange={(e) => updateForm(null, 'destination', e.target.value)}
                                                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-semibold text-stone-700 mb-2 flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-amber-500" /> Travel Dates
                                            </label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input 
                                                    type="date" 
                                                    value={formData.travelDates.start}
                                                    onChange={(e) => updateForm('travelDates', 'start', e.target.value)}
                                                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-500 focus:outline-none focus:border-amber-500"
                                                />
                                                <input 
                                                    type="date" 
                                                    value={formData.travelDates.end}
                                                    onChange={(e) => updateForm('travelDates', 'end', e.target.value)}
                                                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-500 focus:outline-none focus:border-amber-500"
                                                />
                                            </div>
                                            <label className="flex items-center gap-2 mt-3 cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    checked={formData.travelDates.flexible}
                                                    onChange={(e) => updateForm('travelDates', 'flexible', e.target.checked)}
                                                    className="w-4 h-4 text-amber-500 rounded border-stone-300 focus:ring-amber-500"
                                                />
                                                <span className="text-sm text-stone-600">My dates are flexible</span>
                                            </label>
                                        </div>

                                        <div>
                                            <label className="text-sm font-semibold text-stone-700 mb-2 flex items-center gap-2">
                                                <Users className="w-4 h-4 text-amber-500" /> Who is Traveling?
                                            </label>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl text-center">
                                                    <div className="text-xs text-stone-500 uppercase font-semibold mb-2">Adults</div>
                                                    <input type="number" min="1" value={formData.travelers.adults} onChange={(e) => updateForm('travelers', 'adults', e.target.value)} className="w-full text-center bg-transparent text-xl font-bold outline-none" />
                                                </div>
                                                <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl text-center">
                                                    <div className="text-xs text-stone-500 uppercase font-semibold mb-2">Children</div>
                                                    <input type="number" min="0" value={formData.travelers.children} onChange={(e) => updateForm('travelers', 'children', e.target.value)} className="w-full text-center bg-transparent text-xl font-bold outline-none" />
                                                </div>
                                                <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl text-center">
                                                    <div className="text-xs text-stone-500 uppercase font-semibold mb-2">Infants</div>
                                                    <input type="number" min="0" value={formData.travelers.infants} onChange={(e) => updateForm('travelers', 'infants', e.target.value)} className="w-full text-center bg-transparent text-xl font-bold outline-none" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: Budget */}
                            {step === 2 && (
                                <motion.div key="step2" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
                                    <div>
                                        <h3 className="text-2xl font-serif text-stone-800 mb-2">2. Budget & Comfort</h3>
                                        <p className="text-stone-500">Help us tailor the experience to your preferences.</p>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-sm font-semibold text-stone-700 mb-3 flex items-center gap-2">
                                                <DollarSign className="w-4 h-4 text-amber-500" /> Budget Range (Per Person)
                                            </label>
                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                                {["Economy (< $1000)", "Comfort ($1000-$2000)", "Premium ($2000-$4000)", "Luxury ($4000+)"].map(b => (
                                                    <button 
                                                        key={b} onClick={() => updateForm(null, 'budgetRange', b)}
                                                        className={`p-3 text-sm font-medium rounded-xl border transition-all ${formData.budgetRange === b ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-sm' : 'bg-white border-stone-200 text-stone-600 hover:border-amber-300'}`}
                                                    >
                                                        {b}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm font-semibold text-stone-700 mb-3 flex items-center gap-2">
                                                <Home className="w-4 h-4 text-amber-500" /> Accommodation Style
                                            </label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {["Luxury 5-Star Hotels", "Boutique / Unique Stays", "Comfortable 3/4-Star Hotels", "Guest Houses / Budget", "Nature Camps / Glamping"].map(acc => (
                                                    <button 
                                                        key={acc} onClick={() => updateForm(null, 'accommodationType', acc)}
                                                        className={`p-3 text-sm font-medium rounded-xl border text-left transition-all ${formData.accommodationType === acc ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-sm' : 'bg-white border-stone-200 text-stone-600 hover:border-amber-300'}`}
                                                    >
                                                        {acc}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm font-semibold text-stone-700 mb-3 flex items-center gap-2">
                                                <Activity className="w-4 h-4 text-amber-500" /> Travel Pace
                                            </label>
                                            <div className="flex flex-col space-y-3">
                                                {[
                                                    { id: 'Relaxed', desc: 'Slow down, sleep in, and take it easy' },
                                                    { id: 'Moderate', desc: 'A good balance of activities and free time' },
                                                    { id: 'Active', desc: 'Pack in as much as possible every day' }
                                                ].map(pace => (
                                                    <button 
                                                        key={pace.id} onClick={() => updateForm(null, 'travelPace', pace.id)}
                                                        className={`p-4 rounded-xl border flex items-center justify-between transition-all ${formData.travelPace === pace.id ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-sm' : 'bg-white border-stone-200 text-stone-600 hover:border-amber-300'}`}
                                                    >
                                                        <div className="text-left">
                                                            <div className="font-bold">{pace.id}</div>
                                                            <div className="text-xs mt-1 opacity-80">{pace.desc}</div>
                                                        </div>
                                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.travelPace === pace.id ? 'border-amber-500' : 'border-stone-300'}`}>
                                                            {formData.travelPace === pace.id && <div className="w-2.5 h-2.5 bg-amber-500 rounded-full"></div>}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3: Style */}
                            {step === 3 && (
                                <motion.div key="step3" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
                                    <div>
                                        <h3 className="text-2xl font-serif text-stone-800 mb-2">3. Style & Extras</h3>
                                        <p className="text-stone-500">What makes a trip special for you?</p>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-stone-700 mb-3">Trip Interests (Select multiple)</label>
                                            <div className="flex flex-wrap gap-2">
                                                {["Adventure", "Culture & History", "Food & Culinary", "Wildlife & Nature", "Beaches", "Wellness & Spa", "Nightlife", "Shopping"].map(int => (
                                                    <button
                                                        key={int} onClick={() => toggleInterest(int)}
                                                        className={`px-4 py-2 text-sm rounded-full border transition-all ${formData.interests.includes(int) ? 'bg-amber-500 border-amber-500 text-white shadow-md' : 'bg-white border-stone-200 text-stone-600 hover:border-amber-300'}`}
                                                    >
                                                        {int}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-stone-700 mb-2">Special Occasion?</label>
                                                <select value={formData.occasion} onChange={(e) => updateForm(null, 'occasion', e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-700 focus:outline-none focus:border-amber-500">
                                                    <option value="">None / Regular Trip</option>
                                                    <option value="Honeymoon">Honeymoon</option>
                                                    <option value="Anniversary">Anniversary</option>
                                                    <option value="Family Vacation">Family Vacation</option>
                                                    <option value="Birthday">Birthday</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-stone-700 mb-2">Transport Preference</label>
                                                <select value={formData.transportPref} onChange={(e) => updateForm(null, 'transportPref', e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-700 focus:outline-none focus:border-amber-500">
                                                    <option value="">Select option</option>
                                                    <option value="Private Car & Driver">Private Car & Driver (Recommended)</option>
                                                    <option value="Self Drive / Rent a car">Self Drive / Rent a car</option>
                                                    <option value="Public Transport / Train">Public Transport / Train</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-stone-700 mb-2">Dietary Requirements</label>
                                            <input type="text" placeholder="e.g. Vegetarian, Halal, Vegan, Allergies..." value={formData.dietaryReqs} onChange={(e) => updateForm(null, 'dietaryReqs', e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-700 focus:outline-none focus:border-amber-500" />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-stone-700 mb-2">Anything else we should know?</label>
                                            <textarea rows="3" placeholder="Tell us about specific places you want to visit, fears, or physical limitations..." value={formData.message} onChange={(e) => updateForm(null, 'message', e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-700 focus:outline-none focus:border-amber-500 resize-none"></textarea>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 4: Contact Info */}
                            {step === 4 && (
                                <motion.div key="step4" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
                                    <div>
                                        <h3 className="text-2xl font-serif text-stone-800 mb-2">4. Your Details</h3>
                                        <p className="text-stone-500">Where should we send your custom itinerary?</p>
                                    </div>

                                    <form id="planForm" onSubmit={submitPlan} className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-semibold text-stone-700 mb-2">Full Name *</label>
                                            <input type="text" required value={formData.fullName} onChange={(e) => updateForm(null, 'fullName', e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-700 focus:outline-none focus:border-amber-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-stone-700 mb-2">Email Address *</label>
                                            <input type="email" required value={formData.email} onChange={(e) => updateForm(null, 'email', e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-700 focus:outline-none focus:border-amber-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-stone-700 mb-2">Phone Number / WhatsApp</label>
                                            <input type="tel" value={formData.phone} onChange={(e) => updateForm(null, 'phone', e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-700 focus:outline-none focus:border-amber-500" />
                                            <p className="text-xs text-stone-400 mt-2">Providing a WhatsApp number helps us reach you faster.</p>
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer Nav */}
                    <div className="bg-stone-50 px-8 py-6 border-t border-stone-100 flex items-center justify-between">
                        {step > 1 ? (
                            <button onClick={prevStep} className="flex items-center gap-2 text-stone-500 hover:text-stone-800 font-medium transition-colors">
                                <ChevronLeft className="w-5 h-5" /> Back
                            </button>
                        ) : (
                            <div></div> // Empty div for flexbox alignment
                        )}

                        {step < 4 ? (
                            <button onClick={nextStep} className="flex items-center gap-2 bg-stone-900 text-white px-8 py-3 rounded-full hover:bg-amber-600 font-medium transition-colors shadow-lg shadow-stone-200">
                                Next Step <ChevronRight className="w-5 h-5" />
                            </button>
                        ) : (
                            <button form="planForm" type="submit" disabled={submitting} className="flex items-center gap-2 bg-amber-500 text-white px-8 py-3 rounded-full hover:bg-amber-600 font-bold transition-all shadow-lg shadow-amber-500/30 disabled:opacity-70 disabled:cursor-not-allowed">
                                {submitting ? "Sending Request..." : "Get My Custom Plan"} <Send className="w-4 h-4 ml-1" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

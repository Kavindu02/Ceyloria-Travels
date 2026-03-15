import React, { useEffect, useState } from "react";
import { Compass } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import DestinationsOverview from "../components/DestinationsOverview";
import DestinationsDetail from "../components/DestinationsDetail";

const Destinations = () => {
    const { category } = useParams();
    const navigate = useNavigate();
    
    // State for data
    const [categoryData, setCategoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const safeCategory = category ? decodeURIComponent(String(category)).trim().toLowerCase() : "";
    
    // Derived state
    const selectedCategory = Array.isArray(categoryData) ? categoryData.find(c => {
        if (!c || !safeCategory) return false;
        const cId = c.id ? String(c.id).trim().toLowerCase() : "";
        const cTitle = c.title ? String(c.title).trim().toLowerCase().replace(/\s+/g, '-') : "";
        return cId === safeCategory || cTitle === safeCategory || c.id === category;
    }) : null;

    // Fetch Data from Backend
    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/destinations`);
                setCategoryData(res.data);
            } catch (err) {
                console.error("Failed to fetch destinations:", err);
                setError("Failed to load destinations.");
            } finally {
                setLoading(false);
            }
        };

        fetchDestinations();
    }, []);

    // Scroll to top on category change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [category]);

    if (error) {
         return (
            <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
                <div className="text-center">
                     <p className="text-red-500 text-xl font-bold mb-4">{error}</p>
                     <p className="text-gray-500">Please check your internet connection or try again later.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="font-sans text-gray-800 bg-[#faf9f6] selection:bg-blue-600 selection:text-white overflow-x-hidden min-h-screen">

            <div className={`transition-all duration-700 pt-0`}>
                {!selectedCategory ? (
                    <DestinationsOverview
                        categoryData={categoryData}
                        onSelectCategory={(cat) => navigate(`/destinations/${cat.id}`)}
                    />
                ) : (
                    <DestinationsDetail
                        selectedCategory={selectedCategory}
                        onBack={() => navigate("/destinations")}
                    />
                )}
            </div>

        </div>
    );
};

export default Destinations;
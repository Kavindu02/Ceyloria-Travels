import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ArrowRight, Calendar, Users } from "lucide-react";

const fontHead = "font-['Playfair_Display',_serif]";
const fontBody = "font-['DM_Sans',_sans-serif]";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  const [packages, setPackages] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        // Fetch packages
        const pkgRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/packages`);
        const pkgData = await pkgRes.json();

        // Fetch accommodations
        const accRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/accommodations`);
        const accData = await accRes.json();

        // Filter based on query
        const filteredPackages = Array.isArray(pkgData)
          ? pkgData.filter(pkg =>
            pkg.title?.toLowerCase().includes(query.toLowerCase()) ||
            pkg.description?.toLowerCase().includes(query.toLowerCase())
          )
          : [];

        const filteredAccommodations = Array.isArray(accData)
          ? accData.filter(acc =>
            acc.name?.toLowerCase().includes(query.toLowerCase()) ||
            acc.description?.toLowerCase().includes(query.toLowerCase())
          )
          : [];

        setPackages(filteredPackages);
        setAccommodations(filteredAccommodations);
      } catch (err) {
        setError(err.message);
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  if (loading) {
    return (
      <div className={`${fontBody} min-h-screen bg-white flex items-center justify-center pt-20`}>
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Searching...</p>
        </div>
      </div>
    );
  }

  const totalResults = packages.length + accommodations.length;

  return (
    <div className={`${fontBody} min-h-screen bg-white pt-24 pb-12`}>
      {/* Header */}
      <div className="px-6 md:px-16 lg:px-24 mb-12">
        <h1 className={`${fontHead} text-4xl md:text-5xl text-gray-900 mb-4`}>
          Search Results for "{query}"
        </h1>
        <p className="text-gray-600 text-lg">
          Found <span className="font-bold text-blue-600">{totalResults}</span> {totalResults === 1 ? 'result' : 'results'}
        </p>
      </div>

      {error && (
        <div className="px-6 md:px-16 lg:px-24 mb-8">
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            Error searching: {error}
          </div>
        </div>
      )}

      {totalResults === 0 ? (
        <div className="px-6 md:px-16 lg:px-24">
          <div className="bg-gray-50 rounded-lg p-12 text-center">
            <p className="text-gray-600 text-lg mb-6">
              No results found for your search. Try different keywords.
            </p>
            <Link
              to="/packages"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
            >
              Browse All Packages <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="px-6 md:px-16 lg:px-24 space-y-16">
          {/* Packages Results */}
          {packages.length > 0 && (
            <section>
              <div className="mb-8">
                <h2 className={`${fontHead} text-3xl text-gray-900 mb-2`}>
                  Travel Packages ({packages.length})
                </h2>
                <div className="w-12 h-1 bg-blue-600 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {packages.map((pkg, idx) => (
                  <Link
                    key={idx}
                    to="/packages"
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={pkg.image || (Array.isArray(pkg.images) && pkg.images[0]) || "/gallery/img1.jpg"}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        alt={pkg.title}
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">
                        Package
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className={`${fontHead} text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors`}>
                        {pkg.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                        {pkg.description || pkg.desc}
                      </p>
                      {pkg.days && (
                        <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {pkg.days}
                          </span>
                          {pkg.people && (
                            <>
                              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" /> {pkg.people} Pax
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Accommodations Results */}
          {accommodations.length > 0 && (
            <section>
              <div className="mb-8">
                <h2 className={`${fontHead} text-3xl text-gray-900 mb-2`}>
                  Accommodations ({accommodations.length})
                </h2>
                <div className="w-12 h-1 bg-blue-600 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {accommodations.map((acc, idx) => (
                  <Link
                    key={idx}
                    to="/accommodations"
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={acc.image || (Array.isArray(acc.images) && acc.images[0]) || "/gallery/img1.jpg"}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        alt={acc.name}
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">
                        🏨 Stay
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className={`${fontHead} text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors`}>
                        {acc.name}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                        {acc.description}
                      </p>
                      {acc.location && (
                        <p className="text-sm text-gray-500 font-medium">
                          📍 {acc.location}
                        </p>
                      )}
                      {acc.price && (
                        <p className="text-lg font-bold text-blue-600 mt-3">
                          LKR {acc.price.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

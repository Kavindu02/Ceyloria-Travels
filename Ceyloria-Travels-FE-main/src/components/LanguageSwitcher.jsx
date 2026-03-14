import { useState, useEffect, useRef } from "react";
import { ChevronUp, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const languages = [
    { code: 'en', name: 'English', country: 'gb' },
    { code: 'si', name: 'Sinhala', country: 'lk' },
    { code: 'ta', name: 'Tamil', country: 'lk' },
    { code: 'fr', name: 'French', country: 'fr' },
    { code: 'de', name: 'German', country: 'de' },
    { code: 'ru', name: 'Russian', country: 'ru' },
    { code: 'zh-CN', name: 'Chinese', country: 'cn' },
    { code: 'it', name: 'Italian', country: 'it' },
    { code: 'es', name: 'Spanish', country: 'es' },
    { code: 'ar', name: 'Arabic', country: 'sa' },
    { code: 'ja', name: 'Japanese', country: 'jp' },
    { code: 'ko', name: 'Korean', country: 'kr' },
    { code: 'pt', name: 'Portuguese', country: 'pt' },
    { code: 'nl', name: 'Dutch', country: 'nl' },
    { code: 'hi', name: 'Hindi', country: 'in' },
    { code: 'tr', name: 'Turkish', country: 'tr' },
    { code: 'sv', name: 'Swedish', country: 'se' },
    { code: 'no', name: 'Norwegian', country: 'no' },
    { code: 'da', name: 'Danish', country: 'dk' },
    { code: 'pl', name: 'Polish', country: 'pl' },
    { code: 'he', name: 'Hebrew', country: 'il' },
    { code: 'th', name: 'Thai', country: 'th' },
    { code: 'vi', name: 'Vietnamese', country: 'vn' },
];

export default function LanguageSwitcher() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState(languages[0]);
    const switcherRef = useRef(null);

    // Disable body scroll when open — save/restore scroll position to prevent jump
    useEffect(() => {
        if (isOpen) {
            const scrollY = window.scrollY;
            document.body.style.overflow = 'hidden';
            document.body.dataset.scrollY = scrollY;
        } else {
            document.body.style.overflow = '';
            const savedY = parseInt(document.body.dataset.scrollY || '0', 10);
            if (savedY) window.scrollTo({ top: savedY, behavior: 'instant' });
            delete document.body.dataset.scrollY;
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (switcherRef.current && !switcherRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    // Function to get cookie value
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    };

    useEffect(() => {
        // Sync state with existing cookie on mount
        const savedLang = getCookie('googtrans');
        if (savedLang) {
            const code = savedLang.split('/').pop();
            const found = languages.find(l => l.code === code);
            if (found) setCurrentLang(found);
        }

        // Block Google Translate from jumping the page by intercepting its body style mutation
        const bodyObserver = new MutationObserver(() => {
            const body = document.body;
            // Google Translate sets position:fixed + negative top — intercept and undo it
            if (body.style.position === 'fixed' || body.style.top) {
                const scrollY = Math.abs(parseInt(body.style.top || '0', 10));
                body.style.position = '';
                body.style.top = '';
                if (scrollY > 0) window.scrollTo({ top: scrollY, behavior: 'instant' });
            }
        });
        bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['style'] });

        // Add Google Translate script
        const addScript = () => {
            const script = document.createElement('script');
            script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
        };

        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: languages.map(l => l.code).join(','),
                layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false,
            }, 'google_translate_element');
        };

        if (!window.google?.translate) {
            addScript();
        }

        return () => bodyObserver.disconnect();
    }, []);

    const changeLanguage = (lang) => {
        setCurrentLang(lang);
        setIsOpen(false);

        const host = window.location.hostname;
        const rootDomain = host.split('.').slice(-2).join('.'); // For clearing e.g. .site.com and site.com

        const clearCookies = () => {
            const expireStr = "expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            // Clear without domain (most common)
            document.cookie = `googtrans=; ${expireStr}`;
            // Clear with explicit domain and subdomains
            document.cookie = `googtrans=; ${expireStr} domain=${host};`;
            document.cookie = `googtrans=; ${expireStr} domain=.${host};`;
            
            if (host !== 'localhost' && host !== '127.0.0.1') {
                document.cookie = `googtrans=; ${expireStr} domain=${rootDomain};`;
                document.cookie = `googtrans=; ${expireStr} domain=.${rootDomain};`;
            }
        };

        const setCookies = (langPath) => {
            const expireStr = "expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/;";
            // Set without domain (standard)
            document.cookie = `googtrans=${langPath}; ${expireStr}`;
            // Also set with domain to ensure it sticks on hosted environments
            document.cookie = `googtrans=${langPath}; ${expireStr} domain=${host};`;
        };

        const select = document.querySelector('.goog-te-combo');

        if (lang.code === 'en') {
            // Revert back to English
            clearCookies();
            
            // Try to trigger the select if available
            if (select) {
                select.value = 'en';
                select.dispatchEvent(new Event('change'));
            }
            
            // Force reload to clear translation state
            setTimeout(() => {
                window.location.reload();
            }, 150);
        } else {
            // Set translation to the selected language
            const langPath = `/en/${lang.code}`;
            setCookies(langPath);

            if (select) {
                select.value = lang.code;
                select.dispatchEvent(new Event('change'));
            }

            setTimeout(() => {
                window.location.reload();
            }, 150);
        }
    };

    return (
        <>
            {/* Hidden Google Translate Element */}
            <div id="google_translate_element" style={{ display: 'none' }}></div>

            <div ref={switcherRef} className="fixed bottom-6 left-6 z-[9999]">
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute bottom-full left-0 mb-4 w-64 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 p-2 notranslate"
                            translate="no"
                        >
                            <div className="max-h-80 overflow-y-auto custom-scrollbar">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => changeLanguage(lang)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentLang.code === lang.code
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'hover:bg-gray-50 text-gray-700'
                                            }`}
                                    >
                                        <div className="w-6 h-4 overflow-hidden rounded-sm shadow-sm border border-gray-100 flex-shrink-0">
                                            <img
                                                src={`https://flagcdn.com/w40/${lang.country}.png`}
                                                alt={lang.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <span className="font-medium text-sm">{lang.name}</span>
                                        {currentLang.code === lang.code && (
                                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    layout
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative flex items-center gap-2.5 bg-white/90 backdrop-blur-md border border-gray-200 p-2 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.16)] transition-all duration-500 group border-2 border-white"
                >
                    <div className="w-9 h-7 overflow-hidden rounded-lg shadow-sm border border-gray-100">
                        <img
                            src={`https://flagcdn.com/w80/${currentLang.country}.png`}
                            alt={currentLang.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    >
                        <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </motion.div>
                </motion.button>
            </div>

            <style>{`
        /* Hide the Google Translate Top Bar */
        .goog-te-banner-frame, 
        .goog-te-banner,
        .goog-te-menu-value span:nth-child(2),
        .goog-te-menu-value img,
        .goog-te-gadget-icon,
        .skiptranslate > iframe,
        #goog-gt-tt,
        .goog-te-balloon-frame,
        #google_translate_element2 {
          display: none !important;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
          border: 1px solid #f8fafc;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* Hide specific Google elements */
        iframe.skiptranslate {
          display: none !important;
          visibility: hidden !important;
        }

        .goog-tooltip {
          display: none !important;
        }
        .goog-tooltip:hover {
          display: none !important;
        }
        .goog-text-highlight {
          background-color: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
      `}</style>
        </>
    );
}

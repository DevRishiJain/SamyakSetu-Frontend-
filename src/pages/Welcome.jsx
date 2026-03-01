import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Typed from 'typed.js';
import { useTheme } from '../context/ThemeContext';

export default function Welcome() {
    const el = useRef(null);
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [selectedLang, setSelectedLang] = useState('English');

    const languages = [
        { name: 'English', native: 'English' },
        { name: 'Hindi', native: 'हिन्दी' },
        { name: 'Telugu', native: 'తెలుగు' },
        { name: 'Marathi', native: 'मराठी' },
        { name: 'Bengali', native: 'বাংলা' },
        { name: 'Tamil', native: 'தமிழ்' },
        { name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    ];

    useEffect(() => {
        const typed = new Typed(el.current, {
            strings: [
                'Welcome friend! Let’s improve your farm together.',
                'नमस्ते मित्र! आइए मिलकर अपने खेत को बेहतर बनाएं।',
                'ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਦੋਸਤ! ਆਓ ਤੁਹਾਡੀ ਖੇਤੀ ਸੁਧਾਰੀਏ।',
                'বন্ধু স্বাগতম! আসুন একসাথে আপনার খামার উন্নত করি।',
                'మిత్రమా స్వాగతం! మన పొలాన్ని కలిసి అభివృద్ధి చేద్దాం.',
                'मित्रा स्वागत आहे! चला सोबत मिळून आपली শেती सुधारूया.',
                'நண்பரே வணக்கம்! உங்கள் விவசாயத்தை மேம்படுத்த ஒன்றிணைவோம்.'
            ],
            typeSpeed: 60,
            backSpeed: 40,
            loop: true,
            backDelay: 2500,
            showCursor: true,
            cursorChar: '|'
        });

        return () => {
            typed.destroy();
        };
    }, []);

    const features = [
        {
            title: "Smart Soil Intelligence",
            subtitle: "Know Your Farm from the Inside Out",
            desc: "Stop guessing. Simply click a photo of your soil and our advanced AI vision models will detect the soil type, quality, and potential issues instantly. Based on your exact location, you get personalized crop suggestions and fertilizer recommendations tailored specifically for you.",
            icon: "photo_camera",
            color: "text-primary",
            bg: "bg-primary/10",
            imgStyle: "bg-gradient-to-tr from-primary to-green-600",
            image: "/images/soil_mascot.png",
            list: ["Instant AI Soil Detection", "Land & Irrigation Profiling", "Personalized Crop Advisory"]
        },
        {
            title: "Hyper-Local Weather & Alerts",
            subtitle: "Never Let the Weather Surprise You",
            desc: "By integrating real-time weather APIs with your farm's location, Setu Mitra gives you WHAT-WHEN-HOW advisories. From predicting the perfect time to sow, to pushing urgent alerts about sudden climate shifts—protect your harvest proactively.",
            icon: "thermostat",
            color: "text-saffron",
            bg: "bg-saffron/10",
            imgStyle: "bg-gradient-to-tr from-saffron to-orange-500",
            image: "/images/weather_mascot.png",
            reverse: true,
            list: ["Location-Based Auto Weather", "Sudden Climate Shift Alerts", "WHAT-WHEN-HOW Daily Advisory"]
        },
        {
            title: "Voice-First AI Chatbot",
            subtitle: "Talk to Your Agricultural Expert 24/7",
            desc: "Got a question? Just ask! Our intelligent chatbot supports speech-to-text and multi-language communication. You can even upload images of diseased leaves to get instant remedies. It's like having an agronomist in your pocket, speaking your regional language.",
            icon: "forum",
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            imgStyle: "bg-gradient-to-tr from-blue-500 to-cyan-500",
            image: "/images/chatbot_mascot.png",
            list: ["Text, Voice & Image Chat", "Native Language Support", "Instant Disease Remedies"]
        },
        {
            title: "Community & Market Prices",
            subtitle: "Grow Together, Sell Smarter",
            desc: "Connect with a vast network of Indian farmers in our AI-moderated community. Share tips, discuss challenges, and compare live rates across nearby mandis to make sure you get the best possible price for your hard-earned produce.",
            icon: "groups",
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            imgStyle: "bg-gradient-to-tr from-purple-600 to-pink-500",
            image: "/images/community_mascot.png",
            reverse: true,
            list: ["AI-Moderated Forums", "Live Mandi Prices", "Govt Procurement Info"]
        },
        {
            title: "Carbon Credits Marketplace",
            subtitle: "Earn Money from Sustainable Farming",
            desc: "Monetize your eco-friendly farming practices. Sell carbon credits directly to verified corporate buyers in our secure marketplace. Plant trees, reduce tillage, and earn supplementary income while helping the planet.",
            icon: "park",
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            imgStyle: "bg-gradient-to-tr from-emerald-500 to-teal-500",
            image: "/images/carbon_mascot.png",
            badge: "Coming Soon 🚀",
            list: ["Trade Carbon Credits", "Corporate Buyer Validation", "Extra Sustainable Income"]
        }
    ];

    return (
        <div className="bg-background-light dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-display transition-colors duration-300">
            <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
                <div className="layout-container flex h-full grow flex-col">
                    {/* Header */}
                    <header className="flex items-center justify-between border-b border-primary/10 px-6 py-4 lg:px-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center size-10 rounded-lg bg-primary text-white">
                                <span className="material-symbols-outlined text-2xl">potted_plant</span>
                            </div>
                            <h2 className="text-xl font-bold tracking-tight text-primary">Samyak Setu</h2>
                        </div>

                        <div className="flex items-center gap-4 md:gap-6">
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300 flex items-center justify-center cursor-pointer"
                                aria-label="Toggle Dark Mode"
                            >
                                <span className="material-symbols-outlined text-xl">
                                    {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                                </span>
                            </button>

                            <div className="relative">
                                <button
                                    onClick={() => setIsLangOpen(!isLangOpen)}
                                    className="flex items-center gap-2 text-sm font-semibold hover:text-primary transition-colors cursor-pointer bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700"
                                >
                                    <span className="material-symbols-outlined text-lg">language</span>
                                    <span className="hidden sm:inline">{selectedLang}</span>
                                    <span className="material-symbols-outlined text-lg">expand_more</span>
                                </button>
                                {isLangOpen && (
                                    <div className="absolute right-0 top-12 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col z-50">
                                        {languages.map(l => (
                                            <button
                                                key={l.name}
                                                onClick={() => {
                                                    setSelectedLang(l.native);
                                                    setIsLangOpen(false);
                                                }}
                                                className="px-4 py-2 text-left hover:bg-primary/10 hover:text-primary font-medium transition-colors text-sm"
                                            >
                                                {l.native}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <a className="text-sm font-semibold hover:text-primary transition-colors cursor-pointer hidden md:block">About</a>
                        </div>
                    </header>

                    <main className="flex-1">
                        {/* Hero Section */}
                        <div className="px-6 py-10 lg:px-20">
                            <div className="relative overflow-hidden rounded-xl lg:rounded-3xl bg-primary/5 dark:bg-primary/10 p-8 lg:p-16 flex flex-col lg:flex-row items-center gap-12">
                                <div className="absolute inset-0 bg-primary/5 pointer-events-none opacity-50"></div>
                                <div className="flex-1 flex flex-col gap-6 text-center lg:text-left z-10 w-full">
                                    <div className="inline-flex items-center self-center lg:self-start px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                                        Your AI Agricultural Assistant • आपका कृषि मित्र
                                    </div>
                                    <div className="min-h-[140px] md:min-h-[180px] lg:min-h-[160px] flex flex-col justify-center">
                                        <h1 className="text-4xl lg:text-6xl font-black leading-tight tracking-tight text-slate-900 dark:text-slate-50 mb-0">
                                            <span className="inline-block" ref={el}></span>
                                        </h1>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                                        <button onClick={() => navigate('/auth')} className="cursor-pointer h-12 lg:h-14 px-8 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                                            <span>Get Started</span>
                                            <span className="material-symbols-outlined">arrow_forward</span>
                                        </button>
                                        <button className="cursor-pointer h-12 lg:h-14 px-8 border-2 border-primary/20 hover:border-primary/40 text-primary dark:text-primary dark:hover:text-primary/80 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl font-bold text-lg transition-all flex items-center justify-center">
                                            Learn More
                                        </button>
                                    </div>
                                </div>
                                <div className="relative w-full max-w-[320px] md:max-w-[400px] flex-shrink-0 lg:w-1/3 aspect-square mt-6 lg:mt-0">
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 lg:-left-20 lg:top-10 lg:translate-x-0 z-20 bg-white dark:bg-slate-800 px-4 py-2 rounded-2xl shadow-xl border-2 border-primary/20 whitespace-nowrap animate-bounce">
                                        <p className="text-sm font-bold text-primary">Namaste! I am Setu Mitra.</p>
                                        <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 lg:left-full lg:top-1/2 lg:translate-y-[-50%] lg:translate-x-[-2px] w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-white dark:border-t-slate-800 lg:border-t-transparent lg:border-b-transparent lg:border-l-white dark:lg:border-l-slate-800 lg:border-l-[10px]"></div>
                                    </div>
                                    <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl"></div>
                                    <div className="relative z-10 h-full w-full rounded-2xl bg-cover bg-center shadow-2xl border-4 border-white dark:border-slate-800" style={{ backgroundImage: "url('/images/hero_mascot.png')" }}>
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl flex items-center gap-3 border border-primary/10 z-30">
                                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                            <span className="material-symbols-outlined">auto_awesome</span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 uppercase">Status</p>
                                            <p className="text-sm font-bold text-primary">Online & Ready</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Features Section */}
                        <div className="py-20 bg-earth-warm/30 dark:bg-slate-900/50">
                            <div className="max-w-7xl mx-auto px-6 lg:px-20">
                                <div className="text-center max-w-3xl mx-auto mb-16">
                                    <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-3">Powering Indian Agriculture</h2>
                                    <h3 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-slate-50">
                                        Revolutionizing Your Farm with the Power of AI
                                    </h3>
                                    <p className="mt-4 text-slate-600 dark:text-slate-400 text-lg">
                                        Samyak Setu is built from the ground up for Indian farmers. We combine AI capabilities with local wisdom to help you maximize your yield safely and effectively.
                                    </p>
                                </div>

                                <div className="space-y-20 lg:space-y-32">
                                    {features.map((feature, idx) => (
                                        <div key={idx} className={`flex flex-col gap-10 lg:gap-20 items-center ${feature.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
                                            <div className="flex-1 w-full text-center lg:text-left">
                                                <div className={`inline-flex items-center justify-center p-3 rounded-2xl ${feature.bg} ${feature.color} mb-6`}>
                                                    <span className="material-symbols-outlined text-4xl">{feature.icon}</span>
                                                </div>
                                                <h4 className="text-2xl lg:text-3xl font-bold flex flex-wrap items-center gap-3 text-slate-900 dark:text-white mb-2">
                                                    {feature.title}
                                                    {feature.badge && <span className="text-[10px] uppercase font-black tracking-widest bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-3 py-1 rounded-full animate-bounce shadow-lg shadow-emerald-500/40 whitespace-nowrap">{feature.badge}</span>}
                                                </h4>
                                                <h5 className="text-lg font-medium text-slate-500 dark:text-slate-400 mb-6">{feature.subtitle}</h5>
                                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg mb-8">
                                                    {feature.desc}
                                                </p>
                                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                                                    {feature.list.map((item, i) => (
                                                        <li key={i} className="flex items-center gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                                            <div className={`size-6 rounded-full flex items-center justify-center ${feature.bg} ${feature.color}`}>
                                                                <span className="material-symbols-outlined text-sm font-bold">check</span>
                                                            </div>
                                                            <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm">{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="flex-1 w-full flex justify-center">
                                                <div className={`w-full max-w-md aspect-square rounded-[2rem] p-3 sm:p-5 shadow-2xl relative ${feature.imgStyle}`}>
                                                    <div className="absolute inset-0 bg-white/10 dark:bg-black/10 backdrop-blur-[2px] rounded-[2rem]"></div>
                                                    <div className="bg-white/90 dark:bg-slate-900/90 h-full w-full rounded-xl lg:rounded-2xl shadow-inner border border-white/20 overflow-hidden relative group">
                                                        <img src={feature.image} alt={feature.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                                        <div className="absolute inset-0 ring-1 ring-inset ring-black/10 dark:ring-white/10 rounded-xl lg:rounded-2xl pointer-events-none"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </main>

                    {/* Footer */}
                    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12 px-6 lg:px-20">
                        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center size-8 rounded-md bg-primary text-white">
                                    <span className="material-symbols-outlined text-lg">potted_plant</span>
                                </div>
                                <h2 className="text-lg font-bold tracking-tight text-primary">Samyak Setu</h2>
                            </div>
                            <div className="flex gap-8 text-sm font-medium text-slate-500 dark:text-slate-400">
                                <a className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</a>
                                <a className="hover:text-primary transition-colors cursor-pointer">Terms of Service</a>
                                <a className="hover:text-primary transition-colors cursor-pointer">Contact Support</a>
                            </div>
                            <p className="text-sm text-slate-400 italic text-center md:text-right">
                                Developed for India's prosperity. <br className="hidden md:block" /> भारत की समृद्धि के लिए विकसित।
                            </p>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}

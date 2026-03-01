import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function DashboardLayout() {
    const { theme, toggleTheme } = useTheme();
    const { language, setLanguage } = useLanguage();
    const navigate = useNavigate();
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

    const languages = [
        { name: 'English (India)', native: 'English (India)', short: 'EN' },
        { name: 'Hindi', native: 'हिन्दी', short: 'HI' },
        { name: 'Telugu', native: 'తెలుగు', short: 'TE' },
        { name: 'Marathi', native: 'मराठी', short: 'MR' },
        { name: 'Bengali', native: 'বাংলা', short: 'BN' },
        { name: 'Tamil', native: 'தமிழ்', short: 'TA' },
        { name: 'Punjabi', native: 'ਪੰਜਾਬੀ', short: 'PA' },
    ];

    const translations = {
        'English (India)': { home: 'Home', soil: 'Soil', chat: 'Chat', history: 'History', settings: 'Settings', location: 'Nagpur, Maharashtra', help: 'Help Center' },
        'हिन्दी': { home: 'घर', soil: 'मिट्टी', chat: 'बात करें', history: 'इतिहास', settings: 'सेटिंग', location: 'नागपुर, महाराष्ट्र', help: 'सहायता केंद्र' },
    };

    const t = (key) => translations[language]?.[key] || translations['English (India)'][key];

    const navItems = [
        { path: '/dashboard', icon: 'home', label: t('home'), exact: true },
        { path: '/dashboard/soil', icon: 'science', label: t('soil') },
        { path: '/dashboard/chat', icon: 'chat_bubble', label: t('chat') },
        { path: '/dashboard/history', icon: 'history', label: t('history') },
        { path: '/dashboard/settings', icon: 'settings', label: t('settings') },
    ];

    return (
        <div className="bg-background-light dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300"
            style={{ backgroundImage: "radial-gradient(rgba(11, 106, 57, 0.08) 0.5px, transparent 0.5px)", backgroundSize: "20px 20px" }}>
            <div className="layout-container flex flex-col md:flex-row h-full min-h-screen">
                {/* Desktop Sidebar (Hidden on Mobile) */}
                <aside className="w-64 hidden bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 md:flex flex-col sticky top-0 h-screen z-50">
                    <div className="p-6 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
                        <div className="bg-primary text-white p-2 rounded-lg">
                            <span className="material-symbols-outlined text-2xl">agriculture</span>
                        </div>
                        <h2 className="text-xl font-bold text-primary dark:text-white tracking-tight">Samyak Setu</h2>
                    </div>
                    <nav className="flex-1 px-4 space-y-2 py-4">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.exact}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer font-medium ${isActive
                                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary'
                                    }`
                                }
                            >
                                <span className="material-symbols-outlined">{item.icon}</span>
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>
                    <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                        <NavLink to="/dashboard/settings" className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-600">
                            <img alt="User Profile" className="size-10 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkoW3O0sqso3W3ZBs4Nz0ab8UYjYQdHXcwvPTwPTolXk1SRT7T8rTdTuAmVUCn46OpJnmmrE2VQ5vKAe0KZ1qABuhCdhK-2svNZy9-l4JFA42x25kh1YrLeL-9SoZzsvlmdGvtjRMfqD3CvpJ2jQ9F2c9bKPGYHxU34E82jBcou1lNJhqcHXFvNJMbsAH6XGXNVqi_0LIvq4YDRlUN8DSoVahmY_atIaMKaY3MfWULwkedBFy7iwRRRZBg1m1ZeL3hxsw5h39yTw" />
                            <div>
                                <p className="text-sm font-bold">Ram Singh</p>
                                <p className="text-xs text-slate-500">ID: #44921</p>
                            </div>
                        </NavLink>
                    </div>
                </aside>

                <main className="flex-1 min-w-0 flex flex-col mt-20 md:mt-0 relative overflow-x-hidden">
                    {/* Top Top Header */}
                    <header className="flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex flex-1 items-center gap-4">
                            {/* Mobile Hamburger & Profile */}
                            <div className="md:hidden flex items-center gap-3">
                                <button onClick={() => setIsMobileMenuOpen(true)} className="p-1.5 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer flex items-center justify-center">
                                    <span className="material-symbols-outlined text-3xl">menu</span>
                                </button>
                                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard/settings')}>
                                    <img alt="User Profile" className="size-9 rounded-full border-2 border-primary/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkoW3O0sqso3W3ZBs4Nz0ab8UYjYQdHXcwvPTwPTolXk1SRT7T8rTdTuAmVUCn46OpJnmmrE2VQ5vKAe0KZ1qABuhCdhK-2svNZy9-l4JFA42x25kh1YrLeL-9SoZzsvlmdGvtjRMfqD3CvpJ2jQ9F2c9bKPGYHxU34E82jBcou1lNJhqcHXFvNJMbsAH6XGXNVqi_0LIvq4YDRlUN8DSoVahmY_atIaMKaY3MfWULwkedBFy7iwRRRZBg1m1ZeL3hxsw5h39yTw" />
                                    <div className="leading-tight">
                                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Ram Singh</p>
                                    </div>
                                </div>
                            </div>
                            {/* Desktop Location */}
                            <div className="hidden md:flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                <span className="material-symbols-outlined text-primary">location_on</span>
                                <span className="font-medium text-sm">{t('location')}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 md:gap-4">
                            <div className="relative hidden md:block">
                                <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className="p-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-1 cursor-pointer transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                                    <span className="material-symbols-outlined text-lg">language</span>
                                    {languages.find(l => l.native === language)?.short || 'EN'}
                                </button>
                                {isLangMenuOpen && (
                                    <div className="absolute right-0 top-12 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col z-50 animate-in fade-in slide-in-from-top-2">
                                        {languages.map(l => (
                                            <button
                                                key={l.name}
                                                onClick={() => {
                                                    setLanguage(l.native);
                                                    setIsLangMenuOpen(false);
                                                }}
                                                className={`px-4 py-2 text-left font-medium transition-colors text-sm cursor-pointer ${language === l.native ? 'bg-primary/10 text-primary' : 'hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                                            >
                                                {l.native}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button onClick={toggleTheme} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer flex items-center justify-center" aria-label="Toggle Theme">
                                <span className="material-symbols-outlined">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
                            </button>
                            <button className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative cursor-pointer" aria-label="Notifications">
                                <span className="material-symbols-outlined">notifications</span>
                                <span className="absolute top-2 right-2 size-2 bg-saffron rounded-full border-2 border-white dark:border-slate-800"></span>
                            </button>
                            <button onClick={() => setIsHelpOpen(true)} className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 cursor-pointer shadow-sm shadow-primary/20 hidden sm:flex">
                                <span className="material-symbols-outlined text-sm">help</span>
                                Help Center
                            </button>
                        </div>
                    </header>

                    <div className="w-full h-1 bg-[repeating-linear-gradient(45deg,#ff9933,#ff9933_10px,transparent_10px,transparent_20px)] opacity-30"></div>

                    {/* Render specific nested routes here */}
                    <div className="flex-1">
                        <Outlet />
                    </div>

                    <footer className="p-6 text-center border-t border-slate-200 dark:border-slate-800 mt-auto bg-stone-50 dark:bg-slate-900">
                        <p className="text-xs text-slate-500 dark:text-slate-400">© 2024 Samyak Setu. Empowering Sustainable Farming.</p>
                    </footer>
                </main>
            </div>

            {/* Mobile Fixed Bottom Nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pt-4 pb-6">
                <NavLink to="/dashboard" end className={({ isActive }) => `flex flex-col items-center gap-1 cursor-pointer transition-colors ${isActive ? 'text-primary' : 'text-slate-400 hover:text-primary/70'}`}>
                    <span className="material-symbols-outlined">home</span>
                    <span className="text-[10px] font-bold">{t('home')}</span>
                </NavLink>
                <NavLink to="/dashboard/soil" className={({ isActive }) => `flex flex-col items-center gap-1 cursor-pointer transition-colors ${isActive ? 'text-primary' : 'text-slate-400 hover:text-primary/70'}`}>
                    <span className="material-symbols-outlined">science</span>
                    <span className="text-[10px] font-bold">{t('soil')}</span>
                </NavLink>
                <NavLink to="/dashboard/soil" className="flex flex-col items-center gap-1 cursor-pointer relative z-10">
                    <div className="bg-primary size-12 rounded-full flex items-center justify-center -mt-10 border-4 border-background-light dark:border-slate-950 shadow-lg shadow-primary/30">
                        <span className="material-symbols-outlined text-white text-2xl">add_a_photo</span>
                    </div>
                </NavLink>
                <NavLink to="/dashboard/chat" className={({ isActive }) => `flex flex-col items-center gap-1 cursor-pointer transition-colors ${isActive ? 'text-primary' : 'text-slate-400 hover:text-primary/70'}`}>
                    <span className="material-symbols-outlined">forum</span>
                    <span className="text-[10px] font-bold">{t('chat')}</span>
                </NavLink>
                <NavLink to="/dashboard/settings" className={({ isActive }) => `flex flex-col items-center gap-1 cursor-pointer transition-colors ${isActive ? 'text-primary' : 'text-slate-400 hover:text-primary/70'}`}>
                    <span className="material-symbols-outlined">person</span>
                    <span className="text-[10px] font-bold">{t('settings')}</span>
                </NavLink>
            </div>
            {/* Added a spacer to make space for the bottom nav on mobile */}
            <div className="h-20 md:h-0"></div>

            {/* Help Center Modal */}
            {isHelpOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={() => setIsHelpOpen(false)}>
                    <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                            <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                                <span className="material-symbols-outlined text-primary">live_help</span>
                                Help Center
                            </h3>
                            <button onClick={() => setIsHelpOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer">
                                <span className="material-symbols-outlined text-xl">close</span>
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Need assistance? Reach out to Setu Mitra automatically or talk to our human support representatives.
                            </p>

                            <div className="flex flex-col gap-4">
                                {/* Bot Option */}
                                <button className="w-full flex items-center gap-4 p-4 border border-slate-200 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50 rounded-xl cursor-pointer transition-colors group bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800"
                                    onClick={() => { setIsHelpOpen(false); navigate('/dashboard/chat'); }}>
                                    <div className="size-12 bg-primary/10 text-primary rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                        <span className="material-symbols-outlined">smart_toy</span>
                                    </div>
                                    <div className="text-left flex-1">
                                        <h4 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">Chat with AI Support</h4>
                                        <p className="text-xs text-slate-500">Fastest resolution & instant crop advice (24/7)</p>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">chevron_right</span>
                                </button>

                                <div className="space-y-3 pt-2">
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Connect with Humans</p>

                                    {/* Email Option */}
                                    <a href="mailto:contact@samyaksetu.com" className="w-full flex items-center gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-saffron/50 dark:hover:border-saffron/50 cursor-pointer transition-colors group bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800">
                                        <div className="size-12 bg-saffron/10 text-saffron rounded-full flex items-center justify-center group-hover:bg-saffron group-hover:text-white transition-colors shadow-sm">
                                            <span className="material-symbols-outlined">mail</span>
                                        </div>
                                        <div className="text-left flex-1">
                                            <h4 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-saffron transition-colors">contact@samyaksetu.com</h4>
                                            <p className="text-xs text-slate-500">Typical email reply within 2 hours</p>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-400 group-hover:text-saffron transition-colors">open_in_new</span>
                                    </a>

                                    {/* Call Option */}
                                    <a href="tel:9289066578" className="w-full flex items-center gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-blue-500/50 dark:hover:border-blue-500/50 cursor-pointer transition-colors group bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800">
                                        <div className="size-12 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors shadow-sm">
                                            <span className="material-symbols-outlined">call</span>
                                        </div>
                                        <div className="text-left flex-1">
                                            <h4 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-500 transition-colors">+91 92890 66578</h4>
                                            <p className="text-xs text-slate-500">Toll-free • Available 9 AM - 6 PM</p>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-400 group-hover:text-blue-500 transition-colors">open_in_new</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Drawer Sidebar */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-[100] flex">
                    {/* Dark Overlay Backdrop */}
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)}></div>

                    {/* Sliding Drawer */}
                    <aside className="relative w-72 max-w-[80%] bg-white dark:bg-slate-900 h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-200 z-10">
                        <div className="p-6 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setIsMobileMenuOpen(false); navigate('/dashboard'); }}>
                                <div className="bg-primary text-white p-2 rounded-lg">
                                    <span className="material-symbols-outlined text-xl">agriculture</span>
                                </div>
                                <h2 className="text-lg font-bold text-primary dark:text-white tracking-tight">Samyak Setu</h2>
                            </div>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 bg-slate-100 dark:bg-slate-800 dark:hover:text-white rounded-full transition-colors cursor-pointer">
                                <span className="material-symbols-outlined text-xl">close</span>
                            </button>
                        </div>
                        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                            {navItems.map((item) => (
                                <NavLink
                                    key={`mobile-${item.path}`}
                                    to={item.path}
                                    end={item.exact}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium ${isActive
                                            ? 'bg-primary text-white shadow-md shadow-primary/20'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary'
                                        }`
                                    }
                                >
                                    <span className="material-symbols-outlined">{item.icon}</span>
                                    <span className="text-base">{item.label}</span>
                                </NavLink>
                            ))}
                        </nav>
                        <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                            <div className="flex items-center gap-3 mb-4 text-slate-600 dark:text-slate-300">
                                <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                                <div className="text-sm">
                                    <p className="font-bold flex items-center gap-2">Nagpur <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-500 text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-widest">LIVE</span></p>
                                    <p className="text-xs opacity-80">Maharashtra</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer shadow-sm hover:border-primary transition-colors flex items-center justify-center gap-1">
                                    <span className="material-symbols-outlined text-sm">language</span>
                                    En (IN)
                                </button>
                                <button onClick={() => { setIsMobileMenuOpen(false); setIsHelpOpen(true); }} className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer shadow-sm hover:border-primary transition-colors flex items-center justify-center gap-1">
                                    <span className="material-symbols-outlined text-sm">help</span>
                                    Help
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
}

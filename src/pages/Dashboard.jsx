import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Dashboard() {
    const { theme, toggleTheme } = useTheme();
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen" style={{ backgroundImage: "radial-gradient(#0b6a3911 0.5px, transparent 0.5px)", backgroundSize: "20px 20px", backgroundColor: "#fcf9f2" }}>
            <div className="layout-container flex flex-col md:flex-row h-full min-h-screen">
                <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col fixed md:sticky top-0 h-auto md:h-screen z-50">
                    <div className="p-6 flex items-center gap-3">
                        <div className="bg-primary text-white p-2 rounded-lg">
                            <span className="material-symbols-outlined text-2xl">agriculture</span>
                        </div>
                        <h2 className="text-xl font-bold text-primary dark:text-white tracking-tight">Samyak Setu</h2>
                    </div>
                    <nav className="flex-1 px-4 space-y-2 py-4">
                        <a className="flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-xl mb-1 flex items-center cursor-pointer">
                            <span className="material-symbols-outlined">home</span>
                            <span className="font-medium">Home / घर</span>
                        </a>
                        <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 rounded-xl transition-colors mb-1 flex items-center cursor-pointer">
                            <span className="material-symbols-outlined">science</span>
                            <span className="font-medium">Soil / मिट्टी</span>
                        </a>
                        <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 rounded-xl transition-colors mb-1 flex items-center cursor-pointer">
                            <span className="material-symbols-outlined">chat_bubble</span>
                            <span className="font-medium">Chat / बात करें</span>
                        </a>
                        <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 rounded-xl transition-colors mb-1 flex items-center cursor-pointer">
                            <span className="material-symbols-outlined">history</span>
                            <span className="font-medium">History / इतिहास</span>
                        </a>
                        <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 rounded-xl transition-colors mb-1 flex items-center cursor-pointer">
                            <span className="material-symbols-outlined">settings</span>
                            <span className="font-medium">Settings / सेटिंग</span>
                        </a>
                    </nav>
                    <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800 rounded-xl cursor-pointer">
                            <img alt="User Profile Avatar" className="size-10 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkoW3O0sqso3W3ZBs4Nz0ab8UYjYQdHXcwvPTwPTolXk1SRT7T8rTdTuAmVUCn46OpJnmmrE2VQ5vKAe0KZ1qABuhCdhK-2svNZy9-l4JFA42x25kh1YrLeL-9SoZzsvlmdGvtjRMfqD3CvpJ2jQ9F2c9bKPGYHxU34E82jBcou1lNJhqcHXFvNJMbsAH6XGXNVqi_0LIvq4YDRlUN8DSoVahmY_atIaMKaY3MfWULwkedBFy7iwRRRZBg1m1ZeL3hxsw5h39yTw" />
                            <div>
                                <p className="text-sm font-bold">Ram Singh</p>
                                <p className="text-xs text-slate-500">ID: #44921</p>
                            </div>
                        </div>
                    </div>
                </aside>

                <main className="flex-1 min-w-0 flex flex-col mt-20 md:mt-0">
                    <header className="flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                            <span className="material-symbols-outlined text-primary">location_on</span>
                            <span className="font-medium text-sm">Nagpur, Maharashtra</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={toggleTheme} className="p-2 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer flex items-center justify-center">
                                <span className="material-symbols-outlined">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
                            </button>
                            <button className="p-2 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative cursor-pointer">
                                <span className="material-symbols-outlined">notifications</span>
                                <span className="absolute top-2 right-2 size-2 bg-saffron rounded-full border-2 border-white"></span>
                            </button>
                            <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 cursor-pointer">
                                <span className="material-symbols-outlined text-sm">help</span>
                                Help Center
                            </button>
                        </div>
                    </header>

                    <div className="w-full h-2 bg-[repeating-linear-gradient(45deg,#ff9933,#ff9933_10px,#ffffff_10px,#ffffff_20px)] opacity-30"></div>

                    <div className="p-6 space-y-6 max-w-6xl mx-auto flex-1">
                        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-gradient-to-br from-primary to-green-800 rounded-xl p-8 text-white relative overflow-hidden shadow-lg border-b-4 border-saffron flex items-center" style={{ backgroundImage: "linear-gradient(to bottom right, #0b6a39, #064e2b)" }}>
                                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between h-full w-full">
                                    <div className="max-w-md pr-4">
                                        <h1 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">Namaste, Ram Singh! / नमस्ते राम सिंह!</h1>
                                        <p className="text-white/80 text-sm md:text-base">Your fields are looking healthy today. The current soil moisture is optimal for the upcoming harvest cycle.</p>
                                        <div className="mt-6 flex gap-4">
                                            <button className="bg-saffron text-white px-6 py-2.5 rounded-lg font-bold shadow-md hover:scale-105 transition-transform whitespace-nowrap cursor-pointer">Get Soil Report</button>
                                        </div>
                                    </div>
                                    <div className="mt-8 md:mt-0 relative flex flex-col items-center flex-shrink-0">
                                        <div className="bg-white text-slate-800 p-3 rounded-2xl rounded-br-none shadow-xl mb-3 max-w-[160px] border-2 border-saffron animate-bounce relative z-20">
                                            <p className="text-[11px] md:text-xs font-bold leading-tight text-center">"Today is a great day for sowing! / आज बुवाई के लिए अच्छा दिन है!"</p>
                                        </div>
                                        <div className="bg-saffron rounded-full p-3 border-4 border-white shadow-lg flex items-center justify-center">
                                            <span className="material-symbols-outlined text-4xl text-white">smart_toy</span>
                                        </div>
                                        <p className="text-[10px] font-bold mt-2 uppercase tracking-widest text-white/90">Setu Mitra / सेतु मित्र</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm border-t-4 border-t-saffron shadow-md bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] flex flex-col h-full">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-bold text-slate-800 dark:text-slate-100 uppercase text-xs tracking-wider">Weather Summary</h3>
                                    <span className="text-primary text-xs font-bold">LIVE</span>
                                </div>
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="material-symbols-outlined text-5xl text-saffron">sunny</span>
                                    <div>
                                        <h2 className="text-4xl font-bold">32°C</h2>
                                        <p className="text-slate-500 text-sm">Clear Skies</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-auto">
                                    <div className="bg-background-light dark:bg-slate-800 p-3 rounded-lg">
                                        <div className="flex items-center gap-2 text-slate-500 mb-1">
                                            <span className="material-symbols-outlined text-sm">humidity_mid</span>
                                            <span className="text-xs">Humidity</span>
                                        </div>
                                        <p className="font-bold">45%</p>
                                    </div>
                                    <div className="bg-background-light dark:bg-slate-800 p-3 rounded-lg">
                                        <div className="flex items-center gap-2 text-slate-500 mb-1">
                                            <span className="material-symbols-outlined text-sm">rainy</span>
                                            <span className="text-xs">Rain Forecast</span>
                                        </div>
                                        <p className="font-bold text-primary">0%</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">bolt</span> Quick Actions / तुरंत कार्यवाही
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button className="cursor-pointer flex items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border-2 border-primary/20 hover:border-primary transition-all group shadow-sm">
                                    <div className="size-12 md:size-14 bg-primary/10 text-primary rounded-full flex-shrink-0 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-2xl md:text-3xl">photo_camera</span>
                                    </div>
                                    <div className="text-left min-w-0">
                                        <h4 className="font-bold text-base md:text-lg truncate">Upload Soil / मिट्टी अपलोड करें</h4>
                                        <p className="text-slate-500 text-xs md:text-sm truncate">Use camera for instant analysis</p>
                                    </div>
                                </button>
                                <button className="cursor-pointer flex items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border-2 border-saffron/20 hover:border-saffron transition-all group shadow-sm">
                                    <div className="size-12 md:size-14 bg-saffron/10 text-saffron rounded-full flex-shrink-0 flex items-center justify-center group-hover:bg-saffron group-hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-2xl md:text-3xl">forum</span>
                                    </div>
                                    <div className="text-left min-w-0">
                                        <h4 className="font-bold text-base md:text-lg truncate">Chat with AI / AI से बात करें</h4>
                                        <p className="text-slate-500 text-xs md:text-sm truncate">Ask anything about your crops</p>
                                    </div>
                                </button>
                            </div>
                        </section>

                        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm overflow-hidden relative border-t-4 border-t-saffron shadow-md bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] flex flex-col h-full">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold text-lg">Latest Advisory</h3>
                                    <span className="bg-primary/10 text-primary text-[10px] px-2 py-1 rounded font-bold uppercase">2 Days Ago</span>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                                            <span className="material-symbols-outlined text-primary">labs</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">Soil Nitrogen: Moderate</p>
                                            <p className="text-sm text-slate-500">Consider adding organic urea mix before the next irrigation cycle.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                                            <span className="material-symbols-outlined text-saffron">warning</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">Pest Alert: Whiteflies</p>
                                            <p className="text-sm text-slate-500">Neighboring farms reported whiteflies. Check underside of leaves.</p>
                                        </div>
                                    </div>
                                </div>
                                <a className="mt-6 inline-flex items-center text-primary font-bold text-sm hover:underline cursor-pointer">
                                    View Full Report <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
                                </a>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold text-lg text-slate-600 dark:text-slate-400">Coming Soon</h3>
                                    <span className="text-xs font-medium text-slate-400">Next Update</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center opacity-60 aspect-square">
                                        <span className="material-symbols-outlined text-slate-400 mb-2 text-2xl">trending_up</span>
                                        <p className="text-[10px] md:text-xs font-bold text-center">Mandi Prices</p>
                                    </div>
                                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center opacity-60 aspect-square">
                                        <span className="material-symbols-outlined text-slate-400 mb-2 text-2xl">campaign</span>
                                        <p className="text-[10px] md:text-xs font-bold text-center">Govt. Alerts</p>
                                    </div>
                                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center opacity-60 aspect-square">
                                        <span className="material-symbols-outlined text-slate-400 mb-2 text-2xl">groups</span>
                                        <p className="text-[10px] md:text-xs font-bold text-center">Community</p>
                                    </div>
                                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center opacity-60 aspect-square">
                                        <span className="material-symbols-outlined text-slate-400 mb-2 text-2xl">shield</span>
                                        <p className="text-[10px] md:text-xs font-bold text-center">Insurance</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <footer className="p-6 text-center border-t border-slate-200 dark:border-slate-800 mt-auto bg-stone-50">
                        <p className="text-xs text-slate-500">© 2024 Samyak Setu. Empowering Sustainable Farming.</p>
                    </footer>
                </main>
            </div>

            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center z-50">
                <a className="flex flex-col items-center gap-1 text-primary cursor-pointer">
                    <span className="material-symbols-outlined">home</span>
                    <span className="text-[10px] font-bold">Home</span>
                </a>
                <a className="flex flex-col items-center gap-1 text-slate-400 cursor-pointer">
                    <span className="material-symbols-outlined">science</span>
                    <span className="text-[10px] font-bold">Soil</span>
                </a>
                <a className="flex flex-col items-center gap-1 cursor-pointer">
                    <div className="bg-primary size-10 rounded-full flex items-center justify-center -mt-8 border-4 border-background-light shadow-lg">
                        <span className="material-symbols-outlined text-white">add</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">Scan</span>
                </a>
                <a className="flex flex-col items-center gap-1 text-slate-400 cursor-pointer">
                    <span className="material-symbols-outlined">forum</span>
                    <span className="text-[10px] font-bold">Chat</span>
                </a>
                <a className="flex flex-col items-center gap-1 text-slate-400 cursor-pointer">
                    <span className="material-symbols-outlined">person</span>
                    <span className="text-[10px] font-bold">Profile</span>
                </a>
            </div>
            {/* Added a spacer to make space for the bottom nav on mobile */}
            <div className="h-16 md:h-0"></div>
        </div>
    );
}

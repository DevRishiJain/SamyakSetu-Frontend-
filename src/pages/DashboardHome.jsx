import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function DashboardHome() {
    const navigate = useNavigate();
    const { language, t } = useLanguage();

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto flex-1 w-full">
            {/* Welcome Banner */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gradient-to-br from-primary to-green-800 rounded-xl p-8 text-white relative overflow-hidden shadow-lg border-b-4 border-saffron flex items-center" style={{ backgroundImage: "linear-gradient(to bottom right, #0b6a39, #064e2b)" }}>
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between h-full w-full">
                        <div className="max-w-md pr-4">
                            <h1 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">{t('greeting')}</h1>
                            <p className="text-white/80 text-sm md:text-base">{t('subtext')}</p>
                            <div className="mt-6 flex gap-4">
                                <button
                                    onClick={() => navigate('/dashboard/soil')}
                                    className="bg-saffron text-white px-6 py-2.5 rounded-lg font-bold shadow-md hover:scale-105 transition-transform whitespace-nowrap cursor-pointer"
                                >
                                    Get Soil Report
                                </button>
                            </div>
                        </div>
                        <div className="mt-8 md:mt-0 relative flex flex-col items-center flex-shrink-0">
                            <div className="bg-white text-slate-800 p-3 rounded-2xl rounded-br-none shadow-xl mb-3 max-w-[160px] border-2 border-saffron animate-bounce relative z-20">
                                <p className="text-[11px] md:text-xs font-bold leading-tight text-center">{t('botText')}</p>
                            </div>
                            <div className="bg-saffron rounded-full p-3 border-4 border-white shadow-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-4xl text-white">smart_toy</span>
                            </div>
                            <p className="text-[10px] font-bold mt-2 uppercase tracking-widest text-white/90">{t('botName')}</p>
                        </div>
                    </div>
                </div>

                {/* Weather Widget */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm border-t-4 border-t-saffron shadow-md bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 uppercase text-xs tracking-wider">Weather Summary</h3>
                        <span className="text-primary text-xs font-bold bg-primary/10 px-2 py-1 rounded">LIVE</span>
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                        <span className="material-symbols-outlined text-5xl text-saffron">sunny</span>
                        <div>
                            <h2 className="text-4xl font-bold">32°C</h2>
                            <p className="text-slate-500 text-sm">Clear Skies</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-auto">
                        <div className="bg-background-light dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-2 text-slate-500 mb-1">
                                <span className="material-symbols-outlined text-sm">water_drop</span>
                                <span className="text-xs font-medium">Humidity</span>
                            </div>
                            <p className="font-bold text-lg">45%</p>
                        </div>
                        <div className="bg-background-light dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-2 text-slate-500 mb-1">
                                <span className="material-symbols-outlined text-sm">rainy</span>
                                <span className="text-xs font-medium">Rain Forecast</span>
                            </div>
                            <p className="font-bold text-lg text-primary">0%</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Actions */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                        <span className="material-symbols-outlined text-primary bg-primary/10 p-1 rounded-lg">bolt</span>
                        {t('quickActions')}
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                        onClick={() => navigate('/dashboard/soil')}
                        className="cursor-pointer flex items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border-2 border-primary/20 hover:border-primary transition-all group shadow-sm bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"
                    >
                        <div className="size-12 md:size-14 border border-primary/20 bg-primary/10 text-primary rounded-full flex-shrink-0 flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/30 transition-all">
                            <span className="material-symbols-outlined text-2xl md:text-3xl">add_a_photo</span>
                        </div>
                        <div className="text-left w-full">
                            <h4 className="font-bold text-base md:text-lg group-hover:text-primary transition-colors text-slate-900 dark:text-slate-100">{t('uploadSoil')}</h4>
                            <p className="text-slate-500 text-xs md:text-sm mt-1">{t('uploadDesc')}</p>
                        </div>
                        <span className="material-symbols-outlined text-transparent group-hover:text-primary transition-colors transform translate-x-[-10px] group-hover:translate-x-0">chevron_right</span>
                    </button>
                    <button
                        onClick={() => navigate('/dashboard/chat')}
                        className="cursor-pointer flex items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border-2 border-saffron/20 hover:border-saffron transition-all group shadow-sm bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"
                    >
                        <div className="size-12 md:size-14 border border-saffron/20 bg-saffron/10 text-saffron rounded-full flex-shrink-0 flex items-center justify-center group-hover:bg-saffron group-hover:text-white group-hover:shadow-lg group-hover:shadow-saffron/30 transition-all">
                            <span className="material-symbols-outlined text-2xl md:text-3xl">forum</span>
                        </div>
                        <div className="text-left w-full">
                            <h4 className="font-bold text-base md:text-lg group-hover:text-saffron transition-colors text-slate-900 dark:text-slate-100">{t('chatAI')}</h4>
                            <p className="text-slate-500 text-xs md:text-sm mt-1">{t('chatDesc')}</p>
                        </div>
                        <span className="material-symbols-outlined text-transparent group-hover:text-saffron transition-colors transform translate-x-[-10px] group-hover:translate-x-0">chevron_right</span>
                    </button>
                </div>
            </section>

            {/* Bottom Info Grid */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm overflow-hidden relative border-t-4 border-t-saffron shadow-md bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] flex flex-col h-full cursor-pointer hover:border-saffron/50 transition-colors" onClick={() => navigate('/dashboard/history')}>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Latest Advisory</h3>
                        <span className="bg-primary/10 text-primary text-[10px] px-2 py-1 rounded font-bold uppercase border border-primary/20">2 Days Ago</span>
                    </div>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="size-10 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                                <span className="material-symbols-outlined text-primary">eco</span>
                            </div>
                            <div>
                                <p className="font-bold text-sm text-slate-900 dark:text-slate-100">Soil Nitrogen: Moderate</p>
                                <p className="text-sm text-slate-500">Consider adding natural organic urea mix before the next cycle.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="size-10 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 flex items-center justify-center flex-shrink-0 shadow-sm">
                                <span className="material-symbols-outlined text-red-500">pest_control</span>
                            </div>
                            <div>
                                <p className="font-bold text-sm text-slate-900 dark:text-slate-100">Pest Alert: Whiteflies Tracked</p>
                                <p className="text-sm text-slate-500">Neighboring districts reported vectors. Check underside of leaves closely.</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex text-primary font-bold text-sm hover:underline items-center gap-1 group">
                        View Full History Report <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </div>
                </div>

                <div className="bg-earth-warm/30 dark:bg-slate-800/20 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-6">
                    <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-slate-800 pb-3">
                        <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800 dark:text-slate-200">
                            <span className="material-symbols-outlined text-primary">new_releases</span>
                            Coming Soon
                        </h3>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">Next Week Update</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-900/20 dark:to-teal-900/20 p-4 rounded-xl border border-emerald-500/30 flex flex-row items-center justify-between hover:bg-emerald-500/20 transition-colors cursor-help group shadow-inner relative overflow-hidden">
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="size-10 bg-emerald-500 text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-md shadow-emerald-500/30 flex-shrink-0">
                                    <span className="material-symbols-outlined text-xl">energy_savings_leaf</span>
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Carbon Credits Marketplace</p>
                                    <p className="text-[10px] text-emerald-600/80 dark:text-emerald-500/80 font-medium mt-0.5">Trade eco-friendly farming credits</p>
                                </div>
                            </div>
                            <span className="text-[9px] uppercase font-black tracking-widest bg-emerald-500 text-white px-2 py-0.5 rounded animate-pulse shadow-md relative z-10 whitespace-nowrap hidden sm:block">HOT 🔥</span>
                            <div className="absolute -right-4 -bottom-4 opacity-5 cursor-default pointer-events-none group-hover:scale-150 group-hover:opacity-10 transition-all duration-700">
                                <span className="material-symbols-outlined text-[100px] text-emerald-500">eco</span>
                            </div>
                        </div>

                        <div className="bg-white/50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center hover:bg-white dark:hover:bg-slate-900 transition-colors cursor-help group shadow-[inset_0_0_10px_rgba(0,0,0,0.02)]">
                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 group-hover:text-primary transition-colors text-2xl">trending_up</span>
                            </div>
                            <p className="text-xs font-bold text-center text-slate-600 dark:text-slate-400">Live Mandi Prices</p>
                        </div>
                        <div className="bg-white/50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center hover:bg-white dark:hover:bg-slate-900 transition-colors cursor-help group shadow-[inset_0_0_10px_rgba(0,0,0,0.02)]">
                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 group-hover:text-primary transition-colors text-2xl">campaign</span>
                            </div>
                            <p className="text-xs font-bold text-center text-slate-600 dark:text-slate-400">Govt. Scheme Alerts</p>
                        </div>
                        <div className="bg-white/50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center hover:bg-white dark:hover:bg-slate-900 transition-colors cursor-help group shadow-[inset_0_0_10px_rgba(0,0,0,0.02)]">
                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 group-hover:text-primary transition-colors text-2xl">groups</span>
                            </div>
                            <p className="text-xs font-bold text-center text-slate-600 dark:text-slate-400">Community Social</p>
                        </div>
                        <div className="bg-white/50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center hover:bg-white dark:hover:bg-slate-900 transition-colors cursor-help group shadow-[inset_0_0_10px_rgba(0,0,0,0.02)]">
                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 group-hover:text-primary transition-colors text-2xl">shield</span>
                            </div>
                            <p className="text-xs font-bold text-center text-slate-600 dark:text-slate-400">Claim Insurance</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

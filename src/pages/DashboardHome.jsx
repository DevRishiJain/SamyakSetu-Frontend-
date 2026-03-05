import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getWeather, getHistory } from '../services/api';
import { useTranslation } from 'react-i18next';

export default function DashboardHome() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user } = useAuth();

    // Weather state
    const [weather, setWeather] = useState(null);
    const [weatherLoading, setWeatherLoading] = useState(true);
    const [weatherError, setWeatherError] = useState('');

    const [recentItem, setRecentItem] = useState(null);
    const [historyLoading, setHistoryLoading] = useState(true);

    // Fetch weather and history on mount
    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) {
                setWeatherLoading(false);
                setHistoryLoading(false);
                return;
            }
            try {
                // Fetch weather
                const weatherData = await getWeather(user.id);
                setWeather(weatherData);
            } catch (err) {
                setWeatherError(err.message || 'Failed to load weather');
            } finally {
                setWeatherLoading(false);
            }

            try {
                // Fetch history
                const hData = await getHistory(user.id);
                // Combine and sort
                const combined = [];
                if (hData.chatHistory) {
                    combined.push(...hData.chatHistory.map(item => ({ ...item, type: 'chat' })));
                }
                if (hData.soilUploadHistory) {
                    combined.push(...hData.soilUploadHistory.map(item => ({ ...item, type: 'soil' })));
                }
                combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                if (combined.length > 0) {
                    setRecentItem(combined[0]);
                }
            } catch (err) {
                console.error("Failed to load history for dashboard:", err);
            } finally {
                setHistoryLoading(false);
            }
        };
        fetchData();
    }, [user?.id]);

    // Map weather condition to icon
    const getWeatherIcon = (condition) => {
        const lower = (condition || '').toLowerCase();
        if (lower.includes('clear') || lower.includes('sunny')) return 'sunny';
        if (lower.includes('cloud')) return 'cloud';
        if (lower.includes('rain') || lower.includes('drizzle')) return 'rainy';
        if (lower.includes('thunder') || lower.includes('storm')) return 'thunderstorm';
        if (lower.includes('snow')) return 'ac_unit';
        if (lower.includes('mist') || lower.includes('fog') || lower.includes('haze')) return 'foggy';
        return 'partly_cloudy_day';
    };

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto flex-1 w-full">
            {/* Welcome Banner */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gradient-to-br from-primary to-green-800 rounded-xl p-8 text-white relative overflow-hidden shadow-lg border-b-4 border-saffron flex items-center" style={{ backgroundImage: "linear-gradient(to bottom right, #0b6a39, #064e2b)" }}>
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between h-full w-full">
                        <div className="max-w-md pr-4 md:pr-4 pr-0 flex flex-col items-center text-center md:items-start md:text-left">
                            <h1 className="text-2xl md:text-3xl font-bold mb-3 leading-tight w-full">{t('dashboard.greeting', { name: user?.name?.split(' ')[0] || t('common.farmer') })}</h1>
                            <p className="text-white/80 text-sm md:text-base w-full">{t('dashboard.subtext')}</p>
                            <div className="mt-6 flex gap-4 w-full justify-center md:justify-start">
                                <button
                                    onClick={() => navigate('/dashboard/soil')}
                                    className="bg-saffron text-white px-6 py-2.5 rounded-lg font-bold shadow-md hover:scale-105 transition-transform whitespace-nowrap cursor-pointer mx-auto md:mx-0"
                                >
                                    {t('dashboard.getSoilReport')}
                                </button>
                            </div>
                        </div>
                        <div className="mt-8 md:mt-0 relative flex flex-col items-center flex-shrink-0 mx-auto md:mx-0">
                            <div className="bg-white text-slate-800 p-3 rounded-2xl md:rounded-br-none shadow-xl mb-3 max-w-[160px] border-2 border-saffron animate-bounce relative z-20">
                                <p className="text-[11px] md:text-xs font-bold leading-tight text-center">{t('dashboard.botText')}</p>
                            </div>
                            <div className="bg-saffron rounded-full p-3 border-4 border-white shadow-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-4xl text-white">smart_toy</span>
                            </div>
                            <p className="text-[10px] font-bold mt-2 uppercase tracking-widest text-white/90 text-center">{t('dashboard.botName')}</p>
                        </div>
                    </div>
                </div>

                {/* Weather Widget — Live Data */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm border-t-4 border-t-saffron shadow-md bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 uppercase text-xs tracking-wider">{t('dashboard.weatherSummary')}</h3>
                        <span className="text-primary text-xs font-bold bg-primary/10 px-2 py-1 rounded">{t('common.live')}</span>
                    </div>

                    {weatherLoading ? (
                        <div className="flex-1 flex flex-col items-center justify-center gap-3">
                            <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
                            <p className="text-slate-500 text-sm">{t('dashboard.loadingWeather')}</p>
                        </div>
                    ) : weatherError ? (
                        <div className="flex-1 flex flex-col items-center justify-center gap-3">
                            <span className="material-symbols-outlined text-4xl text-slate-300">cloud_off</span>
                            <p className="text-slate-500 text-sm text-center">{weatherError}</p>
                        </div>
                    ) : weather?.current ? (
                        <>
                            <div className="flex items-center gap-4 mb-6">
                                {weather.current.icon ? (
                                    <img src={weather.current.icon} alt={weather.current.condition} className="w-14 h-14" />
                                ) : (
                                    <span className="material-symbols-outlined text-5xl text-saffron">
                                        {getWeatherIcon(weather.current.condition)}
                                    </span>
                                )}
                                <div>
                                    <h2 className="text-4xl font-bold">{Math.round(weather.current.temperature)}°C</h2>
                                    <p className="text-slate-500 text-sm capitalize">{weather.current.description || weather.current.condition}</p>
                                    {weather.current.location && (
                                        <p className="text-xs text-primary font-bold mt-0.5">{weather.current.location}</p>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-auto">
                                <div className="bg-background-light dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                                        <span className="material-symbols-outlined text-sm">water_drop</span>
                                        <span className="text-xs font-medium">{t('dashboard.humidity')}</span>
                                    </div>
                                    <p className="font-bold text-lg">{weather.current.humidity}%</p>
                                </div>
                                <div className="bg-background-light dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                                        <span className="material-symbols-outlined text-sm">air</span>
                                        <span className="text-xs font-medium">{t('dashboard.wind')}</span>
                                    </div>
                                    <p className="font-bold text-lg">{weather.current.windSpeed} m/s</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center gap-3">
                            <span className="material-symbols-outlined text-4xl text-slate-300">cloud_off</span>
                            <p className="text-slate-500 text-sm">{t('dashboard.weatherUnavailable')}</p>
                        </div>
                    )}
                </div>
            </section>

            {/* 5-Day Forecast Strip */}
            {weather?.forecast && weather.forecast.length > 0 && (
                <section>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg text-saffron">calendar_month</span>
                        {t('dashboard.fiveDayForecast')}
                    </h3>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {weather.forecast.slice(0, 8).map((f, idx) => (
                            <div key={idx} className="min-w-[120px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex flex-col items-center gap-2 shadow-sm flex-shrink-0">
                                <p className="text-[10px] text-slate-500 font-bold">{f.dateTime?.split(' ')[1]?.slice(0, 5) || ''}</p>
                                {f.icon ? (
                                    <img src={f.icon} alt={f.condition} className="w-8 h-8" />
                                ) : (
                                    <span className="material-symbols-outlined text-2xl text-saffron">
                                        {getWeatherIcon(f.condition)}
                                    </span>
                                )}
                                <p className="font-bold text-sm">{Math.round(f.temperature)}°C</p>
                                <p className="text-[10px] text-slate-500 capitalize">{f.description?.split(' ').slice(0, 2).join(' ')}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Quick Actions */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                        <span className="material-symbols-outlined text-primary bg-primary/10 p-1 rounded-lg">bolt</span>
                        {t('dashboard.quickActions')}
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
                            <h4 className="font-bold text-base md:text-lg group-hover:text-primary transition-colors text-slate-900 dark:text-slate-100">{t('dashboard.uploadSoil')}</h4>
                            <p className="text-slate-500 text-xs md:text-sm mt-1">{t('dashboard.uploadDesc')}</p>
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
                            <h4 className="font-bold text-base md:text-lg group-hover:text-saffron transition-colors text-slate-900 dark:text-slate-100">{t('dashboard.chatAI')}</h4>
                            <p className="text-slate-500 text-xs md:text-sm mt-1">{t('dashboard.chatDesc')}</p>
                        </div>
                        <span className="material-symbols-outlined text-transparent group-hover:text-saffron transition-colors transform translate-x-[-10px] group-hover:translate-x-0">chevron_right</span>
                    </button>
                </div>
            </section>

            {/* Bottom Info Grid */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm overflow-hidden relative border-t-4 border-t-primary shadow-md bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] flex flex-col h-full cursor-pointer hover:border-primary/50 transition-colors" onClick={() => navigate('/dashboard/history')}>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{t('dashboard.latestAdvisory')}</h3>
                    </div>

                    <div className="flex-1 flex flex-col justify-center py-2 h-full">
                        {historyLoading ? (
                            <div className="flex items-center gap-2 text-slate-500">
                                <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                                <span className="text-sm">Loading...</span>
                            </div>
                        ) : recentItem ? (
                            <div className="flex gap-4 items-start bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 relative group overflow-hidden">
                                <div className={`size-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${recentItem.type === 'soil' ? 'bg-primary/10 text-primary' : 'bg-saffron/10 text-saffron'}`}>
                                    <span className="material-symbols-outlined text-lg">{recentItem.type === 'soil' ? 'science' : 'forum'}</span>
                                </div>
                                <div className="flex-1 z-10 w-full overflow-hidden">
                                    <div className="flex justify-between items-start mb-1 gap-2">
                                        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                                            {recentItem.type === 'soil' ? t('history.soilScan') : t('history.advisoryChat')}
                                        </h4>
                                        <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap bg-white dark:bg-slate-900 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-800">
                                            {new Date(recentItem.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                        {recentItem.type === 'soil'
                                            ? `${recentItem.soilType || t('history.unknownSoilType')} • ${recentItem.predictions?.[0]?.crop || 'Analysis ready'}`
                                            : recentItem.message}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-3">
                                <div className="size-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700">
                                    <span className="material-symbols-outlined text-3xl text-slate-300">timeline</span>
                                </div>
                                <p className="text-slate-500 text-sm text-center max-w-xs">{t('dashboard.advisoryTimelineHint')}</p>
                            </div>
                        )}
                    </div>
                    <div className="mt-auto flex text-primary font-bold text-sm hover:underline items-center gap-1 group">
                        {t('dashboard.viewHistory')} <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </div>
                </div>

                <div className="bg-earth-warm/30 dark:bg-slate-800/20 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-6">
                    <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-slate-800 pb-3">
                        <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800 dark:text-slate-200">
                            <span className="material-symbols-outlined text-primary">new_releases</span>
                            {t('common.comingSoon')}
                        </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-900/20 dark:to-teal-900/20 p-4 rounded-xl border border-emerald-500/30 flex flex-row items-center justify-between hover:bg-emerald-500/20 transition-colors cursor-help group shadow-inner relative overflow-hidden">
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="size-10 bg-emerald-500 text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-md shadow-emerald-500/30 flex-shrink-0">
                                    <span className="material-symbols-outlined text-xl">energy_savings_leaf</span>
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{t('dashboard.carbonCreditsMarketplace')}</p>
                                    <p className="text-[10px] text-emerald-600/80 dark:text-emerald-500/80 font-medium mt-0.5">{t('dashboard.carbonCreditsDesc')}</p>
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
                            <p className="text-xs font-bold text-center text-slate-600 dark:text-slate-400">{t('dashboard.liveMandiPrices')}</p>
                        </div>
                        <div className="bg-white/50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center hover:bg-white dark:hover:bg-slate-900 transition-colors cursor-help group shadow-[inset_0_0_10px_rgba(0,0,0,0.02)]">
                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 group-hover:text-primary transition-colors text-2xl">campaign</span>
                            </div>
                            <p className="text-xs font-bold text-center text-slate-600 dark:text-slate-400">{t('dashboard.govtSchemeAlerts')}</p>
                        </div>
                        <div className="bg-white/50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center hover:bg-white dark:hover:bg-slate-900 transition-colors cursor-help group shadow-[inset_0_0_10px_rgba(0,0,0,0.02)]">
                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 group-hover:text-primary transition-colors text-2xl">groups</span>
                            </div>
                            <p className="text-xs font-bold text-center text-slate-600 dark:text-slate-400">{t('dashboard.communitySocial')}</p>
                        </div>
                        <div className="bg-white/50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center hover:bg-white dark:hover:bg-slate-900 transition-colors cursor-help group shadow-[inset_0_0_10px_rgba(0,0,0,0.02)]">
                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 group-hover:text-primary transition-colors text-2xl">shield</span>
                            </div>
                            <p className="text-xs font-bold text-center text-slate-600 dark:text-slate-400">{t('dashboard.claimInsurance')}</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

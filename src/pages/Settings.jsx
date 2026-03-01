import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Settings() {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const { language, setLanguage, t } = useLanguage();

    const [isLangModalOpen, setIsLangModalOpen] = useState(false);
    const [isLocModalOpen, setIsLocModalOpen] = useState(false);

    // Location Form States
    const [locSearch, setLocSearch] = useState('');
    const [loadingLoc, setLoadingLoc] = useState(false);
    const [currentLoc, setCurrentLoc] = useState('Nagpur, Maharashtra, India');

    const languages = [
        { name: 'English', native: 'English' },
        { name: 'Hindi', native: 'हिन्दी' },
        { name: 'Telugu', native: 'తెలుగు' },
        { name: 'Marathi', native: 'मराठी' },
        { name: 'Bengali', native: 'বাংলা' },
        { name: 'Tamil', native: 'தமிழ்' },
        { name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    ];

    const handleLocSearch = (e) => {
        e.preventDefault();
        setLoadingLoc(true);
        setTimeout(() => {
            setCurrentLoc(locSearch || 'New Location Saved');
            setLoadingLoc(false);
            setIsLocModalOpen(false);
        }, 1200);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto flex-1 w-full space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="bg-primary/10 text-primary p-2 rounded-lg">
                    <span className="material-symbols-outlined text-2xl">settings</span>
                </div>
                <div>
                    <h1 className="text-2xl font-bold">{t('profileSettings')}</h1>
                    <p className="text-slate-500 text-sm">{t('profileSub')}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Card Sidebar */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center shadow-lg relative overflow-hidden text-center group cursor-pointer hover:border-primary/50 transition-colors">
                        <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
                        <img
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkoW3O0sqso3W3ZBs4Nz0ab8UYjYQdHXcwvPTwPTolXk1SRT7T8rTdTuAmVUCn46OpJnmmrE2VQ5vKAe0KZ1qABuhCdhK-2svNZy9-l4JFA42x25kh1YrLeL-9SoZzsvlmdGvtjRMfqD3CvpJ2jQ9F2c9bKPGYHxU34E82jBcou1lNJhqcHXFvNJMbsAH6XGXNVqi_0LIvq4YDRlUN8DSoVahmY_atIaMKaY3MfWULwkedBFy7iwRRRZBg1m1ZeL3hxsw5h39yTw"
                            alt="avatar"
                            className="size-24 rounded-full border-4 border-white dark:border-slate-800 shadow-md mb-4 z-10 group-hover:scale-105 transition-transform"
                        />
                        <div className="z-10">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Ram Singh</h2>
                            <p className="text-sm font-medium text-slate-500 mb-1">+91 98765 43210</p>
                            <p className="text-[11px] uppercase tracking-widest font-black text-primary bg-primary/10 px-3 py-1 rounded-full inline-block mt-2">{t('verifiedFarmer')}</p>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-1 relative overflow-hidden shadow-inner">
                        <div className="flex gap-1 bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-full">
                            <button className="flex-1 py-3 text-sm font-bold bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-full shadow-sm">{t('general')}</button>
                            <button className="flex-1 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">{t('security')}</button>
                        </div>
                    </div>
                </div>

                {/* Settings Actions Area */}
                <div className="md:col-span-2 space-y-6">
                    {/* General Settings Section */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                        <div className="p-6">
                            <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
                                <span className="material-symbols-outlined text-saffron">brush</span>
                                {t('personalization')}
                            </h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-bold">{t('darkModeTitle')}</p>
                                    <p className="text-xs text-slate-500 max-w-xs mt-1">{t('darkModeDesc')}</p>
                                </div>
                                <button
                                    onClick={toggleTheme}
                                    className={`relative w-14 h-8 rounded-full transition-colors cursor-pointer ${theme === 'dark' ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}
                                >
                                    <div className={`absolute left-1 top-1 bg-white size-6 rounded-full transition-transform shadow-sm flex items-center justify-center ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}>
                                        <span className="material-symbols-outlined text-[14px] text-slate-600">{theme === 'dark' ? 'dark_mode' : 'light_mode'}</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex items-center justify-between group" onClick={() => setIsLangModalOpen(true)}>
                            <div>
                                <p className="font-bold group-hover:text-primary transition-colors">{t('langPrefTitle')}</p>
                                <p className="text-xs text-slate-500 max-w-xs mt-1">{t('langPrefDesc')} <span className="font-bold text-slate-700 dark:text-slate-300">{language}</span>.</p>
                            </div>
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary relative transition-transform group-hover:translate-x-1">chevron_right</span>
                        </div>

                        <div className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex items-center justify-between group" onClick={() => setIsLocModalOpen(true)}>
                            <div>
                                <p className="font-bold group-hover:text-primary transition-colors">{t('farmLocTitle')}</p>
                                <p className="text-xs text-slate-500 max-w-xs mt-1">{t('farmLocDesc')} <br /><span className="font-bold text-primary mt-1 inline-block bg-primary/10 px-2 py-0.5 rounded">{currentLoc}</span></p>
                            </div>
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary relative transition-transform group-hover:translate-x-1">chevron_right</span>
                        </div>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-3xl shadow-sm overflow-hidden p-6 cursor-pointer group hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                        onClick={() => navigate('/')}>
                        <div className="flex items-center gap-4 text-red-600 dark:text-red-500">
                            <span className="material-symbols-outlined">logout</span>
                            <div className="flex-1">
                                <h4 className="font-bold">{t('logoutTitle')}</h4>
                                <p className="text-xs opacity-80 font-medium">{t('logoutDesc')}</p>
                            </div>
                            <span className="material-symbols-outlined transition-transform group-hover:translate-x-2">arrow_forward</span>
                        </div>
                    </div>

                </div>
            </div>

            {/* Language Modal */}
            {isLangModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsLangModalOpen(false)}>
                    <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-xl font-bold">{t('selectLang')}</h3>
                            <button onClick={() => setIsLangModalOpen(false)} className="text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full p-2">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2">
                            {languages.map(lang => (
                                <button
                                    key={lang.name}
                                    onClick={() => { setLanguage(lang.native); setIsLangModalOpen(false); }}
                                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors cursor-pointer border ${language === lang.native ? 'border-primary bg-primary/10' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                >
                                    <div className="flex flex-col text-left">
                                        <span className="font-bold text-slate-900 dark:text-white">{lang.native}</span>
                                        <span className="text-xs text-slate-500">{lang.name}</span>
                                    </div>
                                    {language === lang.native && <span className="material-symbols-outlined text-primary">check_circle</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Location Modal */}
            {isLocModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsLocModalOpen(false)}>
                    <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">pin_drop</span>
                                {t('updateLoc')}
                            </h3>
                            <button onClick={() => setIsLocModalOpen(false)} className="text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full p-2">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <button className="w-full h-14 bg-earth-warm hover:bg-primary/20 dark:bg-slate-800 dark:hover:bg-primary/30 text-primary dark:text-white rounded-xl font-bold text-lg transition-all border border-primary/20 flex items-center justify-center gap-3 cursor-pointer">
                                <span className="material-symbols-outlined">my_location</span>
                                {t('autoDetect')}
                            </button>

                            <div className="flex items-center gap-4 text-slate-400 text-xs font-bold uppercase tracking-widest">
                                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
                                {t('orSearch')}
                                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
                            </div>

                            <form onSubmit={handleLocSearch} className="space-y-4">
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                                    <input
                                        type="text"
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-sm"
                                        placeholder={t('searchPlaceholder')}
                                        value={locSearch}
                                        onChange={(e) => setLocSearch(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" disabled={loadingLoc} className="w-full h-14 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
                                    {loadingLoc ? <span className="material-symbols-outlined animate-spin">refresh</span> : t('saveLocation')}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

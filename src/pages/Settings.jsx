import { useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { logoutFarmer, updateLocation, updateProfilePic } from '../services/api';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../i18n';

export default function Settings() {
    const { t } = useTranslation();
    const { theme, toggleTheme } = useTheme();
    const { user, logout, updateUser } = useAuth();
    const { language, setLanguage } = useLanguage();
    const navigate = useNavigate();
    const profilePicRef = useRef(null);

    const [isLangModalOpen, setIsLangModalOpen] = useState(false);
    const [isLocModalOpen, setIsLocModalOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [uploadingPic, setUploadingPic] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Location Form States
    const [loadingLoc, setLoadingLoc] = useState(false);
    const [locError, setLocError] = useState('');



    const handleLogout = async () => {
        setLoggingOut(true);
        setError('');
        try {
            await logoutFarmer();
        } catch {
            // Even if API call fails, we still want to clear local session
        } finally {
            logout();
            navigate('/');
        }
    };

    const handleProfilePicChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingPic(true);
        setError('');
        setSuccess('');

        try {
            const data = await updateProfilePic(file);
            updateUser({ profilePic: data.profilePic });
            setSuccess(t('settings.profilePicSuccess'));
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to update profile picture.');
        } finally {
            setUploadingPic(false);
        }
    };

    const handleAutoDetectGPS = () => {
        setLoadingLoc(true);
        setLocError('');
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        await updateLocation({
                            farmerId: user?.id,
                            latitude,
                            longitude,
                        });
                        updateUser({
                            location: { latitude, longitude },
                        });
                        setIsLocModalOpen(false);
                        setSuccess(t('settings.locationSuccess'));
                        setTimeout(() => setSuccess(''), 3000);
                    } catch (err) {
                        setLocError(err.message || 'Failed to update location.');
                    } finally {
                        setLoadingLoc(false);
                    }
                },
                (geoErr) => {
                    setLoadingLoc(false);
                    setLocError(t('settings.gpsError'));
                }
            );
        } else {
            setLoadingLoc(false);
            setLocError(t('settings.geoNotSupported'));
        }
    };

    const handleManualLocation = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const lat = parseFloat(formData.get('latitude'));
        const lng = parseFloat(formData.get('longitude'));

        if (isNaN(lat) || isNaN(lng)) {
            setLocError(t('settings.invalidCoords'));
            return;
        }

        setLoadingLoc(true);
        setLocError('');

        try {
            await updateLocation({
                farmerId: user?.id,
                latitude: lat,
                longitude: lng,
            });
            updateUser({
                location: { latitude: lat, longitude: lng },
            });
            setIsLocModalOpen(false);
            setSuccess(t('settings.locationSuccess'));
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setLocError(err.message || 'Failed to update location.');
        } finally {
            setLoadingLoc(false);
        }
    };

    const locationDisplay = user?.location
        ? `Lat: ${user.location.latitude?.toFixed(4)}, Lng: ${user.location.longitude?.toFixed(4)}`
        : t('settings.notSet');

    return (
        <div className="p-6 max-w-4xl mx-auto flex-1 w-full space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="bg-primary/10 text-primary p-2 rounded-lg">
                    <span className="material-symbols-outlined text-2xl">settings</span>
                </div>
                <div>
                    <h1 className="text-2xl font-bold">{t('settings.title')}</h1>
                    <p className="text-slate-500 text-sm">{t('settings.subtitle')}</p>
                </div>
            </div>

            {/* Alerts */}
            {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">error</span>
                    {error}
                </div>
            )}
            {success && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-600 dark:text-green-400 text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                    {success}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Card Sidebar */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center shadow-lg relative overflow-hidden text-center group cursor-pointer hover:border-primary/50 transition-colors">
                        <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>

                        {/* Hidden file input for profile pic */}
                        <input
                            type="file"
                            ref={profilePicRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleProfilePicChange}
                        />

                        <div className="relative z-10 mb-4">
                            <img
                                src={user?.profilePic || "https://lh3.googleusercontent.com/aida-public/AB6AXuCkoW3O0sqso3W3ZBs4Nz0ab8UYjYQdHXcwvPTwPTolXk1SRT7T8rTdTuAmVUCn46OpJnmmrE2VQ5vKAe0KZ1qABuhCdhK-2svNZy9-l4JFA42x25kh1YrLeL-9SoZzsvlmdGvtjRMfqD3CvpJ2jQ9F2c9bKPGYHxU34E82jBcou1lNJhqcHXFvNJMbsAH6XGXNVqi_0LIvq4YDRlUN8DSoVahmY_atIaMKaY3MfWULwkedBFy7iwRRRZBg1m1ZeL3hxsw5h39yTw"}
                                alt="avatar"
                                className="size-24 rounded-full border-4 border-white dark:border-slate-800 shadow-md group-hover:scale-105 transition-transform object-cover"
                            />
                            <button
                                onClick={() => profilePicRef.current?.click()}
                                disabled={uploadingPic}
                                className="absolute bottom-0 right-0 size-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-primary/90 transition-colors border-2 border-white dark:border-slate-800"
                            >
                                {uploadingPic ? (
                                    <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                                ) : (
                                    <span className="material-symbols-outlined text-sm">photo_camera</span>
                                )}
                            </button>
                        </div>

                        <div className="z-10">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{user?.name || 'Farmer'}</h2>
                            <p className="text-sm font-medium text-slate-500 mb-1">{user?.phone ? `+91 ${user.phone}` : ''}</p>
                            <p className="text-[11px] uppercase tracking-widest font-black text-primary bg-primary/10 px-3 py-1 rounded-full inline-block mt-2">{t('common.verifiedFarmer')}</p>
                        </div>
                    </div>

                    {/* Tab toggle commented out for now
                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-1 relative overflow-hidden shadow-inner">
                        <div className="flex gap-1 bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-full">
                            <button className="flex-1 py-3 text-sm font-bold bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-full shadow-sm">General</button>
                            <button className="flex-1 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">Security</button>
                        </div>
                    </div>
                    */}
                </div>

                {/* Settings Actions Area */}
                <div className="md:col-span-2 space-y-6">
                    {/* General Settings Section */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                        <div className="p-6">
                            <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
                                <span className="material-symbols-outlined text-saffron">brush</span>
                                {t('settings.personalizationBase')}
                            </h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-bold">{t('settings.darkMode')}</p>
                                    <p className="text-xs text-slate-500 max-w-xs mt-1">{t('settings.darkModeDesc')}</p>
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
                                <p className="font-bold group-hover:text-primary transition-colors">{t('settings.languagePreferences')}</p>
                                <p className="text-xs text-slate-500 max-w-xs mt-1">{t('settings.languageCurrently')} <span className="font-bold text-slate-700 dark:text-slate-300">{language}</span>.</p>
                            </div>
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary relative transition-transform group-hover:translate-x-1">chevron_right</span>
                        </div>

                        <div className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex items-center justify-between group" onClick={() => setIsLocModalOpen(true)}>
                            <div>
                                <p className="font-bold group-hover:text-primary transition-colors">{t('settings.yourFarmLocation')}</p>
                                <p className="text-xs text-slate-500 max-w-xs mt-1">{t('settings.farmLocationDesc')}</p>
                            </div>
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary relative transition-transform group-hover:translate-x-1">chevron_right</span>
                        </div>

                        {/* Update Profile Picture */}
                        <div
                            className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex items-center justify-between group"
                            onClick={() => profilePicRef.current?.click()}
                        >
                            <div>
                                <p className="font-bold group-hover:text-primary transition-colors">{t('settings.updateProfilePicture')}</p>
                                <p className="text-xs text-slate-500 max-w-xs mt-1">{t('settings.profilePicDesc')}</p>
                            </div>
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary relative transition-transform group-hover:translate-x-1">chevron_right</span>
                        </div>
                    </div>

                    {/* Logout */}
                    <div
                        className={`bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-3xl shadow-sm overflow-hidden p-6 cursor-pointer group hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors ${loggingOut ? 'opacity-60 pointer-events-none' : ''}`}
                        onClick={handleLogout}
                    >
                        <div className="flex items-center gap-4 text-red-600 dark:text-red-500">
                            {loggingOut ? (
                                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                            ) : (
                                <span className="material-symbols-outlined">logout</span>
                            )}
                            <div className="flex-1">
                                <h4 className="font-bold">{loggingOut ? t('settings.loggingOut') : t('settings.logoutSecurely')}</h4>
                                <p className="text-xs opacity-80 font-medium">{t('settings.logoutDesc')}</p>
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
                            <h3 className="text-xl font-bold">{t('settings.selectLanguage')}</h3>
                            <button onClick={() => setIsLangModalOpen(false)} className="text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full p-2 cursor-pointer">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2">
                            {LANGUAGES.map(lang => (
                                <button
                                    key={lang.code}
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
                                {t('settings.updateLocation')}
                            </h3>
                            <button onClick={() => setIsLocModalOpen(false)} className="text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full p-2 cursor-pointer">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {locError && (
                                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">error</span>
                                    {locError}
                                </div>
                            )}

                            <button
                                onClick={handleAutoDetectGPS}
                                disabled={loadingLoc}
                                className="w-full h-14 bg-earth-warm hover:bg-primary/20 dark:bg-slate-800 dark:hover:bg-primary/30 text-primary dark:text-white rounded-xl font-bold text-lg transition-all border border-primary/20 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
                            >
                                {loadingLoc ? (
                                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                ) : (
                                    <span className="material-symbols-outlined">my_location</span>
                                )}
                                {t('settings.autoDetectGPS')}
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

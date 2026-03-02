import { useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { logoutFarmer, updateLocation, updateProfilePic } from '../services/api';

export default function Settings() {
    const { theme, toggleTheme } = useTheme();
    const { user, logout, updateUser } = useAuth();
    const navigate = useNavigate();
    const profilePicRef = useRef(null);

    const [isLangModalOpen, setIsLangModalOpen] = useState(false);
    const [isLocModalOpen, setIsLocModalOpen] = useState(false);
    const [selectedLang, setSelectedLang] = useState('English (India)');
    const [loggingOut, setLoggingOut] = useState(false);
    const [uploadingPic, setUploadingPic] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Location Form States
    const [loadingLoc, setLoadingLoc] = useState(false);
    const [locError, setLocError] = useState('');

    const languages = [
        { name: 'English (India)', native: 'English (India)' },
        { name: 'Hindi', native: 'हिन्दी' },
        { name: 'Telugu', native: 'తెలుగు' },
        { name: 'Marathi', native: 'मराठी' },
        { name: 'Bengali', native: 'বাংলা' },
        { name: 'Tamil', native: 'தமிழ்' },
        { name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    ];

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
            setSuccess('Profile picture updated successfully!');
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
                        setSuccess('Location updated successfully!');
                        setTimeout(() => setSuccess(''), 3000);
                    } catch (err) {
                        setLocError(err.message || 'Failed to update location.');
                    } finally {
                        setLoadingLoc(false);
                    }
                },
                (geoErr) => {
                    setLoadingLoc(false);
                    setLocError('Unable to detect GPS. Please allow location permissions.');
                }
            );
        } else {
            setLoadingLoc(false);
            setLocError('Geolocation is not supported by your browser.');
        }
    };

    const handleManualLocation = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const lat = parseFloat(formData.get('latitude'));
        const lng = parseFloat(formData.get('longitude'));

        if (isNaN(lat) || isNaN(lng)) {
            setLocError('Please enter valid latitude and longitude values.');
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
            setSuccess('Location updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setLocError(err.message || 'Failed to update location.');
        } finally {
            setLoadingLoc(false);
        }
    };

    const locationDisplay = user?.location
        ? `Lat: ${user.location.latitude?.toFixed(4)}, Lng: ${user.location.longitude?.toFixed(4)}`
        : 'Not set';

    return (
        <div className="p-6 max-w-4xl mx-auto flex-1 w-full space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="bg-primary/10 text-primary p-2 rounded-lg">
                    <span className="material-symbols-outlined text-2xl">settings</span>
                </div>
                <div>
                    <h1 className="text-2xl font-bold">Profile & Settings</h1>
                    <p className="text-slate-500 text-sm">Manage your Setu Mitra preferences.</p>
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
                            <p className="text-[11px] uppercase tracking-widest font-black text-primary bg-primary/10 px-3 py-1 rounded-full inline-block mt-2">Verified Farmer</p>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-1 relative overflow-hidden shadow-inner">
                        <div className="flex gap-1 bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-full">
                            <button className="flex-1 py-3 text-sm font-bold bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-full shadow-sm">General</button>
                            <button className="flex-1 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">Security</button>
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
                                Personalization Base
                            </h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-bold">Dark Mode</p>
                                    <p className="text-xs text-slate-500 max-w-xs mt-1">Protect your eyes and save smartphone battery, especially scanning soil fields at night.</p>
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
                                <p className="font-bold group-hover:text-primary transition-colors">Language Preferences</p>
                                <p className="text-xs text-slate-500 max-w-xs mt-1">Currently Setu Mitra communicates with you in: <span className="font-bold text-slate-700 dark:text-slate-300">{selectedLang}</span>.</p>
                            </div>
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary relative transition-transform group-hover:translate-x-1">chevron_right</span>
                        </div>

                        <div className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex items-center justify-between group" onClick={() => setIsLocModalOpen(true)}>
                            <div>
                                <p className="font-bold group-hover:text-primary transition-colors">Your Farm Location</p>
                                <p className="text-xs text-slate-500 max-w-xs mt-1">Update your farm coordinates for precise incoming climate alert forecasting. <br /><span className="font-bold text-primary mt-1 inline-block bg-primary/10 px-2 py-0.5 rounded">{locationDisplay}</span></p>
                            </div>
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary relative transition-transform group-hover:translate-x-1">chevron_right</span>
                        </div>

                        {/* Update Profile Picture */}
                        <div
                            className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex items-center justify-between group"
                            onClick={() => profilePicRef.current?.click()}
                        >
                            <div>
                                <p className="font-bold group-hover:text-primary transition-colors">Update Profile Picture</p>
                                <p className="text-xs text-slate-500 max-w-xs mt-1">Upload a new photo for your farmer profile. Supported formats: JPEG, PNG, WebP.</p>
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
                                <h4 className="font-bold">{loggingOut ? 'Logging out...' : 'Log out securely'}</h4>
                                <p className="text-xs opacity-80 font-medium">Clear session data and return to the Welcome portal.</p>
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
                            <h3 className="text-xl font-bold">Select Language / भाषा चुनें</h3>
                            <button onClick={() => setIsLangModalOpen(false)} className="text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full p-2 cursor-pointer">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2">
                            {languages.map(lang => (
                                <button
                                    key={lang.name}
                                    onClick={() => { setSelectedLang(lang.name); setIsLangModalOpen(false); }}
                                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors cursor-pointer border ${selectedLang === lang.name ? 'border-primary bg-primary/10' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                >
                                    <div className="flex flex-col text-left">
                                        <span className="font-bold text-slate-900 dark:text-white">{lang.native}</span>
                                        <span className="text-xs text-slate-500">{lang.name}</span>
                                    </div>
                                    {selectedLang === lang.name && <span className="material-symbols-outlined text-primary">check_circle</span>}
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
                                Update Location
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
                                Auto-Detect GPS
                            </button>

                            <div className="flex items-center gap-4 text-slate-400 text-xs font-bold uppercase tracking-widest">
                                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
                                OR ENTER COORDINATES
                                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
                            </div>

                            <form onSubmit={handleManualLocation} className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Latitude</label>
                                        <input
                                            type="number"
                                            name="latitude"
                                            step="any"
                                            defaultValue={user?.location?.latitude || ''}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                                            placeholder="e.g. 28.6139"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Longitude</label>
                                        <input
                                            type="number"
                                            name="longitude"
                                            step="any"
                                            defaultValue={user?.location?.longitude || ''}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                                            placeholder="e.g. 77.2090"
                                            required
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loadingLoc}
                                    className="w-full h-14 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    {loadingLoc ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : 'Save Location'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

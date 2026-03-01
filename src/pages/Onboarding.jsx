import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState({ lat: null, lng: null, address: '' });
    const [searchQuery, setSearchQuery] = useState('');

    const handleGetLocation = () => {
        setLoading(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    // Mocking Google Maps Reverse Geocoding
                    setTimeout(() => {
                        setLocation({
                            lat: latitude,
                            lng: longitude,
                            address: 'Nagpur, Maharashtra, India' // Simulated derived address
                        });
                        setSearchQuery('Nagpur, Maharashtra, India');
                        setLoading(false);
                    }, 1000);
                },
                (error) => {
                    console.error("Error getting location: ", error);
                    setLoading(false);
                    alert("Unable to fetch location automatically. Please search manually.");
                }
            );
        } else {
            setLoading(false);
            alert("Geolocation is not supported by your browser");
        }
    };

    const handleContinue = (e) => {
        e.preventDefault();
        if (location.lat && location.lng) {
            // Save to DB / Context here
            console.log('Saved Coordinates:', location);
            navigate('/dashboard');
        } else {
            alert('Please provide your location or allow permissions to continue.');
        }
    };

    // Simulated typeahead map search
    const handleSearch = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLocation({
                lat: 21.1458,
                lng: 79.0882,
                address: searchQuery || 'Nagpur, Maharashtra'
            });
            setLoading(false);
        }, 800);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex items-center justify-center relative overflow-hidden p-6">
            <div className="absolute inset-0 bg-primary/5 pointer-events-none opacity-50"></div>

            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-8 lg:p-10 shadow-2xl relative z-10 border border-primary/20">
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex items-center justify-center size-14 rounded-full bg-saffron/10 text-saffron shadow-lg">
                            <span className="material-symbols-outlined text-3xl">my_location</span>
                        </div>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-2 text-center">
                        Where is your farm?
                    </h2>
                    <p className="text-slate-500 text-center text-sm">
                        Accurate location helps Setu Mitra provide precise hyper-local weather alerts and soil crop suggestions.
                    </p>
                </div>

                <div className="flex flex-col gap-6">
                    <button
                        onClick={handleGetLocation}
                        className="w-full cursor-pointer h-14 bg-earth-warm hover:bg-primary/20 dark:bg-slate-800 dark:hover:bg-primary/30 text-primary dark:text-white rounded-xl font-bold text-lg transition-all border border-primary/20 flex items-center justify-center gap-3"
                    >
                        {loading && !searchQuery ? (
                            <span className="material-symbols-outlined animate-spin">refresh</span>
                        ) : (
                            <span className="material-symbols-outlined">my_location</span>
                        )}
                        <span>Use My Current Location</span>
                    </button>

                    <div className="flex items-center gap-4 text-slate-400 text-sm font-medium">
                        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
                        OR SEARCH
                        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
                    </div>

                    <form onSubmit={handleSearch} className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        <input
                            type="text"
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                            placeholder="Search your village, district, or PIN..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>

                    {location.address && (
                        <div className="p-4 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">location_on</span>
                                <div className="text-sm">
                                    <p className="font-bold text-slate-900 dark:text-white">{location.address}</p>
                                    <p className="text-slate-500 text-xs">Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}</p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-green-600">check_circle</span>
                        </div>
                    )}

                    <div className="mt-4">
                        <button
                            onClick={handleContinue}
                            disabled={!location.lat}
                            className={`w-full cursor-pointer h-14 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg 
                                ${location.lat ? 'bg-primary hover:bg-primary/90 text-white shadow-primary/20' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'}`}
                        >
                            <span>Save & Continue to Dashboard</span>
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

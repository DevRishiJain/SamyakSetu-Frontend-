import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // In the future, this is where API authentication will go.
        // For now, we will simulate login/signup routing.
        if (isLogin) {
            navigate('/dashboard');
        } else {
            navigate('/onboarding');
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex items-center justify-center relative overflow-hidden p-6">
            {/* Background elements to match the welcome screen aesthetic */}
            <div className="absolute inset-0 bg-primary/5 pointer-events-none opacity-50"></div>
            <div className="absolute top-[-10%] left-[-10%] w-[40%] aspect-square bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] aspect-square bg-saffron/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 lg:p-10 shadow-2xl relative z-10 border border-primary/20">
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex items-center justify-center size-12 rounded-xl bg-primary text-white shadow-lg shadow-primary/30">
                            <span className="material-symbols-outlined text-3xl">potted_plant</span>
                        </div>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-2">
                        {isLogin ? 'Welcome Back!' : 'Join Samyak Setu'}
                    </h2>
                    <p className="text-slate-500 text-center text-sm">
                        {isLogin ? 'Log in to continue your farming journey' : 'Create an account to improve your harvest together'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">Full Name (पूरा नाम)</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">person</span>
                                <input
                                    type="text"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                    placeholder="Enter your full name"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">Phone Number (फ़ोन नंबर)</label>
                        <div className="relative flex">
                            <span className="inline-flex items-center px-3 border border-r-0 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-l-xl font-medium sm:text-sm">
                                +91
                            </span>
                            <input
                                type="tel"
                                required
                                pattern="[0-9]{10}"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-r-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                placeholder="10-digit number"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">Password (पासवर्ड)</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">lock</span>
                            <input
                                type="password"
                                required
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button type="submit" className="mt-4 w-full cursor-pointer h-12 lg:h-14 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                        {isLogin ? (
                            <>
                                <span>Log In • लॉग इन करें</span>
                                <span className="material-symbols-outlined">login</span>
                            </>
                        ) : (
                            <>
                                <span>Sign Up • साइन अप करें</span>
                                <span className="material-symbols-outlined">person_add</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-slate-500 text-sm">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-primary font-bold hover:underline cursor-pointer focus:outline-none"
                        >
                            {isLogin ? 'Sign up' : 'Log in'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Typed from 'typed.js';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../i18n';

export default function Welcome() {
    const el = useRef(null);
    const featuresRef = useRef(null);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { theme, toggleTheme } = useTheme();
    const { language, setLanguage } = useLanguage();
    const [isLangOpen, setIsLangOpen] = useState(false);



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
            title: t('welcome.feature1Title'),
            subtitle: t('welcome.feature1Subtitle'),
            desc: t('welcome.feature1Desc'),
            icon: "photo_camera",
            color: "text-primary",
            bg: "bg-primary/10",
            imgStyle: "bg-gradient-to-tr from-primary to-green-600",
            image: "/images/soil_mascot.png",
            list: [t('welcome.instantAISoil'), t('welcome.landIrrigation'), t('welcome.personalizedCrop')]
        },
        {
            title: t('welcome.feature2Title'),
            subtitle: t('welcome.feature2Subtitle'),
            desc: t('welcome.feature2Desc'),
            icon: "thermostat",
            color: "text-saffron",
            bg: "bg-saffron/10",
            imgStyle: "bg-gradient-to-tr from-saffron to-orange-500",
            image: "/images/weather_mascot.png",
            reverse: true,
            list: [t('welcome.locationWeather'), t('welcome.climateAlerts'), t('welcome.dailyAdvisory')]
        },
        {
            title: t('welcome.feature3Title'),
            subtitle: t('welcome.feature3Subtitle'),
            desc: t('welcome.feature3Desc'),
            icon: "forum",
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            imgStyle: "bg-gradient-to-tr from-blue-500 to-cyan-500",
            image: "/images/chatbot_mascot.png",
            list: [t('welcome.textVoiceChat'), t('welcome.nativeLanguage'), t('welcome.instantRemedies')]
        },
        {
            title: t('welcome.feature4Title'),
            subtitle: t('welcome.feature4Subtitle'),
            desc: t('welcome.feature4Desc'),
            icon: "groups",
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            imgStyle: "bg-gradient-to-tr from-purple-600 to-pink-500",
            image: "/images/community_mascot.png",
            reverse: true,
            list: [t('welcome.aiForums'), t('welcome.liveMandiPrices'), t('welcome.govtProcurement')]
        },
        {
            title: t('welcome.feature5Title'),
            subtitle: t('welcome.feature5Subtitle'),
            desc: t('welcome.feature5Desc'),
            icon: "park",
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            imgStyle: "bg-gradient-to-tr from-emerald-500 to-teal-500",
            image: "/images/carbon_mascot.png",
            badge: t('welcome.feature5Badge'),
            list: [t('welcome.tradeCarbonCredits'), t('welcome.corporateBuyer'), t('welcome.extraIncome')]
        }
    ];

    return (
        <div className="bg-background-light dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-display transition-colors duration-300">
            <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
                <div className="layout-container flex h-full grow flex-col">
                    {/* Header */}
                    <header className="flex items-center justify-between border-b border-primary/10 px-6 py-4 lg:px-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
                        <div className="flex items-center gap-3">
                            <img src="/images/favicon.png" alt="Samyak Setu Logo" className="size-10 object-contain drop-shadow-sm" />
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
                                    <span className="hidden sm:inline">{language}</span>
                                    <span className="material-symbols-outlined text-lg">expand_more</span>
                                </button>
                                {isLangOpen && (
                                    <div className="absolute right-0 top-12 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col z-50">
                                        {LANGUAGES.map(l => (
                                            <button
                                                key={l.code}
                                                onClick={() => {
                                                    setLanguage(l.native);
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
                        </div>
                    </header>

                    <main className="flex-1">
                        {/* Hero Section */}
                        <div className="px-6 py-10 lg:px-20">
                            <div className="relative overflow-hidden rounded-xl lg:rounded-3xl bg-primary/5 dark:bg-primary/10 p-8 lg:p-16 flex flex-col lg:flex-row items-center gap-12">
                                <div className="absolute inset-0 bg-primary/5 pointer-events-none opacity-50"></div>
                                <div className="flex-1 flex flex-col gap-6 text-center lg:text-left z-10 w-full">
                                    <div className="inline-flex items-center self-center lg:self-start px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                                        {t('welcome.aiAssistant')}
                                    </div>
                                    <div className="min-h-[140px] md:min-h-[180px] lg:min-h-[160px] flex flex-col justify-center">
                                        <h1 className="text-4xl lg:text-6xl font-black leading-tight tracking-tight text-slate-900 dark:text-slate-50 mb-0">
                                            <span className="inline-block" ref={el}></span>
                                        </h1>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                                        <button onClick={() => navigate('/auth')} className="cursor-pointer h-12 lg:h-14 px-8 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                                            <span>{t('welcome.getStarted')}</span>
                                            <span className="material-symbols-outlined">arrow_forward</span>
                                        </button>
                                        <button
                                            onClick={() => featuresRef.current?.scrollIntoView({ behavior: 'smooth' })}
                                            className="cursor-pointer h-12 lg:h-14 px-8 border-2 border-primary/20 hover:border-primary/40 text-primary dark:text-primary dark:hover:text-primary/80 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl font-bold text-lg transition-all flex items-center justify-center"
                                        >
                                            {t('welcome.learnMore')}
                                        </button>
                                    </div>
                                </div>
                                <div className="relative w-full max-w-[320px] md:max-w-[400px] flex-shrink-0 lg:w-1/3 aspect-square mt-6 lg:mt-0">
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 lg:-left-20 lg:top-10 lg:translate-x-0 z-20 bg-white dark:bg-slate-800 px-4 py-2 rounded-2xl shadow-xl border-2 border-primary/20 whitespace-nowrap animate-bounce">
                                        <p className="text-sm font-bold text-primary">{t('welcome.namasteBot')}</p>
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
                                            <p className="text-xs font-bold text-slate-500 uppercase">{t('common.status')}</p>
                                            <p className="text-sm font-bold text-primary">{t('welcome.onlineReady')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Features Section */}
                        <div ref={featuresRef} className="py-20 bg-earth-warm/30 dark:bg-slate-900/50">
                            <div className="max-w-7xl mx-auto px-6 lg:px-20">
                                <div className="text-center max-w-3xl mx-auto mb-16">
                                    <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-3">{t('welcome.poweringAg')}</h2>
                                    <h3 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-slate-50">
                                        {t('welcome.revolutionizing')}
                                    </h3>
                                    <p className="mt-4 text-slate-600 dark:text-slate-400 text-lg">
                                        {t('welcome.builtForFarmers')}
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
                                <img src="/images/favicon.png" alt="Samyak Setu Logo" className="size-8 object-contain drop-shadow-sm" />
                                <h2 className="text-lg font-bold tracking-tight text-primary">Samyak Setu</h2>
                            </div>

                            <p className="text-sm text-slate-400 italic text-center md:text-right">
                                {t('welcome.developedForIndia')}
                            </p>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}

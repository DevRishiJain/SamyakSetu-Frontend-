import { useLanguage } from '../context/LanguageContext';

export default function History() {
    const { t } = useLanguage();
    return (
        <div className="p-6 max-w-4xl mx-auto flex-1 w-full space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="bg-primary/10 text-primary p-2 rounded-lg">
                    <span className="material-symbols-outlined text-2xl">history</span>
                </div>
                <div>
                    <h1 className="text-2xl font-bold">{t('historyTitle')}</h1>
                    <p className="text-slate-500 text-sm">{t('historySub')}</p>
                </div>
            </div>

            <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 lg:ml-8 space-y-12 pb-10">

                {/* Item 1 */}
                <div className="relative">
                    <div className="absolute -left-[11px] bg-primary size-5 rounded-full border-4 border-white dark:border-slate-900 shadow-sm"></div>
                    <div className="pl-8 pt-1 flex flex-col sm:flex-row gap-4 sm:justify-between items-start">
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex-1 w-full">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="bg-primary/10 text-primary size-8 rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[16px]">science</span>
                                </span>
                                <h3 className="font-bold text-lg">Soil Scan: Alluvial Sample</h3>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                                Soil indicated optimal moisture but lacked natural nitrogen. Recommended adding urea mix in the next irrigation phase. Scanned via Setu Vision AI.
                            </p>
                            <button className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                                View Full Report <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                            </button>
                        </div>
                        <div className="text-slate-400 text-xs font-bold uppercase tracking-widest pt-1 flex-shrink-0">
                            2 Days Ago
                        </div>
                    </div>
                </div>

                {/* Item 2 */}
                <div className="relative">
                    <div className="absolute -left-[11px] bg-saffron size-5 rounded-full border-4 border-white dark:border-slate-900 shadow-sm"></div>
                    <div className="pl-8 pt-1 flex flex-col sm:flex-row gap-4 sm:justify-between items-start">
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex-1 w-full flex flex-col h-full justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="bg-saffron/10 text-saffron size-8 rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[16px]">warning</span>
                                    </span>
                                    <h3 className="font-bold text-lg">AI Alert: Whitefly Danger</h3>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 leading-relaxed">
                                    Setu AI analyzed nearby community reports from Nagpur zone and flagged a massive whitefly attack. Early precautionary spray recommended.
                                </p>
                            </div>
                            <button className="text-sm font-bold text-saffron hover:underline flex items-center gap-1">
                                View Treatment <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                            </button>
                        </div>
                        <div className="text-slate-400 text-xs font-bold uppercase tracking-widest pt-1 flex-shrink-0">
                            Last Week
                        </div>
                    </div>
                </div>

                {/* Item 3 */}
                <div className="relative opacity-60">
                    <div className="absolute -left-[11px] bg-slate-300 dark:bg-slate-700 size-5 rounded-full border-4 border-white dark:border-slate-900 shadow-sm"></div>
                    <div className="pl-8 pt-1 flex flex-col sm:flex-row gap-4 sm:justify-between items-start">
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex-1 w-full">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 size-8 rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[16px]">account_circle</span>
                                </span>
                                <h3 className="font-bold text-lg">Onboarding Setu Mitra</h3>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 leading-relaxed">
                                Welcome to Samyak Setu! You set up your profile and registered your farmland location in Nagpur, Maharashtra.
                            </p>
                        </div>
                        <div className="text-slate-400 text-xs font-bold uppercase tracking-widest pt-1 flex-shrink-0">
                            Oct 12, 2024
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

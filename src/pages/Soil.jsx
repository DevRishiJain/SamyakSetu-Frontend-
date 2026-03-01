import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Soil() {
    const [loading, setLoading] = useState(false);
    const [scanned, setScanned] = useState(false);
    const { t } = useLanguage();

    const handleUpload = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setScanned(true);
        }, 1500);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto flex-1 w-full space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="bg-primary/10 text-primary p-2 rounded-lg">
                    <span className="material-symbols-outlined 2xl">science</span>
                </div>
                <div>
                    <h1 className="text-2xl font-bold">{t('soilTitle')}</h1>
                    <p className="text-slate-500 text-sm">{t('soilSub')}</p>
                </div>
            </div>

            {!scanned ? (
                <div className="mt-8">
                    <div className="border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 dark:bg-slate-800/50 rounded-2xl p-12 flex flex-col items-center justify-center text-center transition-colors cursor-pointer" onClick={handleUpload}>
                        {loading ? (
                            <div className="flex flex-col items-center gap-4">
                                <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
                                <h3 className="font-bold text-lg">{t('analyzing')}</h3>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4">
                                <div className="bg-white dark:bg-slate-900 p-4 rounded-full shadow-lg shadow-primary/10">
                                    <span className="material-symbols-outlined text-4xl text-primary">add_a_photo</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{t('tapToScan')}</h3>
                                    <p className="text-slate-500 text-sm max-w-xs mt-2">{t('ensureClear')}</p>
                                </div>
                                <button className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-bold shadow-md hover:bg-primary/90 transition-colors">
                                    {t('openCam')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="space-y-6 fade-in">
                    <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start">
                        <div className="w-full md:w-48 h-48 bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden shadow-inner flex-shrink-0 flex items-center justify-center bg-[url('https://placeholder.pics/svg/300')] bg-cover bg-center">
                            {/* Simulated cropped photo */}
                        </div>
                        <div className="flex-1 w-full space-y-4">
                            <div>
                                <h3 className="text-sm font-bold text-green-700 dark:text-green-500 uppercase tracking-widest mb-1">{t('detectedType')}</h3>
                                <div className="flex items-center gap-3">
                                    <h2 className="text-2xl md:text-3xl font-black">{t('alluvial')}</h2>
                                    <span className="material-symbols-outlined text-green-500 bg-green-100 p-1 rounded-full text-base">check_circle</span>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 mt-2">{t('highlyFertile')}</p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-green-200 dark:border-green-800 pt-4 mt-4">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold">{t('moisture')}</p>
                                    <p className="font-bold text-lg text-blue-600">{t('optimal')}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold">{t('nitrogen')}</p>
                                    <p className="font-bold text-lg text-saffron">{t('deficient')}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold">{t('organicCarbon')}</p>
                                    <p className="font-bold text-lg text-primary">{t('high')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">tips_and_updates</span>
                        {t('recommendedActions')}
                    </h2>

                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
                        <div className="flex gap-4 p-4 border border-slate-100 dark:border-slate-700 rounded-lg hover:border-primary transition-colors cursor-pointer bg-slate-50 dark:bg-slate-800/50">
                            <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-full h-fit">science</span>
                            <div>
                                <h4 className="font-bold text-lg">{t('addUrea')}</h4>
                                <p className="text-slate-500 mt-1">{t('ureaDesc')}</p>
                            </div>
                        </div>
                        <div className="flex gap-4 p-4 border border-slate-100 dark:border-slate-700 rounded-lg hover:border-saffron transition-colors cursor-pointer bg-slate-50 dark:bg-slate-800/50">
                            <span className="material-symbols-outlined text-saffron bg-saffron/10 p-2 rounded-full h-fit">agriculture</span>
                            <div>
                                <h4 className="font-bold text-lg">{t('recCrops')}</h4>
                                <p className="text-slate-500 mt-1">{t('recCropsDesc')}</p>
                            </div>
                        </div>
                    </div>

                    <button className="w-full py-4 border-2 border-primary text-primary hover:bg-primary/5 rounded-xl font-bold transition-colors" onClick={() => setScanned(false)}>
                        {t('scanAnother')}
                    </button>
                </div>
            )}
        </div>
    );
}

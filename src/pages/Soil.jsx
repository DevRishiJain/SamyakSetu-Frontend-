import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { uploadSoilImage, chatWithAdvisor } from '../services/api';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Soil() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const fileInputRef = useRef(null);

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState('');

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setUploadResult(null);
            setAnalysis(null);
            setError('');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) { setError(t('soil.selectImageError')); return; }
        if (!user?.id) { setError(t('soil.userSessionError')); return; }
        setUploading(true);
        setError('');
        try {
            const data = await uploadSoilImage(user.id, selectedFile);
            setUploadResult(data);
        } catch (err) {
            setError(err.message || 'Failed to upload soil image. Please try again.');
        } finally { setUploading(false); }
    };

    const handleAnalyze = async () => {
        if (!uploadResult) return;
        if (!user?.id) { setError(t('soil.userSessionError')); return; }
        setAnalyzing(true);
        setError('');
        try {
            const data = await chatWithAdvisor({
                farmerId: user.id,
                message: `I just uploaded a soil image and the AI detected it as "${uploadResult.soilType}". Please provide detailed agricultural advice about this soil type including: best crops to grow, fertilizer recommendations, irrigation tips, and any seasonal considerations for my location.`,
            });
            setAnalysis(data);
        } catch (err) {
            setError(err.message || 'Failed to analyze soil. Please try again.');
        } finally { setAnalyzing(false); }
    };

    const handleReset = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setUploadResult(null);
        setAnalysis(null);
        setError('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="p-6 max-w-4xl mx-auto flex-1 w-full space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="bg-primary/10 text-primary p-2 rounded-lg">
                    <span className="material-symbols-outlined 2xl">science</span>
                </div>
                <div>
                    <h1 className="text-2xl font-bold">{t('soil.title')}</h1>
                    <p className="text-slate-500 text-sm">{t('soil.subtitle')}</p>
                </div>
            </div>

            {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">error</span>
                    {error}
                </div>
            )}

            <input type="file" ref={fileInputRef} className="hidden" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleFileSelect} />

            {!uploadResult ? (
                <div className="mt-8">
                    <div
                        className="border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 dark:bg-slate-800/50 rounded-2xl p-12 flex flex-col items-center justify-center text-center transition-colors cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {uploading ? (
                            <div className="flex flex-col items-center gap-4">
                                <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
                                <h3 className="font-bold text-lg">{t('soil.uploadingAnalyzing')}</h3>
                                <p className="text-slate-500 text-sm">{t('soil.mayTakeSeconds')}</p>
                            </div>
                        ) : previewUrl ? (
                            <div className="flex flex-col items-center gap-4">
                                <img src={previewUrl} alt="Soil preview" className="w-48 h-48 object-cover rounded-xl shadow-lg border-2 border-primary/20" />
                                <div>
                                    <h3 className="font-bold text-lg">{selectedFile.name}</h3>
                                    <p className="text-slate-500 text-sm mt-1">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                                </div>
                                <div className="flex gap-3 mt-2">
                                    <button onClick={(e) => { e.stopPropagation(); handleUpload(); }} className="px-6 py-2.5 bg-primary text-white rounded-lg font-bold shadow-md hover:bg-primary/90 transition-colors cursor-pointer flex items-center gap-2">
                                        <span className="material-symbols-outlined text-xl">cloud_upload</span>
                                        {t('soil.uploadScan')}
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); handleReset(); }} className="px-6 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                        {t('soil.change')}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4">
                                <div className="bg-white dark:bg-slate-900 p-4 rounded-full shadow-lg shadow-primary/10">
                                    <span className="material-symbols-outlined text-4xl text-primary">add_a_photo</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{t('soil.tapToScan')}</h3>
                                    <p className="text-slate-500 text-sm max-w-xs mt-2">{t('soil.imageHint')}</p>
                                </div>
                                <button className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-bold shadow-md hover:bg-primary/90 transition-colors cursor-pointer">
                                    {t('soil.selectImage')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="space-y-6 fade-in">
                    <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start">
                        <div className="w-full md:w-48 h-48 rounded-xl overflow-hidden shadow-inner flex-shrink-0">
                            <img src={uploadResult.imagePath || previewUrl} alt="Uploaded soil" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 w-full space-y-4">
                            <div>
                                <h3 className="text-sm font-bold text-green-700 dark:text-green-500 uppercase tracking-widest mb-1">{t('soil.detectedSoilType')}</h3>
                                <div className="flex items-center gap-3">
                                    <h2 className="text-2xl md:text-3xl font-black">{uploadResult.soilType}</h2>
                                    <span className="material-symbols-outlined text-green-500 bg-green-100 p-1 rounded-full text-base">check_circle</span>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 mt-2">{t('soil.aiVisionDetected')}</p>
                            </div>
                            {uploadResult.imagePath && (
                                <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg">
                                    <span className="material-symbols-outlined text-sm">cloud_done</span>
                                    {t('soil.storedInS3')}
                                </div>
                            )}
                        </div>
                    </div>

                    {!analysis && (
                        <button onClick={handleAnalyze} disabled={analyzing} className="w-full py-4 bg-saffron hover:bg-saffron/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-saffron/20 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60">
                            {analyzing ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                    {t('soil.analyzingWithAI')}
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined">auto_awesome</span>
                                    {t('soil.analyzeButton')}
                                </>
                            )}
                        </button>
                    )}

                    {analysis && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">tips_and_updates</span>
                                {t('soil.aiAnalysis')}
                            </h2>
                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                                <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-[15px] leading-relaxed break-words">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {typeof analysis.reply === 'string' ? analysis.reply : String(analysis.reply || '')}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    )}

                    <button className="w-full py-4 border-2 border-primary text-primary hover:bg-primary/5 rounded-xl font-bold transition-colors cursor-pointer" onClick={handleReset}>
                        {t('soil.scanAnother')}
                    </button>
                </div>
            )}
        </div>
    );
}

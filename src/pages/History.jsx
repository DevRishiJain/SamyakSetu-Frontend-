import { useState, useEffect } from 'react';
import { getHistory } from '../services/api';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// ──────── Helpers ────────

function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

function formatTime(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

function relativeTime(iso) {
    if (!iso) return '';
    const now = new Date();
    const d = new Date(iso);
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return formatDate(iso);
}

// Merge all three arrays into a single sorted timeline.
function buildTimeline(data) {
    const items = [];

    (data.chatHistory || []).forEach(h => {
        items.push({ ...h, _type: 'chat', _time: h.createdAt });
    });

    (data.soilUploadHistory || []).forEach(h => {
        items.push({ ...h, _type: 'soil', _time: h.createdAt });
    });

    (data.samyakaiHistory || []).forEach(h => {
        items.push({ ...h, _type: 'samyakai', _time: h.createdAt });
    });

    // Newest first
    items.sort((a, b) => new Date(b._time) - new Date(a._time));
    return items;
}

// ──────── Tab button for filter bar ────────
const TABS = [
    { key: 'all', labelKey: 'history.all', icon: 'select_all' },
    { key: 'chat', labelKey: 'history.advisoryChat', icon: 'chat' },
    { key: 'soil', labelKey: 'history.soilScans', icon: 'science' },
    { key: 'samyakai', labelKey: 'history.samyakAI', icon: 'smart_toy' },
];

function TabButton({ active, icon, label, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`
                flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-200
                whitespace-nowrap cursor-pointer select-none
                ${active
                    ? 'bg-primary text-white shadow-md shadow-primary/25'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-primary/40 hover:text-primary'
                }
            `}
        >
            <span className="material-symbols-outlined text-[16px]">{icon}</span>
            {label}
        </button>
    );
}

// ──────── Individual history cards ────────

function ChatCard({ item }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div
            onClick={() => setExpanded(!expanded)}
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200 cursor-pointer"
        >
            <div className="flex items-start gap-3">
                <div className={`
                    size-10 rounded-xl flex items-center justify-center flex-shrink-0
                    ${item.role === 'user'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-emerald-500/10 text-emerald-600'
                    }
                `}>
                    <span className="material-symbols-outlined text-xl">
                        {item.role === 'user' ? 'person' : 'smart_toy'}
                    </span>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/5 px-2 py-0.5 rounded-full">
                            <span className="material-symbols-outlined text-[12px]">chat</span>
                            Advisory Chat
                        </span>
                        <span className="text-[10px] text-slate-400 flex-shrink-0">{relativeTime(item.createdAt)}</span>
                    </div>
                    <div className={`mt-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed ${!expanded ? 'line-clamp-3' : ''}`}>
                        <div className="prose dark:prose-invert max-w-none text-[14px] leading-relaxed break-words">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {typeof item.message === 'string' ? item.message : String(item.message || '')}
                            </ReactMarkdown>
                        </div>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                        <p className="text-[10px] text-slate-400">
                            {formatDate(item.createdAt)} · {formatTime(item.createdAt)}
                        </p>
                        <span className="text-[10px] font-medium text-primary hover:underline">
                            {expanded ? 'Show less' : 'Read more'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SoilCard({ item }) {
    return (
        <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-saffron/30 transition-all duration-200">
            <div className="flex items-start gap-3">
                <div className="size-10 rounded-xl bg-saffron/10 text-saffron flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-xl">science</span>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-saffron bg-saffron/5 px-2 py-0.5 rounded-full">
                            <span className="material-symbols-outlined text-[12px]">science</span>
                            Soil Scan
                        </span>
                        <span className="text-[10px] text-slate-400 flex-shrink-0">{relativeTime(item.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-3 mt-1">
                        {item.imagePath && (
                            <img
                                src={item.imagePath}
                                alt="Soil sample"
                                className="size-16 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        )}
                        <div>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                {item.soilType || 'Unknown Soil Type'}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-1">
                                {formatDate(item.createdAt)} · {formatTime(item.createdAt)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SamyakAICard({ item }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div
            onClick={() => setExpanded(!expanded)}
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-blue-400/30 transition-all duration-200 cursor-pointer"
        >
            <div className="flex items-start gap-3">
                <div className={`
                    size-10 rounded-xl flex items-center justify-center flex-shrink-0
                    ${item.role === 'user'
                        ? 'bg-blue-500/10 text-blue-500'
                        : 'bg-violet-500/10 text-violet-500'
                    }
                `}>
                    <span className="material-symbols-outlined text-xl">
                        {item.role === 'user' ? 'person' : 'psychology'}
                    </span>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-500 bg-blue-500/5 px-2 py-0.5 rounded-full">
                            <span className="material-symbols-outlined text-[12px]">smart_toy</span>
                            SamyakAI
                        </span>
                        <span className="text-[10px] text-slate-400 flex-shrink-0">{relativeTime(item.createdAt)}</span>
                    </div>
                    <div className={`mt-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed ${!expanded ? 'line-clamp-3' : ''}`}>
                        <div className="prose dark:prose-invert max-w-none text-[14px] leading-relaxed break-words">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {typeof item.message === 'string' ? item.message : String(item.message || '')}
                            </ReactMarkdown>
                        </div>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                        <p className="text-[10px] text-slate-400">
                            {formatDate(item.createdAt)} · {formatTime(item.createdAt)}
                        </p>
                        <span className="text-[10px] font-medium text-blue-500 hover:underline">
                            {expanded ? 'Show less' : 'Read more'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TimelineCard({ item }) {
    if (item._type === 'chat') return <ChatCard item={item} />;
    if (item._type === 'soil') return <SoilCard item={item} />;
    if (item._type === 'samyakai') return <SamyakAICard item={item} />;
    return null;
}

// ──────── Stat pill shown at the top ────────

function StatPill({ icon, label, count, color }) {
    return (
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-${color}/5 border border-${color}/20`}>
            <span className={`material-symbols-outlined text-base text-${color}`}>{icon}</span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{count}</span>
            <span className="text-[10px] text-slate-400 hidden sm:inline">{label}</span>
        </div>
    );
}

// ──────── Main component ────────

export default function History() {
    const { t } = useTranslation();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        let cancelled = false;

        getHistory()
            .then(d => {
                if (!cancelled) setData(d);
            })
            .catch(err => {
                if (!cancelled) setError(err.message || 'Something went wrong');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, []);

    const timeline = data ? buildTimeline(data) : [];
    const filtered = activeTab === 'all' ? timeline : timeline.filter(i => i._type === activeTab);

    const chatCount = (data?.chatHistory || []).length;
    const soilCount = (data?.soilUploadHistory || []).length;
    const samyakCount = (data?.samyakaiHistory || []).length;
    const totalCount = chatCount + soilCount + samyakCount;

    // ──── Render states ────

    if (loading) {
        return (
            <div className="p-6 max-w-4xl mx-auto flex-1 w-full space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                    <div className="bg-primary/10 text-primary p-2 rounded-lg">
                        <span className="material-symbols-outlined text-2xl">history</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{t('history.title')}</h1>
                        <p className="text-slate-500 text-sm">{t('history.loadingTimeline')}</p>
                    </div>
                </div>

                {/* Skeleton loaders */}
                <div className="space-y-4 animate-pulse">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
                            <div className="flex gap-3">
                                <div className="size-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-700" />
                                    <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
                                    <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 max-w-4xl mx-auto flex-1 w-full space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                    <div className="bg-primary/10 text-primary p-2 rounded-lg">
                        <span className="material-symbols-outlined text-2xl">history</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{t('history.title')}</h1>
                        <p className="text-slate-500 text-sm">{t('history.subtitle')}</p>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center py-16 px-6">
                    <div className="size-20 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-4xl text-red-500">cloud_off</span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">{t('history.unableToLoad')}</h2>
                    <p className="text-sm text-slate-500 text-center max-w-sm mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-lg">refresh</span>
                        {t('common.tryAgain')}
                    </button>
                </div>
            </div>
        );
    }

    // ──── Empty state ────

    if (totalCount === 0) {
        return (
            <div className="p-6 max-w-4xl mx-auto flex-1 w-full space-y-8">
                <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                    <div className="bg-primary/10 text-primary p-2 rounded-lg">
                        <span className="material-symbols-outlined text-2xl">history</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{t('history.title')}</h1>
                        <p className="text-slate-500 text-sm">{t('history.subtitle')}</p>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center py-20 px-6">
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl scale-150"></div>
                        <div className="relative bg-gradient-to-br from-primary/10 to-saffron/10 border-2 border-dashed border-primary/30 rounded-full size-32 flex items-center justify-center">
                            <span className="material-symbols-outlined text-6xl text-primary/60">history_toggle_off</span>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3 text-center">
                        {t('history.noHistoryYet')}
                    </h2>
                    <p className="text-slate-500 text-center max-w-md leading-relaxed">
                        {t('history.noHistoryDesc')}
                    </p>

                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-lg">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center gap-2 shadow-sm">
                            <div className="size-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                                <span className="material-symbols-outlined">chat</span>
                            </div>
                            <p className="text-xs font-bold text-slate-600 dark:text-slate-400 text-center">{t('history.advisoryChat')}</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center gap-2 shadow-sm">
                            <div className="size-10 bg-saffron/10 text-saffron rounded-full flex items-center justify-center">
                                <span className="material-symbols-outlined">science</span>
                            </div>
                            <p className="text-xs font-bold text-slate-600 dark:text-slate-400 text-center">{t('history.soilScans')}</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center gap-2 shadow-sm">
                            <div className="size-10 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center">
                                <span className="material-symbols-outlined">smart_toy</span>
                            </div>
                            <p className="text-xs font-bold text-slate-600 dark:text-slate-400 text-center">{t('history.samyakAI')}</p>
                        </div>
                    </div>

                    <div className="mt-8 bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center gap-3 max-w-md">
                        <span className="material-symbols-outlined text-primary text-xl flex-shrink-0">tips_and_updates</span>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                            <span className="font-bold text-primary">{t('history.tip')}</span> {t('history.tipText')}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ──── Main timeline view ────

    return (
        <div className="p-6 max-w-4xl mx-auto flex-1 w-full space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="bg-primary/10 text-primary p-2 rounded-lg">
                    <span className="material-symbols-outlined text-2xl">history</span>
                </div>
                <div>
                    <h1 className="text-2xl font-bold">{t('history.title')}</h1>
                    <p className="text-slate-500 text-sm">{t('history.subtitle')}</p>
                </div>
            </div>

            {/* Stats bar */}
            <div className="flex items-center gap-3 flex-wrap">
                <StatPill icon="timeline" label={t('history.total')} count={totalCount} color="primary" />
                <StatPill icon="chat" label={t('history.chats')} count={chatCount} color="primary" />
                <StatPill icon="science" label={t('nav.soil')} count={soilCount} color="saffron" />
                <StatPill icon="smart_toy" label={t('history.samyakAI')} count={samyakCount} color="blue-500" />
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
                {TABS.map(tab => (
                    <TabButton
                        key={tab.key}
                        active={activeTab === tab.key}
                        icon={tab.icon}
                        label={t(tab.labelKey)}
                        onClick={() => setActiveTab(tab.key)}
                    />
                ))}
            </div>

            {/* Timeline cards */}
            <div className="space-y-3">
                {filtered.length > 0 ? (
                    filtered.map((item, idx) => (
                        <TimelineCard key={item.id || idx} item={item} />
                    ))
                ) : (
                    <div className="flex flex-col items-center py-16">
                        <div className="size-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                            <span className="material-symbols-outlined text-3xl text-slate-400">filter_list_off</span>
                        </div>
                        <p className="text-sm text-slate-500">{t('history.noEntries')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

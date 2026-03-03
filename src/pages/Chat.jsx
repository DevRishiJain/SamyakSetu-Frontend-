import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { samyakAIChat, textToSpeech, speechToText, voiceChat } from '../services/api';
import { useTranslation } from 'react-i18next';

export default function Chat() {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [voiceMode, setVoiceMode] = useState(false); // Toggle for end-to-end voice chat
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [playingAudioId, setPlayingAudioId] = useState(null); // Track which message audio is playing
    const [ttsLoading, setTtsLoading] = useState(null); // Track which message TTS is loading

    const endOfMessagesRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const recordingTimerRef = useRef(null);
    const audioPlayerRef = useRef(null);

    // ─────────────────────────────────────────
    // TEXT SEND — uses /api/samyakai
    // ─────────────────────────────────────────
    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isTyping) return;

        const userMessage = {
            id: Date.now(),
            text: inputValue,
            sender: "user",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMessage]);
        const query = inputValue;
        setInputValue('');
        setIsTyping(true);

        try {
            const data = await samyakAIChat(query);
            const botReply = {
                id: Date.now() + 1,
                text: data.reply,
                sender: "bot",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, botReply]);
        } catch (err) {
            const errorReply = {
                id: Date.now() + 1,
                text: `Sorry, I encountered an error: ${err.message}. Please try again.`,
                sender: "bot",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isError: true,
            };
            setMessages(prev => [...prev, errorReply]);
        } finally {
            setIsTyping(false);
        }
    };

    // ─────────────────────────────────────────
    // TEXT-TO-SPEECH — plays AI reply as audio
    // ─────────────────────────────────────────
    const handlePlayTTS = async (msg) => {
        // If already playing this message, stop it
        if (playingAudioId === msg.id) {
            if (audioPlayerRef.current) {
                audioPlayerRef.current.pause();
                audioPlayerRef.current = null;
            }
            setPlayingAudioId(null);
            return;
        }

        // If msg already has audioUrl cached, just play it
        if (msg.audioUrl) {
            playAudio(msg.audioUrl, msg.id);
            return;
        }

        setTtsLoading(msg.id);
        try {
            const data = await textToSpeech(msg.text);
            // Cache the audioUrl on the message
            setMessages(prev => prev.map(m =>
                m.id === msg.id ? { ...m, audioUrl: data.audioUrl } : m
            ));
            playAudio(data.audioUrl, msg.id);
        } catch (err) {
            console.error('TTS Error:', err);
            alert('Failed to generate audio: ' + err.message);
        } finally {
            setTtsLoading(null);
        }
    };

    const playAudio = (url, msgId) => {
        // Stop any currently playing audio
        if (audioPlayerRef.current) {
            audioPlayerRef.current.pause();
        }

        const audio = new Audio(url);
        audioPlayerRef.current = audio;
        setPlayingAudioId(msgId);

        audio.play();
        audio.onended = () => {
            setPlayingAudioId(null);
            audioPlayerRef.current = null;
        };
        audio.onerror = () => {
            setPlayingAudioId(null);
            audioPlayerRef.current = null;
        };
    };

    // ─────────────────────────────────────────
    // MICROPHONE RECORDING — MediaRecorder API
    // ─────────────────────────────────────────
    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
            });
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);

            // Start timer
            recordingTimerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

        } catch (err) {
            console.error('Mic access error:', err);
            alert('Please allow microphone access to use voice features.');
        }
    }, []);

    const stopRecording = useCallback(() => {
        return new Promise((resolve) => {
            if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
                resolve(null);
                return;
            }

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const audioFile = new File([audioBlob], 'voice_note.webm', { type: 'audio/webm' });

                // Stop all mic tracks
                mediaRecorderRef.current.stream?.getTracks().forEach(track => track.stop());

                clearInterval(recordingTimerRef.current);
                setIsRecording(false);
                setRecordingTime(0);
                resolve(audioFile);
            };

            mediaRecorderRef.current.stop();
        });
    }, []);

    // ─────────────────────────────────────────
    // STT MODE — Mic → Text in input field
    // ─────────────────────────────────────────
    const handleSTTRecord = async () => {
        if (isRecording) {
            // Stop and transcribe
            const audioFile = await stopRecording();
            if (!audioFile) return;

            setIsTranscribing(true);
            try {
                const data = await speechToText(audioFile);
                setInputValue(prev => prev + (prev ? ' ' : '') + data.text);
            } catch (err) {
                alert('Transcription failed: ' + err.message);
            } finally {
                setIsTranscribing(false);
            }
        } else {
            // Start recording
            await startRecording();
        }
    };

    // ─────────────────────────────────────────
    // VOICE CHAT MODE — Full pipeline
    // Mic → STT → AI → TTS → autoplay
    // ─────────────────────────────────────────
    const handleVoiceChatRecord = async () => {
        if (isRecording) {
            const audioFile = await stopRecording();
            if (!audioFile) return;

            setIsTyping(true);
            setIsTranscribing(true);

            try {
                const data = await voiceChat(audioFile);

                // Add user's transcribed text as a message
                const userMsg = {
                    id: Date.now(),
                    text: data.userText,
                    sender: "user",
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isVoice: true,
                };
                setMessages(prev => [...prev, userMsg]);

                // Add AI reply
                const botReply = {
                    id: Date.now() + 1,
                    text: data.reply,
                    sender: "bot",
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    audioUrl: data.audioUrl,
                    isVoice: true,
                };
                setMessages(prev => [...prev, botReply]);

                // Auto-play the AI's audio response
                if (data.audioUrl) {
                    setTimeout(() => playAudio(data.audioUrl, botReply.id), 500);
                }

            } catch (err) {
                const errorReply = {
                    id: Date.now() + 1,
                    text: `Voice chat error: ${err.message}. Please try again.`,
                    sender: "bot",
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isError: true,
                };
                setMessages(prev => [...prev, errorReply]);
            } finally {
                setIsTyping(false);
                setIsTranscribing(false);
            }
        } else {
            await startRecording();
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            clearInterval(recordingTimerRef.current);
            if (audioPlayerRef.current) {
                audioPlayerRef.current.pause();
            }
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                mediaRecorderRef.current.stream?.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Initialize greeting message with translation
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([{
                id: 1,
                text: t('chat.botGreeting', { name: user?.name ? ` ${user.name.split(' ')[0]}` : '' }),
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        }
    }, [t]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    return (
        <div className="flex-1 w-full flex flex-col h-[calc(100vh-80px)] md:h-[calc(100vh-80px)] overflow-hidden relative">
            {/* Chat Header */}
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 p-4 px-6 flex items-center justify-between shadow-sm z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="bg-saffron/10 text-saffron p-2 rounded-full relative shadow-sm border border-saffron/20">
                        <span className="material-symbols-outlined text-3xl">smart_toy</span>
                        <div className="absolute bottom-1 right-1 size-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                    </div>
                    <div>
                        <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100 leading-tight">{t('chat.samyakAI')}</h2>
                        <p className="text-xs text-green-600 font-bold uppercase tracking-wider flex items-center gap-1">
                            <span className="relative flex size-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full size-2 bg-green-500"></span>
                            </span>
                            {voiceMode ? t('chat.voiceModeActive') : t('chat.onlineStatus')}
                        </p>
                    </div>
                </div>
                <div className="flex gap-1 sm:gap-2 text-slate-400">
                    {/* Voice Mode Toggle */}
                    <button
                        onClick={() => setVoiceMode(!voiceMode)}
                        className={`p-2 rounded-full transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${voiceMode
                            ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30 hover:bg-purple-600'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-purple-500'
                            }`}
                        aria-label="Toggle Voice Mode"
                        title={voiceMode ? 'Switch to Text Mode' : 'Switch to Voice Mode'}
                    >
                        <span className="material-symbols-outlined text-lg">{voiceMode ? 'record_voice_over' : 'voice_over_off'}</span>
                        <span className="hidden sm:inline">{voiceMode ? t('chat.voiceOn') : t('chat.voice')}</span>
                    </button>
                </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950/20">
                <div className="text-center my-4">
                    <span className="bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold tracking-widest px-4 py-1.5 rounded-full shadow-sm">
                        {t('common.today')}
                    </span>
                </div>

                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] sm:max-w-[70%] flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

                            {/* Avatars */}
                            {msg.sender === 'bot' && (
                                <div className="size-8 rounded-full bg-saffron/10 border border-saffron/20 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                                    <span className="material-symbols-outlined text-saffron text-sm">smart_toy</span>
                                </div>
                            )}
                            {msg.sender === 'user' && (
                                <div className="size-8 rounded-full bg-primary/10 border-2 border-white dark:border-slate-800 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm overflow-hidden">
                                    {user?.profilePic ? (
                                        <img src={user.profilePic} alt="User" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="material-symbols-outlined text-primary text-sm">person</span>
                                    )}
                                </div>
                            )}

                            {/* Bubble */}
                            <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`px-5 py-3.5 rounded-2xl shadow-sm text-[15px] leading-relaxed relative ${msg.sender === 'user'
                                    ? 'bg-primary text-white rounded-tr-sm shadow-primary/20'
                                    : msg.isError
                                        ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-tl-sm'
                                        : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-sm shadow-[0_4px_20px_rgba(0,0,0,0.02)]'
                                    }`}>
                                    <p className="whitespace-pre-wrap">{msg.text}</p>

                                    {/* Voice badge for voice messages */}
                                    {msg.isVoice && (
                                        <span className={`inline-flex items-center gap-1 text-[10px] mt-2 ${msg.sender === 'user' ? 'text-white/70' : 'text-slate-400'}`}>
                                            <span className="material-symbols-outlined text-xs">mic</span>
                                            {t('chat.voiceMessage')}
                                        </span>
                                    )}
                                </div>

                                {/* Action buttons row under the bubble */}
                                <div className={`flex items-center gap-1 mt-1 ${msg.sender === 'user' ? 'mr-1' : 'ml-1'}`}>
                                    <span className="text-[10px] text-slate-400 font-medium">
                                        {msg.timestamp}
                                    </span>

                                    {/* TTS Play Button — Only on bot messages that aren't errors */}
                                    {msg.sender === 'bot' && !msg.isError && msg.id !== 1 && (
                                        <button
                                            onClick={() => handlePlayTTS(msg)}
                                            disabled={ttsLoading === msg.id}
                                            className={`ml-1 p-1 rounded-full transition-all cursor-pointer group ${playingAudioId === msg.id
                                                ? 'bg-saffron text-white shadow-sm'
                                                : 'text-slate-400 hover:text-saffron hover:bg-saffron/10'
                                                }`}
                                            title={playingAudioId === msg.id ? 'Stop listening' : 'Listen to this reply'}
                                        >
                                            {ttsLoading === msg.id ? (
                                                <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                                            ) : playingAudioId === msg.id ? (
                                                <span className="material-symbols-outlined text-sm">stop_circle</span>
                                            ) : (
                                                <span className="material-symbols-outlined text-sm group-hover:scale-110 transition-transform">volume_up</span>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                ))}

                {/* Typing / Processing indicator */}
                {(isTyping || isTranscribing) && (
                    <div className="flex justify-start">
                        <div className="max-w-[85%] sm:max-w-[70%] flex gap-3 flex-row">
                            <div className="size-8 rounded-full bg-saffron/10 border border-saffron/20 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                                <span className="material-symbols-outlined text-saffron text-sm">smart_toy</span>
                            </div>
                            <div className="flex flex-col items-start">
                                <div className="px-5 py-3.5 rounded-2xl rounded-tl-sm bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
                                    <div className="flex items-center gap-1.5">
                                        <div className="size-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="size-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="size-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                                <span className="text-[10px] text-slate-400 mt-1 ml-1 font-medium">
                                    {isTranscribing ? t('chat.transcribing') : t('chat.thinking')}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={endOfMessagesRef} />
            </div>

            {/* ═══════════════════════════════════════════ */}
            {/* VOICE MODE — Full Screen Recording UI      */}
            {/* ═══════════════════════════════════════════ */}
            {voiceMode ? (
                <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-6 shrink-0 relative z-20">
                    <div className="max-w-md mx-auto flex flex-col items-center gap-4">

                        {/* Recording visualizer */}
                        {isRecording && (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="w-1 bg-purple-500 rounded-full animate-pulse"
                                            style={{
                                                height: `${12 + Math.random() * 20}px`,
                                                animationDelay: `${i * 100}ms`,
                                                animationDuration: '0.5s',
                                            }}
                                        ></div>
                                    ))}
                                </div>
                                <span className="text-sm font-mono font-bold text-purple-600">{formatTime(recordingTime)}</span>
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="w-1 bg-purple-500 rounded-full animate-pulse"
                                            style={{
                                                height: `${12 + Math.random() * 20}px`,
                                                animationDelay: `${(i + 5) * 100}ms`,
                                                animationDuration: '0.5s',
                                            }}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <p className="text-xs text-slate-500 font-medium text-center">
                            {isRecording
                                ? t('chat.listening')
                                : isTranscribing
                                    ? t('chat.processingVoice')
                                    : t('chat.voiceChatMode')
                            }
                        </p>

                        {/* Big Record Button */}
                        <button
                            onClick={handleVoiceChatRecord}
                            disabled={isTyping || isTranscribing}
                            className={`size-20 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xl disabled:opacity-50 ${isRecording
                                ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/40 animate-pulse'
                                : 'bg-gradient-to-br from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white shadow-purple-500/40 hover:scale-105 active:scale-95'
                                }`}
                        >
                            <span className="material-symbols-outlined text-4xl">
                                {isRecording ? 'stop' : isTranscribing ? 'progress_activity' : 'mic'}
                            </span>
                        </button>

                        {/* Switch to text hint */}
                        <button
                            onClick={() => setVoiceMode(false)}
                            className="text-xs text-slate-400 hover:text-primary transition-colors cursor-pointer flex items-center gap-1"
                        >
                            <span className="material-symbols-outlined text-sm">keyboard</span>
                            {t('chat.switchToTyping')}
                        </button>
                    </div>
                </div>
            ) : (
                /* ═══════════════════════════════════════════ */
                /* TEXT MODE — Normal input with STT mic      */
                /* ═══════════════════════════════════════════ */
                <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 shrink-0 relative z-20">
                    <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-center gap-2">

                        {/* STT Mic Button — records audio → converts to text in the input */}
                        <button
                            type="button"
                            onClick={handleSTTRecord}
                            disabled={isTyping || isTranscribing}
                            className={`p-3 rounded-full flex items-center justify-center transition-all shrink-0 cursor-pointer ${isRecording
                                ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse'
                                : isTranscribing
                                    ? 'bg-saffron/20 text-saffron'
                                    : 'text-slate-400 hover:text-primary hover:bg-primary/10'
                                } disabled:opacity-50`}
                            aria-label={isRecording ? 'Stop recording' : 'Voice input'}
                            title={isRecording ? 'Stop & transcribe' : 'Hold to speak (Speech-to-Text)'}
                        >
                            {isTranscribing ? (
                                <span className="material-symbols-outlined text-xl animate-spin">progress_activity</span>
                            ) : (
                                <span className="material-symbols-outlined text-xl">{isRecording ? 'stop' : 'mic'}</span>
                            )}
                        </button>

                        {/* Recording indicator inline */}
                        {isRecording && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-full">
                                <div className="size-2 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="text-xs font-mono font-bold text-red-600">{formatTime(recordingTime)}</span>
                            </div>
                        )}

                        <div className="flex-1 relative flex items-center bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-inner">
                            <input
                                type="text"
                                className="w-full bg-transparent border-none focus:ring-0 py-3.5 pl-5 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400"
                                placeholder={isTranscribing ? t('chat.transcribing') : isRecording ? '🎤 ...' : t('chat.inputPlaceholder')}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                disabled={isTyping || isRecording}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={!inputValue.trim() || isTyping}
                            className={`p-3.5 rounded-full flex items-center justify-center transition-all shrink-0 ${inputValue.trim() && !isTyping
                                ? 'bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary/90 cursor-pointer transform hover:scale-105 active:scale-95'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 shadow-none cursor-not-allowed'
                                }`}
                            aria-label="Send Message"
                        >
                            <span className="material-symbols-outlined text-xl ml-0.5">send</span>
                        </button>
                    </form>
                </div>
            )}

        </div>
    );
}

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { samyakAIChat } from '../services/api';

export default function Chat() {
    const { user } = useAuth();
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: `Namaste${user?.name ? ` ${user.name.split(' ')[0]}` : ''}! I am SamyakAI, your farming assistant. Ask me anything about agriculture, crops, soil, pests, weather, or farming schemes. 🌾`,
            sender: "bot",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const endOfMessagesRef = useRef(null);

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

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

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
                        <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100 leading-tight">SamyakAI</h2>
                        <p className="text-xs text-green-600 font-bold uppercase tracking-wider flex items-center gap-1">
                            <span className="relative flex size-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full size-2 bg-green-500"></span>
                            </span>
                            Online — Agricultural AI
                        </p>
                    </div>
                </div>
                <div className="flex gap-2 text-slate-400">
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer" aria-label="Translate Chat">
                        <span className="material-symbols-outlined hover:text-primary transition-colors">translate</span>
                    </button>
                    <button
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
                        aria-label="Clear Chat"
                        onClick={() => setMessages([messages[0]])}
                    >
                        <span className="material-symbols-outlined hover:text-red-500 transition-colors">delete_sweep</span>
                    </button>
                </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950/20">
                <div className="text-center my-4">
                    <span className="bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold tracking-widest px-4 py-1.5 rounded-full shadow-sm">
                        Today
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
                                </div>
                                <span className={`text-[10px] text-slate-400 mt-1 font-medium ${msg.sender === 'user' ? 'mr-1' : 'ml-1'}`}>
                                    {msg.timestamp}
                                </span>
                            </div>

                        </div>
                    </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
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
                                <span className="text-[10px] text-slate-400 mt-1 ml-1 font-medium">SamyakAI is thinking...</span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={endOfMessagesRef} />
            </div>

            {/* Chat Input */}
            <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 shrink-0 relative z-20">
                <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-center gap-2">
                    <div className="flex-1 relative flex items-center bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-inner">
                        <input
                            type="text"
                            className="w-full bg-transparent border-none focus:ring-0 py-3.5 pl-5 pr-12 text-sm text-slate-900 dark:text-white placeholder-slate-400"
                            placeholder="Ask SamyakAI (Type in any language)..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            disabled={isTyping}
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

        </div>
    );
}

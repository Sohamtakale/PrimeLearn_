"use client";

import { useState, useRef, useEffect } from 'react';
import { getHint } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MessageSquare, Send, Sparkles, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MentorChat() {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am your AI Socratic Mentor. How can I guide you today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [hintLevel, setHintLevel] = useState(1);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        const lId = localStorage.getItem('learner_id') || 'demo_user';

        const { data, error } = await getHint({
            learner_id: lId,
            concept_id: 'general', // Mock concept
            question: userMsg,
            hint_level: hintLevel
        });

        if (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${error}` }]);
        } else {
            setMessages(prev => [...prev, { role: 'assistant', content: data.hint, level: data.hint_level }]);
            if (data.next_level) {
                setHintLevel(data.next_level);
            }
        }
        setLoading(false);
    };

    return (
        <div className="h-screen flex flex-col bg-brand-secondary">
            {/* Header */}
            <header className="h-16 border-b border-surface-hover bg-surface/80 flex items-center px-8 z-10 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center">
                        <BrainCircuit className="text-brand-primary w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-white font-serif font-bold leading-tight">AI Mentor</h2>
                        <p className="text-xs text-brand-primary tracking-widest uppercase font-bold">Socratic Mode (L{hintLevel})</p>
                    </div>
                </div>
                <div className="ml-auto flex items-center gap-4">
                    <span className="text-xs text-text-secondary border border-surface-hover px-3 py-1 rounded-full">Concept: BST</span>
                </div>
            </header>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-6 relative">
                <div className="absolute inset-0 pointer-events-none opacity-50" style={{ backgroundImage: 'radial-gradient(rgba(201,209,217,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                <div className="max-w-3xl w-full mx-auto flex flex-col gap-6 z-10 my-auto pb-4">
                    {messages.map((m, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className={`flex max-w-[85%] ${m.role === 'user' ? 'self-end bg-surface-hover border-brand-primary/20' : 'self-start bg-surface border-surface-hover'} border p-4 rounded-2xl shadow-lg relative group`}
                        >
                            {m.role === 'assistant' && (
                                <div className="absolute -left-10 top-2 w-8 h-8 rounded-full bg-brand-secondary border border-surface-hover flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-brand-primary" />
                                </div>
                            )}
                            <div className="text-sm md:text-base leading-relaxed text-text-primary whitespace-pre-wrap">
                                {m.content}
                            </div>
                            {m.level && (
                                <div className="absolute -bottom-6 right-0 text-[10px] text-text-secondary uppercase tracking-widest">Hint Level {m.level} applied</div>
                            )}
                        </motion.div>
                    ))}

                    {loading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="self-start max-w-[85%] bg-surface border border-surface-hover p-4 rounded-2xl flex items-center gap-3 ml-10">
                            <div className="w-2 h-2 rounded-full bg-brand-primary animate-bounce"></div>
                            <div className="w-2 h-2 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-6 bg-surface/50 border-t border-surface-hover shrink-0">
                <div className="max-w-3xl mx-auto flex gap-4">
                    <Input
                        placeholder="Ask your question..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        className="bg-brand-secondary border-surface-hover rounded-full px-6"
                    />
                    <Button onClick={handleSend} disabled={!input.trim() || loading} className="w-14 h-14 rounded-full p-0 flex items-center justify-center shrink-0">
                        <Send className="w-5 h-5 ml-1" />
                    </Button>
                </div>
            </div>

        </div>
    );
}

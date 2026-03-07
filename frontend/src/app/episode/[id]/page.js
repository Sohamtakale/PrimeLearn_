"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getEpisode, postProgress, executeCode } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Play, Check, Terminal, Sparkles, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EpisodePlayer() {
    const { id } = useParams();
    const router = useRouter();
    const [episode, setEpisode] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [runningCode, setRunningCode] = useState(false);
    const [masteryLevel, setMasteryLevel] = useState(0); // 0 to 1

    useEffect(() => {
        async function loadEpisode() {
            // Hardcode revision / time for demo
            const { data, error } = await getEpisode(id, false, 30);
            if (error) {
                setError(error);
            } else {
                setEpisode(data);
                if (data.format === 'Code Lab') {
                    // Provide standard boilerplate for code lab
                    setCode('// Write your solution here\nfunction solve() {\n  return "Hello World";\n}\n\nconsole.log(solve());');
                }
            }
            setLoading(false);
        }
        loadEpisode();
    }, [id]);

    const handleRunCode = async () => {
        setRunningCode(true);
        // In PrimeLearn, Sandbox only supports Python currently per our backend constraints
        // For demo purposes, we'll send it assuming it's python, or mock it if JS is written
        const { data, error } = await executeCode({ code, language: 'python' });

        if (error) {
            setOutput(`Error: ${error}`);
        } else {
            setOutput(data.error ? `Traceback:\n${data.error}` : data.output || "Success");
            // Bump mastery
            setMasteryLevel(prev => Math.min(prev + 0.5, 1));
        }
        setRunningCode(false);
    };

    const handleComplete = async () => {
        const lId = localStorage.getItem('learner_id');
        await postProgress(id, {
            learner_id: lId,
            concept_id: id,
            completion_rate: 1.0,
            time_spent_seconds: 120
        });
        router.push('/home');
    };

    if (loading) return <div className="h-screen flex items-center justify-center text-text-secondary">Loading Module...</div>;
    if (error) return <div className="h-screen flex items-center justify-center text-brand-danger">Error: {error}</div>;
    if (!episode) return <div className="h-screen flex items-center justify-center text-text-secondary">No Episode Found</div>;

    return (
        <div className="h-screen flex flex-col bg-brand-secondary text-text-primary">
            {/* Header Breadcrumb Area */}
            <header className="h-16 border-b border-surface-hover bg-surface/50 backdrop-blur px-8 flex items-center justify-between z-10">
                <div className="flex items-center gap-4 text-sm text-text-secondary font-medium">
                    <span>DNS Search</span>
                    <span>/</span>
                    <span className="text-white">{episode.title || "Episode"}</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-brand-primary uppercase tracking-widest">{episode.format || "Visual Story"}</span>
                    <div className="text-white text-sm bg-surface-hover px-3 py-1 rounded-full">{Math.round(masteryLevel * 100)}%</div>
                </div>
            </header>

            {/* Split Content Area depending on format */}
            <div className="flex-1 flex overflow-hidden">

                {/* Left Side: Instructions / Content */}
                <div className={`p-8 overflow-y-auto ${episode.format === 'Code Lab' ? 'w-1/3 border-r border-surface-hover bg-surface/30' : 'w-full max-w-4xl mx-auto'}`}>
                    <h1 className="text-3xl font-serif text-white mb-6 leading-tight">{episode.title}</h1>

                    <div className="prose prose-invert prose-p:text-text-secondary prose-headings:text-white max-w-none">
                        {episode.content ? (
                            <div dangerouslySetInnerHTML={{ __html: episode.content?.replace(/\n/g, '<br/>') }} />
                        ) : (
                            <p>The journey begins here...</p>
                        )}
                    </div>

                    {episode.format !== 'Code Lab' && (
                        <div className="mt-12 flex justify-end">
                            <Button onClick={handleComplete}>Mark Complete</Button>
                        </div>
                    )}
                </div>

                {/* Right Side: Code Editor (Only for Code Lab) */}
                {episode.format === 'Code Lab' && (
                    <div className="w-2/3 flex flex-col bg-[#0d1117]">
                        {/* Editor Tabs bar */}
                        <div className="flex bg-surface border-b border-surface-hover text-xs font-mono text-text-secondary">
                            <div className="px-4 py-2 border-r border-surface-hover bg-[#0d1117] text-white">main.py</div>
                        </div>

                        {/* Textarea Code block (Simplified IDE) */}
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="flex-1 w-full bg-transparent text-[#c9d1d9] p-6 font-mono text-sm resize-none focus:outline-none"
                            spellCheck="false"
                        />

                        {/* Terminal Output */}
                        <div className="h-48 border-t border-surface-hover bg-surface flex flex-col">
                            <div className="flex items-center justify-between px-4 py-2 border-b border-surface-hover text-xs font-mono text-brand-primary">
                                <span className="flex items-center gap-2"><Terminal size={14} /> Output Console</span>
                                <div className="flex gap-2">
                                    <Button onClick={handleComplete} variant="ghost" size="sm" className="hidden md:flex">Submit & Complete</Button>
                                    <Button onClick={handleRunCode} size="sm" className="h-8 py-0 gap-2 font-mono text-xs" isLoading={runningCode}>
                                        <Play size={12} /> Run Code
                                    </Button>
                                </div>
                            </div>
                            <div className="flex-1 p-4 font-mono text-sm overflow-y-auto text-text-secondary whitespace-pre-wrap">
                                {output || "No output yet. Run your code."}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* AI Mentor Floating Button */}
            <motion.button
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                onClick={() => router.push('/mentor')}
                className="fixed bottom-6 right-6 bg-surface border border-surface-hover hover:border-brand-primary/50 text-white pl-4 pr-5 py-3 rounded-full shadow-2xl flex items-center gap-3 transition-colors group"
            >
                <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center">
                    <MessageSquare size={16} className="text-brand-primary group-hover:scale-110 transition-transform" />
                </div>
                <span className="font-medium text-sm">Ask Mentor</span>
            </motion.button>

        </div>
    );
}

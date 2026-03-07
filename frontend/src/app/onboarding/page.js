"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser, setGoal, getAssessment, submitAssessment, setLearnerId } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Sparkles, Globe, BrainCircuit, Activity, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Onboarding() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // State
    const [goal, setGoalText] = useState('');
    const [language, setLanguageText] = useState('en');
    const [questions, setQuestions] = useState([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [finalScore, setFinalScore] = useState(null);

    const handleRegisterAndGoal = async () => {
        if (!goal.trim()) return;
        setLoading(true);
        setError(null);

        // 1. Register
        const { data: regData, error: regErr } = await registerUser({ language });
        if (regErr) { setError(regErr); setLoading(false); return; }

        const lId = regData.learner_id;
        setLearnerId(lId);

        // 2. Set Goal
        const { error: goalErr } = await setGoal({ learner_id: lId, goal });
        if (goalErr) { setError(goalErr); setLoading(false); return; }

        setStep(2);
        setLoading(false);
    };

    const handleFetchAssessment = async () => {
        setLoading(true);
        setError(null);
        const lId = localStorage.getItem('learner_id');
        const { data, error } = await getAssessment(lId);

        if (error) { setError(error); setLoading(false); return; }

        setQuestions(data.assessment);
        setStep(3);
        setLoading(false);
    };

    const handleAnswerSubmit = async (selectedOptionIndex) => {
        const currentQ = questions[currentQIndex];
        const isCorrect = selectedOptionIndex === currentQ.correct_option_index;

        const newAnswers = [...answers, {
            question_id: `q${currentQIndex}`,
            difficulty: currentQ.difficulty || 0.5,
            is_correct: isCorrect
        }];

        setAnswers(newAnswers);

        if (currentQIndex < questions.length - 1) {
            setCurrentQIndex(currentQIndex + 1);
        } else {
            // Finished all questions, submit to backend
            setLoading(true);
            const lId = localStorage.getItem('learner_id');
            const { data, error } = await submitAssessment({
                learner_id: lId,
                answers: newAnswers
            });

            if (error) { setError(error); setLoading(false); return; }

            setFinalScore(data.ability_score * 1000); // Scale to 1000 for visuals
            setStep(4);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-secondary text-text-primary flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Background Dots */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--color-text-secondary) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

            <AnimatePresence mode="wait">

                {/* STEP 1: GOAL */}
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className="w-full max-w-xl z-10 flex flex-col items-center"
                    >
                        <Sparkles className="text-brand-primary w-12 h-12 mb-6" />
                        <h1 className="text-5xl font-serif text-white mb-2 text-center">What do you<br />want to learn?</h1>
                        <p className="text-text-secondary mb-10 text-center">Your goals dictate the breadth and depth of your map.</p>

                        <div className="w-full bg-surface p-8 rounded-3xl border border-surface-hover shadow-2xl">
                            <Input
                                placeholder="e.g. Master CPU Architecture, Explore AWS, Build a web crawler"
                                value={goal}
                                onChange={(e) => setGoalText(e.target.value)}
                                className="mb-8 p-4 text-lg"
                                onKeyDown={(e) => e.key === 'Enter' && handleRegisterAndGoal()}
                            />

                            <div className="flex flex-wrap gap-2 mb-8 justify-center">
                                {['AWS Architect', 'API Auth', 'Pershing', 'ML/AI Coding'].map(tag => (
                                    <span key={tag} onClick={() => setGoalText(tag)} className="text-xs px-3 py-1 rounded-full border border-surface-hover bg-surface-hover/50 text-text-secondary cursor-pointer hover:border-brand-primary/50 hover:text-white transition-colors">
                                        + {tag}
                                    </span>
                                ))}
                            </div>

                            <Button
                                onClick={handleRegisterAndGoal}
                                className="w-full flex justify-center items-center gap-2 py-4 text-lg"
                                disabled={!goal.trim() || loading}
                                isLoading={loading}
                            >
                                Continue <ChevronRight className="w-5 h-5" />
                            </Button>
                            {error && <p className="text-brand-danger text-sm text-center mt-4">{error}</p>}
                        </div>
                    </motion.div>
                )}

                {/* STEP 2: LANGUAGE */}
                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className="w-full max-w-3xl z-10 flex flex-col items-center"
                    >
                        <h1 className="text-4xl font-serif text-white mb-2 text-center">Set your trajectory</h1>
                        <p className="text-text-secondary mb-10 text-center">Select language your modules load initially in.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-10">

                            <div
                                className={`bg-surface border-2 rounded-2xl p-6 cursor-pointer transition-all ${language === 'en' ? 'border-brand-primary shadow-[0_0_20px_rgba(255,210,30,0.15)]' : 'border-surface-hover hover:border-text-secondary'}`}
                                onClick={() => setLanguageText('en')}
                            >
                                <div className="h-40 bg-brand-secondary rounded-xl mb-6 overflow-hidden relative">
                                    {/* Placeholder visual */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 to-black/40 flex items-center justify-center">
                                        <Globe className="w-12 h-12 text-white/50" />
                                    </div>
                                </div>
                                <h3 className="text-2xl text-white font-serif mb-2">English</h3>
                                <p className="text-text-secondary text-sm">Western regions language model optimizations for vocabulary.</p>
                            </div>

                            <div
                                className={`bg-surface border-2 rounded-2xl p-6 cursor-pointer transition-all ${language === 'hi' ? 'border-brand-primary shadow-[0_0_20px_rgba(255,210,30,0.15)]' : 'border-surface-hover hover:border-text-secondary'}`}
                                onClick={() => setLanguageText('hi')}
                            >
                                <div className="h-40 bg-brand-secondary rounded-xl mb-6 overflow-hidden relative">
                                    {/* Placeholder visual */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-orange-900/40 to-black/40 flex items-center justify-center">
                                        <Globe className="w-12 h-12 text-white/50" />
                                    </div>
                                </div>
                                <h3 className="text-2xl text-white font-serif mb-2">Hindi</h3>
                                <p className="text-text-secondary text-sm">Contextual translation tuning tailored specifically culturally to India.</p>
                            </div>
                        </div>

                        {error && <p className="text-brand-danger mb-4">{error}</p>}

                        <Button onClick={handleFetchAssessment} className="w-full max-w-sm py-4" isLoading={loading}>
                            Load My Exam
                        </Button>
                    </motion.div>
                )}

                {/* STEP 3: ASSESSMENT */}
                {step === 3 && questions.length > 0 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}
                        className="w-full max-w-3xl z-10"
                    >
                        <div className="flex justify-between items-center mb-4 text-xs font-semibold text-text-secondary tracking-widest uppercase">
                            <span>Adaptive Assessment</span>
                            <span>Question {currentQIndex + 1} of {questions.length}</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-1 w-full bg-surface rounded-full mb-12 overflow-hidden">
                            <motion.div
                                className="h-full bg-brand-primary"
                                initial={{ width: `${(currentQIndex / questions.length) * 100}%` }}
                                animate={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
                            />
                        </div>

                        <h2 className="text-2xl md:text-3xl text-white font-serif leading-relaxed mb-10">
                            {questions[currentQIndex].question}
                        </h2>

                        <div className="flex flex-col gap-4">
                            {questions[currentQIndex].options.map((option, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => !loading && handleAnswerSubmit(idx)}
                                    className={`group bg-surface border border-surface-hover p-5 rounded-2xl cursor-pointer hover:border-brand-primary/50 hover:bg-surface-hover transition-colors flex items-center gap-4 ${loading ? 'opacity-50 pointer-events-none' : ''}`}
                                >
                                    <div className="w-8 h-8 rounded-full bg-brand-secondary border border-surface-hover flex items-center justify-center text-text-secondary group-hover:bg-brand-primary group-hover:text-brand-secondary group-hover:border-brand-primary font-bold text-sm transition-colors">
                                        {String.fromCharCode(65 + idx)}
                                    </div>
                                    <span className="text-text-primary text-lg">{option}</span>
                                </div>
                            ))}
                        </div>

                        {error && <p className="text-brand-danger mt-6 text-center">{error}</p>}
                    </motion.div>
                )}

                {/* STEP 4: RESULT */}
                {step === 4 && (
                    <motion.div
                        key="step4"
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-2xl z-10 flex flex-col items-center bg-surface p-12 rounded-3xl border border-surface-hover shadow-2xl"
                    >
                        <p className="text-brand-primary text-sm font-bold tracking-widest uppercase mb-4 shadow-sm">Assessment Complete</p>
                        <h2 className="text-4xl text-white font-serif mb-4 text-center">Onboarding Complete</h2>
                        <p className="text-text-secondary text-center mb-10 max-w-md">Your cognitive architectural blueprint has generated natively in alignment with Iris AI neural models.</p>

                        <div className="relative w-48 h-48 mb-12 flex items-center justify-center">
                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                                <circle cx="96" cy="96" r="88" fill="none" stroke="var(--color-surface-hover)" strokeWidth="12" />
                                <motion.circle
                                    cx="96" cy="96" r="88" fill="none" stroke="var(--color-brand-primary)" strokeWidth="12"
                                    strokeDasharray="552.92" strokeDashoffset="552.92" strokeLinecap="round"
                                    animate={{ strokeDashoffset: 552.92 - (552.92 * (finalScore / 1000)) }}
                                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                                />
                            </svg>
                            <div className="text-center">
                                <p className="text-5xl font-mono text-white font-bold">{Math.round(finalScore)}</p>
                                <p className="text-xs text-text-secondary font-bold uppercase tracking-widest mt-1">Skill Score</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 w-full gap-4 mb-10">
                            <div className="text-center bg-brand-secondary p-4 rounded-xl border border-surface-hover">
                                <BrainCircuit className="w-5 h-5 text-text-secondary mx-auto mb-2" />
                                <p className="text-lg text-white font-bold">12</p>
                                <p className="text-xs text-text-secondary">Nodes Active</p>
                            </div>
                            <div className="text-center bg-brand-secondary p-4 rounded-xl border border-surface-hover">
                                <Activity className="w-5 h-5 text-text-secondary mx-auto mb-2" />
                                <p className="text-lg text-white font-bold">45</p>
                                <p className="text-xs text-text-secondary">Concepts</p>
                            </div>
                            <div className="text-center bg-brand-secondary p-4 rounded-xl border border-surface-hover">
                                <CheckCircle2 className="w-5 h-5 text-brand-primary mx-auto mb-2" />
                                <p className="text-lg text-white font-bold">Gold Rank</p>
                                <p className="text-xs text-text-secondary">Starter Tier</p>
                            </div>
                        </div>

                        <Button onClick={() => router.push('/home')} className="w-full py-4 text-lg">
                            Open Portal
                        </Button>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
}

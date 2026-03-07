import Link from 'next/link';
import { Compass, BookOpen, Sparkles } from 'lucide-react';

export default function Home() {
    return (
        <main className="min-h-screen bg-brand-secondary flex flex-col items-center justify-center relative overflow-hidden text-center p-6">

            {/* Background stars / dots effect simulated */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--color-text-secondary) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

            {/* Dynamic Center Piece */}
            <div className="z-10 flex flex-col items-center max-w-2xl bg-surface/50 p-12 rounded-3xl backdrop-blur-md border border-surface-hover shadow-2xl">
                <div className="w-32 h-32 rounded-full relative mb-8 flex items-center justify-center" style={{ background: 'radial-gradient(circle, rgba(255,210,30,0.4) 0%, rgba(13,17,23,1) 80%)' }}>
                    <div className="w-20 h-20 rounded-full border-4 border-brand-primary bg-surface shadow-[0_0_30px_#FFD21E] flex items-center justify-center">
                        <Sparkles className="text-brand-primary w-8 h-8" />
                    </div>
                </div>

                <h1 className="text-6xl font-serif text-white mb-4 tracking-tight">Prime<span className="text-brand-primary">Learn</span></h1>
                <p className="text-text-secondary text-lg mb-10 font-light">Chart Your Learning Universe with dynamic navigation through the cosmos of knowledge.</p>

                <Link
                    href="/onboarding"
                    className="bg-brand-primary text-brand-secondary hover:bg-yellow-400 font-semibold px-8 py-4 rounded-full transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,210,30,0.3)] w-full max-w-xs flex items-center justify-center gap-2"
                >
                    <Compass className="w-5 h-5" />
                    Begin Journey
                </Link>
            </div>

            {/* Features Row */}
            <div className="z-10 flex gap-6 mt-16 text-left max-w-4xl opacity-80">
                <div className="bg-surface border border-surface-hover p-6 rounded-xl flex-1 hover:border-brand-primary/50 transition-colors">
                    <BookOpen className="text-brand-primary mb-3 w-6 h-6" />
                    <h3 className="font-serif text-white text-lg mb-2">Personalized Paths</h3>
                    <p className="text-text-secondary text-sm">Adaptive learning pathways mapping exactly to your knowledge gaps.</p>
                </div>

                <div className="bg-surface border border-surface-hover p-6 rounded-xl flex-1 hover:border-brand-primary/50 transition-colors">
                    <Sparkles className="text-brand-primary mb-3 w-6 h-6" />
                    <h3 className="font-serif text-white text-lg mb-2">Visual Story</h3>
                    <p className="text-text-secondary text-sm">Concept explorations designed visually to improve retention.</p>
                </div>

                <div className="bg-surface border border-surface-hover p-6 rounded-xl flex-1 hover:border-brand-primary/50 transition-colors">
                    <Compass className="text-brand-primary mb-3 w-6 h-6" />
                    <h3 className="font-serif text-white text-lg mb-2">Global Context</h3>
                    <p className="text-text-secondary text-sm">Learn with localized examples tailored to your native environments.</p>
                </div>
            </div>
        </main>
    );
}

"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Compass, User, LayoutDashboard, Flame } from 'lucide-react';

export function Sidebar() {
    const pathname = usePathname();

    const navLinks = [
        { name: 'Constellation', href: '/home', icon: Compass },
        { name: 'Episodes', href: '/episode', icon: Sparkles },
        { name: 'Mentor', href: '/mentor', icon: User },
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ];

    return (
        <aside className="w-64 h-screen bg-surface border-r border-surface-hover fixed left-0 top-0 hidden md:flex flex-col py-8 px-6 z-50">
            <div className="flex items-center gap-2 mb-10">
                <Sparkles className="text-brand-primary w-6 h-6" />
                <span className="text-white font-serif text-xl tracking-tight">PrimeLearn</span>
            </div>

            <div className="bg-brand-secondary/50 border border-surface-hover rounded-xl p-4 mb-8 flex items-center gap-4">
                <Flame className="text-orange-500 w-8 h-8" />
                <div>
                    <p className="text-white font-bold text-lg leading-tight">7 Days</p>
                    <p className="text-text-secondary text-xs uppercase tracking-widest">Active Streak</p>
                </div>
            </div>

            <nav className="flex flex-col gap-2">
                {navLinks.map((link) => {
                    const isActive = pathname.startsWith(link.href);
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-brand-primary/10 text-brand-primary' : 'text-text-secondary hover:bg-surface-hover hover:text-white'}`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium text-sm">{link.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-primary to-orange-500 shadow-[0_0_15px_rgba(255,210,30,0.4)]"></div>
                    <div>
                        <p className="text-white text-sm font-semibold">Alex Rivera</p>
                        <p className="text-text-secondary text-xs">Level 12 Architect</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}

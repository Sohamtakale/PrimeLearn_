"use client";

import { useState, useEffect } from 'react';
import { getDashboard } from '@/lib/api';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Flame, Trophy, Star, Clock, AlertTriangle, CheckCircle, Brain } from 'lucide-react';

// Mock Recharts Data for Fallback
const mockRadarData = [
    { subject: 'DSA', A: 120, fullMark: 150 },
    { subject: 'NET', A: 98, fullMark: 150 },
    { subject: 'DB', A: 86, fullMark: 150 },
    { subject: 'CLOUD', A: 99, fullMark: 150 },
    { subject: 'WEB', A: 85, fullMark: 150 },
    { subject: 'SYS', A: 65, fullMark: 150 },
];

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDash() {
            const lId = localStorage.getItem('learner_id') || 'demo';
            const { data, error } = await getDashboard(lId);
            if (!error && data) {
                setData(data);
            }
            setLoading(false);
        }
        fetchDash();
    }, []);

    return (
        <div className="min-h-screen bg-brand-secondary p-8 flex flex-col gap-6 overflow-y-auto">

            {/* Top Banner Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-surface border border-surface-hover rounded-2xl p-6 flex flex-col relative overflow-hidden group">
                    <Flame className="absolute -right-4 -top-4 w-24 h-24 text-surface-hover group-hover:text-orange-500/10 transition-colors" />
                    <div className="flex items-center gap-2 mb-4 text-text-secondary text-sm font-semibold uppercase tracking-wider"><Flame size={16} className="text-orange-500" /> Current Streak</div>
                    <div className="text-4xl font-mono text-white mb-1">{data?.profile?.streak || 7} Days</div>
                    <div className="text-xs text-brand-accent">Personal best!</div>
                </div>

                <div className="bg-surface border border-surface-hover rounded-2xl p-6 flex flex-col relative overflow-hidden group">
                    <Trophy className="absolute -right-4 -top-4 w-24 h-24 text-surface-hover group-hover:text-brand-primary/10 transition-colors" />
                    <div className="flex items-center gap-2 mb-4 text-text-secondary text-sm font-semibold uppercase tracking-wider"><Trophy size={16} className="text-brand-primary" /> Concepts Mastered</div>
                    <div className="text-4xl font-mono text-white mb-1">{data?.mastery?.total_mastered || 12}</div>
                    <div className="text-xs text-text-secondary">Next goal: 20</div>
                </div>

                <div className="bg-surface border border-surface-hover rounded-2xl p-6 flex flex-col relative overflow-hidden group">
                    <Star className="absolute -right-4 -top-4 w-24 h-24 text-surface-hover group-hover:text-yellow-500/10 transition-colors" />
                    <div className="flex items-center gap-2 mb-4 text-text-secondary text-sm font-semibold uppercase tracking-wider"><Star size={16} className="text-yellow-500" /> Total XP</div>
                    <div className="text-4xl font-mono text-white mb-1">1,240</div>
                    <div className="w-full bg-surface-hover h-1 mt-2 rounded-full overflow-hidden"><div className="bg-brand-primary w-[60%] h-full"></div></div>
                </div>

                <div className="bg-surface border border-surface-hover rounded-2xl p-6 flex flex-col relative overflow-hidden group">
                    <Clock className="absolute -right-4 -top-4 w-24 h-24 text-surface-hover group-hover:text-blue-500/10 transition-colors" />
                    <div className="flex items-center gap-2 mb-4 text-text-secondary text-sm font-semibold uppercase tracking-wider"><Clock size={16} className="text-blue-500" /> Hours Learned</div>
                    <div className="text-4xl font-mono text-white mb-1">12.5h</div>
                    <div className="text-xs text-text-secondary">+2.5h this week</div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">

                {/* Left Column (Radar + Recent) */}
                <div className="lg:col-span-2 flex flex-col gap-6">

                    {/* Radar Chart */}
                    <div className="bg-surface border border-surface-hover rounded-2xl p-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-serif text-white flex items-center gap-2"><Brain className="text-brand-primary w-5 h-5" /> Skill Mastery Radar</h3>
                        </div>
                        <div className="flex-1 min-h-[300px] -ml-6 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={mockRadarData}>
                                    <PolarGrid stroke="#30363D" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#8B949E', fontSize: 12 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                    <Radar name="Skills" dataKey="A" stroke="#238636" fill="#238636" fillOpacity={0.2} strokeWidth={2} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent Sessions */}
                    <div className="bg-surface border border-surface-hover rounded-2xl p-6">
                        <h3 className="text-lg font-serif text-white mb-6">Recent Sessions</h3>
                        {loading ? <p className="text-text-secondary">Loading logs...</p> : (
                            <div className="flex flex-col gap-4">
                                {data?.recent_logs?.slice(0, 3).map((log, i) => (
                                    <div key={i} className="flex justify-between items-center bg-brand-secondary border border-surface-hover p-4 rounded-xl">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-white font-medium text-sm">{log.action}: {log.concept_id}</span>
                                            <span className="text-xs text-text-secondary">{new Date(log.timestamp).toLocaleDateString()}</span>
                                        </div>
                                        {log.completion_rate ? (
                                            <div className="text-brand-accent text-sm font-bold bg-brand-accent/10 px-2 py-1 rounded">
                                                {Math.round(log.completion_rate * 100)}%
                                            </div>
                                        ) : null}
                                    </div>
                                )) || <p className="text-text-secondary text-sm">No recent activity.</p>}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column (Leitner + BKT) */}
                <div className="flex flex-col gap-6">

                    {/* Spaced Repetition (Leitner) */}
                    <div className="bg-surface border border-surface-hover rounded-2xl p-6 flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-serif text-white">Spaced Repetition</h3>
                            <span className="text-xs text-brand-primary hover:underline cursor-pointer">Review All</span>
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="bg-brand-secondary border border-brand-primary/50 rounded-xl p-4 flex justify-between items-center shadow-[0_0_15px_rgba(255,210,30,0.1)] relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-primary"></div>
                                <div>
                                    <p className="text-xs text-text-secondary uppercase tracking-widest font-bold mb-1">Due Today (Box 1)</p>
                                    <p className="text-lg text-white font-bold">{data?.leitner?.due_now || 3} Concepts Due</p>
                                </div>
                                <AlertTriangle className="text-brand-primary w-6 h-6" />
                            </div>

                            <div className="bg-surface-hover border border-surface-hover rounded-xl p-4 flex justify-between items-center opacity-70">
                                <div>
                                    <p className="text-xs text-text-secondary uppercase tracking-widest font-bold mb-1">In 3 Days (Box 2)</p>
                                    <p className="text-lg text-white font-bold">8 Concepts</p>
                                </div>
                                <CheckCircle className="text-brand-accent w-6 h-6" />
                            </div>

                            <div className="bg-surface-hover border border-surface-hover rounded-xl p-4 flex justify-between items-center opacity-50">
                                <div>
                                    <p className="text-xs text-text-secondary uppercase tracking-widest font-bold mb-1">In 1 Week (Box 3)</p>
                                    <p className="text-lg text-white font-bold">24 Concepts</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BKT Knowledge Tracking */}
                    <div className="bg-surface border border-surface-hover rounded-2xl p-6">
                        <h3 className="text-lg font-serif text-white mb-6">Knowledge Tracking (BKT)</h3>
                        <div className="space-y-4">

                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-text-primary">Time Complexity</span>
                                    <span className="text-brand-accent font-mono font-bold">94%</span>
                                </div>
                                <div className="w-full bg-surface-hover h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-brand-accent h-full" style={{ width: '94%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-text-primary">SQL Window Functions</span>
                                    <span className="text-blue-400 font-mono font-bold">68%</span>
                                </div>
                                <div className="w-full bg-surface-hover h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-blue-400 h-full" style={{ width: '68%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-text-primary">BGP Path Selection</span>
                                    <span className="text-brand-primary font-mono font-bold">42%</span>
                                </div>
                                <div className="w-full bg-surface-hover h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-brand-primary h-full" style={{ width: '42%' }}></div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}

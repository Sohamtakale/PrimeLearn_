"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Play, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Mocked graph data based on Stitch 
const nodes = [
    { id: 'start', label: 'Backend', x: 20, y: 30, state: 'mastered' },
    { id: 'db', label: 'Database', x: 40, y: 20, state: 'mastered' },
    { id: 'api', label: 'REST API', x: 45, y: 55, state: 'mastered' },
    { id: 'bst', label: 'Binary Search Trees', x: 65, y: 40, state: 'active' },
    { id: 'auth', label: 'OAuth 2.0', x: 75, y: 65, state: 'locked' },
    { id: 'graph', label: 'Graph Theory', x: 80, y: 25, state: 'locked' },
];

const links = [
    { source: 'start', target: 'db' },
    { source: 'start', target: 'api' },
    { source: 'db', target: 'bst' },
    { source: 'api', target: 'bst' },
    { source: 'bst', target: 'auth' },
    { source: 'bst', target: 'graph' },
];

export default function Constellation() {
    const router = useRouter();
    const [selectedNode, setSelectedNode] = useState(nodes.find(n => n.id === 'bst'));

    const getNodeColor = (state) => {
        switch (state) {
            case 'mastered': return '#238636'; // brand-accent
            case 'active': return '#FFD21E'; // brand-primary
            case 'locked': return '#8B949E'; // text-secondary
            default: return '#8B949E';
        }
    };

    return (
        <div className="flex h-screen w-full relative overflow-hidden bg-brand-secondary">

            {/* Background stars */}
            <div className="absolute inset-0 pointer-events-none opacity-50" style={{ backgroundImage: 'radial-gradient(rgba(201,209,217,0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>

            {/* Main Canvas Area */}
            <div className="flex-1 relative">
                <svg className="w-full h-full absolute inset-0 pointer-events-none">
                    {/* Draw connecting lines */}
                    {links.map((link, idx) => {
                        const sourceNode = nodes.find(n => n.id === link.source);
                        const targetNode = nodes.find(n => n.id === link.target);
                        if (!sourceNode || !targetNode) return null;

                        const isActivePath = sourceNode.state === 'mastered' && targetNode.state === 'active';
                        const isMasteredPath = sourceNode.state === 'mastered' && targetNode.state === 'mastered';

                        let strokeColor = 'rgba(139,148,158,0.2)';
                        if (isMasteredPath) strokeColor = 'rgba(35,134,54,0.6)';
                        if (isActivePath) strokeColor = 'rgba(255,210,30,0.4)';

                        return (
                            <motion.line
                                key={idx}
                                x1={`${sourceNode.x}%`} y1={`${sourceNode.y}%`}
                                x2={`${targetNode.x}%`} y2={`${targetNode.y}%`}
                                stroke={strokeColor}
                                strokeWidth="2"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1.5, delay: idx * 0.2 }}
                            />
                        );
                    })}
                </svg>

                {/* Draw Nodes */}
                {nodes.map((node, idx) => (
                    <motion.div
                        key={node.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', delay: idx * 0.1 }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group"
                        style={{ left: `${node.x}%`, top: `${node.y}%` }}
                        onClick={() => setSelectedNode(node)}
                    >
                        <div
                            className={`w-4 h-4 rounded-full transition-all duration-300 ${selectedNode?.id === node.id ? 'scale-150 ring-4 ring-offset-4 ring-offset-brand-secondary' : 'hover:scale-125'}`}
                            style={{
                                backgroundColor: getNodeColor(node.state), boxShadow: selectedNode?.id === node.id ? `0 0 20px ${getNodeColor(node.state)}` : 'none',
                                ['--tw-ring-color']: getNodeColor(node.state)
                            }}
                        />
                        <span className={`mt-3 whitespace-nowrap text-sm font-medium transition-colors ${selectedNode?.id === node.id ? 'text-white' : 'text-text-secondary group-hover:text-white'}`}>
                            {node.label}
                        </span>
                    </motion.div>
                ))}
            </div>

            {/* Right Side Info Panel */}
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                className="w-96 bg-surface/80 backdrop-blur-md border-l border-surface-hover p-6 flex flex-col z-20 overflow-y-auto"
            >
                {selectedNode ? (
                    <>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <span className="text-xs uppercase tracking-widest text-text-secondary font-bold block mb-1">Concept Map</span>
                                <h2 className="text-3xl font-serif text-white">{selectedNode.label}</h2>
                            </div>
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center border"
                                style={{
                                    borderColor: getNodeColor(selectedNode.state),
                                    backgroundColor: `${getNodeColor(selectedNode.state)}20`
                                }}
                            >
                                <Sparkles size={16} style={{ color: getNodeColor(selectedNode.state) }} />
                            </div>
                        </div>

                        {/* Context Stats */}
                        <div className="bg-brand-secondary border border-surface-hover rounded-xl p-4 mb-6">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-text-secondary">Expected Mastery</span>
                                <span className="text-brand-primary font-bold">85%</span>
                            </div>
                            <div className="w-full bg-surface-hover rounded-full h-1.5 mb-4">
                                <div className="bg-brand-primary h-1.5 rounded-full" style={{ width: '85%' }}></div>
                            </div>

                            <p className="text-text-secondary text-sm leading-relaxed">
                                {selectedNode.state === 'active'
                                    ? `You're currently charting a course through ${selectedNode.label}. Mastering this node unlocks new capabilities across the constellation.`
                                    : selectedNode.state === 'mastered'
                                        ? `You have successfully conquered ${selectedNode.label}.`
                                        : `This node is locked. Master prerequisite modules to access ${selectedNode.label}.`
                                }
                            </p>
                        </div>

                        {/* Prereqs */}
                        <div className="mb-auto">
                            <h3 className="text-sm uppercase tracking-widest text-text-secondary font-bold mb-3">Links</h3>
                            <div className="flex gap-2">
                                <span className="bg-surface-hover border border-text-secondary/20 text-text-secondary text-xs px-2 py-1 rounded">Linked Lists</span>
                                <span className="bg-brand-accent/10 border border-brand-accent/30 text-brand-accent text-xs px-2 py-1 rounded">Recursion</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3 mt-6">
                            <Button
                                className="w-full py-4 relative group overflow-hidden"
                                onClick={() => router.push(`/episode/${selectedNode.id}`)}
                                disabled={selectedNode.state === 'locked'}
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    <Play size={18} fill="currentColor" />
                                    {selectedNode.state === 'mastered' ? 'Review Concept' : 'Continue Episode'}
                                </span>
                                {selectedNode.state !== 'locked' && (
                                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] skew-x-12"></div>
                                )}
                            </Button>
                            <Button variant="secondary" className="w-full" onClick={() => router.push('/mentor')}>
                                Ask Mentor
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="h-full flex items-center justify-center text-text-secondary text-center">
                        Select a celestial node to view coordinates.
                    </div>
                )}
            </motion.div>

        </div>
    );
}

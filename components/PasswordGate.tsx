import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldCheck, ChevronRight } from 'lucide-react';

interface PasswordGateProps {
    children: React.ReactNode;
}

const PasswordGate: React.FC<PasswordGateProps> = ({ children }) => {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    // Correct password
    const CORRECT_PASSWORD = '0909';

    useEffect(() => {
        // Check if user was already authenticated
        const authStatus = localStorage.getItem('dku_re09_auth');
        if (authStatus === 'true') {
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === CORRECT_PASSWORD) {
            setIsAuthenticated(true);
            setError(false);
            localStorage.setItem('dku_re09_auth', 'true');
        } else {
            setError(true);
            setPassword('');
            // Shake effect or feedback
        }
    };

    if (loading) return null;

    if (isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <div className="fixed inset-0 z-[9999] bg-sage-950 flex items-center justify-center p-6 overflow-hidden">
            {/* Immersive Scenic Background with Quality Optimization */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
                style={{
                    backgroundImage: 'url("/images/luxury_golf_bg.png")',
                    imageRendering: 'auto'
                }}
            >
                {/* Advanced Noise/Grain overlay to mask pixelation and add cinematic feel */}
                <div className="absolute inset-0 opacity-[0.15] pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />

                {/* Multi-layered overlays for depth and quality enhancement */}
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-sage-950/90 via-sage-950/10 to-sage-950/30" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-md bg-white/10 backdrop-blur-3xl p-10 rounded-[3.5rem] shadow-[0_60px_100px_-20px_rgba(0,0,0,0.5)] border border-white/20 relative z-10 text-center"
            >
                <div className="mb-10 flex flex-col items-center">
                    <div className="w-20 h-20 bg-sage-50 rounded-3xl flex items-center justify-center mb-6 shadow-inner border border-champagne-100">
                        <Lock className="text-sage-400" size={32} strokeWidth={1.5} />
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.4em] text-sage-400 font-bold mb-3">Privilege Access Only</span>
                    <h2 className="text-4xl font-serif text-sage-600 italic">DKU-RE09 CLUB</h2>
                    <p className="mt-4 text-xs text-sage-400 leading-relaxed italic max-w-xs">
                        "09학번 전공자들만이 공유하는 그린 위의 기록.<br />회원 인증 후 입장이 가능합니다."
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="relative group">
                        <input
                            type="password"
                            placeholder="Enter Access Key"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError(false);
                            }}
                            className={`w-full py-5 px-8 bg-sage-50/50 border rounded-2xl outline-none transition-all duration-500 text-center tracking-[0.5em] font-bold text-sage-600 placeholder:tracking-normal placeholder:font-medium placeholder:text-sage-300 ${error ? 'border-rose-300 ring-4 ring-rose-50' : 'border-champagne-100 focus:border-sage-300 focus:bg-white focus:ring-4 focus:ring-sage-50'
                                }`}
                            autoFocus
                        />
                        <AnimatePresence>
                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="text-[10px] text-rose-500 font-bold mt-3 absolute w-full left-0"
                                >
                                    Invalid key. Please verify your identity.
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-5 bg-sage-400 hover:bg-sage-600 text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-xs transition-all duration-500 flex items-center justify-center group shadow-lg shadow-sage-200"
                    >
                        <span>Confirm Identity</span>
                        <ChevronRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="mt-12 flex items-center justify-center space-x-2 text-sage-200">
                    <ShieldCheck size={14} />
                    <span className="text-[9px] uppercase tracking-widest font-bold">Secure Class-Only Environment</span>
                </div>
            </motion.div>

            {/* Footer Branding */}
            <div className="absolute bottom-10 left-0 w-full text-center">
                <p className="text-[10px] uppercase tracking-[0.5em] text-sage-300 font-bold opacity-40">
                    Dankook Urban Planning & Real Estate 09
                </p>
            </div>
        </div>
    );
};

export default PasswordGate;

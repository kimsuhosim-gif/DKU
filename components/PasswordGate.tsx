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
            {/* User-Uploaded High-Resolution Scene (.jpg) */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
                style={{
                    backgroundImage: 'url("/images/luxury_golf_bg.jpg")',
                    imageRendering: 'auto'
                }}
            >
                {/* Visual texture & Depth enhancements */}
                <div className="absolute inset-0 opacity-[0.2] pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-sage-950/90 via-transparent to-sage-950/30" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                className="w-[82%] max-w-sm bg-black/25 backdrop-blur-3xl p-7 md:p-12 rounded-[3.5rem] shadow-[0_60px_100px_-20px_rgba(0,0,0,0.5)] border border-white/10 relative z-10 text-center"
            >
                <div className="mb-6 md:mb-12 flex flex-col items-center">
                    <div className="w-14 h-14 md:w-20 md:h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-5 shadow-inner border border-white/10">
                        <Lock className="text-champagne-200" size={24} strokeWidth={1.5} />
                    </div>
                    <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-white/50 font-bold mb-2 md:mb-3">Privilege Access Only</span>
                    <h2 className="text-2xl md:text-4xl font-serif text-white italic">DKU-RE09 CLUB</h2>
                    <p className="mt-3 md:mt-4 text-[10px] md:text-xs text-white/60 leading-relaxed italic max-w-xs px-2">
                        "09학번 전공자들만이 공유하는 그린 위의 기록.<br className="hidden md:block" /> 회원 인증 후 입장이 가능합니다."
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
                            className={`w-full py-5 px-8 bg-white/5 border rounded-2xl outline-none transition-all duration-500 text-center tracking-[0.5em] font-bold text-white placeholder:tracking-normal placeholder:font-medium placeholder:text-white/30 ${error ? 'border-rose-400/50 ring-4 ring-rose-500/10' : 'border-white/10 focus:border-white/30 focus:bg-white/10 focus:ring-4 focus:ring-white/5'
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
                        className="w-full py-5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs transition-all duration-500 flex items-center justify-center group shadow-xl"
                    >
                        <span>Confirm Identity</span>
                        <ChevronRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="mt-10 md:mt-12 flex items-center justify-center space-x-2 text-white/30">
                    <ShieldCheck size={14} />
                    <span className="text-[9px] uppercase tracking-widest font-bold">Secure Class-Only Environment</span>
                </div>
            </motion.div>

            {/* Footer Branding */}
            <div className="absolute bottom-8 left-0 w-full text-center px-6">
                <p className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.5em] text-white/40 font-bold">
                    Dankook Urban Planning & Real Estate 09
                </p>
            </div>
        </div>
    );
};

export default PasswordGate;

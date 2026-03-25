import React, { useState } from 'react';
import { securityService } from '../pos/services/securityService';

/**
 * R DE RICO - LOGIN UI
 * 
 * Interfaz de acceso simplificada por PIN único.
 * Diseño premium, minimalista y de alto impacto.
 */

export const LoginUI = ({ onLogin }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!pin) return;
        
        setError(null);
        setIsProcessing(true);

        try {
            const userData = await securityService.validatePin(pin);
            onLogin({ 
                id: userData.id,
                role: userData.role,
                name: userData.name,
                profile_id: userData.profile_id,
                permissions: userData.profile?.permissions || {}
            });
        } catch (err) {
            setError("Clave de acceso incorrecta");
            setPin('');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleKeypad = (val) => {
        setError(null);
        if (val === 'C') {
            setPin('');
        } else if (val === '←') {
            setPin(prev => prev.slice(0, -1));
        } else {
            if (pin.length < 8) {
                setPin(prev => prev + val);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-start justify-center p-6 pt-12 font-sans text-white bg-cover bg-center" style={{ backgroundImage: 'url("/assets/wood_bg.jpg")' }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            <div className="max-w-md w-full relative z-10">
                {/* Branding */}
                <div className="text-center mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
                    <img src="/assets/logo.png" alt="Logo R de Rico" className="w-48 h-48 object-contain mx-auto mb-4 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]" />
                    <h1 className="text-5xl font-black uppercase italic tracking-tighter text-orange-500 mb-1 text-glow">R de Rico</h1>
                    <p className="text-[10px] font-black text-gray-500 tracking-[0.4em] uppercase">Evolutive Digital Ecosystem</p>
                </div>

                <div className="bg-gray-900/40 border border-white/5 p-6 rounded-[50px] shadow-2xl backdrop-blur-3xl relative overflow-hidden ring-1 ring-white/10">
                    {/* Efectos de luz */}
                    <div className="absolute -top-20 -left-20 w-40 h-40 bg-orange-600/10 blur-3xl rounded-full"></div>
                    <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#c1d72e]/10 blur-3xl rounded-full"></div>

                    <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
                        <div className="text-center">
                            <h2 className="text-base font-black uppercase tracking-tight text-white mb-0.5 italic">Bienvenido</h2>
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Ingrese su clave de acceso</p>
                        </div>

                        <div className="space-y-5">
                            <div className="relative group">
                                <input
                                    type="password"
                                    placeholder="••••••"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    className={`w-full bg-black/40 border ${error ? 'border-red-500/50' : 'border-white/10'} p-4 rounded-3xl outline-none focus:border-[#c1d72e] font-black text-2xl text-center tracking-[0.8em] transition-all placeholder:text-gray-800 placeholder:tracking-normal shadow-inner`}
                                    autoFocus
                                    required
                                />
                                {error && (
                                    <p className="text-[9px] text-red-500 font-black uppercase text-center mt-1.5 animate-pulse tracking-widest">
                                        {error}
                                    </p>
                                )}
                            </div>

                            {/* Teclado Numérico Visual */}
                            <div className="grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto pt-1">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '←'].map((val) => (
                                    <button
                                        key={val}
                                        type="button"
                                        onClick={() => handleKeypad(val.toString())}
                                        className={`h-12 rounded-2xl flex items-center justify-center text-lg font-black transition-all active:scale-90 touch-none select-none
                                            ${val === 'C' ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/10' : 
                                              val === '←' ? 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border border-orange-500/10' : 
                                              'bg-white/5 text-white hover:bg-white/10 border border-white/5'}`}
                                    >
                                        {val}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isProcessing || !pin}
                            className={`w-full py-4 rounded-3xl font-black uppercase text-[10px] tracking-[0.2em] transition-all shadow-xl
                                ${isProcessing ? 'bg-gray-800 text-gray-600' : 'bg-[#c1d72e] text-black hover:scale-[1.02] shadow-[#c1d72e]/10 active:scale-95'}`}
                        >
                            {isProcessing ? 'VALIDANDO...' : 'ENTRAR AL SISTEMA'}
                        </button>
                    </form>
                </div>

                <div className="mt-6 text-center text-[8px] font-bold text-gray-700 uppercase tracking-[0.3em]">
                    Sucursal Toluca Centro | Terminal ID: RDR-001-A
                </div>
            </div>
        </div>
    );
};

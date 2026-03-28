import React, { useState } from 'react';
import { VisionScanner } from '../VisionScanner';

export const VisionVisor = ({ isScanning, setIsScanning, addToCart, products, categories }) => {
    const [aiStatus, setAiStatus] = useState('IDLE'); // IDLE, ANALYZING, LOCAL, CLOUD, ERROR

    const statusConfig = {
        ANALYZING: { color: 'bg-blue-400', label: 'ANALIZANDO...', icon: '🧠' },
        LOCAL:     { color: 'bg-[#c1d72e]', label: 'IA LOCAL (T6)', icon: '🟢' },
        CLOUD:     { color: 'bg-yellow-400', label: 'IA NUBE (GEMINI)', icon: '🟡' },
        ERROR:     { color: 'bg-red-500', label: 'IA OFFLINE', icon: '🔴' },
        IDLE:      { color: 'bg-gray-500', label: 'ESPERANDO...', icon: '⚪' }
    };

    const currentStatus = statusConfig[aiStatus] || statusConfig.IDLE;

    return (
        <div className="flex-1 relative rounded-[40px] overflow-hidden shadow-2xl border border-white/10 group bg-black/5 animate-in fade-in zoom-in-95 duration-500">
            <VisionScanner 
                isScanning={isScanning} 
                onScan={addToCart} 
                products={products} 
                categories={categories} 
                onStatusChange={setAiStatus}
            />

            <div className="absolute top-8 left-8 z-30 pointer-events-none">
                <div className="bg-black/40 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
                    <h3 className="text-[9px] font-black text-[#c1d72e] uppercase tracking-[0.4em] mb-1 drop-shadow-lg">Vision Inteligente</h3>
                    <h2 className="text-xl font-black uppercase tracking-tighter italic text-white/90 drop-shadow-lg">Scanner R-1 <span className="text-white/20 font-black">PRO</span></h2>
                </div>
            </div>

            {!isScanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-transparent transition-all duration-700">
                    <button
                        onClick={() => setIsScanning(true)}
                        className="bg-[#c1d72e] text-black px-12 py-6 rounded-[30px] font-black uppercase tracking-[0.3em] flex items-center gap-6 hover:scale-105 active:scale-95 transition-all shadow-[0_0_50px_rgba(193,215,46,0.3)] group"
                    >
                        <div className="w-10 h-10 bg-black/10 rounded-full flex items-center justify-center">
                            🔍
                        </div>
                        INICIAR ESCANEO IA
                    </button>
                    <p className="mt-8 text-white/30 text-[10px] font-black uppercase tracking-[0.5em]">Esperando producto...</p>
                </div>
            )}

            {isScanning && (
                <div className="absolute top-10 right-10 z-30 flex flex-col gap-3">
                    <div className="bg-black/60 backdrop-blur-xl p-5 rounded-[28px] border border-white/10 animate-in fade-in slide-in-from-right-4 duration-500 shadow-2xl min-w-[180px]">
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`w-3 h-3 rounded-full ${currentStatus.color} ${aiStatus !== 'IDLE' ? 'animate-pulse' : ''} shadow-[0_0_10px_rgba(255,255,255,0.2)]`}></div>
                            <p className="text-[9px] font-black text-white/90 uppercase tracking-widest">{currentStatus.label}</p>
                        </div>
                        <div className="flex justify-between items-end">
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-tighter italic">Source: {aiStatus === 'LOCAL' ? 'SERVER T6' : 'GOOGLE CLOUD'}</p>
                            <p className="text-[9px] font-black text-[#c1d72e]">SCANNER ON</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsScanning(false)}
                        className="bg-red-500/80 hover:bg-red-600 text-white p-4 rounded-3xl shadow-xl border border-red-500/50 flex items-center justify-center transition-all hover:scale-105 active:scale-95 animate-in fade-in zoom-in"
                        title="Detener Escaner"
                    >
                        <span className="text-xl">⏹️</span>
                    </button>
                </div>
            )}
        </div>
    );
};

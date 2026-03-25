import React, { useState } from 'react';
import { GestionPersonal } from '../pos/components/GestionPersonal';
import { PerfilesAccessSuite } from './PerfilesAccessSuite';

export const SeguridadAccesoUI = ({ onPermissionsUpdate }) => {
    const [showProfileSuite, setShowProfileSuite] = useState(false);

    return (
        <div className="flex flex-col h-full bg-[#050505] text-white overflow-hidden p-10">
            {/* Header de la Pantalla - Compacto v4.1 */}
            <header className="flex flex-row items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-8">
                    <h1 className="text-5xl font-black uppercase italic tracking-tighter text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                        SEGURIDAD <span className="text-[#c1d72e]">Y ACCESO</span>
                    </h1>
                    <div className="h-8 w-[1px] bg-white/10 hidden md:block"></div>
                    <p className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.6em] italic hidden md:block">Privilegios e Identidad</p>
                </div>
                <button 
                    onClick={() => setShowProfileSuite(true)}
                    className="px-5 py-2 bg-white/5 border border-white/10 rounded-full text-[8px] font-black uppercase tracking-[0.2em] text-[#c1d72e] hover:bg-[#c1d72e] hover:text-black transition-all shadow-lg active:scale-95"
                >
                    EDITAR PERFILES...
                </button>
            </header>

            {/* Contenido Modular por Secciones */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="max-w-5xl space-y-6 pb-6">
                    
                    {/* Sección 1: Gestión de Claves de Acceso (Legacy POS) */}
                    <section className="animate-in fade-in slide-in-from-bottom-10 duration-700">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-orange-500/5 blur-2xl rounded-[60px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                            <GestionPersonal isSection={true} onClose={() => {}} />
                        </div>
                    </section>

                    {/* Más secciones podrán ser añadidas aquí en el futuro */}
                    
                </div>
            </div>

            {showProfileSuite && (
                <PerfilesAccessSuite 
                    onClose={() => setShowProfileSuite(false)} 
                    onPermissionsUpdate={onPermissionsUpdate}
                />
            )}

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #c1d72e; }
            `}</style>
        </div>
    );
};

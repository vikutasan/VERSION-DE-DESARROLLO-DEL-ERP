import React, { useState } from 'react';

/**
 * CategoryEditor - R de Rico
 * 
 * Interfaz para la gestión manual de categorías de productos.
 */
export const CategoryEditor = ({ categories, onSave, onCancel }) => {
    // Normalizar datos para asegurar que siempre trabajamos con objetos {name, visionEnabled}
    const normalizedCategories = (categories || []).map(c => 
        typeof c === 'string' ? { name: c, visionEnabled: true } : c
    );
    
    const [localCategories, setLocalCategories] = useState([...normalizedCategories]);

    const toggleVision = (name) => {
        setLocalCategories(localCategories.map(c => 
            c.name === name ? { ...c, visionEnabled: !c.visionEnabled } : c
        ));
    };

    return (
        <div className="flex flex-col h-full bg-[#0a0a0a] text-white p-10 animate-in fade-in duration-500">
            <div className="mb-10 flex justify-between items-center">
                <div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter italic">Visibilidad de <span className="text-[#c1d72e]">Inteligencia Artificial</span></h2>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-2">Configuración de Escaneo por Cámara</p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={onCancel}
                        className="px-6 py-2 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={() => onSave(localCategories)}
                        className="px-8 py-2 bg-[#c1d72e] text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                    >
                        Guardar Configuración
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-8 flex-1 overflow-hidden">
                <div className="p-8 border border-[#c1d72e]/10 bg-[#c1d72e]/5 rounded-[40px] flex items-center gap-6">
                    <div className="text-3xl">ℹ️</div>
                    <div>
                        <p className="text-[11px] font-black uppercase text-[#c1d72e] italic mb-1">Control de Enfoque Visual</p>
                        <p className="text-[12px] font-bold leading-relaxed text-gray-400">
                            Activa <span className="text-[#c1d72e]">👁️</span> en las categorías que quieras reconocer con la cámara (Ej: Panes). Desactívalo en las que uses con lector de código de barras o ingreso manual.
                        </p>
                    </div>
                </div>

                {/* Listado de Filtros */}
                <div className="flex-1 glass rounded-[40px] border-white/5 p-10 flex flex-col overflow-hidden">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-8 flex justify-between border-b border-white/5 pb-4">
                        Categorías del Catálogo <span>{localCategories.length} Total</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto custom-scrollbar pr-4">
                        {localCategories.map((cat, idx) => (
                            <div key={idx} className={`group border p-5 rounded-3xl flex justify-between items-center transition-all duration-300 ${cat.visionEnabled ? 'bg-[#c1d72e]/5 border-[#c1d72e]/20 shadow-lg shadow-[#c1d72e]/5' : 'bg-white/2 border-white/5 opacity-60 hover:opacity-100'}`}>
                                <div className="flex items-center gap-5">
                                    <button 
                                        onClick={() => toggleVision(cat.name)}
                                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${cat.visionEnabled ? 'bg-[#c1d72e] text-black shadow-lg shadow-[#c1d72e]/30 scale-110' : 'bg-white/5 text-gray-600 hover:bg-white/10 hover:text-gray-400'}`}
                                        title={cat.visionEnabled ? 'Visión IA Activada' : 'Visión IA Desactivada'}
                                    >
                                        <span className="text-xl">{cat.visionEnabled ? '👁️' : '🔘'}</span>
                                    </button>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{cat.icon || '📦'}</span>
                                            <span className={`font-black uppercase tracking-tight text-sm block ${cat.visionEnabled ? 'text-white' : 'text-gray-500'}`}>{cat.name}</span>
                                        </div>
                                        <span className="text-[8px] font-black uppercase text-gray-600 tracking-widest">{cat.visionEnabled ? 'Enfoque Activo' : 'Ignorar Cámara'}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

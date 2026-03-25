import React from 'react';

export const CategoryBar = ({ categories, activeCategory, setActiveCategory, viewMode, setViewMode, setCurrentPage }) => {
    return (
        <div className="bg-black/40 backdrop-blur-md rounded-2xl p-2 border border-white/5 shadow-2xl">
            <div className="overflow-x-auto custom-scrollbar pb-1">
                <div className="flex gap-2 min-w-max">
                    <button
                        onClick={() => setViewMode('CAMERA')}
                        className={`px-6 py-3 rounded-lg text-[18px] font-black uppercase tracking-widest transition-all whitespace-nowrap shadow-xl flex items-center gap-2 ${viewMode === 'CAMERA' ? 'bg-[#c1d72e] text-black shadow-[#c1d72e]/20' : 'bg-white/5 text-white/90 hover:bg-white/10'}`}
                    >
                        <span className="text-2xl">👁️</span>
                        ESCANER IA
                    </button>
                    <div className="w-px h-8 bg-white/5 mx-1"></div>
                    {categories.map(cat => (
                        <button
                            key={cat.name}
                            onClick={() => { setActiveCategory(cat.name); setViewMode('GRID'); setCurrentPage(1); }}
                            className={`px-6 py-3 rounded-lg text-[18px] font-black uppercase tracking-widest transition-all whitespace-nowrap drop-shadow-sm ${viewMode === 'GRID' && activeCategory === cat.name ? 'bg-[#c1d72e] text-black' : 'bg-white/5 text-white/90 hover:bg-white/10'}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

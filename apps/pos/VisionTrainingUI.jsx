import React, { useState, useEffect } from 'react';
import { VisionScanner } from './VisionScanner';
import { CategoryEditor } from './CategoryEditor';
import { posService } from './services/POSService';

/**
 * VisionTrainingUI - R de Rico
 * 
 * Módulo para entrenar la "Mente" de la IA:
 * 1. Seleccionar Producto del Catálogo Real.
 * 2. Capturar ráfagas de imágenes (15-20 mínimo).
 * 3. Etiquetar y Sincronizar al Dataset de Entrenamiento.
 */

export const VisionTrainingUI = ({ products, categories = [], onCategoriesChange }) => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [capturedImages, setCapturedImages] = useState([]);
    const [isCapturing, setIsCapturing] = useState(false);
    const [syncProgress, setSyncProgress] = useState(0);
    const [isEditingCategories, setIsEditingCategories] = useState(false);

    const handleFrameCaptured = (frameData) => {
        if (isCapturing && capturedImages.length < 20) {
            setCapturedImages(prev => [...prev, {
                id: Date.now() + prev.length,
                url: frameData,
                timestamp: new Date().toLocaleTimeString()
            }]);
            
            if (capturedImages.length + 1 >= 20) {
                setIsCapturing(false);
            }
        }
    };

    const handleCapture = () => {
        if (!selectedProduct) return;
        setCapturedImages([]);
        setIsCapturing(true);
    };

    const handleSync = async () => {
        if (!selectedProduct || capturedImages.length === 0) return;
        
        try {
            setSyncProgress(10);
            const imageUrls = capturedImages.map(img => img.url);
            
            // Subida real al servidor
            await posService.uploadTrainingImages(selectedProduct.sku, imageUrls);
            
            setSyncProgress(100);
            setTimeout(() => {
                setSyncProgress(0);
                setCapturedImages([]);
            }, 3000);
        } catch (error) {
            console.error("Error sincronizando dataset:", error);
            alert("Error al subir imágenes al servidor corporativo.");
            setSyncProgress(0);
        }
    };

    if (isEditingCategories) {
        return (
            <CategoryEditor 
                categories={categories} 
                onSave={(newCats) => {
                    onCategoriesChange?.(newCats);
                    setIsEditingCategories(false);
                }}
                onCancel={() => setIsEditingCategories(false)}
            />
        );
    }

    return (
        <div className="flex h-full bg-[#080808] text-white">
            {/* Panel de Control de Entrenamiento */}
            <div className="w-[450px] p-10 border-r border-white/5 flex flex-col backdrop-blur-3xl bg-black/40 shadow-2xl">
                <div className="mb-10 flex justify-between items-start">
                    <div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter italic"><span className="text-orange-500">Training</span> Mode</h2>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-2">Dataset Collector v1.0</p>
                    </div>
                    <button 
                        onClick={() => setIsEditingCategories(true)}
                        className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
                        title="Configurar Categorías"
                    >
                        <span className="text-xl">⚙️</span>
                    </button>
                </div>

                <div className="space-y-8 flex-1">
                    {/* 1. Selección de Objetivo */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">1. Seleccionar Producto</label>
                        <select
                            onChange={(e) => setSelectedProduct(products.find(p => p.sku === e.target.value))}
                            className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl font-black uppercase tracking-tight text-sm outline-none focus:border-orange-500/50 custom-scrollbar"
                        >
                            <option value="">-- Elige un producto --</option>
                            {[...new Set(products.map(p => p.category))].sort().map(cat => (
                                <optgroup key={cat} label={cat} className="bg-[#0a0a0a] text-[#c1d72e]">
                                    {products
                                        .filter(p => p.category === cat)
                                        .sort((a, b) => a.name.localeCompare(b.name))
                                        .map(p => (
                                            <option key={p.sku} value={p.sku} className="text-white">
                                                {p.name}
                                            </option>
                                        ))
                                    }
                                </optgroup>
                            ))}
                        </select>
                    </div>

                    {/* 2. Estadísticas de Captura */}
                    {selectedProduct && (
                        <div className="p-6 bg-orange-600/10 border border-orange-500/20 rounded-3xl animate-in fade-in zoom-in-95 duration-500">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-black uppercase text-orange-500">Muestras Capturadas</span>
                                <span className="text-2xl font-black italic">{capturedImages.length} <span className="text-xs text-gray-500 font-medium">/ 20</span></span>
                            </div>
                            <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-500 transition-all duration-700" style={{ width: `${Math.min((capturedImages.length / 20) * 100, 100)}%` }}></div>
                            </div>
                            <p className="text-[9px] text-gray-500 mt-2 font-bold italic">Se recomiendan al menos 20 fotos por producto.</p>
                        </div>
                    )}

                    {/* 3. Acciones */}
                    <div className="space-y-4 pt-4">
                        <button
                            disabled={!selectedProduct || isCapturing}
                            onClick={handleCapture}
                            className="w-full bg-white text-black font-black py-5 rounded-2xl uppercase tracking-widest text-xs shadow-2xl hover:scale-105 transition-all disabled:opacity-20 disabled:grayscale active:scale-95"
                        >
                            {isCapturing ? '👁️ Capturando ráfaga...' : '👁️ Tomar Muestras'}
                        </button>

                        <button
                            disabled={capturedImages.length === 0 || syncProgress > 0}
                            onClick={handleSync}
                            className="w-full bg-orange-600 font-black py-5 rounded-2xl uppercase tracking-widest text-xs shadow-2xl hover:bg-orange-500 transition-all disabled:opacity-20 active:scale-95"
                        >
                            {syncProgress > 0 && syncProgress < 100 ? `☁️ Sincronizando (${syncProgress}%)...` : syncProgress === 100 ? '✅ Sincronizado' : '☁️ Subir al Dataset'}
                        </button>
                    </div>
                </div>

                <div className="mt-10 p-6 glass rounded-3xl border-indigo-500/20">
                    <p className="text-[9px] font-black uppercase text-indigo-400 mb-2 italic">Tip de Entrenamiento</p>
                    <p className="text-[10px] font-bold leading-relaxed text-gray-400">Mueve el producto y cambia la iluminación para que la IA aprenda a reconocerlo en cualquier condición.</p>
                </div>
            </div>

            {/* Panel de Visualización y Galería */}
            <div className="flex-1 p-10 flex flex-col overflow-hidden">
                {/* Cámara activa para entrenamiento */}
                <div className="h-3/5 mb-8">
                    <VisionScanner onCaptureFrame={isCapturing ? handleFrameCaptured : null} />
                </div>

                {/* Galería de Muestras */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-6">Muestras del Periodo Actual</h3>
                    <div className="grid grid-cols-5 gap-6">
                        {capturedImages.map((img, idx) => (
                            <div key={idx} className="aspect-square glass rounded-2xl overflow-hidden border border-white/5 relative group animate-in slide-in-from-bottom-2 duration-300">
                                <img src={img.url} alt="sample" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 text-[8px] font-black text-center text-orange-500 backdrop-blur-sm">
                                    IMG_{idx + 1}
                                </div>
                            </div>
                        ))}
                        {capturedImages.length === 0 && (
                            <div className="col-span-5 h-40 border-2 border-dashed border-white/5 rounded-3xl flex items-center justify-center text-gray-700 font-black uppercase tracking-widest text-xs italic">
                                Esperando capturas...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

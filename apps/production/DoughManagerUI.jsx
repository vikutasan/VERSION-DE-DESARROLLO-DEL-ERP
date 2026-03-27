import React, { useState, useEffect } from 'react';
import { 
    ArrowLeft, Plus, Search, Filter, Loader2, ChefHat, Info, 
    Save, X, ChevronRight, ChevronLeft, Beaker, Zap, Timer, 
    Scale, Trash2, ListOrdered, Settings2, Package, ArrowRight, Edit2, GripVertical
} from 'lucide-react';

/**
 * DOUGH MANAGER UI (INDUSTRIAL EDITION)
 * 
 * Basado en la Matriz de Producción R de Rico.
 * Maneja MEP, Procedimientos y Rendimientos.
 */

const getTheme = (idx) => {
    // Generador de Color HSL Dinámico (Soft-Theme Edition)
    const hue = (idx * 137.5) % 360;
    return {
        // Fondo ultra-claro (96%) para evitar fatiga ocular
        bg: `hsl(${hue}, 65%, 96%)`,
        // Inputs con tono intermedio (88%) para resaltar áreas de captura
        input: `hsl(${hue}, 65%, 88%)`,
        // Texto alto contraste (15%)
        text: `hsl(${hue}, 70%, 15%)`,
        // Borde sutil
        border: `hsl(${hue}, 65%, 82%)`
    };
};

export const DoughManagerUI = ({ onBack }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDough, setSelectedDough] = useState(null);
    const [doughs, setDoughs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [draggedIdx, setDraggedIdx] = useState(null);

    const loadDoughs = async () => {
        try {
            const resp = await fetch('http://127.0.0.1:3002/api/v1/production/doughs');
            if (resp.ok) setDoughs(await resp.json());
        } catch (e) { console.error(e); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { loadDoughs(); }, []);

    const handleDragStart = (e, index) => {
        setDraggedIdx(index);
        e.dataTransfer.effectAllowed = "move";
        e.target.style.opacity = '0.5';
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (draggedIdx === index) return;

        const items = [...doughs];
        const draggedItem = items[draggedIdx];
        items.splice(draggedIdx, 1);
        items.splice(index, 0, draggedItem);

        setDraggedIdx(index);
        setDoughs(items);
    };

    const handleDragEnd = (e) => {
        e.target.style.opacity = '1';
        setDraggedIdx(null);
        // Persistir usando el estado más reciente
        setDoughs(current => {
            saveOrder(current.map(d => d.id));
            return current;
        });
    };

    const saveOrder = async (orderIds) => {
        try {
            await fetch('http://127.0.0.1:3002/api/v1/production/doughs/reorder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order: orderIds })
            });
        } catch (e) { console.error("Error saving order:", e); }
    };

    return (
        <div 
            style={{ 
                backgroundColor: '#b2b2b2',
                backgroundImage: 'radial-gradient(circle at center, #d1d1d1 0%, #b2b2b2 100%)'
            }}
            className="flex-1 flex flex-col h-full animate-in fade-in duration-700 overflow-hidden relative"
        >
            {/* Capa de Grano Industrial Sutil (Acabado Metálico/Piedra) */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none' bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]" />
            
            {/* Header: GESTOR DE MASAS (Cristal Industrial) */}
            <div className="relative z-10 flex items-center justify-between p-8 border-b border-black/10 bg-white/70 backdrop-blur-3xl shadow-md">
                <div className="flex items-center gap-6">
                    {onBack && (
                        <button 
                            onClick={onBack}
                            className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center text-gray-700 hover:text-black hover:bg-black/5 transition-all"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <div>
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-black">
                            GESTOR DE <span className="text-orange-500">MASAS</span>
                        </h1>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] mt-1">
                            Control de Materia Prima • R de Rico
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-black transition-colors" size={16} />
                        <input 
                            type="text" 
                            placeholder="Buscar masa o clave..."
                            className="bg-white/40 border border-black/5 rounded-[20px] py-3 pl-12 pr-6 text-xs font-bold text-black focus:outline-none focus:bg-white/60 w-64 transition-all placeholder-black/20"
                        />
                    </div>
                    <button
                        onClick={() => { setSelectedDough({ name: '', code: '', dough_type: 'MASA SALADA', theoretical_yield: 0, expected_waste: 0, ingredients: [], procedure_steps: [], requires_rest: false, rest_time_mins: 0, rest_container: '', dough_relations: [], product_relations: [], themeIdx: doughs.length }); setIsModalOpen(true); }}
                        className="bg-black text-white px-8 py-4 rounded-[30px] text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-3"
                    >
                        <Plus size={20} /> AGREGAR MASA
                    </button>
                </div>
            </div>

            {/* Listado de Masas */}
            <div className="flex-1 overflow-auto p-8 custom-scrollbar">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                        <Loader2 className="animate-spin text-orange-500" size={48} />
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sincronizando Archivo Maestro...</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 max-w-5xl mx-auto">
                        {doughs.map((dough, idx) => {
                            const theme = getTheme(idx);
                            return (
                                <div
                                    key={dough.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, idx)}
                                    onDragOver={(e) => handleDragOver(e, idx)}
                                    onDragEnd={handleDragEnd}
                                    onClick={() => { setSelectedDough({...dough, themeIdx: idx}); setIsModalOpen(true); }}
                                    style={{ 
                                        backgroundColor: theme.bg,
                                        transform: draggedIdx === idx ? 'scale(0.98)' : 'scale(1)',
                                        zIndex: draggedIdx === idx ? 50 : 1
                                    }}
                                    className="group relative border border-black/5 rounded-2xl p-4 hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden flex items-center gap-6 active:cursor-grabbing"
                                >
                                    <div className="opacity-20 group-hover:opacity-60 transition-opacity">
                                        <GripVertical size={20} style={{ color: theme.text }} />
                                    </div>
                                    {/* Nombre de la Masa (Cromática Total) */}
                                    <div className="relative z-10 flex flex-1 items-center justify-between">
                                        <div className="flex items-center gap-4 min-w-0 pr-12">
                                            <span style={{ backgroundColor: 'rgba(0,0,0,0.1)', color: theme.text }} className="px-3 py-1.5 rounded-xl text-[12px] font-black uppercase tracking-widest opacity-60">
                                                {dough.code || idx + 1}
                                            </span>
                                            <span style={{ color: theme.text }} className="text-lg font-black uppercase tracking-tight truncate leading-none">
                                                {dough.name}
                                            </span>
                                        </div>

                                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2">
                                            <span style={{ color: theme.text }} className="text-[9px] font-black uppercase tracking-widest italic opacity-60">Gestionar</span>
                                            <ArrowRight size={16} style={{ color: theme.text }} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <DoughWizardModal
                    initialData={selectedDough}
                    onClose={() => { setIsModalOpen(false); setSelectedDough(null); }}
                    onSuccess={() => { setIsModalOpen(false); setSelectedDough(null); loadDoughs(); }}
                />
            )}
        </div>
    );
};

/**
 * WIZARD MODAL: ADN PANADERO
 */
const DoughWizardModal = ({ onClose, onSuccess, initialData }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [editingColumnId, setEditingColumnId] = useState(null);

    const _baseMatrix = {
        columns: [
            { id: 'mep_polvos', name: 'MEP POLVOS', type: 'POLVOS' },
            { id: 'mep_liquidos', name: 'MEP LÍQUIDOS', type: 'LIQUIDOS' }
        ],
        rows: [
            { id: 'row_base_reference', name: 'RECETA BASE', baston_qty: 1, unit: 'BST', values: {} }
        ]
    };
    
    // Legacy Data Reconstruction Logic
    if (!initialData?.recipe_matrix && initialData?.batches?.length) {
        // 1. Identify unique ingredients to create columns
        const legacyIngs = initialData.ingredients || [];
        legacyIngs.forEach(ing => {
            const isStandardMEP = ing.mep_type === 'POLVOS' || ing.mep_type === 'LIQUIDOS';
            if (!isStandardMEP) {
                const colId = `c_${ing.name.replace(/\s+/g, '_').toLowerCase()}`;
                if (!_baseMatrix.columns.some(c => c.name === ing.name.toUpperCase())) {
                    _baseMatrix.columns.push({ id: colId, name: ing.name.toUpperCase(), type: ing.mep_type });
                }
            }
        });

        // 2. Create rows for each batch (including Base Reference)
        const batchesToMap = [
            { name: 'RECETA BASE', baston_qty: 1, unit: 'BST', isBase: true },
            ...initialData.batches
        ];

        _baseMatrix.rows = batchesToMap.map((b, bIdx) => {
             const row = { 
                id: b.isBase ? 'row_base_reference' : 'r_'+bIdx+'_'+Date.now(), 
                name: b.name, 
                baston_qty: b.baston_qty, 
                unit: b.unit || 'BST', 
                values: {} 
             };
             
             // Populate columns
             _baseMatrix.columns.forEach(col => {
                 if (col.id === 'mep_polvos') {
                     const sum = legacyIngs.filter(i => i.mep_type === 'POLVOS').reduce((acc, curr) => acc + (curr.qty_per_baston * b.baston_qty), 0);
                     row.values[col.id] = { qty: Math.round(sum * 100) / 100, unit: 'g' };
                 } else if (col.id === 'mep_liquidos') {
                     const sum = legacyIngs.filter(i => i.mep_type === 'LIQUIDOS').reduce((acc, curr) => acc + (curr.qty_per_baston * b.baston_qty), 0);
                     row.values[col.id] = { qty: Math.round(sum * 100) / 100, unit: 'g' };
                 } else {
                     // Find the corresponding custom ingredient
                     const match = legacyIngs.find(i => i.name.toUpperCase() === col.name);
                     row.values[col.id] = { 
                        qty: match ? Math.round(match.qty_per_baston * b.baston_qty * 100) / 100 : 0, 
                        unit: match?.unit || 'g' 
                     };
                 }
             });
             return row;
        });
    }

    const initialMatrix = (initialData && initialData.recipe_matrix) ? initialData.recipe_matrix : _baseMatrix;

    const [formData, setFormData] = useState({
        code: '', name: '', dough_type: 'MASA SALADA', description: '',
        theoretical_yield: 0, expected_waste: 0,
        requires_rest: false, rest_container: '', rest_warehouse: '', rest_time_min: 0,
        ingredients: [], 
        procedure_steps: [],
        batches: [], 
        recipe_matrix: initialMatrix,
        product_relations: [],
        dough_relations: [],
        themeIdx: 0,
        ...initialData
    });

    // Aseguramos consistencia post-merge de initialData
    useEffect(() => {
        if (!formData?.recipe_matrix?.columns) {
            setFormData(prev => ({ ...prev, recipe_matrix: _baseMatrix }));
        }
    }, [formData]);

    // Auto-calcula la RECETA BASE (1 Unidad) basada en el promedio de las tandas activas
    useEffect(() => {
        if (!formData?.recipe_matrix?.rows) return;
        const rows = formData.recipe_matrix.rows;
        const columns = formData.recipe_matrix.columns;
        const productionRows = rows.filter(r => r.id !== 'row_base_reference');
        
        if (productionRows.length === 0) return;

        const baseRow = rows.find(r => r.id === 'row_base_reference');
        if (!baseRow) return;

        let needsUpdate = false;
        const newBaseValues = { ...baseRow.values };

        columns.forEach(col => {
            let totalRatio = 0;
            let validRowsCount = 0;

            productionRows.forEach(row => {
                const qty = row.baston_qty || 0;
                const val = row.values[col.id]?.qty || 0;
                if (qty > 0 && val > 0) {
                    totalRatio += (val / qty);
                    validRowsCount++;
                }
            });

            const avgRatio = validRowsCount > 0 ? Math.round((totalRatio / validRowsCount) * 100) / 100 : 0;
            
            // Sincronizar unidad con la primera tanda disponible
            const firstUnit = productionRows.find(r => r.values[col.id]?.unit)?.values[col.id]?.unit || 'g';
            
            if (newBaseValues[col.id]?.qty !== avgRatio || newBaseValues[col.id]?.unit !== firstUnit) {
                newBaseValues[col.id] = { ...newBaseValues[col.id], qty: avgRatio, unit: firstUnit };
                needsUpdate = true;
            }
        });

        if (needsUpdate) {
            const newRows = rows.map(r => r.id === 'row_base_reference' ? { ...r, values: newBaseValues } : r);
            setFormData(prev => ({ ...prev, recipe_matrix: { ...prev.recipe_matrix, rows: newRows } }));
        }
    }, [formData?.recipe_matrix?.rows]);

    const [catalog, setCatalog] = useState({ products: [], doughs: [] });
    const [searchTerm, setSearchTerm] = useState('');

    const loadCatalog = async () => {
        try {
            const [pResp, dResp] = await Promise.all([
                fetch('http://127.0.0.1:3002/api/v1/catalog/products'),
                fetch('http://127.0.0.1:3002/api/v1/production/doughs')
            ]);
            if (pResp.ok && dResp.ok) {
                setCatalog({
                    products: await pResp.json(),
                    doughs: await dResp.json()
                });
            }
        } catch (e) { console.error("Error loading catalog:", e); }
    };

    useEffect(() => { loadCatalog(); }, []);

    const addMatrixRow = () => {
        if (!formData?.recipe_matrix?.columns) return;
        const newRowId = 'r_' + Date.now();
        const newRow = { id: newRowId, name: '', baston_qty: 1, unit: 'BST', values: {} };
        formData.recipe_matrix.columns.forEach(col => {
            newRow.values[col.id] = { qty: 0, unit: 'g' };
        });
        setFormData({...formData, recipe_matrix: { ...formData.recipe_matrix, rows: [...(formData.recipe_matrix.rows || []), newRow] } });
    };

    const addMatrixColumn = () => {
        if (!formData?.recipe_matrix?.rows) return;
        const newColId = 'c_' + Date.now();
        const newCol = { id: newColId, name: 'NUEVO INSUMO', type: 'INGREDIENTE DIRECTO' };
        
        const newRows = formData.recipe_matrix.rows.map(r => ({
            ...r,
            values: { ...r.values, [newColId]: { qty: 0, unit: 'g' } }
        }));
        
        setFormData({...formData, recipe_matrix: { columns: [...(formData.recipe_matrix.columns || []), newCol], rows: newRows } });
        setEditingColumnId(newColId);
    };

    const addStep = () => {
        setFormData({
            ...formData,
            procedure_steps: [...formData.procedure_steps, {
                step_number: formData.procedure_steps.length + 1,
                task: 'REVOLVER', description: '', equipment: '', speed: '1', time_minutes: 0
            }]
        });
    };

    const [notification, setNotification] = useState(null);

    const showNotify = (title, msg, type = 'error') => {
        setNotification({ title, msg, type });
        if (type === 'success') setTimeout(() => setNotification(null), 3000);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const derivedBatches = (formData?.recipe_matrix?.rows || []).map(r => ({
                name: r.name || `${r.baston_qty || 1}B`,
                baston_qty: r.baston_qty || 1
            }));

            const payload = {
                ...formData,
                batches: derivedBatches,
                ingredients: [], // Empty to phase out the old linear config
                dough_relations: formData.dough_relations.map(r => ({
                    related_dough_id: r.id,
                    qty_per_baston: r.qty_per_baston || 0
                }))
            };

            const isUpdate = !!initialData?.id;
            const url = isUpdate
                ? `http://localhost:3002/api/v1/production/doughs/${initialData.id}`
                : 'http://localhost:3002/api/v1/production/doughs';

            const resp = await fetch(url, {
                method: isUpdate ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (resp.ok) {
                showNotify("ÉXITO", "Masa guardada correctamente", "success");
                setTimeout(onSuccess, 1500);
            } else {
                const err = await resp.json();
                showNotify("ERROR DE MOTOR", err.detail || "No se pudo guardar la masa", "error");
            }
        } catch (e) {
            showNotify("ERROR DE CONEXIÓN", "El servidor no responde (Puerto 3002)", "error");
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { id: 1, label: 'GENERAL', icon: Info },
        { id: 2, label: 'RECETA (BOM)', icon: Beaker },
        { id: 3, label: 'PROCESO DE REVOLTURA', icon: ListOrdered },
        { id: 4, label: 'REPOSO', icon: Timer },
        { id: 5, label: 'VÍNCULOS', icon: Zap }
    ];

    const theme = getTheme(formData.themeIdx ?? 0);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />

            <div
                style={{ backgroundColor: theme.bg }}
                className="relative w-full max-w-6xl h-[90vh] border border-black/10 rounded-[60px] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
            >
                {/* Modal Header - Theme aware */}
                <div className="p-8 pb-4 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div>
                            <h2 style={{ color: theme.text }} className="text-5xl font-black italic uppercase tracking-tighter">
                                {formData.name || 'NUEVA MASA'}
                            </h2>
                            <p style={{ color: theme.text }} className="text-[10px] font-bold uppercase tracking-[0.4em] mt-1 opacity-60">Configuración Maestra Industrial</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ backgroundColor: theme.input, color: theme.text }} className="p-4 rounded-full hover:scale-110 transition-all">
                        <X size={24} />
                    </button>
                </div>

                {/* Stepper Progress - Theme aware */}
                <div className="px-10 py-2 flex gap-3">
                    {steps.map(s => (
                        <button
                            key={s.id}
                            onClick={() => setStep(s.id)}
                            style={{
                                backgroundColor: step === s.id ? theme.text : theme.input,
                                color: step === s.id ? theme.bg : theme.text,
                                borderColor: 'rgba(0,0,0,0.1)'
                            }}
                            className={`flex-1 flex items-center gap-3 p-3 rounded-2xl border transition-all`}
                        >
                            <div className={`p-1.5 rounded-lg ${step === s.id ? 'bg-white/20' : 'bg-black/5'}`}>
                                <s.icon size={16} />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest">{s.label}</span>
                        </button>
                    ))}
                </div>

                {/* Form Content - Truly Centered Distribution */}
                <div className="flex-1 overflow-auto px-10 relative flex flex-col justify-center min-h-0 custom-scrollbar py-6">
                    <div className="max-w-5xl mx-auto w-full">
                        {step === 1 && (
                            <div className="grid grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
                                <div className="space-y-6">
                                    <label className="block">
                                        <span style={{ color: theme.text }} className="text-[13px] font-black uppercase opacity-60 tracking-widest pl-2">Nombre de la Masa</span>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={e => setFormData({...formData, name: e.target.value})}
                                            placeholder="Ej: MASA DE FUERZA REFINADA"
                                            style={{ backgroundColor: theme.input, color: theme.text }}
                                            className="w-full border border-black/5 rounded-3xl p-5 mt-2 outline-none font-bold placeholder-black/30"
                                        />
                                    </label>
                                    <label className="block">
                                        <span style={{ color: theme.text }} className="text-[13px] font-black uppercase opacity-60 tracking-widest pl-2">Clave Maestra</span>
                                        <input
                                            type="text"
                                            value={formData.code}
                                            onChange={e => setFormData({...formData, code: e.target.value})}
                                            placeholder="Ej: MF-01"
                                            style={{ backgroundColor: theme.input, color: theme.text }}
                                            className="w-full border border-black/5 rounded-3xl p-5 mt-2 outline-none font-mono font-bold placeholder-black/30"
                                        />
                                    </label>
                                    <label className="block">
                                        <span style={{ color: theme.text }} className="text-[13px] font-black uppercase opacity-60 tracking-widest pl-2">Descripción</span>
                                        <textarea
                                            value={formData.description || ''}
                                            onChange={e => setFormData({...formData, description: e.target.value})}
                                            placeholder="Descripción o notas de la masa..."
                                            style={{ backgroundColor: theme.input, color: theme.text }}
                                            className="w-full border border-black/5 rounded-3xl p-5 mt-2 outline-none font-bold placeholder-black/30 resize-none h-24"
                                        />
                                    </label>
                                </div>
                                <div className="space-y-6">
                                    <label className="block">
                                        <span style={{ color: theme.text }} className="text-[13px] font-black uppercase opacity-60 tracking-widest pl-2">Tipo de Masa</span>
                                        <select
                                            value={formData.dough_type}
                                            onChange={e => setFormData({...formData, dough_type: e.target.value})}
                                            style={{ backgroundColor: theme.input, color: theme.text }}
                                            className="w-full border border-black/5 rounded-3xl p-5 mt-2 focus:ring-1 focus:ring-orange-500/50 outline-none font-bold appearance-none uppercase"
                                        >
                                            <option value="PREFERMENTO">PREFERMENTO</option>
                                            <option value="MASA SALADA">MASA SALADA</option>
                                            <option value="MASA DULCE">MASA DULCE</option>
                                        </select>
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <label className="block">
                                            <span style={{ color: theme.text }} className="text-[13px] font-black uppercase opacity-60 tracking-widest pl-2">Rend. Teórico (g)</span>
                                            <input
                                                type="number"
                                                value={formData.theoretical_yield}
                                                onChange={e => setFormData({...formData, theoretical_yield: Number(e.target.value)})}
                                                style={{ backgroundColor: theme.input, color: theme.text }}
                                                className="w-full border border-black/5 rounded-3xl p-5 mt-2 outline-none font-mono font-bold"
                                            />
                                        </label>
                                        <label className="block">
                                            <span style={{ color: theme.text }} className="text-[13px] font-black uppercase opacity-60 tracking-widest pl-2">% Merma Esperada</span>
                                            <input
                                                type="number"
                                                value={formData.expected_waste}
                                                onChange={e => setFormData({...formData, expected_waste: Number(e.target.value)})}
                                                style={{ backgroundColor: theme.input, color: theme.text }}
                                                className="w-full border border-black/5 rounded-3xl p-5 mt-2 outline-none font-mono font-bold"
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4 animate-in fade-in duration-500 flex flex-col h-full">
                                <div className="flex justify-between items-center mb-2 shrink-0">
                                    <h3 style={{ color: theme.text }} className="text-2xl font-black italic uppercase border-b border-black/10 pb-2 flex-1">Receta por <span className="opacity-40 ml-2">Tandas</span></h3>
                                    <button onClick={addMatrixColumn} style={{ backgroundColor: theme.text, color: theme.bg }} className="px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2">
                                        <Plus size={14}/> Agregar Insumo (Columna)
                                    </button>
                                </div>
                                <div className="flex-1 overflow-auto custom-scrollbar bg-black/5 rounded-[40px] border border-black/5 p-2 relative w-full">
                                    <div className="min-w-max">
                                        {/* Table Header */}
                                        <div className="flex gap-4 mb-2">
                                            <div className="w-48 shrink-0 flex items-end pb-2">
                                                <span style={{ color: theme.text }} className="text-xs font-black uppercase tracking-widest opacity-60">Matriz de Producción</span>
                                            </div>
                                            {formData.recipe_matrix.columns.map((col, cIdx) => (
                                                <div key={col.id} className="w-48 shrink-0 relative group flex items-center gap-2">
                                                    <div style={{ backgroundColor: theme.input }} className="flex-1 p-2 text-center rounded-2xl border-2 border-black/20 flex flex-col h-14 justify-center shadow-md relative overflow-hidden">
                                                        {editingColumnId === col.id ? (
                                                            <input 
                                                                autoFocus
                                                                className="bg-transparent text-[11px] font-black uppercase text-center outline-none w-full border-b-2 border-orange-500"
                                                                style={{ color: theme.text }}
                                                                value={col.name}
                                                                onBlur={() => setEditingColumnId(null)}
                                                                onKeyDown={e => e.key === 'Enter' && setEditingColumnId(null)}
                                                                onChange={e => {
                                                                    const newCols = [...formData.recipe_matrix.columns];
                                                                    newCols[cIdx].name = e.target.value.toUpperCase();
                                                                    setFormData({...formData, recipe_matrix: {...formData.recipe_matrix, columns: newCols}});
                                                                }}
                                                            />
                                                        ) : (
                                                            <>
                                                                <span style={{ color: theme.text }} className="text-[11px] leading-tight font-black uppercase tracking-widest">{col.name}</span>
                                                                {cIdx > 1 && (
                                                                    <div className="absolute inset-0 bg-white/95 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-all">
                                                                        <button 
                                                                            onClick={() => setEditingColumnId(col.id)}
                                                                            className="p-1.5 bg-black text-white rounded-lg hover:scale-110 transition-all"
                                                                        >
                                                                            <Edit2 size={12}/>
                                                                        </button>
                                                                        <button 
                                                                            onClick={() => {
                                                                                const newCols = formData.recipe_matrix.columns.filter(c => c.id !== col.id);
                                                                                setFormData({...formData, recipe_matrix: {...formData.recipe_matrix, columns: newCols}});
                                                                            }}
                                                                            className="p-1.5 bg-red-500 text-white rounded-lg hover:scale-110 transition-all"
                                                                        >
                                                                            <Trash2 size={12}/>
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Table Rows */}
                                        <div className="space-y-4">
                                            {formData.recipe_matrix.rows.length === 0 && (
                                                <div className="py-20 text-center opacity-30">
                                                    <p className="font-black uppercase tracking-widest text-xs">Añade tu primera Fila/Tanda</p>
                                                </div>
                                            )}
                                            {formData.recipe_matrix.rows.map((row, rIdx) => (
                                                <div key={row.id} className="flex gap-4 items-center group">
                                                    {/* Batch Config */}
                                                    <div 
                                                        style={{ 
                                                            backgroundColor: row.id === 'row_base_reference' ? theme.text : theme.input,
                                                            borderColor: row.id === 'row_base_reference' ? theme.text : 'rgba(0,0,0,0.2)'
                                                        }} 
                                                        className={`w-48 shrink-0 flex items-center gap-1 p-3 rounded-2xl border-2 shadow-sm relative transition-all`}
                                                    >
                                                        {row.id === 'row_base_reference' ? (
                                                            <div className="flex-1 flex flex-col items-center justify-center -space-y-1">
                                                                <span style={{ color: theme.bg }} className="text-[9px] font-black uppercase tracking-tighter opacity-60">RECETA BASE</span>
                                                                <span style={{ color: theme.bg }} className="text-2xl font-black leading-none">1</span>
                                                            </div>
                                                        ) : (
                                                            <input 
                                                                type="text"
                                                                value={row.name}
                                                                onChange={e => {
                                                                    const newRows = [...formData.recipe_matrix.rows];
                                                                    newRows[rIdx].name = e.target.value.toUpperCase();
                                                                    setFormData({...formData, recipe_matrix: {...formData.recipe_matrix, rows: newRows}});
                                                                }}
                                                                style={{ color: '#000' }}
                                                                placeholder="Ej: 4B"
                                                                className="bg-transparent font-black text-sm w-16 outline-none text-center"
                                                            />
                                                        )}
                                                        
                                                        {row.id !== 'row_base_reference' && <span className="opacity-20 text-xs">/</span>}
                                                        
                                                        {row.id !== 'row_base_reference' && (
                                                            <input 
                                                                type="number"
                                                                value={row.baston_qty || ''}
                                                                onChange={e => {
                                                                    const newRows = [...formData.recipe_matrix.rows];
                                                                    newRows[rIdx].baston_qty = Number(e.target.value);
                                                                    setFormData({...formData, recipe_matrix: {...formData.recipe_matrix, rows: newRows}});
                                                                }}
                                                                style={{ color: '#000' }}
                                                                className="bg-transparent font-black text-sm w-12 outline-none text-right"
                                                            />
                                                        )}

                                                        <select
                                                            value={row.unit || 'BST'}
                                                            onChange={e => {
                                                                const newRows = [...formData.recipe_matrix.rows];
                                                                newRows[rIdx].unit = e.target.value;
                                                                setFormData({...formData, recipe_matrix: {...formData.recipe_matrix, rows: newRows}});
                                                            }}
                                                            style={{ color: row.id === 'row_base_reference' ? theme.bg : theme.text }}
                                                            className="bg-transparent text-[10px] font-black uppercase mt-1 tracking-widest opacity-60 outline-none appearance-none cursor-pointer"
                                                        >
                                                            <option value="BST">BST</option>
                                                            <option value="TND">TND</option>
                                                            <option value="1/2 TND">1/2 TND</option>
                                                        </select>
                                                        
                                                        {row.id !== 'row_base_reference' && (
                                                            <button 
                                                                onClick={() => {
                                                                    const newRows = formData.recipe_matrix.rows.filter((_, i) => i !== rIdx);
                                                                    setFormData({...formData, recipe_matrix: {...formData.recipe_matrix, rows: newRows}});
                                                                }}
                                                                className="absolute -left-4 p-1 bg-red-500 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                                                            >
                                                                <Trash2 size={12}/>
                                                            </button>
                                                        )}
                                                    </div>

                                                    {/* Ingredient Cells */}
                                                    {formData.recipe_matrix.columns.map(col => {
                                                        const cell = row.values[col.id] || { qty: 0, unit: 'g' };
                                                        const isBase = row.id === 'row_base_reference';
                                                        return (
                                                            <div 
                                                                key={col.id} 
                                                                style={{ 
                                                                    backgroundColor: isBase ? theme.text : 'white',
                                                                    borderColor: isBase ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                                                                }}
                                                                className={`w-48 shrink-0 flex items-center border-2 rounded-2xl overflow-hidden ${isBase ? '' : 'focus-within:ring-4 focus-within:ring-orange-500/20 focus-within:border-black'} transition-all shadow-sm`}
                                                            >
                                                                {isBase ? (
                                                                    <div style={{ color: theme.bg }} className="w-full px-3 py-2 font-mono font-black text-lg text-right opacity-90 select-none">
                                                                        {cell.qty || 0}
                                                                    </div>
                                                                ) : (
                                                                    <input 
                                                                        type="number"
                                                                        value={cell.qty === 0 ? '' : cell.qty}
                                                                        placeholder="0"
                                                                        onChange={e => {
                                                                            const val = Number(e.target.value);
                                                                            const newRows = [...formData.recipe_matrix.rows];
                                                                            newRows[rIdx].values[col.id] = { ...cell, qty: val };
                                                                            setFormData({...formData, recipe_matrix: {...formData.recipe_matrix, rows: newRows}});
                                                                        }}
                                                                        style={{ color: '#000' }}
                                                                        className="w-full min-w-0 bg-transparent px-3 py-2 font-mono font-black text-lg outline-none text-right"
                                                                    />
                                                                )}
                                                                {isBase ? (
                                                                    <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: theme.bg }} className="text-[10px] font-black font-mono w-16 px-1 pl-2 py-3 opacity-60 border-l border-white/10 select-none">
                                                                        {cell.unit}
                                                                    </div>
                                                                ) : (
                                                                    <select 
                                                                        value={cell.unit}
                                                                        onChange={e => {
                                                                            const newRows = [...formData.recipe_matrix.rows];
                                                                            newRows[rIdx].values[col.id] = { ...cell, unit: e.target.value };
                                                                            setFormData({...formData, recipe_matrix: {...formData.recipe_matrix, rows: newRows}});
                                                                        }}
                                                                        style={{ color: '#000' }}
                                                                        className="bg-black/5 text-[10px] font-black font-mono w-16 px-1 pl-2 py-3 outline-none cursor-pointer appearance-none text-left border-l border-black/10"
                                                                    >
                                                                        <option value="g">g</option>
                                                                        <option value="kg">kg</option>
                                                                        <option value="ml">ml</option>
                                                                        <option value="L">L</option>
                                                                        <option value="BASTÓN">BST</option>
                                                                        <option value="TANDA">TND</option>
                                                                        <option value="1/2 TANDA">1/2 TND</option>
                                                                        <option value="pza">pza</option>
                                                                    </select>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ))}

                                            <button 
                                                onClick={addMatrixRow}
                                                className="w-48 p-3 rounded-2xl border-2 border-dashed border-black/20 text-black/40 hover:border-black/50 hover:text-black hover:bg-black/5 transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 mt-2"
                                            >
                                                <Plus size={14}/> Fila (Tanda)
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-4 animate-in fade-in duration-500">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 style={{ color: theme.text }} className="text-2xl font-black italic uppercase border-b border-black/10 pb-2 flex-1">Instrucciones de <span className="opacity-40 text-sm ml-2">Revoltura</span></h3>
                                    <button onClick={addStep} style={{ backgroundColor: theme.text, color: theme.bg }} className="px-6 py-4 rounded-2xl text-[12px] font-black uppercase tracking-widest hover:scale-105 transition-all gap-2 flex items-center ml-4">
                                        <Plus size={14}/> Agregar Paso
                                    </button>
                                </div>
                                <div className="space-y-4 relative">
                                    {formData.procedure_steps.map((st, idx) => (
                                        <div key={idx} className="flex gap-4 items-center">
                                            <div style={{ backgroundColor: theme.text, color: theme.bg }} className="w-10 h-10 rounded-xl flex items-center justify-center font-black italic shrink-0">
                                                {st.step_number}
                                            </div>
                                            <div style={{ backgroundColor: theme.input }} className="flex-1 p-4 rounded-2xl border border-black/5 flex items-center gap-4 group hover:shadow-lg transition-all">
                                                <input
                                                    placeholder="Tarea (Ej: INTEGRAR HARINA)"
                                                    value={st.task}
                                                    onChange={e => {
                                                        const newSteps = [...formData.procedure_steps];
                                                        newSteps[idx].task = e.target.value.toUpperCase();
                                                        setFormData({...formData, procedure_steps: newSteps});
                                                    }}
                                                    style={{ backgroundColor: theme.bg, color: theme.text }}
                                                    className="flex-1 border border-black/5 rounded-xl p-3 text-xs font-black outline-none transition-all placeholder-black/30"
                                                />
                                                <input
                                                    placeholder="Equipo"
                                                    value={st.equipment}
                                                    onChange={e => {
                                                        const newSteps = [...formData.procedure_steps];
                                                        newSteps[idx].equipment = e.target.value.toUpperCase();
                                                        setFormData({...formData, procedure_steps: newSteps});
                                                    }}
                                                    style={{ backgroundColor: theme.bg, color: theme.text }}
                                                    className="w-40 border border-black/5 rounded-xl p-3 text-xs font-black outline-none placeholder-black/30"
                                                />
                                                <select
                                                    value={st.speed}
                                                    onChange={e => {
                                                        const newSteps = [...formData.procedure_steps];
                                                        newSteps[idx].speed = e.target.value;
                                                        setFormData({...formData, procedure_steps: newSteps});
                                                    }}
                                                    style={{ backgroundColor: theme.bg, color: theme.text }}
                                                    className="w-24 border border-black/5 rounded-xl p-3 text-xs font-black outline-none appearance-none"
                                                >
                                                    <option value="1">VEL 1</option>
                                                    <option value="2">VEL 2</option>
                                                    <option value="OFF">OFF</option>
                                                </select>
                                                <div style={{ backgroundColor: theme.bg }} className="flex items-center gap-2 border border-black/5 rounded-xl px-3 py-2">
                                                    <input
                                                        type="number"
                                                        value={st.time_minutes}
                                                        onChange={e => {
                                                            const newSteps = [...formData.procedure_steps];
                                                            newSteps[idx].time_minutes = Number(e.target.value);
                                                            setFormData({...formData, procedure_steps: newSteps});
                                                        }}
                                                        style={{ color: theme.text }}
                                                        className="bg-transparent text-xs font-mono font-black text-center w-12 outline-none"
                                                    />
                                                    <span style={{ color: theme.text }} className="text-[10px] font-black opacity-40 uppercase">Min</span>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        const newSteps = formData.procedure_steps.filter((_, i) => i !== idx);
                                                        setFormData({...formData, procedure_steps: newSteps});
                                                    }}
                                                    className="p-2 text-gray-700 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={16}/>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="animate-in fade-in duration-500 max-w-2xl mx-auto w-full">
                                <div className="space-y-8">
                                    <div style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} className="p-8 border border-black/5 rounded-[40px] space-y-8">
                                        <div className="flex items-center justify-between px-2">
                                            <h3 style={{ color: theme.text }} className="text-sm font-black italic uppercase tracking-widest">Requiere <span className="opacity-40">Reposo Maestro</span></h3>
                                            <button 
                                                onClick={() => setFormData({...formData, requires_rest: !formData.requires_rest})}
                                                className={`w-12 h-6 rounded-full transition-all relative ${formData.requires_rest ? 'bg-black/80' : 'bg-black/10'}`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.requires_rest ? 'left-7' : 'left-1'}`} />
                                            </button>
                                        </div>
                                        <hr className="border-black/5" />
                                        <div className="space-y-4">
                                            <label className="block">
                                                <span style={{ color: theme.text }} className="font-black uppercase tracking-widest text-[11px] opacity-60">Contenedor de Reposo</span>
                                                <input 
                                                    type="text" 
                                                    value={formData.rest_container}
                                                    onChange={e => setFormData({...formData, rest_container: e.target.value})}
                                                    placeholder="Ej: CUBETA AMARILLA 20L / CHAROLA"
                                                    style={{ backgroundColor: theme.input, color: theme.text }}
                                                    className="w-full border border-black/5 rounded-3xl p-5 mt-2 outline-none font-bold placeholder-black/30"
                                                />
                                            </label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <label className="block">
                                                    <span style={{ color: theme.text }} className="text-[13px] font-black uppercase opacity-60 tracking-widest pl-2">Almacén de Destino</span>
                                                    <input 
                                                        type="text" 
                                                        value={formData.rest_warehouse}
                                                        onChange={e => setFormData({...formData, rest_warehouse: e.target.value})}
                                                        placeholder="Ej: CÁMARA 1"
                                                        style={{ backgroundColor: theme.input, color: theme.text }}
                                                        className="w-full border border-black/5 rounded-3xl p-5 mt-2 outline-none font-bold placeholder-black/30"
                                                    />
                                                </label>
                                                <label className="block">
                                                    <span style={{ color: theme.text }} className="text-[14px] font-black uppercase tracking-widest opacity-60 pl-2">Tiempo de Reposo</span>
                                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                                        <div className="space-y-1">
                                                            <span style={{ color: theme.text }} className="text-[12px] font-black uppercase opacity-40 tracking-widest pl-2">Horas</span>
                                                            <div style={{ backgroundColor: theme.input }} className="flex items-center gap-2 border border-black/5 rounded-[20px] px-4 py-3">
                                                                <input 
                                                                    type="number" 
                                                                    placeholder="0"
                                                                    value={Math.floor(formData.rest_time_min / 60) || ''}
                                                                    onChange={e => {
                                                                        const hours = Number(e.target.value);
                                                                        const mins = formData.rest_time_min % 60;
                                                                        setFormData({...formData, rest_time_min: (hours * 60) + mins});
                                                                    }}
                                                                    style={{ color: theme.text }}
                                                                    className="bg-transparent font-mono font-black text-lg w-full outline-none text-center"
                                                                />
                                                                <span style={{ color: theme.text }} className="text-[9px] font-black opacity-40 uppercase tracking-widest">HRS</span>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <span style={{ color: theme.text }} className="text-[12px] font-black uppercase opacity-40 tracking-widest pl-2">Minutos</span>
                                                            <div style={{ backgroundColor: theme.input }} className="flex-1 flex items-center gap-2 border border-black/5 rounded-[20px] px-4 py-3">
                                                                <input 
                                                                    type="number" 
                                                                    placeholder="0"
                                                                    value={formData.rest_time_min % 60 || ''}
                                                                    onChange={e => {
                                                                        const mins = Number(e.target.value);
                                                                        const hours = Math.floor(formData.rest_time_min / 60);
                                                                        setFormData({...formData, rest_time_min: (hours * 60) + mins});
                                                                    }}
                                                                    style={{ color: theme.text }}
                                                                    className="bg-transparent font-mono font-black text-lg w-full outline-none text-center"
                                                                />
                                                                <span style={{ color: theme.text }} className="text-[9px] font-black opacity-40 uppercase tracking-widest">MIN</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 5 && (
                            <div className="animate-in fade-in duration-500 pt-6 max-w-4xl mx-auto w-full">
                                <div className="space-y-8">
                                    <div className="text-center">
                                        <h3 style={{ color: theme.text }} className="text-3xl font-black tracking-tighter uppercase italic">
                                            {formData.dough_type === 'PREFERMENTO' || formData.dough_type === 'PRE-FERMENTO' ? 'Masas que emplean este pre-fermento' : 'Productos que emplean esta masa'}
                                        </h3>
                                        <p style={{ color: theme.text }} className="text-[11px] font-black uppercase tracking-widest mt-2 opacity-50">Trazabilidad industrial descendente (Downstream)</p>
                                    </div>

                                    <div className="bg-white/5 border border-black/5 rounded-[40px] p-8">
                                        {(() => {
                                            const isPreferment = formData.dough_type === 'PREFERMENTO' || formData.dough_type === 'PRE-FERMENTO';
                                            
                                            if (isPreferment) {
                                                const linkedDoughs = (catalog.doughs || []).filter(d => 
                                                    d.ingredients?.some(ing => ing.mep_type === 'PRE-FERMENTO' && ing.related_dough_id === initialData?.id)
                                                );

                                                if (linkedDoughs.length === 0) {
                                                    return (
                                                        <div className="text-center py-20 opacity-30">
                                                            <Zap size={48} className="mx-auto mb-4" />
                                                            <p className="font-bold uppercase tracking-widest text-xs">No hay masas vinculadas a este prefermento</p>
                                                        </div>
                                                    );
                                                }

                                                return (
                                                    <div className="grid grid-cols-1 gap-4">
                                                        {linkedDoughs.map(d => (
                                                            <div key={d.id} className="flex items-center justify-between bg-white rounded-3xl p-6 shadow-sm border border-black/5">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center font-black text-xs">DOU</div>
                                                                    <div>
                                                                        <div className="font-black uppercase tracking-tighter text-lg">{d.name}</div>
                                                                        <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{d.code}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="bg-black/5 px-4 py-2 rounded-xl font-black text-[10px] uppercase opacity-60">USADO EN RECETA</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                );
                                            } else {
                                                const linkedProducts = (catalog.products || []).filter(p => {
                                                    const ts = p.technical_sheet || p.technical_data;
                                                    if (!ts) return false;
                                                    return (
                                                        ts.primary_mass_id?.toString() === initialData?.id?.toString() ||
                                                        ts.secondary_mass_id?.toString() === initialData?.id?.toString() ||
                                                        ts.tertiary_mass_id?.toString() === initialData?.id?.toString()
                                                    );
                                                });

                                                if (linkedProducts.length === 0) {
                                                    return (
                                                        <div className="text-center py-20 opacity-30">
                                                            <Zap size={48} className="mx-auto mb-4" />
                                                            <p className="font-bold uppercase tracking-widest text-xs">No hay productos vinculados a esta masa</p>
                                                            <p className="text-[10px] mt-2 opacity-60 italic">Vincúlalos desde el Maestro de Productos</p>
                                                        </div>
                                                    );
                                                }

                                                return (
                                                    <div className="grid grid-cols-1 gap-4">
                                                        {linkedProducts.map(p => {
                                                            const ts = p.technical_sheet || p.technical_data || {};
                                                            let grams = 0;
                                                            if (ts.primary_mass_id?.toString() === initialData?.id?.toString()) grams = ts.primary_mass_grams;
                                                            else if (ts.secondary_mass_id?.toString() === initialData?.id?.toString()) grams = ts.secondary_mass_grams;
                                                            else if (ts.tertiary_mass_id?.toString() === initialData?.id?.toString()) grams = ts.tertiary_mass_grams;

                                                            return (
                                                                <div key={p.id} className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-black/5 hover:translate-x-1 transition-transform group">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center overflow-hidden shadow-inner">
                                                                            {p.image_url ? (
                                                                                <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                                                                            ) : (
                                                                                <div style={{ backgroundColor: theme.input }} className="w-full h-full flex items-center justify-center font-black text-[9px] opacity-30">PRO</div>
                                                                            )}
                                                                        </div>
                                                                        <div>
                                                                            <div style={{ color: theme.text }} className="font-black uppercase tracking-tighter text-base leading-none">{p.name || 'SIN NOMBRE'}</div>
                                                                            <div style={{ color: theme.text }} className="text-[9px] font-bold opacity-30 uppercase tracking-widest">{p.sku || 'SIN SKU'}</div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="flex items-baseline gap-2 bg-black/5 px-4 py-2 rounded-xl">
                                                                            <div style={{ color: theme.text }} className="text-xl font-mono font-black">{parseFloat(grams) || 0}<span className="text-[10px] ml-1 opacity-40">g</span></div>
                                                                            <div style={{ color: theme.text }} className="text-[11px] font-black opacity-60 uppercase tracking-wider leading-none">/ UNIDAD</div>
                                                                        </div>
                                                                        <div style={{ backgroundColor: theme.bg, color: theme.text }} className="w-8 h-8 rounded-full flex items-center justify-center shadow-md border border-black/5 group-hover:scale-110 transition-transform">
                                                                            <ChevronRight size={16} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                );
                                            }
                                        })()}
                                    </div>
                                    
                                    <div className="flex items-center gap-3 justify-center text-[10px] font-black uppercase tracking-widest opacity-30 italic">
                                        <div className="w-8 h-[1px] bg-black/50" />
                                        La vinculación se gestiona automáticamente desde el Maestro de Productos
                                        <div className="w-8 h-[1px] bg-black/50" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Navigation - Slim */}
                <div style={{ backgroundColor: 'rgba(0,0,0,0.05)' }} className="p-6 border-t border-black/5 flex justify-end items-center">
                    <div className="flex gap-3">
                        {step > 1 && (
                            <button 
                                onClick={() => setStep(step - 1)}
                                style={{ backgroundColor: theme.input, color: theme.text }}
                                className="px-8 py-5 rounded-3xl text-sm font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2"
                            >
                                <ChevronLeft size={18}/> Anterior
                            </button>
                        )}
 
                        {step < 5 && (
                            <button 
                                onClick={() => setStep(step + 1)}
                                style={{ backgroundColor: theme.text, color: theme.bg }}
                                className="px-8 py-5 rounded-3xl text-sm font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                            >
                                Siguiente <ChevronRight size={18}/>
                            </button>
                        )}
                        
                        <button 
                            onClick={handleSave}
                            disabled={loading || !formData.name}
                            style={{ 
                                backgroundColor: loading || !formData.name ? 'rgba(0,0,0,0.1)' : theme.text,
                                color: loading || !formData.name ? 'rgba(0,0,0,0.3)' : theme.bg
                            }}
                            className="px-10 py-5 rounded-3xl text-sm font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
                            GUARDAR MASA
                        </button>
                    </div>
                </div>

                {/* NOTIFICACIÓN "IMPERIAL" */}
                {notification && (
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 z-[110] animate-in fade-in slide-in-from-top-8 duration-500">
                        <div style={{ backgroundColor: theme.bg }} className={`px-10 py-6 rounded-[30px] border border-black/10 backdrop-blur-3xl shadow-2xl flex items-center gap-6 min-w-[400px]`}>
                            <div style={{ backgroundColor: theme.input, color: theme.text }} className={`w-12 h-12 rounded-2xl flex items-center justify-center`}>
                                {notification.type === 'error' ? <X size={24}/> : <Plus size={24}/>}
                            </div>
                            <div>
                                <p style={{ color: theme.text }} className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-1">{notification.title}</p>
                                <p style={{ color: theme.text }} className="text-sm font-black uppercase italic tracking-tight">{notification.msg}</p>
                            </div>
                            {notification.type === 'error' && (
                                <button onClick={() => setNotification(null)} style={{ color: theme.text }} className="ml-auto p-2 hover:bg-black/5 rounded-full transition-all">
                                    <X size={16}/>
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

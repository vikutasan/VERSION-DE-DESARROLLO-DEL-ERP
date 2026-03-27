import React, { useState, useEffect } from 'react';
import { 
    ArrowLeft, Plus, Search, Filter, Loader2, ChefHat, Info, 
    Save, X, ChevronRight, ChevronLeft, Beaker, Zap, Timer, 
    Scale, Trash2, ListOrdered, Settings2, Package, ArrowRight
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

    const loadDoughs = async () => {
        try {
            const resp = await fetch('http://localhost:3002/api/v1/production/doughs');
            if (resp.ok) setDoughs(await resp.json());
        } catch (e) { console.error(e); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { loadDoughs(); }, []);

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
                                    onClick={() => { setSelectedDough({...dough, themeIdx: idx}); setIsModalOpen(true); }}
                                    style={{ backgroundColor: theme.bg }}
                                    className="group relative border border-black/5 rounded-2xl p-4 hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden flex items-center gap-6"
                                >
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
    const [formData, setFormData] = useState({
        code: '', name: '', dough_type: 'MASA SALADA', description: '',
        theoretical_yield: 0, expected_waste: 0,
        requires_rest: false, rest_container: '', rest_warehouse: '', rest_time_min: 0,
        ingredients: [],
        procedure_steps: [],
        batches: [{ name: 'BASE', baston_qty: 1 }],
        product_relations: [], // { id, name, code, grams_per_piece, pieces_per_baston }
        dough_relations: [],   // { id, name, code, qty_per_baston }
        themeIdx: 0,
        ...initialData
    });

    const [catalog, setCatalog] = useState({ products: [], doughs: [] });
    const [searchTerm, setSearchTerm] = useState('');

    const loadCatalog = async () => {
        try {
            const [pResp, dResp] = await Promise.all([
                fetch('http://localhost:3002/api/v1/products'),
                fetch('http://localhost:3002/api/v1/production/doughs')
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

    const addIngredient = () => {
        setFormData({
            ...formData,
            ingredients: [...formData.ingredients, { name: '', qty_per_baston: 0, unit: 'g', mep_type: 'POLVOS' }]
        });
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
            // Adapt dough_relations to match backend expected format
            const payload = {
                ...formData,
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
                <div className="px-10 py-4 flex gap-3">
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
                            <div className="space-y-4 animate-in fade-in duration-500">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 style={{ color: theme.text }} className="text-2xl font-black italic uppercase border-b border-black/10 pb-2 flex-1">Mise en Place <span className="opacity-40 text-sm ml-2">(Ingredientes)</span></h3>
                                    <button onClick={addIngredient} style={{ backgroundColor: theme.text, color: theme.bg }} className="px-6 py-4 rounded-2xl text-[12px] font-black uppercase tracking-widest hover:scale-105 transition-all gap-2 flex items-center ml-4">
                                        <Plus size={14}/> Agregar Insumo
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {formData.ingredients.length === 0 && (
                                        <div style={{ backgroundColor: theme.input, borderColor: theme.border }} className="text-center py-20 rounded-[40px] border border-dashed">
                                            <Beaker size={48} style={{ color: theme.text }} className="mx-auto opacity-30 mb-4" />
                                            <p style={{ color: theme.text }} className="font-black uppercase text-[13px] tracking-widest opacity-50">No hay ingredientes cargados todavía</p>
                                        </div>
                                    )}
                                    {formData.ingredients.map((ing, idx) => (
                                        <div key={idx} style={{ backgroundColor: theme.input }} className="flex gap-4 p-6 rounded-[30px] border border-black/5 hover:shadow-lg transition-all group">
                                            <div className="flex-1 flex items-center gap-4">
                                                <input
                                                    placeholder="Nombre del Insumo"
                                                    value={ing.name}
                                                    onChange={e => {
                                                        const newIngs = [...formData.ingredients];
                                                        newIngs[idx].name = e.target.value;
                                                        setFormData({...formData, ingredients: newIngs});
                                                    }}
                                                    style={{ color: theme.text }}
                                                    className="bg-transparent border-none font-black text-sm w-full outline-none placeholder-black/30"
                                                />
                                                <div className="w-56">
                                                    <select
                                                        value={ing.mep_type}
                                                        onChange={e => {
                                                            const newIngs = [...formData.ingredients];
                                                            newIngs[idx].mep_type = e.target.value;
                                                            setFormData({...formData, ingredients: newIngs});
                                                        }}
                                                        style={{ backgroundColor: theme.bg, color: theme.text }}
                                                        className="border border-black/5 rounded-xl px-4 py-2 text-xs font-black outline-none w-full appearance-none uppercase"
                                                    >
                                                        <option value="POLVOS">MEP POLVOS</option>
                                                        <option value="LIQUIDOS">MEP LÍQUIDOS</option>
                                                        <option value="PRE-FERMENTO">PRE-FERMENTO</option>
                                                        <option value="INGREDIENTE DIRECTO">INGREDIENTE DIRECTO</option>
                                                    </select>
                                                </div>
                                                <div className="w-48 flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        value={ing.qty_per_baston}
                                                        onChange={e => {
                                                            const newIngs = [...formData.ingredients];
                                                            newIngs[idx].qty_per_baston = Number(e.target.value);
                                                            setFormData({...formData, ingredients: newIngs});
                                                        }}
                                                        style={{ backgroundColor: theme.bg, color: theme.text }}
                                                        className="border border-black/5 rounded-l-xl px-4 py-2 font-mono text-center w-full font-black text-sm outline-none"
                                                    />
                                                    <select
                                                        value={ing.unit}
                                                        onChange={e => {
                                                            const newIngs = [...formData.ingredients];
                                                            newIngs[idx].unit = e.target.value;
                                                            setFormData({...formData, ingredients: newIngs});
                                                        }}
                                                        style={{ backgroundColor: theme.bg, color: theme.text }}
                                                        className="border border-black/5 rounded-r-xl px-2 py-2 text-xs font-black outline-none appearance-none"
                                                    >
                                                        <option value="g">g</option>
                                                        <option value="kg">kg</option>
                                                        <option value="ml">ml</option>
                                                        <option value="L">L</option>
                                                        <option value="BASTON">BASTÓN</option>
                                                        <option value="pza">pza</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const newIngs = formData.ingredients.filter((_, i) => i !== idx);
                                                    setFormData({...formData, ingredients: newIngs});
                                                }}
                                                className="p-2 text-gray-700 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={18}/>
                                            </button>
                                        </div>
                                    ))}
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
                                <div className="space-y-6">
                                    <div className="text-center mb-8">
                                        <h3 style={{ color: theme.text }} className="text-3xl font-black tracking-tighter uppercase italic">
                                            5. {formData.dough_type === 'PREFERMENTO' ? 'Masas' : 'Productos'} de <span className="opacity-40">Uso</span>
                                        </h3>
                                        <p style={{ color: theme.text }} className="text-[11px] font-black uppercase tracking-widest mt-2 opacity-50">Traza la cadena de producción industrial</p>
                                    </div>

                                    {/* Buscador de Vínculos */}
                                    <div className="relative group max-w-xl mx-auto">
                                        <Search style={{ color: theme.text }} className="absolute left-5 top-1/2 -translate-y-1/2 opacity-40" size={20} />
                                        <input 
                                            type="text" 
                                            placeholder={`Buscar ${formData.dough_type === 'PREFERMENTO' ? 'masa' : 'producto'} para vincular...`}
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                            style={{ backgroundColor: theme.input, color: theme.text }}
                                            className="w-full border border-black/5 rounded-[30px] py-6 pl-14 pr-6 text-base font-bold focus:shadow-xl transition-all placeholder-black/30"
                                        />
                                        
                                        {searchTerm && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-black/5 rounded-3xl overflow-hidden z-50 shadow-2xl max-h-64 overflow-auto custom-scrollbar">
                                                {(formData.dough_type === 'PREFERMENTO' ? catalog.doughs : catalog.products.filter(p => p.nature === 'MANUFACTURADO'))
                                                    .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()) && item.id !== initialData?.id)
                                                    .map(item => {
                                                        const key = formData.dough_type === 'PREFERMENTO' ? 'dough_relations' : 'product_relations';
                                                        const isSelected = formData[key].some(r => (r.id === item.id || r.related_dough_id === item.id));
                                                        
                                                        return (
                                                            <button 
                                                                key={item.id}
                                                                onClick={() => {
                                                                    if (!isSelected) {
                                                                        if (formData.dough_type === 'PREFERMENTO') {
                                                                            setFormData({...formData, dough_relations: [...formData.dough_relations, { id: item.id, name: item.name, code: item.code, qty_per_baston: 0 }]});
                                                                        } else {
                                                                            setFormData({...formData, product_relations: [...formData.product_relations, { id: item.id, name: item.name, code: item.code, product_id: item.id, grams_per_piece: 0, pieces_per_baston: 0 }]});
                                                                        }
                                                                    } else {
                                                                        setFormData({...formData, [key]: formData[key].filter(r => r.id !== item.id && r.related_dough_id !== item.id)});
                                                                    }
                                                                    setSearchTerm('');
                                                                }}
                                                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-black/5 transition-all text-left border-b border-black/5 last:border-0"
                                                            >
                                                                <div className="flex items-center gap-4">
                                                                    <div style={{ backgroundColor: theme.input, color: theme.text }} className="w-8 h-8 rounded-lg flex items-center justify-center font-black italic text-[10px]">
                                                                        {item.code || 'ID'}
                                                                    </div>
                                                                    <span className="text-xs font-bold text-black uppercase">{item.name}</span>
                                                                </div>
                                                                {isSelected ? <Trash2 size={16} className="text-red-500" /> : <Plus size={16} className="text-black/40" />}
                                                            </button>
                                                        );
                                                    })
                                                }
                                            </div>
                                        )}
                                    </div>

                                    {/* Lista de Vínculos Actuales */}
                                    <div className="grid grid-cols-2 gap-4 mt-8">
                                        {(formData.dough_type === 'PREFERMENTO' ? formData.dough_relations : formData.product_relations).map((item, idx) => {
                                            const isPrefermento = formData.dough_type === 'PREFERMENTO';
                                            const key = isPrefermento ? 'dough_relations' : 'product_relations';

                                            return (
                                                <div key={item.id || item.related_dough_id} style={{ backgroundColor: theme.input }} className="border border-black/5 p-5 rounded-[32px] flex flex-col gap-4 group hover:shadow-lg transition-all">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div style={{ backgroundColor: theme.bg, color: theme.text }} className="w-10 h-10 rounded-xl flex items-center justify-center font-black italic text-xs border border-black/5">
                                                                {item.code || 'ID'}
                                                            </div>
                                                            <span style={{ color: theme.text }} className="text-xs font-black uppercase tracking-tight">{item.name}</span>
                                                        </div>
                                                        <button 
                                                            onClick={() => {
                                                                setFormData({...formData, [key]: formData[key].filter(r => r.id !== item.id && r.related_dough_id !== item.related_dough_id)});
                                                            }}
                                                            style={{ color: theme.text }}
                                                            className="p-2 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-black/5">
                                                        {isPrefermento ? (
                                                            <div className="col-span-2 space-y-1">
                                                                <span style={{ color: theme.text }} className="text-[10px] font-black uppercase tracking-widest pl-1 opacity-50">Consumo (g) / Bastón de {item.name}</span>
                                                                <div style={{ backgroundColor: theme.bg }} className="flex items-center gap-2 border border-black/5 rounded-xl px-3 py-2">
                                                                    <input 
                                                                        type="number"
                                                                        value={item.qty_per_baston || ''}
                                                                        placeholder="0"
                                                                        onChange={e => {
                                                                            const val = Number(e.target.value);
                                                                            const newList = [...formData[key]];
                                                                            newList[idx].qty_per_baston = val;
                                                                            setFormData({...formData, [key]: newList});
                                                                        }}
                                                                        style={{ color: theme.text }}
                                                                        className="bg-transparent text-xs font-mono font-black w-full outline-none text-center placeholder-black/30"
                                                                    />
                                                                    <span style={{ color: theme.text }} className="text-[9px] font-black opacity-40">g</span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className="space-y-1">
                                                                    <span style={{ color: theme.text }} className="text-[10px] font-black uppercase tracking-widest pl-1 opacity-50">Gramaje / Pieza</span>
                                                                    <div style={{ backgroundColor: theme.bg }} className="flex items-center gap-2 border border-black/5 rounded-xl px-3 py-2">
                                                                        <input 
                                                                            type="number"
                                                                            value={item.grams_per_piece || ''}
                                                                            placeholder="0"
                                                                            onChange={e => {
                                                                                const val = Number(e.target.value);
                                                                                const newList = [...formData[key]];
                                                                                newList[idx].grams_per_piece = val;
                                                                                setFormData({...formData, [key]: newList});
                                                                            }}
                                                                            style={{ color: theme.text }}
                                                                            className="bg-transparent text-xs font-mono font-black w-full outline-none text-center placeholder-black/30"
                                                                        />
                                                                        <span style={{ color: theme.text }} className="text-[9px] font-black opacity-40">g</span>
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <span style={{ color: theme.text }} className="text-[10px] font-black uppercase tracking-widest pl-1 opacity-50">Piezas / Bastón</span>
                                                                    <div style={{ backgroundColor: theme.text }} className="rounded-xl px-3 py-2 flex items-center justify-center border border-transparent">
                                                                        <input 
                                                                            type="number"
                                                                            value={item.pieces_per_baston !== undefined ? item.pieces_per_baston : ''}
                                                                            placeholder="0"
                                                                            onChange={e => {
                                                                                const val = Number(e.target.value);
                                                                                const newList = [...formData[key]];
                                                                                newList[idx].pieces_per_baston = val;
                                                                                setFormData({...formData, [key]: newList});
                                                                            }}
                                                                            style={{ color: theme.bg }}
                                                                            className="bg-transparent text-xs font-mono font-black w-full outline-none text-center placeholder-white/50"
                                                                        />
                                                                        <span style={{ color: theme.bg }} className="text-[9px] font-black ml-1 tracking-tighter opacity-60">PZS</span>
                                                                    </div>
                                                                </div>
                                                                
                                                                {/* Resumen de Tandas */}
                                                                {formData.batches.length > 0 && (item.pieces_per_baston > 0) && (
                                                                    <div className="col-span-2 mt-2 bg-black/5 rounded-xl p-3">
                                                                        <span style={{ color: theme.text }} className="text-[9px] font-black uppercase tracking-widest opacity-50 block mb-2">Rendimiento por Tanda Configurada:</span>
                                                                        <div className="grid grid-cols-2 gap-2">
                                                                            {formData.batches.map((b, i) => (
                                                                                <div key={i} className="flex justify-between items-center text-[10px] font-mono font-bold">
                                                                                    <span style={{ color: theme.text }} className="opacity-70">{b.name}:</span>
                                                                                    <span style={{ color: theme.text }}>{Math.floor(item.pieces_per_baston * b.baston_qty)} pza</span>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {(formData.dough_type === 'PREFERMENTO' ? formData.dough_relations : formData.product_relations).length === 0 && (
                                            <div style={{ backgroundColor: theme.input }} className="col-span-2 py-12 border border-dashed border-black/10 rounded-[40px] flex flex-col items-center justify-center opacity-30 select-none">
                                                <Zap size={32} style={{ color: theme.text }} />
                                                <p style={{ color: theme.text }} className="text-[10px] font-black uppercase tracking-widest mt-4">No hay vínculos establecidos</p>
                                            </div>
                                        )}
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

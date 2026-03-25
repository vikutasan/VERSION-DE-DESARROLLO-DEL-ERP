import React, { useState, useEffect } from 'react';
import { securityService } from '../services/securityService';

export const GestionPersonal = ({ onClose, isSection = false }) => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [view, setView] = useState('list'); // 'list' or 'form'
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [profiles, setProfiles] = useState([]);
    const [numpadValue, setNumpadValue] = useState('');
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        employee_code: '',
        role: 'CAJERO',
        profile_id: null
    });

    useEffect(() => {
        loadEmployees();
    }, []);

    const loadEmployees = async () => {
        setLoading(true);
        try {
            const [empData, profData] = await Promise.all([
                securityService.listEmployees(),
                securityService.listProfiles()
            ]);
            setEmployees(empData);
            setProfiles(profData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenForm = (emp = null) => {
        if (emp) {
            setEditingEmployee(emp);
            setFormData({
                name: emp.name,
                employee_code: emp.employee_code,
                role: emp.role,
                profile_id: emp.profile_id
            });
            setNumpadValue(emp.employee_code);
        } else {
            setEditingEmployee(null);
            setFormData({ name: '', employee_code: '', role: 'CAJERO', profile_id: null });
            setNumpadValue('');
        }
        setView('form');
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError(null);
        
        const payload = {
            ...formData,
            employee_code: numpadValue
        };

        if (!payload.name || !payload.employee_code) {
            setError("Nombre y PIN son obligatorios");
            return;
        }

        try {
            if (editingEmployee) {
                await securityService.updateEmployee(editingEmployee.id, payload);
            } else {
                await securityService.createEmployee(payload);
            }
            setView('list');
            loadEmployees();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeactivate = async (id) => {
        if (!window.confirm("¿Seguro que deseas desactivar este colaborador? No podrá loguearse más.")) return;
        try {
            await securityService.deactivateEmployee(id);
            loadEmployees();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleNumpad = (val) => {
        if (numpadValue.length >= 6 && val !== 'C') return;
        if (val === 'C') {
            setNumpadValue('');
        } else {
            setNumpadValue(prev => prev + val);
        }
    };
    
    const containerClasses = isSection 
        ? "bg-[#1a1a1a] w-full h-[700px] rounded-[50px] border border-white/10 shadow-2xl overflow-hidden flex flex-col"
        : "fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-xl animate-in fade-in duration-300";

    const modalClasses = isSection
        ? "w-full h-full flex flex-col"
        : "bg-[#1a1a1a] w-[800px] h-[600px] rounded-[50px] border border-white/10 shadow-[0_0_100px_rgba(193,215,46,0.1)] overflow-hidden flex flex-col";

    return (
        <div className={containerClasses}>
            <div className={modalClasses}>
                
                {/* Header Subordinado */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
                    <div>
                        <h2 className="text-xl font-black uppercase italic tracking-tighter text-white/90">
                            GESTOR DE <span className="text-[#c1d72e]/80">CLAVES DE ACCESO</span>
                        </h2>
                        <p className="text-[8px] font-bold text-gray-600 uppercase tracking-[0.4em] mt-0.5 italic">
                            Administración de Accesos y Claves
                        </p>
                    </div>
                    {!isSection && (
                        <button onClick={onClose} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-2xl hover:bg-red-500/20 hover:text-red-500 transition-all">✕</button>
                    )}
                </div>

                <div className="flex-1 overflow-hidden flex p-8 gap-8">
                    {view === 'list' ? (
                        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                            <div className="flex justify-between items-center bg-white/5 p-4 rounded-3xl border border-white/10">
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#c1d72e]">Colaboradores Activos</span>
                                <button 
                                    onClick={() => handleOpenForm()}
                                    className="bg-[#c1d72e] text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                                >
                                    + Nuevo Colaborador
                                </button>
                            </div>

                            {error && <div className="bg-red-500/20 text-red-500 p-4 rounded-2xl text-[10px] font-bold uppercase">{error}</div>}

                            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                {loading ? (
                                    <div className="h-full flex items-center justify-center text-[#c1d72e] animate-pulse">Cargando Colaboradores...</div>
                                ) : employees.map(emp => (
                                    <div key={emp.id} className="bg-white/5 border border-white/5 p-5 rounded-[30px] flex items-center justify-between group hover:border-[#c1d72e]/30 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl">👤</div>
                                            <div>
                                                <p className="text-sm font-black text-white uppercase">{emp.name}</p>
                                                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                                                    Rol: <span className="text-orange-500">{emp.role}</span> | PIN: ****
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleOpenForm(emp)}
                                                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#c1d72e] hover:text-black transition-all"
                                            >
                                                ✎
                                            </button>
                                            <button 
                                                onClick={() => handleDeactivate(emp.id)}
                                                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-500/20 hover:text-red-500 transition-all"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex gap-8 animate-in slide-in-from-right-8 duration-500">
                            {/* Left: Form */}
                            <div className="flex-1 space-y-6">
                                <div className="space-y-4">
                                    <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest block px-2">Nombre Completo</label>
                                    <input 
                                        type="text" 
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm font-bold focus:border-[#c1d72e] outline-none transition-all"
                                        placeholder="Ej. Juan Pérez"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest block px-2">Perfil Asignado</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {profiles.map(p => (
                                            <button 
                                                key={p.id}
                                                type="button"
                                                onClick={() => setFormData({...formData, role: p.name, profile_id: p.id})}
                                                className={`py-3 px-4 rounded-2xl text-[8px] font-black uppercase tracking-widest border transition-all truncate ${formData.profile_id === p.id || (formData.role === p.name && !formData.profile_id) ? 'bg-[#c1d72e] border-[#c1d72e] text-black shadow-lg shadow-[#c1d72e]/20' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}
                                            >
                                                {p.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-8 flex gap-4">
                                    <button 
                                        onClick={() => setView('list')}
                                        className="flex-1 py-4 rounded-2xl border border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-white/5 transition-all text-gray-500"
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        onClick={handleSave}
                                        className="flex-[2] py-4 rounded-2xl bg-[#c1d72e] text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#c1d72e]/10"
                                    >
                                        {editingEmployee ? 'Actualizar Datos' : 'Registrar Colaborador'}
                                    </button>
                                </div>

                                {error && <div className="bg-red-500/20 text-red-500 p-4 rounded-2xl text-[10px] font-bold uppercase">{error}</div>}
                            </div>

                            {/* Right: Numpad for PIN */}
                            <div className="w-[280px] bg-black/40 rounded-[40px] border border-white/5 p-6 flex flex-col gap-4">
                                <label className="text-[9px] font-black uppercase text-[#c1d72e] tracking-widest text-center mt-2">Asignar PIN de Acceso</label>
                                <div className="bg-white/10 rounded-2xl h-16 flex items-center justify-center text-2xl font-black font-mono tracking-[0.5em] text-white overflow-hidden">
                                    {numpadValue.split('').map(() => '•').join('') || <span className="text-white/10 text-sm">____</span>}
                                </div>
                                <div className="grid grid-cols-3 gap-2 flex-1">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0].map(val => (
                                        <button 
                                            key={val}
                                            onClick={() => handleNumpad(val)}
                                            className={`h-14 rounded-2xl flex items-center justify-center text-lg font-black transition-all ${val === 'C' ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-white/5 text-white hover:bg-white/10'}`}
                                        >
                                            {val}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-[8px] text-gray-600 text-center font-bold uppercase p-2">Este PIN será solicitado al iniciar turno</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

import React, { useState } from 'react';
import { terminals } from '../utils/posConstants';
import { posService } from '../services/POSService';

export const TerminalSelector = ({ currentUser, terminalStatuses, setTerminalStatuses, onTerminalSelected }) => {
    const [unlockingTerminal, setUnlockingTerminal] = useState(null);
    const [deniedModal, setDeniedModal] = useState(null);

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-20 animate-in fade-in zoom-in-95 duration-700">
            <div className="text-center mb-16">
                <h3 className="text-orange-500 font-black uppercase tracking-[0.5em] text-xs mb-4">Configuracion de Estacion</h3>
                <h2 className="text-6xl font-black uppercase tracking-tighter italic">Selecciona tu <span className="text-white/20">Terminal</span></h2>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-8 max-w-7xl w-full">
                {terminals.map(t => {
                    const isOccupied = terminalStatuses[t.id];
                    const isMine = isOccupied && isOccupied.occupier_id === currentUser?.id;
                    const lockedByOther = isOccupied && !isMine;

                    return (
                        <button 
                            key={t.id} 
                            onClick={async () => {
                                if (lockedByOther) {
                                    const userRole = (currentUser?.role || '').toString().trim().toUpperCase();
                                    const isAdmin = userRole === 'ADMIN';
                                    
                                    // Nuevo: Verificar permiso dinámico desde el perfil
                                    const hasUnlockPermission = currentUser?.permissions?.pos_force_unlock === 'full';
                                    
                                    console.log("Terminal Unlock Attempt:", {
                                        terminal: t.id,
                                        user: currentUser?.name,
                                        role: userRole,
                                        isAdmin,
                                        hasUnlockPermission,
                                        isCashRegister: isOccupied.is_cash_register
                                    });

                                    // 1. Caso: Terminal de CAJA (Granular: Solo con permiso especial)
                                    const isCashTerminal = t.id === 'CAJA' || isOccupied.is_cash_register === true;
                                    const hasCashForcePermission = currentUser?.permissions?.pos_force_cash_unlock === 'full';

                                    if (isCashTerminal && !hasCashForcePermission) {
                                        setDeniedModal({
                                            title: "SISTEMA DE SEGURIDAD FINANCIERA",
                                            message: "Esta terminal es una CAJA activa.\n\nPor seguridad extrema, el desbloqueo forzado de cajas está RESTRINGIDO en tu perfil actual."
                                        });
                                        return;
                                    }

                                    // 2. Caso: Terminal de venta normal o Usuario con permisos (Normal o Especial si es Caja)
                                    if (isAdmin || hasUnlockPermission || (isCashTerminal && hasCashForcePermission)) {
                                        setUnlockingTerminal({ 
                                            id: t.id, 
                                            occupier: isOccupied.occupier_name, 
                                            is_cash: isOccupied.is_cash_register 
                                        });
                                    } else {
                                        // DEBUG: Mostrar por qué se deniega acceso
                                        console.warn("Access Denied Details:", {
                                            role: userRole,
                                            permissions: currentUser?.permissions,
                                            hasKey: !!currentUser?.permissions?.pos_force_unlock,
                                            keyValue: currentUser?.permissions?.pos_force_unlock
                                        });

                                        setDeniedModal({
                                            title: "PERMISOS INSUFICIENTES",
                                            message: `Esta terminal está ocupada por ${isOccupied.occupier_name}.\n\nPara liberarla, solicita el apoyo de tu Gerente o Administrador.`
                                        });
                                    }
                                    return;
                                }
                                
                                try {
                                    await posService.lockTerminal(t.id, currentUser.id, currentUser.name);
                                    onTerminalSelected(t.id);
                                } catch (e) {
                                    setDeniedModal({ title: "ERROR", message: e.message });
                                }
                            }} 
                            className={`group relative transition-all duration-500 rounded-[40px] border flex flex-col items-center shadow-2xl overflow-hidden
                            ${lockedByOther 
                                ? 'cursor-not-allowed border-red-500/60 bg-[#1a0808]' 
                                : 'p-10 gap-6 bg-black/20 hover:bg-orange-600 border-white/5 hover:border-orange-400 hover:scale-110'}`}>
                            
                            {lockedByOther ? (
                                <div className="w-full flex flex-col relative">
                                    <div className="bg-red-900/60 px-4 py-2 flex items-center justify-between">
                                        <span className="text-white font-black text-sm uppercase tracking-widest">
                                            {t.name === 'CAJA' ? 'CAJA' : `T${t.name.split(' ')[1]}`}
                                        </span>
                                        <span className="text-[9px] font-black uppercase tracking-wider bg-red-600 text-white px-2 py-0.5 rounded-full">
                                            {isOccupied.is_cash_register ? 'EN CAJA' : 'OCUPADA'}
                                        </span>
                                    </div>
                                    <div className="px-4 py-5 flex flex-col items-center gap-3">
                                        <span className="text-5xl">🔒</span>
                                        <div className="text-center">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-1">En uso por</p>
                                            <p className="text-white font-black text-base uppercase leading-tight">
                                                {isOccupied.occupier_name}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="w-24 h-24 flex items-center justify-center bg-white/5 group-hover:bg-white/20 rounded-3xl transition-colors">
                                        {t.icon.endsWith('.png') ? <img src={t.icon} alt={t.name} className="w-16 h-16 object-contain" /> : <span className="text-4xl">{t.icon}</span>}
                                    </div>
                                    <div className="text-center">
                                        <span className="block text-2xl font-black italic uppercase group-hover:text-white transition-colors">
                                            {t.name === 'CAJA' ? 'CAJA' : t.name.split(' ')[1]}
                                        </span>
                                        <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest group-hover:text-orange-200">
                                            {t.name === 'CAJA' ? 'Cajero Central' : 'Punto de Venta'}
                                        </span>
                                    </div>
                                </>
                            )}
                        </button>
                    );
                })}
            </div>
            
            {unlockingTerminal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] animate-in fade-in duration-300">
                    <div className="bg-gray-900 border border-white/10 p-8 rounded-[40px] shadow-[0_0_50px_rgba(255,100,0,0.2)] max-w-sm w-full text-center relative overflow-hidden">
                        <div className="absolute -top-20 -left-20 w-40 h-40 bg-red-600/20 blur-3xl rounded-full"></div>
                        <div className="text-6xl mb-4 relative z-10">⚠️</div>
                        <h2 className="text-xl font-black uppercase text-white mb-2 relative z-10">FORZAR LIBERACION</h2>
                        <p className="text-sm font-bold text-gray-400 mb-6 relative z-10">
                            La terminal está actualmente ocupada por <span className="text-orange-400">{unlockingTerminal.occupier}</span>.<br/><br/>¿Estás seguro que deseas romper su sesión y liberarla para el equipo?
                        </p>
                        <div className="flex gap-4 relative z-10">
                            <button 
                                onClick={() => setUnlockingTerminal(null)}
                                className="flex-1 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 font-bold uppercase text-[10px] tracking-widest transition-all"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={async () => {
                                    try {
                                        await posService.forceUnlockTerminal(unlockingTerminal.id);
                                        const data = await posService.getTerminalsStatus();
                                        setTerminalStatuses(data);
                                        setUnlockingTerminal(null);
                                    } catch(e) {
                                        console.error(e);
                                    }
                                }}
                                className="flex-1 py-3 rounded-2xl bg-red-600/80 hover:bg-red-500 border border-red-500/50 font-black uppercase text-[10px] tracking-widest text-white shadow-lg transition-all shadow-red-500/20"
                            >
                                SÍ, FORZAR
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {deniedModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] animate-in fade-in duration-300">
                    <div className="bg-gray-900 border border-white/10 p-8 rounded-[40px] shadow-[0_0_50px_rgba(255,0,0,0.2)] max-w-sm w-full text-center relative overflow-hidden">
                        <div className="absolute -top-20 -left-20 w-40 h-40 bg-red-600/20 blur-3xl rounded-full"></div>
                        <div className="text-6xl mb-4 relative z-10">❌</div>
                        <h2 className="text-xl font-black uppercase text-red-500 mb-3 relative z-10">{deniedModal.title}</h2>
                        <p className="text-xs font-bold text-gray-400 mb-4 relative z-10 whitespace-pre-wrap leading-relaxed">
                            {deniedModal.message}
                        </p>

                        {/* Debug Info para Soporte Técnico (Solo visible si no es admin y falla) */}
                        {currentUser?.role !== 'ADMIN' && (
                            <div className="bg-black/40 p-4 rounded-2xl mb-6 text-[8px] font-mono text-gray-600 text-left border border-white/5 relative z-10">
                                <p className="mb-1 text-orange-500/50 uppercase font-black tracking-widest">Diagnostic Info:</p>
                                <p>Role: {currentUser?.role}</p>
                                <p>Unlock Perm: {String(currentUser?.permissions?.pos_force_unlock)}</p>
                                <p>Permissions Keys: {Object.keys(currentUser?.permissions || {}).join(', ')}</p>
                            </div>
                        )}

                        <div className="flex justify-center relative z-10">
                            <button 
                                onClick={() => setDeniedModal(null)}
                                className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 font-black uppercase text-[10px] tracking-widest text-white transition-all shadow-lg"
                            >
                                ENTENDIDO
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

import React, { useState } from 'react';

export const SalesReceipt = ({ cart, removeFromCart, updateQuantity, total, currentAccountNum, selectedTerminal, handleCheckout, handleHoldAccount, cashEnabled = false }) => {
    const [editMode, setEditMode] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [editInputValue, setEditInputValue] = useState('');

    const handleQuantityClick = (item) => {
        setEditingItem(item);
        setEditInputValue(item.quantity?.toString() || '1');
        setEditMode(true);
    };

    const handleEditNumberClick = (num) => {
        setEditInputValue(prev => {
            if (prev === '0' || prev === '') return num.toString();
            return prev + num;
        });
    };

    const handleEditClear = () => setEditInputValue('');

    const handleEditConfirm = () => {
        const newQty = parseInt(editInputValue, 10);
        if (!isNaN(newQty) && newQty > 0) {
            updateQuantity(editingItem.id, newQty);
        } else if (newQty === 0) {
            removeFromCart(editingItem.id);
        }
        setEditMode(false);
        setEditingItem(null);
    };

    const handleEditCancel = () => {
        setEditMode(false);
        setEditingItem(null);
    };

    return (
        <div className="w-[420px] bg-[#fdfbf7] px-6 pt-6 pb-6 flex flex-col shadow-2xl relative border-l border-black/10 overflow-visible transition-all duration-500 text-black font-mono z-50">
            <div className="absolute top-[-14px] left-0 right-0 w-full overflow-hidden" style={{ height: '14px' }}>
                <svg viewBox="0 0 420 14" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <path d="M0,14 L10,0 L20,14 L30,0 L40,14 L50,0 L60,14 L70,0 L80,14 L90,0 L100,14 L110,0 L120,14 L130,0 L140,14 L150,0 L160,14 L170,0 L180,14 L190,0 L200,14 L210,0 L220,14 L230,0 L240,14 L250,0 L260,14 L270,0 L280,14 L290,0 L300,14 L310,0 L320,14 L330,0 L340,14 L350,0 L360,14 L370,0 L380,14 L390,0 L400,14 L410,0 L420,14 Z" fill="#fdfbf7" />
                </svg>
            </div>

            <div className="flex justify-between items-start border-b-[1.5px] border-dashed border-gray-400 pb-3 mb-2 -mt-4">
                <div className="flex items-start gap-3">
                    <img src="/assets/logo.png" alt="R de Rico Logo" className="w-16 h-16 object-contain grayscale opacity-80 -mt-2" />
                    <div className="flex flex-col justify-center pt-1">
                        <h2 className="text-base font-black uppercase tracking-widest leading-none text-black">R DE RICO</h2>
                        <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-1">Ticket de Venta</h3>
                    </div>
                </div>
                <div className="flex flex-col items-end justify-center text-xs text-gray-500 pt-1">
                    <p className="leading-none mb-1 font-black">Term {selectedTerminal || '01'}</p>
                    <p className="leading-none">{new Date().toLocaleDateString()}</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                <div className="flex justify-between text-xs text-gray-600 font-black border-b-2 border-black/20 pb-2 mb-3 uppercase tracking-wider">
                    <span>Cant. - Articulo</span>
                    <span>Importe</span>
                </div>
                {cart.map((item) => (
                    <div key={item.id} className="flex flex-col group animate-in slide-in-from-right-4 duration-300">
                        <div className="flex justify-between items-start">
                            <div className="flex gap-3 w-3/4">
                                <div 
                                    onClick={() => handleQuantityClick(item)}
                                    className="font-black min-w-[40px] text-right text-3xl leading-none cursor-pointer hover:text-orange-500 hover:scale-110 active:scale-95 transition-all outline-none"
                                    title="Modificar cantidad"
                                >
                                    {item.quantity || 1}x
                                </div>
                                <div>
                                    <p className="font-black text-lg uppercase leading-tight text-gray-900">{item.name}</p>
                                    <p className="text-base text-gray-500 uppercase">${(item.price || 0).toFixed(2)} c/u</p>
                                </div>
                            </div>
                            <div className="text-right flex flex-col items-end">
                                <p className="font-black text-2xl">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-[9px] text-red-500 font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity mt-1 hover:underline"
                                >
                                    [ Quitar ]
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {cart.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                        <p className="font-mono text-xs uppercase text-center border-2 border-dashed border-gray-300 p-4 w-full">★ El ticket esta vacio ★</p>
                    </div>
                )}
            </div>

            <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-400 space-y-4">
                <button 
                    onClick={() => cashEnabled && handleCheckout()}
                    disabled={!cashEnabled}
                    title={!cashEnabled ? 'Presione "🏦 CAJA" para habilitar el cobro' : ''}
                    className={`w-full group relative overflow-hidden p-4 rounded-[30px] border-2 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.2)] ${
                        cashEnabled
                            ? 'bg-black border-black hover:scale-[1.02] active:scale-95 cursor-pointer'
                            : 'bg-gray-300 border-gray-400 cursor-not-allowed opacity-60'
                    }`}
                >
                    <div className="flex justify-between items-center relative z-10 px-1">
                        <div className="text-left">
                            <span className={`block text-[8px] font-black uppercase tracking-[0.3em] mb-0.5 ${
                                cashEnabled ? 'text-[#c1d72e]' : 'text-gray-500'
                            }`}>
                                {cashEnabled ? 'Total a Pagar' : 'Caja no habilitada'}
                            </span>
                            <span className={`block text-2xl font-black italic tracking-tighter ${
                                cashEnabled ? 'text-white' : 'text-gray-500'
                            }`}>COBRAR</span>
                        </div>
                        <span className={`text-3xl font-black tracking-tighter ${
                            cashEnabled ? 'text-[#c1d72e]' : 'text-gray-500'
                        }`}>${total.toFixed(2)}</span>
                    </div>
                    {/* Glow effect — solo cuando está activo */}
                    {cashEnabled && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    )}
                </button>

                <div className="flex flex-col gap-3">
                    <button 
                        onClick={handleHoldAccount}
                        className="w-full bg-[#c1d72e] border-2 border-black hover:bg-black hover:text-[#c1d72e] p-6 flex flex-col items-center justify-center transition-all active:scale-95 group shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-[2px_2px_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] relative overflow-hidden">
                        <div className="flex items-center gap-4">
                            <span className="text-3xl grayscale group-hover:grayscale-0 animate-bounce">📌</span>
                            <div className="text-left">
                                <span className="block text-[14px] font-black uppercase tracking-tighter leading-none">ABRIR NUEVA CUENTA</span>
                                <span className="block text-[8px] font-bold text-black/40 group-hover:text-[#c1d72e]/40 uppercase tracking-widest mt-1">Enviar ticket al pizarron central</span>
                            </div>
                        </div>
                        <div className="absolute right-[-10px] bottom-[-10px] text-6xl opacity-10 group-hover:opacity-20 transition-opacity">
                            🛒
                        </div>
                    </button>
                </div>
            </div>

            {/* Modal de Edición de Cantidad */}
            {editMode && editingItem && (
                <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', zIndex: 99999 }} className="flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-[#1a1a1a] p-8 rounded-[30px] shadow-[0_0_100px_rgba(249,115,22,0.1)] border border-white/10 flex flex-col items-center w-[400px] animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <h3 className="text-white text-lg font-black uppercase tracking-widest mb-1 text-center">Modificar Cantidad</h3>
                        <p className="text-orange-500 font-bold text-xl uppercase mb-6 text-center">{editingItem.name}</p>
                        
                        <div className="w-full bg-white text-black p-4 rounded-2xl text-5xl font-black text-right shadow-inner min-h-[80px] flex items-center justify-end mb-6">
                            {editInputValue || '0'}
                        </div>

                        <div className="grid grid-cols-3 gap-3 w-full mb-6">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, 'OK'].map((key) => (
                                <button
                                    key={key}
                                    onClick={() => {
                                        if (key === 'C') handleEditClear();
                                        else if (key === 'OK') handleEditConfirm();
                                        else handleEditNumberClick(key);
                                    }}
                                    className={`h-16 rounded-2xl text-2xl font-black transition-all active:scale-95 flex items-center justify-center 
                                        ${key === 'OK' ? 'bg-[#c1d72e] text-black shadow-[0_0_15px_rgba(193,215,46,0.5)]' : 
                                          key === 'C' ? 'bg-red-500/20 text-red-500 hover:bg-red-500/40 text-xl' : 
                                          'bg-white/5 border border-white/10 text-white hover:bg-white/20'}`}
                                >
                                    {key}
                                </button>
                            ))}
                        </div>
                        
                        <button 
                            onClick={handleEditCancel}
                            className="w-full py-4 text-gray-500 hover:text-white uppercase tracking-widest font-black text-xs transition-colors"
                        >
                            [ Cancelar ]
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

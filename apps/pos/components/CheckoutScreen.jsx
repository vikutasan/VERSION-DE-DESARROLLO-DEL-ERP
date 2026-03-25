import React, { useState, useEffect } from 'react';

export const CheckoutScreen = ({ total, onConfirm, onClose, onFinish, onPrint }) => {
    const [payments, setPayments] = useState([]);
    const [receivedAmount, setReceivedAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('EFECTIVO');
    const [cardType, setCardType] = useState('DEBITO'); // DEBITO, CREDITO, QR
    const [isLiquidado, setIsLiquidado] = useState(false);
    const [editingPaymentId, setEditingPaymentId] = useState(null);
    const [tempEditValue, setTempEditValue] = useState('');
    
    const totalPaid = payments.reduce((acc, p) => acc + p.amount, 0);
    const pendingAmount = Math.max(0, total - totalPaid);
    const change = Math.max(0, (parseFloat(receivedAmount) || 0) + totalPaid - total);

    const handleNumberClick = (num) => {
        if (receivedAmount.includes('.') && num === '.') return;
        setReceivedAmount(prev => prev + num);
    };

    const handleClear = () => setReceivedAmount('');

    const handleAddPayment = () => {
        if (isLiquidado) return;
        const amount = parseFloat(receivedAmount);
        if (!amount || amount <= 0) return;

        const newPayment = {
            method: paymentMethod,
            amount: Math.min(amount, pendingAmount + change), 
            displayAmount: amount,
            type: paymentMethod === 'TARJETA' ? cardType : null,
            id: Date.now()
        };

        if (paymentMethod === 'EFECTIVO') {
            const realAbono = Math.min(amount, pendingAmount);
            const cambioEntregado = Math.max(0, amount - realAbono);
            setPayments([...payments, { 
                ...newPayment, 
                amount: realAbono,
                received: amount,
                cambio: cambioEntregado
            }]);
        } else {
            setPayments([...payments, { ...newPayment, amount: Math.min(amount, pendingAmount) }]);
        }
        
        setReceivedAmount('');
    };

    const handleDeletePayment = (id) => {
        if (isLiquidado) return;
        setPayments(payments.filter(p => p.id !== id));
        if (editingPaymentId === id) setEditingPaymentId(null);
    };

    const handleStartEdit = (p) => {
        if (isLiquidado) return;
        setEditingPaymentId(p.id);
        setTempEditValue(p.amount.toString());
    };

    const handleSaveEdit = (id) => {
        const newVal = parseFloat(tempEditValue);
        if (isNaN(newVal) || newVal < 0) {
            setEditingPaymentId(null);
            return;
        }

        setPayments(payments.map(p => {
            if (p.id === id) {
                const realReceived = p.received || p.amount;
                const newAbono = Math.min(newVal, realReceived);
                return {
                    ...p,
                    amount: newAbono,
                    cambio: Math.max(0, realReceived - newAbono)
                };
            }
            return p;
        }));
        setEditingPaymentId(null);
    };

    const handleFinalize = async () => {
        if (isLiquidado) return;
        
        let finalPayments = [...payments];
        const entered = parseFloat(receivedAmount) || 0;
        const currentPending = Math.max(0, total - finalPayments.reduce((s, p) => s + p.amount, 0));
        
        if (currentPending > 0 && entered > 0) {
            const realAbono = Math.min(entered, currentPending);
            finalPayments = [...finalPayments, {
                method: paymentMethod,
                amount: realAbono,
                received: entered,
                cambio: Math.max(0, entered - realAbono),
                displayAmount: entered,
                type: paymentMethod === 'TARJETA' ? cardType : null,
                id: Date.now()
            }];
        }
        
        const totalFinalPaid = finalPayments.reduce((s, p) => s + p.amount, 0);
        
        if (totalFinalPaid >= total) {
            try {
                await onConfirm(finalPayments);
                setIsLiquidado(true);
            } catch (error) {
                console.error("Error liquidando:", error);
                alert("Hubo un error al liquidar la cuenta. Intente de nuevo.");
            }
        } else {
            alert('Aún queda saldo pendiente por cubrir.');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="bg-[#1a1a1a] w-[800px] rounded-[50px] border border-white/10 shadow-[0_0_100px_rgba(193,215,46,0.1)] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
                    <div>
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">SUITE DE <span className="text-[#c1d72e]">COBRO</span></h2>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] mt-1 italic">Gestión de Pagos Mixtos</p>
                    </div>
                    <button onClick={isLiquidado ? onFinish : onClose} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-2xl hover:bg-red-500/20 hover:text-red-500 transition-all">✕</button>
                </div>

                <div className="flex flex-row flex-1 overflow-hidden">
                    {/* Left Panel: Payment Entry */}
                    <div className="w-1/2 p-10 border-r border-white/5 space-y-6">
                        {/* Status Display */}
                        <div className="flex flex-col bg-black/40 p-5 rounded-3xl border border-white/5">
                            <div className="flex justify-between items-center opacity-50 mb-1">
                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Total Original</span>
                                <span className="text-sm font-bold font-mono">${total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black uppercase text-[#c1d72e] tracking-widest">Saldo Pendiente</span>
                                <span className="text-4xl font-black text-[#c1d72e] font-mono tracking-tighter">${pendingAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Method Selector */}
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={() => setPaymentMethod('EFECTIVO')}
                                className={`py-4 rounded-2xl border-2 transition-all flex items-center justify-center gap-3 ${paymentMethod === 'EFECTIVO' ? 'border-[#c1d72e] bg-[#c1d72e]/10 text-[#c1d72e]' : 'border-white/5 bg-white/5 text-gray-400'}`}
                            >
                                <span className="text-xl">💵</span>
                                <span className="text-[9px] font-black uppercase tracking-widest">Efectivo</span>
                            </button>
                            <button 
                                onClick={() => setPaymentMethod('TARJETA')}
                                className={`py-4 rounded-2xl border-2 transition-all flex items-center justify-center gap-3 ${paymentMethod === 'TARJETA' ? 'border-orange-500 bg-orange-500/10 text-orange-500' : 'border-white/5 bg-white/5 text-gray-400'}`}
                            >
                                <span className="text-xl">💳</span>
                                <span className="text-[9px] font-black uppercase tracking-widest">Tarjeta</span>
                            </button>
                        </div>

                        {paymentMethod === 'TARJETA' && (
                            <div className="grid grid-cols-3 gap-2 animate-in fade-in zoom-in-95 duration-300">
                                {['DEBITO', 'CREDITO', 'QR'].map(t => (
                                    <button 
                                        key={t}
                                        onClick={() => setCardType(t)}
                                        className={`py-2 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all ${cardType === t ? 'bg-orange-500 text-black border-orange-500 shadow-lg shadow-orange-500/20' : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/20'}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input Area */}
                        <div className="space-y-4">
                            <div className="bg-white text-black p-4 rounded-2xl text-4xl font-black text-right shadow-inner min-h-[70px] flex flex-col justify-center relative">
                                <span className="text-[8px] absolute top-2 left-3 font-black uppercase text-gray-400">Importe a Recibir</span>
                                {receivedAmount ? `$${receivedAmount}` : '$0.00'}
                            </div>

                            <div className="flex gap-2">
                                <div className="grid grid-cols-3 gap-2 flex-grow">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0].map((num) => (
                                        <button 
                                            key={num}
                                            disabled={isLiquidado}
                                            onClick={() => handleNumberClick(num.toString())}
                                            className={`h-12 rounded-xl border text-lg font-black transition-all ${isLiquidado ? 'bg-white/5 border-white/5 text-gray-700 cursor-not-allowed' : 'bg-white/5 border-white/10 hover:bg-white/10 active:scale-90 text-white'}`}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                    <button disabled={isLiquidado} onClick={handleClear} className={`h-12 rounded-xl text-[10px] font-black uppercase transition-all ${isLiquidado ? 'bg-red-500/5 text-red-500/20 cursor-not-allowed' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'}`}>C</button>
                                </div>
                                
                                <button 
                                    disabled={!receivedAmount || pendingAmount <= 0 || isLiquidado}
                                    onClick={handleAddPayment}
                                    className={`w-24 rounded-xl border transition-all flex flex-col items-center justify-center gap-1 active:scale-95 ${(!receivedAmount || pendingAmount <= 0 || isLiquidado) ? 'bg-white/5 border-white/5 text-gray-700 cursor-not-allowed' : 'bg-white/5 border-white/10 hover:bg-white/10 text-white shadow-xl'}`}
                                >
                                    <span className={`text-2xl mb-0.5 ${(!receivedAmount || pendingAmount <= 0 || isLiquidado) ? 'opacity-20' : 'opacity-100'}`}>➕</span>
                                    <div className="flex flex-col items-center leading-none">
                                        <span className="text-[12px] font-black uppercase tracking-tighter">Abonar</span>
                                        <span className="text-[12px] font-black uppercase tracking-tighter">Pago</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Payments List */}
                    <div className="w-1/2 p-10 bg-black/10 flex flex-col">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500 mb-8 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                            Resumen de Pagos
                        </h3>

                        <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2">
                            {payments.map(p => (
                                <div key={p.id} className="bg-white/5 border border-white/10 p-8 rounded-[30px] flex justify-between items-center group relative overflow-hidden animate-in slide-in-from-right-4 duration-300">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-[13px] font-black uppercase text-white tracking-tight">{p.method} {p.type && `(${p.type})`}</p>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#c1d72e]"></span>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Procesado</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        {!isLiquidado && (
                                            <button 
                                                onClick={() => handleDeletePayment(p.id)}
                                                className="w-10 h-10 flex items-center justify-center text-[16px] text-white/40 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all"
                                                title="Eliminar abono"
                                            >
                                                ✕
                                            </button>
                                        )}
                                        {p.method === 'EFECTIVO' ? (
                                            <div className="flex flex-col items-end leading-[1.2]">
                                                <div className="flex items-center gap-2 justify-end w-full">
                                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">Recibo</span>
                                                    <span className="text-[14px] font-black text-white/80 font-mono">${p.received.toFixed(2)}</span>
                                                </div>
                                                <div className="flex items-center gap-2 justify-end w-full mt-2 group/edit">
                                                    <span className="text-[11px] font-black text-[#c1d72e] uppercase tracking-tighter">Abona</span>
                                                    {editingPaymentId === p.id ? (
                                                        <input 
                                                            type="number"
                                                            autoFocus
                                                            className="w-28 bg-white/10 border border-[#c1d72e] text-2xl font-black text-[#c1d72e] font-mono rounded px-2 outline-none"
                                                            value={tempEditValue}
                                                            onChange={(e) => setTempEditValue(e.target.value)}
                                                            onBlur={() => handleSaveEdit(p.id)}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(p.id)}
                                                        />
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-3xl font-black text-[#c1d72e] font-mono tracking-tight">${p.amount.toFixed(2)}</span>
                                                            {!isLiquidado && (
                                                                <button 
                                                                    onClick={() => handleStartEdit(p)}
                                                                    className="p-1.5 opacity-0 group-hover/edit:opacity-100 text-white/40 hover:text-[#c1d72e] transition-all"
                                                                    title="Editar abono"
                                                                >
                                                                    ✏️
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 justify-end w-full mt-2">
                                                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-tighter">Cambio</span>
                                                    <span className="text-[14px] font-black text-orange-400 font-mono">${p.cambio.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <span className="text-[11px] font-black text-[#c1d72e] uppercase tracking-tighter">Abona</span>
                                                <span className="text-3xl font-black text-[#c1d72e] font-mono tracking-tight">${p.amount.toFixed(2)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {payments.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-gray-700 text-center px-4">
                                    <span className="text-4xl mb-4 opacity-10">🎫</span>
                                    <p className="text-[9px] font-black uppercase tracking-widest opacity-30 italic leading-relaxed">No hay abonos registrados para esta cuenta</p>
                                </div>
                            )}
                        </div>

                        {change > 0 && (
                            <div className="mt-4 p-4 bg-[#c1d72e] rounded-2xl animate-in zoom-in-95 duration-300">
                                <div className="flex justify-between items-center">
                                    <span className="text-[9px] font-black uppercase text-black/60 tracking-widest">Cambio a entregar</span>
                                    <span className="text-xl font-black text-black font-mono">-${change.toFixed(2)}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Action */}
                <div className="p-8 bg-black/40 border-t border-white/5 flex gap-4">
                    {!isLiquidado ? (
                        <button 
                            onClick={handleFinalize}
                            className={`flex-1 py-5 rounded-[25px] text-lg font-black uppercase italic tracking-tighter transition-all shadow-2xl active:scale-95 ${pendingAmount <= 0 || (receivedAmount && parseFloat(receivedAmount) >= pendingAmount) ? 'bg-[#c1d72e] text-black shadow-[#c1d72e]/20' : 'bg-gray-800 text-gray-500 grayscale cursor-not-allowed'}`}
                        >
                            {pendingAmount <= 0 ? 'Liquidar Cuenta' : 'Liquidar Cuenta'}
                        </button>
                    ) : (
                        <div className="flex-1 flex gap-4 animate-in slide-in-from-bottom-4 duration-500">
                            <button 
                                onClick={onFinish}
                                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-black py-5 rounded-[25px] text-xs uppercase tracking-widest transition-all"
                            >
                                CERRAR (SIN TICKET)
                            </button>
                            <button 
                                onClick={onPrint}
                                className="flex-[2] bg-orange-500 hover:bg-orange-600 text-white font-black py-5 rounded-[25px] text-lg uppercase italic tracking-tighter transition-all shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:shadow-[0_0_50px_rgba(249,115,22,0.6)]"
                            >
                                🖨️ IMPRIMIR TICKET
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

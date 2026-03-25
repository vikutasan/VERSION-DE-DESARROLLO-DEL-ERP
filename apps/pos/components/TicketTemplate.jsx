import React, { forwardRef } from 'react';

export const TicketTemplate = forwardRef(({ ticket, cart, total, payments }, ref) => {
    const today = new Date().toLocaleString();
    
    return (
        <div ref={ref} className="print-ticket bg-white text-black w-[80mm] font-mono text-[9px] leading-[1.1]">
            <style>
                {`
                    @media print {
                        @page { margin: 0; size: 80mm auto; }
                        body { margin: 0; padding: 0; }
                        .print-ticket { 
                            width: 80mm; 
                            background: white; 
                            color: black;
                            padding: 1mm 2mm; 
                            margin: 0;
                        }
                    }
                    .print-ticket { padding: 2mm 4mm; }
                    .dotted-line { border-top: 1px dotted #000; margin: 1px 0; }
                    .compact-row { display: flex; justify-content: space-between; margin-bottom: 0px; }
                `}
            </style>
            
            {/* Header Ultra Compacto con Logo */}
            <div className="flex flex-col items-center mb-1">
                <img src="/assets/logo.png" alt="Logo" className="w-12 h-12 grayscale object-contain mb-1" />
                <div className="text-center font-bold text-[11px] uppercase tracking-widest">R de Rico</div>
            </div>
            
            <div className="text-center text-[7.5px] mb-0.5">
                {today} | CTA: {ticket?.account_num || '---'}
            </div>
 
            <div className="dotted-line"></div>
 
            {/* Items Table - Espaciado Mínimo */}
            <table className="w-full mb-0.5">
                <tbody>
                    {(ticket?.items || cart || []).map((item, idx) => {
                        const name = item.product?.name || item.name || 'Articulo';
                        const qty = item.quantity || 1;
                        const price = item.unit_price || item.price || 0;
                        return (
                            <tr key={idx} className="align-top">
                                <td className="w-5">{qty}x</td>
                                <td className="max-w-[45mm]">
                                    <div className="font-bold truncate">{name}</div>
                                    <div className="text-[7.5px] italic text-gray-600">${price.toFixed(2)} c/u</div>
                                </td>
                                <td className="text-right font-bold pl-1 align-bottom">${(price * qty).toFixed(2)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
 
            <div className="dotted-line"></div>
 
            {/* Totals */}
            <div className="flex justify-between font-bold text-[10px] my-0.5">
                <span>TOTAL</span>
                <span>${(ticket?.total || total || 0).toFixed(2)}</span>
            </div>
 
            {/* Payment Details */}
            <div className="text-[7px]">
                {(ticket?.payment_details || payments || []).length > 0 && (ticket?.payment_details || payments).map((p, idx) => (
                    <div key={idx} className="flex justify-between italic">
                        <span>{p.method}</span>
                        <span>${(p.amount || 0).toFixed(2)}</span>
                    </div>
                ))}
            </div>
 
            {/* Auditoría de Responsables */}
            <div className="mt-2 pt-1 border-t border-dotted border-black text-[7px] space-y-0.5 uppercase">
                <div className="flex justify-between">
                    <span className="font-bold">CAPTURÓ:</span>
                    <span className="truncate ml-2">{ticket?.captured_by?.name || 'SISTEMA'}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-bold">COBRÓ:</span>
                    <span className="truncate ml-2">{ticket?.cashed_by?.name || 'SISTEMA/AUTO'}</span>
                </div>
                <div className="flex justify-between text-[6px] italic">
                    <span>Terminal:</span>
                    <span>{ticket?.terminal_id || 'T1'}</span>
                </div>
            </div>
 
            <div className="text-center text-[7px] italic mt-1 border-t pt-0.5">
                *** Disfrute su pan ***
            </div>
        </div>
    );
});

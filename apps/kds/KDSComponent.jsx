import React, { useState, useEffect } from 'react';

/**
 * R de Rico - Kitchen Display System (KDS)
 * 
 * Componente principal para la gestión de comandas en tiempo real.
 * Diseñado para pantallas de alta visibilidad en áreas de:
 * 1. Panadería (Bakery)
 * 2. Pizzería (Pizza)
 * 3. Cafetería (Cafe)
 */

export const OrderCard = ({ order }) => {
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            const diff = Math.floor((new Date() - new Date(order.createdAt)) / 1000 / 60);
            setElapsedTime(diff);
        }, 10000);
        return () => clearInterval(timer);
    }, [order.createdAt]);

    const getTimerColor = () => {
        if (elapsedTime > 15) return 'text-red-500 font-bold'; // Alerta: más de 15 min
        if (elapsedTime > 8) return 'text-orange-400 font-bold'; // Advertencia: más de 8 min
        return 'text-green-400 font-bold';
    };

    return (
        <div className="bg-gray-800/80 backdrop-blur-md border border-gray-700 rounded-xl p-4 shadow-xl flex flex-col min-w-[300px] h-full">
            <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-3">
                <h3 className="text-xl font-bold text-white">#{order.id.slice(-4).toUpperCase()}</h3>
                <span className={getTimerColor()}>{elapsedTime} min</span>
            </div>

            <div className="flex-grow space-y-3">
                {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start text-lg">
                        <div className="flex items-center space-x-2">
                            <span className="bg-orange-500 text-black px-2 py-0.5 rounded-md font-black italic">
                                {item.quantity}
                            </span>
                            <span className="text-gray-100 font-medium">{item.name}</span>
                        </div>
                        {item.category === 'PIZZA' && <span className="text-sm bg-red-900/40 text-red-300 px-2 rounded">🔥 PIZZA</span>}
                        {item.category === 'BAKERY' && <span className="text-sm bg-amber-900/40 text-amber-300 px-2 rounded">🥖 PAN</span>}
                        {item.category === 'CAFE' && <span className="text-sm bg-blue-900/40 text-blue-300 px-2 rounded">☕ CAFE</span>}
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700 flex space-x-2">
                <button className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg transition-colors text-lg active:scale-95 uppercase tracking-widest">
                    Listo
                </button>
            </div>
        </div>
    );
};

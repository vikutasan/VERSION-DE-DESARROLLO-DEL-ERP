import React, { useState } from 'react';

/**
 * R de Rico - Cake Configurator (E-commerce Web App)
 * 
 * Interfaz premium para que el cliente diseñe su pastel ideal, lo pague y lo mande a producción.
 */

export const CakeConfiguratorUI = () => {
    const [step, setStep] = useState(1);
    const [cake, setCake] = useState({
        size: '10 personas',
        shape: 'Redondo',
        base: 'Vainilla Francesa',
        filling: 'Frutos Rojos del Bosque',
        frosting: 'Crema Batida Artesanal',
        message: '',
        deliveryDate: '',
        deliveryBranch: 'Toluca Centro',
    });

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    return (
        <div className="bg-[#0a0a0b] text-white min-h-screen font-sans">
            {/* Barra de Progreso Superior */}
            <div className="h-1 bg-gray-900 w-full sticky top-0">
                <div
                    className="h-full bg-gradient-to-r from-orange-600 to-pink-600 transition-all duration-500"
                    style={{ width: `${(step / 4) * 100}%` }}
                />
            </div>

            <nav className="p-6 flex justify-between items-center bg-black/40 backdrop-blur-md sticky top-1">
                <h1 className="text-2xl font-black uppercase tracking-tighter text-orange-500">R de Rico <span className="text-white">Pastelería</span></h1>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Paso {step} de 4</span>
            </nav>

            <main className="max-w-4xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-12 mt-10">

                {/* Visualizador del Pastel (Preview) */}
                <div className="relative group">
                    <div className="aspect-square bg-gradient-to-br from-gray-900 to-black rounded-[40px] border border-gray-800 flex items-center justify-center p-10 overflow-hidden shadow-2xl">
                        <div className="text-center">
                            {/* Aquí iría el render 3D o imagen dinámica SVG */}
                            <div className="w-48 h-24 bg-orange-200/20 rounded-t-full relative mb-1 border-2 border-orange-500/30 blur-sm" />
                            <div className="w-56 h-32 bg-orange-300/30 rounded-lg relative border-2 border-orange-400/30 shadow-2xl" />
                            <p className="mt-8 text-orange-500 font-black uppercase text-xs tracking-[0.3em]">Tu Diseño Signature</p>
                        </div>
                    </div>
                </div>

                {/* Configurador por Pasos */}
                <div className="space-y-8">
                    {step === 1 && (
                        <section className="animate-in fade-in slide-in-from-right-10">
                            <h2 className="text-4xl font-black mb-2 leading-none uppercase">Base & Tamaño</h2>
                            <p className="text-gray-500 mb-8 font-bold">Iniciemos con el alma del pastel.</p>

                            <div className="grid grid-cols-2 gap-4">
                                {['10 personas', '20 personas', '30 personas', '50 personas'].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setCake({ ...cake, size: s })}
                                        className={`p-4 rounded-2xl border transition-all text-sm font-bold ${cake.size === s ? 'border-orange-500 bg-orange-500/10 text-orange-500' : 'border-gray-800 bg-gray-900/40 hover:border-gray-600'}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>

                            <label className="block mt-8 text-[10px] uppercase font-black text-gray-500 mb-3 tracking-widest">Bizcocho (Base)</label>
                            <div className="space-y-2">
                                {['Vainilla Francesa', 'Chocolate Belga', 'Red Velvet Premium', 'Nueces de la Sierra'].map(b => (
                                    <div
                                        key={b}
                                        onClick={() => setCake({ ...cake, base: b })}
                                        className={`p-4 rounded-2xl cursor-pointer border flex justify-between items-center transition-all ${cake.base === b ? 'border-orange-500 bg-orange-500/10' : 'border-gray-800'}`}
                                    >
                                        <span className="font-bold">{b}</span>
                                        {cake.base === b && <div className="w-2 h-2 bg-orange-500 rounded-full shadow-lg shadow-orange-500/50" />}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {step === 2 && (
                        <section className="animate-in fade-in slide-in-from-right-10 text-left">
                            <h2 className="text-4xl font-black mb-2 leading-none uppercase">Relleno & Sabores</h2>
                            <p className="text-gray-500 mb-8 font-bold">Contrastes que enamoran al paladar.</p>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] uppercase font-black text-gray-500 mb-3 block">Corazón del Pastel (Relleno)</label>
                                    <select
                                        className="w-full bg-gray-900 border border-gray-800 p-4 rounded-2xl outline-none focus:border-orange-500 font-bold"
                                        value={cake.filling}
                                        onChange={(e) => setCake({ ...cake, filling: e.target.value })}
                                    >
                                        <option>Frutos Rojos del Bosque</option>
                                        <option>Crema de Avellana & Cacao</option>
                                        <option>Cajeta Quemada Tradicional</option>
                                        <option>Queso Mascarpone</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-black text-gray-500 mb-3 block">Cobertura (Frosting)</label>
                                    <select
                                        className="w-full bg-gray-900 border border-gray-800 p-4 rounded-2xl outline-none focus:border-orange-500 font-bold"
                                        value={cake.frosting}
                                        onChange={(e) => setCake({ ...cake, frosting: e.target.value })}
                                    >
                                        <option>Crema Batida Artesanal</option>
                                        <option>Ganache de Chocolate 70%</option>
                                        <option>Fondant Estilo Americano</option>
                                        <option>Smooth Buttercream</option>
                                    </select>
                                </div>
                                <div className="mt-8">
                                    <label className="text-[10px] uppercase font-black text-gray-500 mb-3 block tracking-widest">Dedicatoria Personalizada</label>
                                    <input
                                        className="w-full bg-gray-900 border border-gray-800 p-5 rounded-2xl outline-none focus:border-orange-500 font-bold text-center placeholder:text-gray-700"
                                        placeholder="Ej: Felicidades Mamá"
                                        value={cake.message}
                                        onChange={(e) => setCake({ ...cake, message: e.target.value })}
                                    />
                                </div>
                            </div>
                        </section>
                    )}

                    {step === 3 && (
                        <section className="animate-in fade-in slide-in-from-right-10">
                            <h2 className="text-4xl font-black mb-2 leading-none uppercase">Entrega & Logística</h2>
                            <p className="text-gray-500 mb-8 font-bold">¿Cuándo y dónde celebramos?</p>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] uppercase font-black text-gray-500 mb-3 block">Fecha de Entrega</label>
                                    <input
                                        type="date"
                                        className="w-full bg-gray-900 border border-gray-800 p-5 rounded-2xl outline-none focus:border-orange-500 font-bold text-white text-lg"
                                        onChange={(e) => setCake({ ...cake, deliveryDate: e.target.value })}
                                    />
                                    <p className="text-[10px] text-orange-500 mt-2 font-bold uppercase tracking-widest italic">* Requerimos 48 horas de anticipación</p>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-black text-gray-500 mb-3 block">Punto de Entrega (Sucursal)</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['Toluca Centro', 'Metepec', 'Galerías', 'Planta Matriz'].map(branch => (
                                            <button
                                                key={branch}
                                                onClick={() => setCake({ ...cake, deliveryBranch: branch })}
                                                className={`p-4 rounded-xl border transition-all text-xs font-black uppercase ${cake.deliveryBranch === branch ? 'border-orange-500 bg-orange-500/10 text-orange-500' : 'border-gray-800 bg-gray-900/40'}`}
                                            >
                                                {branch}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {step === 4 && (
                        <section className="animate-in fade-in zoom-in-95">
                            <h2 className="text-[40px] font-black mb-1 leading-none uppercase text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">Todo Listos</h2>
                            <p className="text-gray-500 mb-10 font-bold italic underline decoration-orange-600/30">Tu creación maestra está a un clic.</p>

                            <div className="bg-gray-900/40 border border-gray-800 p-8 rounded-[30px] shadow-2xl space-y-4 mb-10">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 font-bold">TAMAÑO:</span>
                                    <span className="font-black uppercase">{cake.size}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 font-bold">COMBINACIÓN:</span>
                                    <span className="font-black uppercase">{cake.base} + {cake.filling}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 font-bold">FECHA:</span>
                                    <span className="font-black text-orange-500 uppercase">{cake.deliveryDate || 'Próximamente'}</span>
                                </div>
                                <div className="h-px bg-gray-800 w-full my-4" />
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-2xl font-black">TOTAL</span>
                                    <div className="text-right">
                                        <p className="text-4xl font-black text-orange-500">$1,850.00</p>
                                        <p className="text-[10px] text-gray-600 font-bold">MXN | IVA INCLUIDO</p>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full bg-gradient-to-r from-orange-600 to-pink-600 py-6 rounded-[22px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-orange-600/40 hover:scale-[1.02] transition-transform active:scale-95">
                                PAGAR & MANDAR A PLANTA
                            </button>
                        </section>
                    )}

                    {/* Controles de Navegación */}
                    <div className="pt-10 flex gap-4">
                        {step > 1 && (
                            <button onClick={prevStep} className="px-8 py-5 rounded-2xl border border-gray-800 font-black uppercase text-xs hover:bg-gray-900 transition-colors">Volver</button>
                        )}
                        {step < 4 && (
                            <button onClick={nextStep} className="flex-1 bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-transform active:scale-95 shadow-xl shadow-white/10">Continuar</button>
                        )}
                    </div>
                </div>
            </main>

            <footer className="mt-20 p-10 text-center text-gray-700 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                R de Rico Pastelería Artesanal &copy; 2026 | Sistema de E-commerce v2.0
            </footer>
        </div>
    );
};

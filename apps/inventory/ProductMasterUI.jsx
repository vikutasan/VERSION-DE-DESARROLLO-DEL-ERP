import React, { useState, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom';

/**
 * R DE RICO - PRODUCT MASTER & CATALOG MANAGER (API SYNC)
 * 
 * Módulo central para la gestión de productos, recetas e inventario logístico.
 * Sincronizado en tiempo real con el servidor FastAPI.
 */

const INITIAL_CATEGORIES_LOCAL = [
    { name: "1.-EMPAQUE Y PAN BLANCO", icon: "🥖" },
    { name: "2.-A - B", icon: "🍪" },
    { name: "3.-C - D", icon: "🍩" },
    { name: "4.-E - K", icon: "🥐" },
    { name: "5.-L - M", icon: "🧁" },
    { name: "6.-N - P", icon: "🥧" },
    { name: "7.-R - S", icon: "🍰" },
    { name: "8.-T - Z", icon: "🥨" },
    { name: "17.-ROSCA DE REYES", icon: "👑" },
    { name: "9.-LACTEOS", icon: "🥛" },
    { name: "10.-SOBRE PEDIDO", icon: "🎂" },
    { name: "11.-ESPORADICOS", icon: "🎁" },
    { name: "12.-CAFES Y CHOCOLATES", icon: "☕" },
    { name: "13.-SOUVENIRS", icon: "🛍️" },
    { name: "14.-HELADOS", icon: "🍨" },
    { name: "15.-PALETAS", icon: "🍭" },
    { name: "16.-AGUAS Y MALTEADAS", icon: "🥤" },
    { name: "DESCONTINUADOS", icon: "📁" }
];

const INITIAL_INGREDIENTS = [
    { id: 'ing_harina', name: 'Harina de Trigo', unit: 'kg', costPerUnit: 18.5 },
    { id: 'ing_mantequilla', name: 'Mantequilla de Planta', unit: 'kg', costPerUnit: 120.0 },
    { id: 'ing_azucar', name: 'Azúcar Refinada', unit: 'kg', costPerUnit: 22.0 },
    { id: 'ing_levadura', name: 'Levadura Seca', unit: 'kg', costPerUnit: 85.0 },
    { id: 'ing_leche', name: 'Leche Entera', unit: 'lt', costPerUnit: 24.5 },
];

export const ProductMasterUI = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('TODOS');
    const [editingProduct, setEditingProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [masses, setMasses] = useState([]);
    const [globalIngredients, setGlobalIngredients] = useState(INITIAL_INGREDIENTS);
    const [showIngredientSelector, setShowIngredientSelector] = useState(false);
    const [showCategoryManager, setShowCategoryManager] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', icon: '📦' });
    const [renamingCategory, setRenamingCategory] = useState(null);
    const [renameValue, setRenameValue] = useState('');
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [deleteOption, setDeleteOption] = useState('ONLY_CAT');
    const [showProductLinker, setShowProductLinker] = useState(false);
    const [linkerSearch, setLinkerSearch] = useState('');
    const [showUnlinkConfirm, setShowUnlinkConfirm] = useState(false);
    const [productToUnlink, setProductToUnlink] = useState(null);
    const [showPermanentDeleteConfirm, setShowPermanentDeleteConfirm] = useState(false);
    const [productToDeletePermanently, setProductToDeletePermanently] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const API_BASE = "http://localhost:3001/api/v1/catalog";

    // Carga inicial de datos desde la API
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Categorías
                const catRes = await fetch(`${API_BASE}/categories`);
                if (catRes.ok) {
                    const catData = await catRes.json();
                    const normalized = catData.map(c => {
                        const local = INITIAL_CATEGORIES_LOCAL.find(lc => lc.name === c.name);
                        return { ...c, icon: c.icon || (local ? local.icon : '📦') };
                    });
                    setCategories(normalized);
                }

                // Productos
                const prodRes = await fetch(`${API_BASE}/products`);
                if (prodRes.ok) {
                    const prodData = await prodRes.json();
                    const normalizedProds = prodData.map(p => ({
                        ...p,
                        categories: p.category ? [p.category.name] : [],
                        nature: p.nature || 'MANUFACTURADO',
                        technical_data: p.technical_sheet || {}
                    }));
                    setProducts(normalizedProds);
                }

                // Masas (Producción)
                const massRes = await fetch("http://localhost:3001/api/v1/production/masses");
                if (massRes.ok) {
                    setMasses(await massRes.json());
                }
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Filtrado de productos
    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                 p.sku.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = activeCategory === 'TODOS' || (p.categories && p.categories.includes(activeCategory));
            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, activeCategory, products]);

    const refreshProducts = async () => {
        const prodRes = await fetch(`${API_BASE}/products`);
        if (prodRes.ok) {
            const prodData = await prodRes.json();
            const normalizedProds = prodData.map(p => ({
                ...p,
                categories: p.category ? [p.category.name] : [],
                nature: p.nature || 'MANUFACTURADO',
                technical_data: p.technical_sheet || {}
            }));
            setProducts(normalizedProds);
        }
    };

    const handleSaveProduct = async (updatedProduct) => {
        try {
            const catName = updatedProduct.categories[0];
            const dbCat = categories.find(c => c.name === catName);
            
            // Sanitización de technical_data
            const techData = { ...(updatedProduct.technical_data || {}) };
            if (techData.primary_mass_id === '') techData.primary_mass_id = null;
            if (techData.weight_per_piece === '') techData.weight_per_piece = null;
            
            const payload = {
                name: updatedProduct.name,
                price: parseFloat(updatedProduct.price) || 0,
                cost: parseFloat(updatedProduct.cost) || 0,
                stock: parseFloat(updatedProduct.stock) || 0,
                warehouse: updatedProduct.warehouse || 'Bóveda Central',
                image_url: updatedProduct.image_url || null,
                sku: updatedProduct.sku,
                category_id: dbCat ? dbCat.id : null,
                nature: updatedProduct.nature || 'MANUFACTURADO',
                technical_data: techData
            };

            let res;
            if (updatedProduct.id) {
                res = await fetch(`${API_BASE}/products/${updatedProduct.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                res = await fetch(`${API_BASE}/products`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            if (res.ok) {
                await refreshProducts();
                setEditingProduct(null);
            } else {
                alert("Error al guardar el producto");
            }
        } catch (err) {
            console.error("Save error:", err);
        }
    };

    const handleCreateProduct = () => {
        const newProd = {
            sku: `SKU-${Math.floor(Math.random() * 10000)}`,
            name: 'NUEVO PRODUCTO',
            categories: activeCategory === 'TODOS' ? [(categories[0]?.name || 'GENERAL')] : [activeCategory],
            price: 0,
            cost: 0,
            stock: 0,
            warehouse: 'Bóveda Central',
            image_url: '',
            nature: 'MANUFACTURADO',
            technical_data: {},
            isNew: true
        };
        setEditingProduct(newProd);
    };

    const handlePermanentDelete = async (product) => {
        if (!product.id) return;
        try {
            const res = await fetch(`${API_BASE}/products/${product.id}`, { method: 'DELETE' });
            if (res.ok) {
                await refreshProducts();
                setShowPermanentDeleteConfirm(false);
                setProductToDeletePermanently(null);
                setEditingProduct(null);
            }
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    const handleImportData = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const importedData = JSON.parse(event.target.result);
                const productsToImport = importedData.products || [];
                
                if (productsToImport.length > 0) {
                    const res = await fetch(`${API_BASE}/import-json`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ products: productsToImport })
                    });
                    
                    if (res.ok) {
                        const result = await res.json();
                        alert(`✅ ${result.message}`);
                        window.location.reload(); // Recarga simple para asegurar sincronía total
                    } else {
                        alert("❌ Error en el servidor al importar.");
                    }
                }
            } catch (err) {
                alert("❌ Error al leer el archivo JSON.");
            }
        };
        reader.readAsText(file);
    };

    const handleAddCategory = async () => {
        if (!newCategory.name) return;
        try {
            const res = await fetch(`${API_BASE}/categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCategory.name, icon: newCategory.icon })
            });
            if (res.ok) {
                const catRes = await fetch(`${API_BASE}/categories`);
                const catData = await catRes.json();
                setCategories(catData.map(c => {
                    const local = INITIAL_CATEGORIES_LOCAL.find(lc => lc.name === c.name);
                    return { ...c, icon: c.icon || (local ? local.icon : '📦') };
                }));
                setNewCategory({ name: '', icon: '📦' });
                setShowCategoryManager(false);
            }
        } catch (err) {
            console.error("Add category error:", err);
        }
    };

    const handleDeleteCategory = async () => {
        const cat = categories.find(c => c.name === categoryToDelete);
        if (!cat) return;
        try {
            const res = await fetch(`${API_BASE}/categories/${cat.id}`, { method: 'DELETE' });
            if (res.ok) {
                setCategories(categories.filter(c => c.id !== cat.id));
                if (activeCategory === cat.name) setActiveCategory('TODOS');
                setCategoryToDelete(null);
                await refreshProducts();
            }
        } catch (err) {
            console.error("Delete category error:", err);
        }
    };

    return (
        <div className="bg-[#050505]/60 backdrop-blur-xl min-h-screen text-white p-8 font-sans flex gap-8">
            
            {/* Modal de Eliminación de Categoría */}
            {categoryToDelete && ReactDOM.createPortal(
                <div className="fixed inset-0 z-[200] flex items-start justify-center p-6 pt-20">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setCategoryToDelete(null)} />
                    <div className="relative w-full max-w-lg bg-gray-900 border border-red-900/30 rounded-[40px] p-10 shadow-2xl">
                        <h3 className="text-3xl font-black uppercase italic tracking-tighter text-red-500 mb-2 text-center">¿Eliminar Categoría?</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-10 text-center">
                            Esta acción es irreversible y afectará el catálogo.
                        </p>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setCategoryToDelete(null)}
                                className="flex-1 py-4 bg-gray-800 rounded-2xl text-[10px] font-black uppercase hover:bg-gray-700 transition-all font-bold"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleDeleteCategory}
                                className="flex-1 py-4 bg-red-600 rounded-2xl text-[10px] font-black uppercase hover:scale-105 active:scale-95 transition-all font-bold"
                            >
                                Confirmar Borrado
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Modal de Edición de Producto */}
            {editingProduct && ReactDOM.createPortal(
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setEditingProduct(null)} />
                    <div className="relative w-full max-w-xl bg-gray-900 border border-indigo-900/30 rounded-[40px] p-10 shadow-2xl">
                        <header className="mb-8 border-b border-gray-800 pb-6 flex gap-6 items-center">
                            {editingProduct.image_url ? (
                                <img src={editingProduct.image_url} alt="Preview" className="w-24 h-24 object-cover rounded-2xl border-2 border-indigo-500/50 shadow-xl shadow-indigo-500/10" />
                            ) : (
                                <div className="w-24 h-24 bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-700 flex items-center justify-center text-gray-500 text-3xl">📷</div>
                            )}
                            <div>
                                <h3 className="text-3xl font-black uppercase italic tracking-tighter text-indigo-400 leading-none mb-2">
                                    {editingProduct.id ? 'Editar Producto' : 'Nuevo Producto'}
                                </h3>
                                <p className="text-[10px] font-black text-[#c1d72e] uppercase tracking-widest bg-black/40 px-3 py-1 rounded-lg inline-block">ID: {editingProduct.sku}</p>
                            </div>
                        </header>

                        <div className="space-y-6 mb-10 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                            <div className="grid grid-cols-2 gap-6 pb-6 border-b border-gray-800">
                                <div className="col-span-2">
                                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-2">Naturaleza del Artículo</label>
                                    <select 
                                        className="w-full bg-indigo-900/20 border border-indigo-500/50 p-4 rounded-2xl text-sm font-black text-indigo-300 outline-none focus:border-indigo-400 appearance-none cursor-pointer"
                                        value={editingProduct.nature || 'MANUFACTURADO'}
                                        onChange={(e) => setEditingProduct({...editingProduct, nature: e.target.value})}
                                    >
                                        <option value="MANUFACTURADO">🏭 MANUFACTURADO</option>
                                        <option value="PREPARADO AL MOMENTO">🧉 PREPARADO AL MOMENTO</option>
                                        <option value="REVENTA">🏷️ REVENTA</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase block mb-2">Nombre Comercial</label>
                                    <input 
                                        className="w-full bg-black/40 border border-gray-800 p-4 rounded-2xl text-lg font-bold outline-none focus:border-[#c1d72e] transition-all"
                                        value={editingProduct.name}
                                        onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase block mb-2">Precio Público ($)</label>
                                    <input 
                                        type="number"
                                        className="w-full bg-black/40 border border-gray-800 p-4 rounded-2xl text-lg font-bold outline-none focus:border-[#c1d72e] text-[#c1d72e] transition-all"
                                        value={editingProduct.price}
                                        onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase block mb-2">Categoría POS</label>
                                    <select 
                                        className="w-full bg-black/40 border border-gray-800 p-4 rounded-2xl text-xs font-bold outline-none focus:border-[#c1d72e] appearance-none cursor-pointer"
                                        value={editingProduct.categories[0]}
                                        onChange={(e) => setEditingProduct({...editingProduct, categories: [e.target.value]})}
                                    >
                                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase block mb-2">Costo Real ($)</label>
                                    <input 
                                        type="number"
                                        className="w-full bg-black/40 border border-red-900/40 p-4 rounded-2xl text-lg font-bold outline-none focus:border-red-500 text-red-500 transition-all"
                                        value={editingProduct.cost || ''}
                                        onChange={(e) => setEditingProduct({...editingProduct, cost: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase block mb-2">Margen Utilidad (%)</label>
                                    <div className="w-full bg-green-900/10 border border-green-500/20 p-4 rounded-2xl text-lg font-black text-green-400 flex items-center h-[60px]">
                                        {(() => {
                                            const p = parseFloat(editingProduct.price) || 0;
                                            const c = parseFloat(editingProduct.cost) || 0;
                                            if (p <= 0) return "---";
                                            const margin = ((p - c) / p) * 100;
                                            return `${margin.toFixed(2)}%`;
                                        })()}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase block mb-2">Inventario Físico (Pzas)</label>
                                    <input 
                                        type="number"
                                        className="w-full bg-black/40 border border-gray-800 p-4 rounded-2xl text-lg font-bold outline-none focus:border-indigo-500 text-white transition-all"
                                        value={editingProduct.stock || ''}
                                        onChange={(e) => setEditingProduct({...editingProduct, stock: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase block mb-2">Almacén de Resguardo</label>
                                    <input 
                                        type="text"
                                        className="w-full bg-black/40 border border-gray-800 p-4 rounded-2xl text-sm font-bold outline-none focus:border-indigo-500 text-gray-300 transition-all uppercase"
                                        value={editingProduct.warehouse || ''}
                                        onChange={(e) => setEditingProduct({...editingProduct, warehouse: e.target.value})}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase block mb-2">URL de Fotografía</label>
                                    <input 
                                        type="text"
                                        placeholder="https://... .jpg"
                                        className="w-full bg-black/40 border border-gray-800 p-4 rounded-2xl text-sm font-mono text-gray-400 outline-none focus:border-indigo-500 transition-all"
                                        value={editingProduct.image_url || ''}
                                        onChange={(e) => setEditingProduct({...editingProduct, image_url: e.target.value})}
                                    />
                                </div>
                            </div>

                            {/* --- CAMPOS DINAMICOS POR NATURALEZA --- */}
                            
                            {editingProduct.nature === 'MANUFACTURADO' && (
                                <div className="space-y-6">
                                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <span>⚙️</span> Parámetros de Manufactura
                                    </h4>
                                    
                                    <div className="grid grid-cols-2 gap-4 bg-gray-800/20 p-5 rounded-[24px] border border-gray-800">
                                        <div className="col-span-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase block mb-2 text-[#c1d72e]">Masa Primaria (Base)</label>
                                            <select 
                                                className="w-full bg-black/60 border border-gray-700 p-3 rounded-xl text-xs font-bold outline-none focus:border-[#c1d72e]"
                                                value={editingProduct.technical_data?.primary_mass_id || ''}
                                                onChange={(e) => setEditingProduct({
                                                    ...editingProduct, 
                                                    technical_data: {...editingProduct.technical_data, primary_mass_id: e.target.value}
                                                })}
                                            >
                                                <option value="">-- Seleccionar Masa --</option>
                                                {masses.map(m => (
                                                    <option key={m.id} value={m.id}>{m.name} ({m.total_yield_grams}g totales)</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-gray-500 uppercase block mb-2">Peso x Pieza (Gramos)</label>
                                            <input 
                                                type="number"
                                                className="w-full bg-black/40 border border-gray-700 p-3 rounded-xl text-sm font-bold outline-none focus:border-indigo-500"
                                                value={editingProduct.technical_data?.weight_per_piece || ''}
                                                onChange={(e) => setEditingProduct({
                                                    ...editingProduct, 
                                                    technical_data: {...editingProduct.technical_data, weight_per_piece: e.target.value}
                                                })}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-indigo-400 uppercase block mb-2">Rendimiento (Autocalculado)</label>
                                            <div className="w-full bg-indigo-900/20 border border-indigo-500/30 p-3 rounded-xl text-sm font-black text-indigo-300 flex items-center justify-center">
                                                {(() => {
                                                    const massId = editingProduct.technical_data?.primary_mass_id;
                                                    const weight = parseFloat(editingProduct.technical_data?.weight_per_piece);
                                                    if (!massId || !weight) return "--- piezas";
                                                    
                                                    const mass = masses.find(m => m.id.toString() === massId.toString());
                                                    if (!mass) return "--- piezas";
                                                    
                                                    const yieldPieces = Math.floor(mass.total_yield_grams / weight);
                                                    return `${yieldPieces} PIEZAS MÁX.`;
                                                })()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 bg-orange-900/10 p-5 rounded-[24px] border border-orange-900/30">
                                        <div>
                                            <label className="text-[9px] font-black text-orange-500 uppercase block mb-2">Temp Bóveda (°C)</label>
                                            <input type="number" className="w-full bg-black/40 border border-orange-900/50 p-3 rounded-xl text-sm text-center font-bold text-orange-200 outline-none"
                                                value={editingProduct.technical_data?.baking_temp_top || ''}
                                                onChange={(e) => setEditingProduct({...editingProduct, technical_data: {...editingProduct.technical_data, baking_temp_top: e.target.value}})}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-black text-orange-500 uppercase block mb-2">Temp Piso (°C)</label>
                                            <input type="number" className="w-full bg-black/40 border border-orange-900/50 p-3 rounded-xl text-sm text-center font-bold text-orange-200 outline-none"
                                                value={editingProduct.technical_data?.baking_temp_bottom || ''}
                                                onChange={(e) => setEditingProduct({...editingProduct, technical_data: {...editingProduct.technical_data, baking_temp_bottom: e.target.value}})}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-black text-orange-500 uppercase block mb-2">Tiempo (Min)</label>
                                            <input type="number" className="w-full bg-black/40 border border-orange-900/50 p-3 rounded-xl text-sm text-center font-bold text-orange-200 outline-none"
                                                value={editingProduct.technical_data?.baking_time_min || ''}
                                                onChange={(e) => setEditingProduct({...editingProduct, technical_data: {...editingProduct.technical_data, baking_time_min: e.target.value}})}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase block mb-2">Procedimiento de Formado</label>
                                        <textarea 
                                            className="w-full bg-black/40 border border-gray-800 p-4 rounded-2xl text-sm outline-none focus:border-indigo-500 min-h-[100px] resize-none custom-scrollbar"
                                            placeholder="Ej: Bolear a 80g, reposar 10 min, formar cuernito..."
                                            value={editingProduct.technical_data?.forming_procedure || ''}
                                            onChange={(e) => setEditingProduct({...editingProduct, technical_data: {...editingProduct.technical_data, forming_procedure: e.target.value}})}
                                        />
                                    </div>
                                </div>
                            )}

                            {editingProduct.nature === 'PREPARADO AL MOMENTO' && (
                                <div className="space-y-6 bg-blue-900/10 p-5 rounded-[24px] border border-blue-900/30">
                                    <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                                        <span>🧉</span> Receta de Barra / Cocina
                                    </h4>
                                    <div>
                                        <label className="text-[10px] font-black text-blue-500 uppercase block mb-2">Tiempo Estándar Preparación (Min)</label>
                                        <input 
                                            type="number"
                                            className="w-full max-w-[150px] bg-black/40 border border-blue-900/50 p-3 rounded-xl text-sm font-bold text-blue-200 outline-none focus:border-blue-400"
                                            value={editingProduct.technical_data?.preparation_time_min || ''}
                                            onChange={(e) => setEditingProduct({...editingProduct, technical_data: {...editingProduct.technical_data, preparation_time_min: e.target.value}})}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-blue-500 uppercase block mb-2">Procedimiento / Receta</label>
                                        <textarea 
                                            className="w-full bg-black/40 border border-blue-900/50 p-4 rounded-2xl text-sm text-blue-100 outline-none focus:border-blue-400 min-h-[120px] resize-none custom-scrollbar"
                                            placeholder="Ej: Extraer 1 shot espresso, espumar leche a 65°C, verter con arte latte..."
                                            value={editingProduct.technical_data?.recipe_procedure || ''}
                                            onChange={(e) => setEditingProduct({...editingProduct, technical_data: {...editingProduct.technical_data, recipe_procedure: e.target.value}})}
                                        />
                                    </div>
                                </div>
                            )}

                            {editingProduct.nature === 'REVENTA' && (
                                <div className="space-y-6 bg-emerald-900/10 p-5 rounded-[24px] border border-emerald-900/30">
                                    <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                                        <span>🏷️</span> Datos de Reventa y Proveeduría
                                    </h4>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="col-span-2">
                                            <label className="text-[10px] font-black text-emerald-500 uppercase block mb-2">Proveedor / Marca</label>
                                            <input 
                                                className="w-full bg-black/40 border border-emerald-900/50 p-3 rounded-xl text-sm font-bold text-emerald-200 outline-none focus:border-emerald-400"
                                                placeholder="Ej: Coca Cola Femsa"
                                                value={editingProduct.technical_data?.provider || ''}
                                                onChange={(e) => setEditingProduct({...editingProduct, technical_data: {...editingProduct.technical_data, provider: e.target.value}})}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-emerald-500 uppercase block mb-2">Código Barras Orig.</label>
                                            <input 
                                                className="w-full bg-black/40 border border-emerald-900/50 p-3 rounded-xl text-sm font-bold text-emerald-200 outline-none focus:border-emerald-400"
                                                value={editingProduct.technical_data?.original_barcode || ''}
                                                onChange={(e) => setEditingProduct({...editingProduct, technical_data: {...editingProduct.technical_data, original_barcode: e.target.value}})}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-emerald-500 uppercase block mb-2">Stock Mínimo Ideal</label>
                                            <input 
                                                type="number"
                                                className="w-full bg-black/40 border border-emerald-900/50 p-3 rounded-xl text-sm font-bold text-emerald-200 outline-none focus:border-emerald-400"
                                                value={editingProduct.technical_data?.min_stock || ''}
                                                onChange={(e) => setEditingProduct({...editingProduct, technical_data: {...editingProduct.technical_data, min_stock: e.target.value}})}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>

                        <div className="flex gap-4">
                            {editingProduct.id && (
                                <button 
                                    onClick={() => handlePermanentDelete(editingProduct)}
                                    className="px-6 py-4 bg-red-600/10 border border-red-500/20 text-red-500 rounded-2xl text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition-all"
                                >
                                    Eliminar
                                </button>
                            )}
                            <div className="flex-1 flex gap-4">
                                <button 
                                    onClick={() => setEditingProduct(null)}
                                    className="flex-1 py-4 bg-gray-800 rounded-2xl text-[10px] font-black uppercase hover:bg-gray-700 transition-all font-bold"
                                >
                                    Cerrar
                                </button>
                                <button 
                                    onClick={() => handleSaveProduct(editingProduct)}
                                    className="flex-1 py-4 bg-[#c1d72e] text-black rounded-2xl text-[10px] font-black uppercase hover:scale-105 active:scale-95 transition-all font-bold shadow-xl shadow-[#c1d72e]/20"
                                >
                                    Guardar Cambios
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Area Principal */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="mb-8 flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-indigo-500">Maestro de Productos</h1>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mt-2">MODO SEGURO | SINCRO API LIVE</p>
                    </div>
                    
                    <div className="flex gap-3">
                        <label className="cursor-pointer bg-gray-900 border border-gray-800 px-6 py-4 rounded-2xl flex items-center gap-3 hover:border-indigo-500 transition-all group">
                            <span className="text-lg">📥</span>
                            <div className="text-left font-bold">
                                <p className="text-[10px] font-black uppercase italic leading-none mb-1">Importar JSON</p>
                                <p className="text-[7px] text-gray-600 font-black uppercase tracking-widest">Modo Aditivo (No Borra)</p>
                            </div>
                            <input type="file" className="hidden" accept=".json" onChange={handleImportData} />
                        </label>
                    </div>
                </header>

                <div className="flex gap-4 mb-6">
                    <div className="flex-1 relative group">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
                        <input 
                            type="text" 
                            placeholder="Buscar por nombre o SKU..."
                            className="w-full bg-black/40 border border-gray-800 p-4 pl-12 rounded-2xl outline-none focus:border-indigo-500 font-bold"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Filtro de Categorías */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-6 custom-scrollbar">
                    <button 
                        onClick={() => setActiveCategory('TODOS')}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeCategory === 'TODOS' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-900/50 text-gray-500 hover:text-white'}`}
                    >
                        Todos
                    </button>
                    {categories.map(cat => (
                        <button 
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.name)}
                            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all flex items-center gap-2 ${activeCategory === cat.name ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-900/50 text-gray-500 hover:text-white'}`}
                        >
                            <span>{cat.icon}</span>
                            {cat.name}
                            <span onClick={(e) => { e.stopPropagation(); setCategoryToDelete(cat.name); }} className="ml-2 hover:text-red-500">✕</span>
                        </button>
                    ))}
                    
                    <button 
                        onClick={() => setShowCategoryManager(!showCategoryManager)}
                        className="px-4 py-3 rounded-xl text-[14px] font-black bg-gray-900/50 text-[#c1d72e] hover:bg-gray-800"
                    >
                        +
                    </button>

                    {showCategoryManager && (
                        <div className="flex gap-2 items-center bg-gray-900/80 p-2 rounded-xl border border-[#c1d72e]/30">
                            <input 
                                type="text"
                                placeholder="Nueva Cat..."
                                className="bg-black/60 border border-gray-800 p-2 rounded-lg text-[10px] uppercase font-black outline-none w-24"
                                value={newCategory.name}
                                onChange={(e) => setNewCategory({...newCategory, name: e.target.value.toUpperCase()})}
                            />
                            <button onClick={handleAddCategory} className="bg-[#c1d72e] text-black px-3 py-2 rounded-lg text-[9px] font-black uppercase">OK</button>
                        </div>
                    )}
                </div>

                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center text-indigo-500 font-black uppercase tracking-widest animate-pulse">Cargando Imperio Digital...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
                        {filteredProducts.map(product => (
                            <div 
                                key={product.id || product.sku}
                                onClick={() => setEditingProduct(product)}
                                className="bg-gray-900/40 border border-gray-800 p-6 rounded-[32px] hover:border-indigo-500 transition-all cursor-pointer group"
                            >
                                {product.image_url ? (
                                    <div className="h-32 w-full mb-4 rounded-xl overflow-hidden border border-gray-800 relative z-0">
                                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                                    </div>
                                ) : (
                                    <div className="text-4xl mb-4 opacity-30 group-hover:opacity-100 transition-opacity">
                                        {(categories.find(c => c.name === product.categories[0])?.icon) || '📦'}
                                    </div>
                                )}
                                <h3 className="text-sm font-black uppercase italic tracking-tighter leading-none mb-1 group-hover:text-[#c1d72e] transition-colors">{product.name}</h3>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[9px] font-mono text-gray-600 mb-2">{product.sku}</p>
                                        <div className="flex gap-1">
                                            {product.categories.map(c => (
                                                <span key={c} className="text-[7px] font-black uppercase bg-gray-800 px-2 py-0.5 rounded-full text-gray-500">{c}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black text-[#c1d72e]">${product.price}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-6 flex justify-between items-center bg-indigo-600/5 p-6 rounded-3xl border border-indigo-500/10">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Total: {filteredProducts.length} productos en linea</p>
                    <button 
                        onClick={handleCreateProduct}
                        className="bg-indigo-600 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-600/20"
                    >
                        + Registrar Producto
                    </button>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4f46e5; }
            `}</style>
        </div>
    );
};

import { useState, useMemo, useEffect } from 'react';

export const useCart = (PRODUCTS, terminalId = 'DEFAULT') => {
    // LLave única por terminal para evitar conflictos
    const storageKey = `pos_cart_${terminalId}`;

    // 1. Inicialización: Intentar cargar desde LocalStorage al arrancar
    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem(storageKey);
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error("Error loading cart from LocalStorage:", error);
            return [];
        }
    });

    // 2. Persistencia: Guardar en LocalStorage cada vez que cambie el carrito
    useEffect(() => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(cart));
        } catch (error) {
            console.error("Error saving cart to LocalStorage:", error);
        }
    }, [cart, storageKey]);

    const total = useMemo(() => 
        cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0)
    , [cart]);

    const addToCart = (product) => {
        setCart(prev => {
            let targetProduct = product;
            
            if (product.isAI) {
                const searchName = product.name.toUpperCase();
                const found = PRODUCTS.find(p => 
                    p.name.toUpperCase().includes(searchName) || 
                    searchName.includes(p.name.toUpperCase())
                );

                if (found) {
                    targetProduct = { ...found, quantity: product.quantity || 1 };
                } else {
                    return prev; // Salir si no se encuentra el producto de la IA
                }
            }

            const existing = prev.find(item => item.id === targetProduct.id);
            if (existing) {
                return prev.map(item =>
                    item.id === targetProduct.id ? { ...item, quantity: (item.quantity || 1) + (targetProduct.quantity || 1) } : item
                );
            }
            return [...prev, { ...targetProduct, quantity: targetProduct.quantity || 1, id: targetProduct.id || Date.now() }];
        });
    };

    const updateQuantity = (productId, newQuantity) => {
        setCart(prev => prev.map(item => 
            item.id === productId ? { ...item, quantity: newQuantity } : item
        ));
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem(storageKey);
    };

    return {
        cart,
        setCart,
        total,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart
    };
};

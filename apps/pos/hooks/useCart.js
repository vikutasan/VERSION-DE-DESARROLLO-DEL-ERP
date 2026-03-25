import { useState, useMemo } from 'react';

export const useCart = (PRODUCTS) => {
    const [cart, setCart] = useState([]);

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
                    const looseFound = PRODUCTS.find(p => 
                        p.name.toUpperCase().includes(searchName) || 
                        searchName.includes(p.name.toUpperCase())
                    );
                    if (looseFound) {
                        targetProduct = { ...looseFound, quantity: product.quantity || 1 };
                    } else {
                        return prev;
                    }
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

    const clearCart = () => setCart([]);

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

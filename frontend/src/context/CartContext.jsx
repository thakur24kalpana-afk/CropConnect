import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  // Initialize state from localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        console.log("📦 Initial cart from localStorage:", parsed);
        return parsed;
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
    return [];
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    console.log("💾 Saving cart to localStorage:", cartItems);
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Check if item is in cart
  const isInCart = (cropId) => {
    return cartItems.some(item => item.id === cropId);
  };

  // Add item to cart
  const addToCart = (crop, quantity = 1) => {
    console.log("🛒 addToCart CALLED with:", crop.name, "quantity:", quantity);
    
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === crop.id);
      
      if (existingItem) {
        console.log("📦 Updating existing item:", crop.name);
        const updatedItems = prevItems.map(item =>
          item.id === crop.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        console.log("📦 Updated items:", updatedItems);
        return updatedItems;
      } else {
        console.log("📦 Adding NEW item:", crop.name);
        const newItem = {
          id: crop.id,
          name: crop.name,
          price: crop.price,
          unit: crop.unit || 'quintal',
          farmer: crop.farmer,
          image: crop.image,
          quantity: quantity,
          location: crop.location,
          maxQuantity: crop.quantity
        };
        const newItems = [...prevItems, newItem];
        console.log("📦 New items array:", newItems);
        return newItems;
      }
    });
    
    alert(`✅ ${crop.name} added to cart!`);
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    console.log("🗑️ removeFromCart called for itemId:", itemId);
    setCartItems(prevItems => {
      const newItems = prevItems.filter(item => item.id !== itemId);
      console.log("🗑️ After removal:", newItems);
      return newItems;
    });
  };

  // Update item quantity
  const updateQuantity = (itemId, newQuantity) => {
    console.log("🔄 updateQuantity called for itemId:", itemId, "new quantity:", newQuantity);
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    console.log("🧹 clearCart called");
    setCartItems([]);
  };

  // Get total items count
  const getTotalItems = () => {
    const total = cartItems.reduce((total, item) => total + item.quantity, 0);
    console.log("📊 getTotalItems returning:", total, "from cartItems:", cartItems);
    return total;
  };

  // Get total price
  const getTotalPrice = () => {
    const total = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    return total;
  };

  // Toggle cart drawer
  const toggleCart = () => {
    console.log("🚪 toggleCart called, current isCartOpen:", isCartOpen);
    setIsCartOpen(prev => !prev);
  };

  const value = {
    cartItems,
    isCartOpen,
    isInCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    toggleCart,
    setIsCartOpen
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
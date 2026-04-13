import { useCart } from '../context/CartContext';

function CartDrawer({ darkMode }) {
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    getTotalPrice,
    clearCart 
  } = useCart();

  const totalPrice = getTotalPrice();
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN').format(price);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    alert(`✅ Order placed! Total: ₹${formatPrice(totalPrice)}`);
    clearCart();
    setIsCartOpen(false);
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          animation: 'fadeIn 0.2s ease'
        }}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '100%',
          maxWidth: '400px',
          height: '100vh',
          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
          boxShadow: '-5px 0 25px rgba(0,0,0,0.15)',
          zIndex: 1001,
          animation: 'slideInRight 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <h2 style={{ 
            margin: 0, 
            fontSize: '20px', 
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '24px' }}>🛒</span>
            Your Cart ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              fontSize: '18px',
              cursor: 'pointer',
              color: 'white'
            }}
          >
            ✕
          </button>
        </div>

        {/* Cart Items */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px'
        }}>
          {cartItems.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: darkMode ? '#9ca3af' : '#6b7280'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🛒</div>
              <h3 style={{ color: darkMode ? '#fff' : '#1f2937', marginBottom: '10px' }}>
                Your cart is empty
              </h3>
              <p>Add some crops to get started!</p>
            </div>
          ) : (
            cartItems.map(item => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  gap: '12px',
                  padding: '15px',
                  marginBottom: '12px',
                  backgroundColor: darkMode ? '#374151' : '#f9fafb',
                  borderRadius: '12px',
                  border: `1px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`
                }}
              >
                {/* Image */}
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  flexShrink: 0
                }}>
                  <img 
                    src={item.image || 'https://images.pexels.com/photos/2886937/pexels-photo-2886937.jpeg'} 
                    alt={item.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>

                {/* Details */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '5px'
                  }}>
                    <h4 style={{ 
                      margin: 0, 
                      fontSize: '16px', 
                      fontWeight: '600',
                      color: darkMode ? '#fff' : '#1f2937'
                    }}>
                      {item.name}
                    </h4>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontSize: '14px',
                        padding: '0 5px'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                  
                  <p style={{ 
                    margin: '0 0 8px', 
                    fontSize: '12px',
                    color: darkMode ? '#9ca3af' : '#6b7280'
                  }}>
                    👨‍🌾 {item.farmer}
                  </p>

                  {/* Quantity Controls */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        border: `1px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`,
                        background: darkMode ? '#2d3a4f' : 'white',
                        color: darkMode ? '#fff' : '#1f2937',
                        cursor: 'pointer',
                        fontSize: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      −
                    </button>
                    
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: darkMode ? '#fff' : '#1f2937',
                      minWidth: '30px',
                      textAlign: 'center'
                    }}>
                      {item.quantity}
                    </span>
                    
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        border: `1px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`,
                        background: darkMode ? '#2d3a4f' : 'white',
                        color: darkMode ? '#fff' : '#1f2937',
                        cursor: 'pointer',
                        fontSize: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      +
                    </button>

                    <span style={{
                      marginLeft: 'auto',
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#10b981'
                    }}>
                      ₹{formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div style={{
            padding: '20px',
            borderTop: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
            backgroundColor: darkMode ? '#1f2937' : '#ffffff'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '15px',
              fontSize: '18px',
              fontWeight: '600',
              color: darkMode ? '#fff' : '#1f2937'
            }}>
              <span>Total:</span>
              <span style={{ color: '#10b981' }}>₹{formatPrice(totalPrice)}</span>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={clearCart}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: darkMode ? '#374151' : '#f3f4f6',
                  border: `1px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`,
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: darkMode ? '#fff' : '#1f2937',
                  cursor: 'pointer'
                }}
              >
                Clear Cart
              </button>
              
              <button
                onClick={handleCheckout}
                style={{
                  flex: 2,
                  padding: '12px',
                  background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
                }}
              >
                Checkout
              </button>
            </div>

            <p style={{
              marginTop: '12px',
              fontSize: '12px',
              color: darkMode ? '#9ca3af' : '#6b7280',
              textAlign: 'center'
            }}>
              🚚 Free delivery on orders above ₹10,000
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          80% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}

export default CartDrawer;
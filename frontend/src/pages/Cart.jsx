import { useCart } from "../context/CartContext"
import { useEffect, useState } from "react"

function Cart({ darkMode, onBackToHome }) {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart()
  const [items, setItems] = useState([])
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState('upi')
  const [upiId, setUpiId] = useState('')
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: ''
  })
  
  const DELIVERY_CHARGE = 1100
  const FREE_DELIVERY_THRESHOLD = 10000
  
  // Update items whenever cartItems changes
  useEffect(() => {
    console.log("🔄 Cart page - cartItems changed:", cartItems)
    setItems([...cartItems])
  }, [cartItems])
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN').format(price)
  }

  const subtotal = getTotalPrice()
  
  // Calculate delivery charge based on subtotal
  const deliveryCharge = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE
  const totalPrice = subtotal + deliveryCharge
  
  // Calculate how much more needed for free delivery
  const amountForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal)

  const handleProceedToPay = () => {
    setShowPaymentModal(true)
  }

  const handlePaymentSubmit = () => {
    let paymentMethod = ''
    if (selectedPayment === 'upi') {
      if (!upiId) {
        alert('Please enter your UPI ID')
        return
      }
      paymentMethod = `UPI (${upiId})`
    } else if (selectedPayment === 'card') {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv) {
        alert('Please enter all card details')
        return
      }
      if (cardDetails.number.length < 16) {
        alert('Please enter valid 16-digit card number')
        return
      }
      if (cardDetails.cvv.length < 3) {
        alert('Please enter valid CVV')
        return
      }
      paymentMethod = `Card (****${cardDetails.number.slice(-4)})`
    } else if (selectedPayment === 'netbanking') {
      paymentMethod = 'Net Banking'
    }

    alert(`✅ Order placed successfully!\n\nPayment Method: ${paymentMethod}\n\nOrder Summary:\nTotal Items: ${items.reduce((sum, item) => sum + item.quantity, 0)}\nSubtotal: ₹${formatPrice(subtotal)}\nDelivery Charges: ${deliveryCharge === 0 ? 'FREE' : `₹${formatPrice(deliveryCharge)}`}\nTotal Amount: ₹${formatPrice(totalPrice)}\n\nThank you for shopping with CropConnect!`)
    
    clearCart()
    setShowPaymentModal(false)
    onBackToHome()
  }

  // If cart is empty
  if (!items || items.length === 0) {
    return (
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '40px 20px',
        minHeight: '70vh',
        textAlign: 'center'
      }}>
        <button 
          onClick={onBackToHome}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: '40px'
          }}
        >
          ← Back to Home
        </button>

        <div style={{
          textAlign: 'center',
          padding: '80px 20px',
          background: darkMode ? '#1f2937' : '#f9fafb',
          borderRadius: '24px',
          border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`
        }}>
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>🛒</div>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '600',
            marginBottom: '12px',
            color: darkMode ? '#fff' : '#1f2937'
          }}>
            Your cart is empty
          </h2>
          <p style={{
            fontSize: '16px',
            color: darkMode ? '#9ca3af' : '#6b7280',
            marginBottom: '30px'
          }}>
            Add some crops to get started!
          </p>
          <button
            onClick={onBackToHome}
            style={{
              padding: '14px 32px',
              background: 'linear-gradient(135deg, #4CAF50, #45a049)',
              color: 'white',
              border: 'none',
              borderRadius: '40px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            🌾 Browse Crops
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '40px 20px',
        minHeight: '70vh'
      }}>
        {/* Back Button */}
        <button 
          onClick={onBackToHome}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: '30px'
          }}
        >
          ← Continue Shopping
        </button>

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            margin: 0,
            color: darkMode ? '#fff' : '#1f2937',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '36px' }}>🛒</span>
            Your Cart
          </h1>
          <span style={{
            fontSize: '14px',
            background: '#ef4444',
            color: 'white',
            padding: '6px 14px',
            borderRadius: '30px',
            fontWeight: '600'
          }}>
            {items.reduce((sum, item) => sum + item.quantity, 0)} items
          </span>
        </div>

        {/* Cart Items Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 320px',
          gap: '30px'
        }}>
          {/* Left: Cart Items List */}
          <div style={{
            background: darkMode ? '#1f2937' : '#ffffff',
            borderRadius: '20px',
            border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '20px',
              borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
              background: darkMode ? '#111827' : '#fafafa'
            }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Cart Items ({items.length})</h3>
            </div>

            <div style={{ padding: '20px' }}>
              {items.map((item, index) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '16px',
                    padding: '16px 0',
                    borderBottom: index !== items.length - 1 ? `1px solid ${darkMode ? '#374151' : '#e5e7eb'}` : 'none'
                  }}
                >
                  {/* Image */}
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: darkMode ? '#374151' : '#f3f4f6',
                    flexShrink: 0
                  }}>
                    <img 
                      src={item.image || 'https://images.pexels.com/photos/2886937/pexels-photo-2886937.jpeg'} 
                      alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '8px'
                    }}>
                      <div>
                        <h4 style={{
                          margin: 0,
                          fontSize: '16px',
                          fontWeight: '700',
                          color: darkMode ? '#fff' : '#1f2937'
                        }}>
                          {item.name}
                        </h4>
                        <p style={{
                          margin: '4px 0 0',
                          fontSize: '12px',
                          color: darkMode ? '#9ca3af' : '#6b7280'
                        }}>
                          👨‍🌾 {item.farmer} • {item.location?.split(',')[0] || 'Local'}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontSize: '18px',
                          padding: '5px 10px',
                          borderRadius: '8px'
                        }}
                      >
                        ✕
                      </button>
                    </div>

                    <p style={{
                      fontSize: '14px',
                      color: '#10b981',
                      fontWeight: '600',
                      marginBottom: '10px'
                    }}>
                      ₹{formatPrice(item.price)} / {item.unit}
                    </p>

                    {/* Quantity Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button
                        onClick={() => {
                          const newQty = item.quantity - 1
                          if (newQty >= 1) {
                            updateQuantity(item.id, newQty)
                          } else {
                            removeFromCart(item.id)
                          }
                        }}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          border: `1px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`,
                          background: darkMode ? '#374151' : 'white',
                          color: darkMode ? '#fff' : '#1f2937',
                          cursor: 'pointer',
                          fontSize: '16px'
                        }}
                      >
                        −
                      </button>
                      <span style={{
                        fontSize: '14px',
                        fontWeight: '600',
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
                          background: darkMode ? '#374151' : 'white',
                          color: darkMode ? '#fff' : '#1f2937',
                          cursor: 'pointer',
                          fontSize: '16px'
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
              ))}
            </div>
          </div>

          {/* Right: Order Summary */}
          <div style={{
            background: darkMode ? '#1f2937' : '#ffffff',
            borderRadius: '20px',
            border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
            padding: '24px',
            height: 'fit-content',
            position: 'sticky',
            top: '100px'
          }}>
            <h3 style={{
              margin: '0 0 20px',
              fontSize: '20px',
              fontWeight: '700',
              color: darkMode ? '#fff' : '#1f2937'
            }}>
              Order Summary
            </h3>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '12px',
              padding: '8px 0',
              color: darkMode ? '#9ca3af' : '#6b7280'
            }}>
              <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
              <span>₹{formatPrice(subtotal)}</span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '12px',
              padding: '8px 0',
              color: darkMode ? '#9ca3af' : '#6b7280'
            }}>
              <span>Delivery Charges</span>
              <span style={{ 
                color: deliveryCharge === 0 ? '#10b981' : '#f59e0b',
                fontWeight: deliveryCharge === 0 ? '600' : 'normal'
              }}>
                {deliveryCharge === 0 ? 'FREE' : `₹${formatPrice(deliveryCharge)}`}
              </span>
            </div>

            {/* Free Delivery Progress Bar */}
            {subtotal < FREE_DELIVERY_THRESHOLD && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  fontSize: '12px',
                  color: '#f59e0b',
                  marginBottom: '6px',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>Add ₹{formatPrice(amountForFreeDelivery)} more for FREE delivery</span>
                  <span>{Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100)}%</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '6px',
                  background: darkMode ? '#374151' : '#e5e7eb',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100)}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #f59e0b, #ef4444)',
                    borderRadius: '3px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            )}

            {/* Free Delivery Badge */}
            {subtotal >= FREE_DELIVERY_THRESHOLD && (
              <div style={{
                marginBottom: '16px',
                padding: '8px',
                background: '#10b98120',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '600' }}>
                  🎉 You've unlocked FREE delivery!
                </span>
              </div>
            )}

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '20px',
              padding: '12px 0',
              borderTop: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
              fontSize: '18px',
              fontWeight: '700',
              color: darkMode ? '#fff' : '#1f2937'
            }}>
              <span>Total</span>
              <span style={{ color: '#10b981' }}>₹{formatPrice(totalPrice)}</span>
            </div>

            <button
              onClick={handleProceedToPay}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: '12px',
                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
              }}
            >
              💳 Proceed to Pay
            </button>

            <button
              onClick={clearCart}
              style={{
                width: '100%',
                padding: '12px',
                background: 'none',
                border: `1px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`,
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                color: darkMode ? '#fff' : '#1f2937',
                cursor: 'pointer'
              }}
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '90%',
            maxWidth: '500px',
            backgroundColor: darkMode ? '#1f2937' : '#ffffff',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
            animation: 'slideUp 0.3s ease'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: darkMode ? '#fff' : '#1f2937' }}>
                💳 Select Payment Method
              </h2>
              <button
                onClick={() => setShowPaymentModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: darkMode ? '#9ca3af' : '#6b7280'
                }}
              >
                ✕
              </button>
            </div>

            {/* Payment Options */}
            <div style={{ marginBottom: '24px' }}>
              {/* UPI Option */}
              <div
                onClick={() => setSelectedPayment('upi')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  marginBottom: '12px',
                  borderRadius: '12px',
                  border: `2px solid ${selectedPayment === 'upi' ? '#4CAF50' : (darkMode ? '#374151' : '#e5e7eb')}`,
                  backgroundColor: selectedPayment === 'upi' ? (darkMode ? '#2d3a4f' : '#f0fdf4') : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <span style={{ fontSize: '24px' }}>📱</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', color: darkMode ? '#fff' : '#1f2937' }}>UPI / Google Pay / PhonePe</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Pay using any UPI app</div>
                </div>
                {selectedPayment === 'upi' && <span style={{ color: '#4CAF50' }}>✓</span>}
              </div>

              {/* UPI Input */}
              {selectedPayment === 'upi' && (
                <div style={{ marginLeft: '52px', marginBottom: '12px' }}>
                  <input
                    type="text"
                    placeholder="Enter UPI ID (e.g., name@okhdfcbank)"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: `1px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`,
                      backgroundColor: darkMode ? '#374151' : '#f9fafb',
                      color: darkMode ? '#fff' : '#1f2937',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
              )}

              {/* Card Option */}
              <div
                onClick={() => setSelectedPayment('card')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  marginBottom: '12px',
                  borderRadius: '12px',
                  border: `2px solid ${selectedPayment === 'card' ? '#4CAF50' : (darkMode ? '#374151' : '#e5e7eb')}`,
                  backgroundColor: selectedPayment === 'card' ? (darkMode ? '#2d3a4f' : '#f0fdf4') : 'transparent',
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: '24px' }}>💳</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', color: darkMode ? '#fff' : '#1f2937' }}>Credit / Debit Card</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Visa, Mastercard, RuPay</div>
                </div>
                {selectedPayment === 'card' && <span style={{ color: '#4CAF50' }}>✓</span>}
              </div>

              {/* Card Details Input */}
              {selectedPayment === 'card' && (
                <div style={{ marginLeft: '52px', marginBottom: '12px' }}>
                  <input
                    type="text"
                    placeholder="Card Number (16 digits)"
                    maxLength="16"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({...cardDetails, number: e.target.value.replace(/\D/g, '')})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: `1px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`,
                      backgroundColor: darkMode ? '#374151' : '#f9fafb',
                      color: darkMode ? '#fff' : '#1f2937',
                      fontSize: '14px',
                      marginBottom: '8px',
                      outline: 'none'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      maxLength="5"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '8px',
                        border: `1px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`,
                        backgroundColor: darkMode ? '#374151' : '#f9fafb',
                        color: darkMode ? '#fff' : '#1f2937',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      maxLength="4"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value.replace(/\D/g, '')})}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '8px',
                        border: `1px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`,
                        backgroundColor: darkMode ? '#374151' : '#f9fafb',
                        color: darkMode ? '#fff' : '#1f2937',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Net Banking Option */}
              <div
                onClick={() => setSelectedPayment('netbanking')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  marginBottom: '12px',
                  borderRadius: '12px',
                  border: `2px solid ${selectedPayment === 'netbanking' ? '#4CAF50' : (darkMode ? '#374151' : '#e5e7eb')}`,
                  backgroundColor: selectedPayment === 'netbanking' ? (darkMode ? '#2d3a4f' : '#f0fdf4') : 'transparent',
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: '24px' }}>🏦</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', color: darkMode ? '#fff' : '#1f2937' }}>Net Banking</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>All major banks</div>
                </div>
                {selectedPayment === 'netbanking' && <span style={{ color: '#4CAF50' }}>✓</span>}
              </div>
            </div>

            {/* Order Total */}
            <div style={{
              background: darkMode ? '#374151' : '#f3f4f6',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Total Amount</span>
                <span style={{ fontSize: '20px', fontWeight: '700', color: '#10b981' }}>₹{formatPrice(totalPrice)}</span>
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePaymentSubmit}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Pay ₹{formatPrice(totalPrice)}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  )
}

export default Cart
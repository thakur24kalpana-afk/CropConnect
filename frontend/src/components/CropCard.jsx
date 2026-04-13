import { useState, useRef, useEffect } from "react"
import { useLanguage } from "../LanguageContext"
import { useCart } from "../context/CartContext"
import QuoteModal from "./QuoteModal"

// Realistic ratings for different crops
const cropRatings = {
  "Wheat": 4.8,
  "Rice": 4.7,
  "Corn": 4.5,
  "Barley": 4.3,
  "Millet": 4.6,
  "Soybean": 4.4,
  "Green Gram": 4.7,
  "Black Gram": 4.5,
  "Chickpea": 4.6,
  "Pigeon Pea": 4.4,
  "Potato": 4.8,
  "Onion": 4.6,
  "Tomato": 4.7,
  "Cauliflower": 4.5,
  "Cabbage": 4.4,
  "Brinjal": 4.5,
  "Okra": 4.6,
  "Green Chili": 4.7,
  "Spinach": 4.8,
  "Carrot": 4.7,
  "Radish": 4.3,
  "Pumpkin": 4.4,
  "Bitter Gourd": 4.5,
  "Bottle Gourd": 4.3,
  "Banana": 4.7,
  "Mango": 4.9,
  "Orange": 4.8,
  "Apple": 4.8
}

// Review counts
const reviewCounts = {
  "Wheat": 234,
  "Rice": 189,
  "Corn": 156,
  "Barley": 98,
  "Millet": 112,
  "Soybean": 134,
  "Green Gram": 87,
  "Black Gram": 76,
  "Chickpea": 145,
  "Pigeon Pea": 69,
  "Potato": 312,
  "Onion": 278,
  "Tomato": 298,
  "Cauliflower": 134,
  "Cabbage": 112,
  "Brinjal": 98,
  "Okra": 87,
  "Green Chili": 156,
  "Spinach": 134,
  "Carrot": 167,
  "Radish": 78,
  "Pumpkin": 92,
  "Bitter Gourd": 67,
  "Bottle Gourd": 71,
  "Banana": 245,
  "Mango": 312,
  "Orange": 287,
  "Apple": 298
}

function CropCard({ crop, onViewDetails, darkMode }) {
  const { t } = useLanguage()
  const { addToCart, removeFromCart, isInCart } = useCart()
  const [showDetailsPopup, setShowDetailsPopup] = useState(false)
  const [showOfferPopup, setShowOfferPopup] = useState(false)
  const [showQuoteModal, setShowQuoteModal] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [offerData, setOfferData] = useState({
    offeredPrice: crop?.price || '',
    quantity: crop?.quantity ? Math.min(100, crop.quantity) : 100,
    message: ''
  })
  
  const cardRef = useRef(null)
  const detailsPopupRef = useRef(null)
  const offerPopupRef = useRef(null)

  const inCart = isInCart(crop.id);
  const rating = cropRatings[crop.name] || 4.5
  const reviews = reviewCounts[crop.name] || 120
  const views = crop.views || Math.floor(Math.random() * 300) + 50;
  
  // Calculate price drop percentage if oldPrice exists
  const priceDropPercent = crop.oldPrice && crop.oldPrice > crop.price 
    ? Math.round((1 - crop.price / crop.oldPrice) * 100) 
    : 0;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN').format(price)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (detailsPopupRef.current && !detailsPopupRef.current.contains(event.target) &&
          cardRef.current && !cardRef.current.contains(event.target)) {
        setShowDetailsPopup(false)
      }
      
      if (offerPopupRef.current && !offerPopupRef.current.contains(event.target) &&
          cardRef.current && !cardRef.current.contains(event.target)) {
        setShowOfferPopup(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCardClick = (e) => {
    e.stopPropagation()
    setShowOfferPopup(false)
    setShowDetailsPopup(!showDetailsPopup)
  }

  const handleMakeOfferClick = (e) => {
    e.stopPropagation()
    setShowDetailsPopup(false)
    setShowOfferPopup(true)
    setOfferData({
      offeredPrice: crop.price,
      quantity: Math.min(100, crop.quantity || 100),
      message: ''
    })
  }

  const handleSubmitOffer = (e) => {
    e.preventDefault()
    setShowOfferPopup(false)
    
    const offer = {
      cropId: crop.id,
      cropName: crop.name,
      offeredPrice: offerData.offeredPrice,
      quantity: offerData.quantity,
      message: offerData.message,
      status: 'pending'
    }
    
    if (onViewDetails) {
      onViewDetails(offer)
    }
    
    alert(`✅ Offer sent for ${crop.name}!`)
  }

  const handleOfferChange = (field, value) => {
    setOfferData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddToCart = (e) => {
    e.stopPropagation();
    console.log("🛒 CropCard: Adding to cart:", crop.name, "ID:", crop.id);
    addToCart(crop);
  }

  const handleRemoveFromCart = (e) => {
    e.stopPropagation();
    console.log("🗑️ CropCard: Removing from cart:", crop.name, "ID:", crop.id);
    removeFromCart(crop.id);
  }

  const handleQuoteRequest = (e) => {
    e.stopPropagation();
    setShowQuoteModal(true);
  }

  const handleQuoteSubmit = (quote) => {
    console.log("Quote submitted:", quote);
    alert(`📝 Quote request sent to ${quote.farmerName} for ${quote.quantity} ${crop.unit} of ${quote.cropName}!`);
    setShowQuoteModal(false);
  }

  // IMPROVED RATING DISPLAY
  const renderStars = () => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span style={{ color: '#fbbf24', fontSize: '12px' }}>
          {'★'.repeat(fullStars)}{'☆'.repeat(emptyStars)}
        </span>
        <span style={{ fontSize: '11px', color: '#9ca3af' }}>({rating.toFixed(1)})</span>
        <span style={{ fontSize: '10px', color: '#6b7280' }}>{reviews} reviews</span>
      </div>
    );
  }

  return (
    <div ref={cardRef} style={{ position: 'relative' }}>
      {/* Modern Crop Card */}
      <div 
        className={`crop-card ${darkMode ? 'crop-card-dark' : ''}`}
        onClick={handleCardClick}
        style={{
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          transform: (showDetailsPopup || showOfferPopup) ? 'scale(1.02)' : 'scale(1)',
          boxShadow: (showDetailsPopup || showOfferPopup)
            ? '0 20px 25px -5px rgba(0,0,0,0.2), 0 10px 10px -5px rgba(0,0,0,0.1)' 
            : '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
          border: `1px solid ${darkMode ? '#374151' : '#f0f0f0'}`,
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Image Container */}
        <div style={{ 
          height: '180px', 
          overflow: 'hidden', 
          position: 'relative',
          background: 'linear-gradient(45deg, #667eea20, #764ba220)'
        }}>
          {!imageLoaded && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              zIndex: 1
            }} />
          )}
          <img 
            src={crop.image || 'https://images.pexels.com/photos/2886937/pexels-photo-2886937.jpeg'} 
            alt={crop.name}
            onLoad={() => setImageLoaded(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
              opacity: imageLoaded ? 1 : 0
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          />
          
          {/* ========== ALL BADGES ========== */}
          
          {/* TOP LEFT BADGES - Stacked */}
          <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            
            {/* NEW CROP BADGE */}
            {crop.isNew && (
              <div style={{
                background: '#10b981',
                color: 'white',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}>
                <span>✨</span>
                <span>New</span>
              </div>
            )}
            
            {/* PRICE DROP BADGE */}
            {priceDropPercent > 0 && (
              <div style={{
                background: '#ef4444',
                color: 'white',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}>
                <span>📉</span>
                <span>-{priceDropPercent}%</span>
              </div>
            )}
            
            {/* TRENDING BADGE */}
            {views > 200 && (
              <div style={{
                background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                color: 'white',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}>
                <span>🔥</span>
                <span>Trending</span>
              </div>
            )}
          </div>

          {/* SOLD OUT OVERLAY */}
          {crop.quantity === 0 && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(0,0,0,0.85)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '30px',
              fontSize: '14px',
              fontWeight: '700',
              zIndex: 3,
              backdropFilter: 'blur(4px)',
              whiteSpace: 'nowrap',
              letterSpacing: '1px'
            }}>
              SOLD OUT
            </div>
          )}

          {/* FAST DELIVERY BADGE - Bottom Right */}
          {crop.fastDelivery && (
            <div style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              background: '#3b82f6',
              color: 'white',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '10px',
              fontWeight: '600',
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}>
              <span>⚡</span>
              <span>Fast Delivery</span>
            </div>
          )}

          {/* Organic Badge - Top Right */}
          {crop.organic && (
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'rgba(34, 197, 94, 0.95)',
              color: 'white',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: '600',
              backdropFilter: 'blur(4px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span style={{ fontSize: '12px' }}>🌱</span>
              <span>ORGANIC</span>
            </div>
          )}

          {/* Farmer Badge - Bottom Left */}
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            color: 'white',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            zIndex: 2
          }}>
            <span>👨‍🌾</span>
            <span>{crop.farmer?.split(' ')[0] || 'Farmer'}</span>
          </div>
        </div>
        
        {/* Content Section */}
        <div style={{ 
          padding: '16px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {/* Top Row: Name and Rating */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <h3 style={{ 
              margin: 0, 
              fontSize: '18px', 
              fontWeight: '700',
              color: darkMode ? '#fff' : '#111827',
              letterSpacing: '-0.025em'
            }}>
              {crop.name}
            </h3>
            {renderStars()}
          </div>

          {/* Location */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px',
            color: darkMode ? '#9ca3af' : '#6b7280',
            fontSize: '12px',
            fontWeight: '500'
          }}>
            <span style={{ fontSize: '14px' }}>📍</span>
            <span>{crop.location?.split(',')[0] || 'Local'}</span>
            <span style={{ 
              background: darkMode ? '#374151' : '#f3f4f6',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '10px',
              fontWeight: '600',
              marginLeft: '4px'
            }}>
              {crop.location?.split(',')[1]?.trim() || 'India'}
            </span>
          </div>

          {/* Farmer Name */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px',
            color: darkMode ? '#9ca3af' : '#6b7280',
            fontSize: '12px',
            fontWeight: '500'
          }}>
            <span style={{ fontSize: '14px' }}>👨‍🌾</span>
            <span>{crop.farmer || 'Local Farmer'}</span>
          </div>

          {/* Price Section */}
          <div style={{ 
            marginTop: '8px',
            padding: '12px 0',
            borderTop: `1px solid ${darkMode ? '#374151' : '#f0f0f0'}`,
            borderBottom: `1px solid ${darkMode ? '#374151' : '#f0f0f0'}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              {/* Original Price with Strike-through if discounted */}
              {priceDropPercent > 0 && (
                <span style={{
                  fontSize: '14px',
                  color: '#9ca3af',
                  textDecoration: 'line-through',
                  marginRight: '8px'
                }}>
                  ₹{formatPrice(crop.oldPrice)}
                </span>
              )}
              <span style={{ 
                fontSize: '24px', 
                fontWeight: '700',
                color: darkMode ? '#fff' : '#111827',
                letterSpacing: '-0.025em'
              }}>
                ₹{formatPrice(crop.price)}
              </span>
              <span style={{ 
                fontSize: '13px', 
                color: darkMode ? '#9ca3af' : '#6b7280',
                marginLeft: '4px',
                fontWeight: '500'
              }}>
                /{crop.unit || 'quintal'}
              </span>
            </div>
            
            {/* Stock Indicator */}
            {crop.quantity > 0 ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: darkMode ? '#374151' : '#f3f4f6',
                padding: '4px 10px',
                borderRadius: '20px'
              }}>
                <span style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%',
                  background: crop.quantity > 500 ? '#10b981' : crop.quantity > 200 ? '#f59e0b' : '#ef4444',
                  display: 'inline-block'
                }} />
                <span style={{ 
                  fontSize: '11px', 
                  fontWeight: '600',
                  color: darkMode ? '#9ca3af' : '#4b5563'
                }}>
                  {crop.quantity} {crop.unit}
                </span>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: '#fee2e2',
                padding: '4px 10px',
                borderRadius: '20px'
              }}>
                <span style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%',
                  background: '#ef4444',
                  display: 'inline-block'
                }} />
                <span style={{ 
                  fontSize: '11px', 
                  fontWeight: '600',
                  color: '#dc2626'
                }}>
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Limited Stock Badge */}
          {crop.quantity < 50 && crop.quantity > 0 && (
            <div style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              background: '#ef4444',
              color: 'white',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: '600',
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span>⚠️</span>
              <span>Limited Stock</span>
            </div>
          )}
          
          {/* Quote Request Button */}
          <button 
            onClick={handleQuoteRequest}
            disabled={crop.quantity === 0}
            style={{
              width: '100%',
              padding: '10px',
              background: crop.quantity === 0 
                ? '#9ca3af' 
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: crop.quantity === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              marginBottom: '8px',
              opacity: crop.quantity === 0 ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (crop.quantity > 0) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (crop.quantity > 0) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            <span>📝</span>
            <span>Request Quote</span>
          </button>

          {/* Add to Cart / Remove Button */}
          {crop.quantity > 0 && (
            inCart ? (
              <button 
                onClick={handleRemoveFromCart}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.2)',
                  marginBottom: '8px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.background = '#dc2626';
                  e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.background = '#ef4444';
                  e.target.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.2)';
                }}
              >
                <span>🗑️</span>
                <span>Remove from Cart</span>
              </button>
            ) : (
              <button 
                onClick={handleAddToCart}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(245, 158, 11, 0.2)',
                  marginBottom: '8px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 8px rgba(245, 158, 11, 0.2)';
                }}
              >
                <span>🛒</span>
                <span>Add to Cart</span>
              </button>
            )
          )}

          {/* Quick View Button */}
          <button 
            onClick={handleCardClick}
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              marginTop: '4px',
              boxShadow: '0 4px 6px -1px rgba(102, 126, 234, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 10px 15px -3px rgba(102, 126, 234, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 4px 6px -1px rgba(102, 126, 234, 0.2)'
            }}
          >
            <span>🔍</span>
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Quote Modal */}
      <QuoteModal
        crop={crop}
        isOpen={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
        onSubmit={handleQuoteSubmit}
        darkMode={darkMode}
        triggerRef={cardRef}
      />

      {/* DETAILS POPUP */}
      {showDetailsPopup && !showOfferPopup && (
        <>
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999
            }}
            onClick={() => setShowDetailsPopup(false)}
          />
          
          <div
            ref={detailsPopupRef}
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginTop: '10px',
              width: '300px',
              backgroundColor: darkMode ? '#1f2937' : '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
              zIndex: 1000,
              animation: 'popIn 0.2s ease',
              border: `1px solid ${darkMode ? '#374151' : '#f0f0f0'}`,
              overflow: 'hidden'
            }}
          >
            <div style={{
              position: 'absolute',
              top: '-6px',
              left: '50%',
              transform: 'translateX(-50%) rotate(45deg)',
              width: '12px',
              height: '12px',
              backgroundColor: darkMode ? '#1f2937' : '#ffffff',
              borderLeft: `1px solid ${darkMode ? '#374151' : '#f0f0f0'}`,
              borderTop: `1px solid ${darkMode ? '#374151' : '#f0f0f0'}`,
              zIndex: -1
            }} />

            <div style={{ padding: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                <div style={{ padding: '12px', background: darkMode ? '#374151' : '#f9fafb', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: darkMode ? '#fff' : '#111827' }}>{crop.quantity}</div>
                  <div style={{ fontSize: '11px', color: darkMode ? '#9ca3af' : '#6b7280' }}>Available Stock</div>
                </div>
                <div style={{ padding: '12px', background: darkMode ? '#374151' : '#f9fafb', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: darkMode ? '#fff' : '#111827' }}>{crop.quality || 'A'}</div>
                  <div style={{ fontSize: '11px', color: darkMode ? '#9ca3af' : '#6b7280' }}>Quality Grade</div>
                </div>
              </div>

              <div style={{ background: darkMode ? '#374151' : '#f9fafb', borderRadius: '12px', padding: '12px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: darkMode ? '#9ca3af' : '#6b7280' }}>Season</span>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: darkMode ? '#fff' : '#111827' }}>{crop.season || 'All Year'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', color: darkMode ? '#9ca3af' : '#6b7280' }}>Harvested</span>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: darkMode ? '#fff' : '#111827' }}>{new Date().getMonth() < 6 ? 'Recent' : 'Fresh'}</span>
                </div>
              </div>

              <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '12px', padding: '12px', marginBottom: '16px', color: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', opacity: '0.9' }}>Market Price</span>
                  <span style={{ fontSize: '20px', fontWeight: '700' }}>₹{formatPrice(Math.round(crop.price * 1.15))}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', padding: '6px 8px', background: 'rgba(255,255,255,0.15)', borderRadius: '8px', fontSize: '12px' }}>
                  <span>You Save</span>
                  <span style={{ fontWeight: '600' }}>15% (₹{formatPrice(Math.round(crop.price * 0.15))})</span>
                </div>
              </div>

              {crop.description && (
                <div style={{ padding: '12px', background: darkMode ? '#374151' : '#f9fafb', borderRadius: '12px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: darkMode ? '#9ca3af' : '#6b7280' }}>📝 Description</div>
                  <p style={{ fontSize: '13px', lineHeight: '1.5', color: darkMode ? '#fff' : '#111827', margin: 0 }}>{crop.description}</p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleMakeOfferClick} style={{ flex: 2, padding: '12px', background: 'linear-gradient(135deg, #4CAF50, #45a049)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  💰 Make Offer
                </button>
                <button onClick={(e) => { e.stopPropagation(); console.log('Call button clicked (disabled)') }} style={{ flex: 1, padding: '12px', background: darkMode ? '#374151' : '#e5e7eb', color: darkMode ? '#9ca3af' : '#6b7280', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '600', cursor: 'not-allowed', opacity: 0.7 }}>
                  📞 Call
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* OFFER POPUP */}
      {showOfferPopup && (
        <>
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999
            }}
            onClick={() => setShowOfferPopup(false)}
          />
          
          <div
            ref={offerPopupRef}
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginTop: '10px',
              width: '320px',
              backgroundColor: darkMode ? '#1f2937' : '#ffffff',
              borderRadius: '20px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
              zIndex: 1001,
              animation: 'popIn 0.2s ease',
              border: `1px solid ${darkMode ? '#374151' : '#f0f0f0'}`,
              overflow: 'hidden'
            }}
          >
            <div style={{
              position: 'absolute',
              top: '-6px',
              left: '50%',
              transform: 'translateX(-50%) rotate(45deg)',
              width: '12px',
              height: '12px',
              backgroundColor: darkMode ? '#1f2937' : '#ffffff',
              borderLeft: `1px solid ${darkMode ? '#374151' : '#f0f0f0'}`,
              borderTop: `1px solid ${darkMode ? '#374151' : '#f0f0f0'}`,
              zIndex: -1
            }} />

            <div style={{ padding: '16px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '600' }}>💰 Make Offer</h3>
              <p style={{ margin: 0, fontSize: '13px', opacity: 0.9 }}>{crop.name} • {crop.farmer?.split(' ')[0] || 'Farmer'}</p>
            </div>

            <form onSubmit={handleSubmitOffer} style={{ padding: '16px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '600', color: darkMode ? '#9ca3af' : '#4b5563' }}>Your Offer (₹) *</label>
                <input type="number" value={offerData.offeredPrice} onChange={(e) => handleOfferChange('offeredPrice', parseInt(e.target.value))} min="1" max={crop.price * 2} required style={{ width: '100%', padding: '10px 12px', fontSize: '15px', border: `2px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`, borderRadius: '10px', backgroundColor: darkMode ? '#374151' : '#f9fafb', color: darkMode ? '#fff' : '#111827' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '11px' }}>
                  <span style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}>Listed: ₹{formatPrice(crop.price)}</span>
                  {offerData.offeredPrice < crop.price && <span style={{ color: '#10b981' }}>Save ₹{formatPrice(crop.price - offerData.offeredPrice)}</span>}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '600', color: darkMode ? '#9ca3af' : '#4b5563' }}>Quantity ({crop.unit}) *</label>
                <input type="number" value={offerData.quantity} onChange={(e) => handleOfferChange('quantity', parseInt(e.target.value))} min="1" max={crop.quantity} required style={{ width: '100%', padding: '10px 12px', fontSize: '14px', border: `2px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`, borderRadius: '10px', backgroundColor: darkMode ? '#374151' : '#f9fafb', color: darkMode ? '#fff' : '#111827' }} />
                <div style={{ marginTop: '4px', fontSize: '11px', color: darkMode ? '#9ca3af' : '#6b7280' }}>Available: {crop.quantity} {crop.unit}</div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '600', color: darkMode ? '#9ca3af' : '#4b5563' }}>Message to Farmer</label>
                <textarea value={offerData.message} onChange={(e) => handleOfferChange('message', e.target.value)} placeholder="e.g., I need this for community kitchen. Can pick up immediately." rows="3" style={{ width: '100%', padding: '10px 12px', fontSize: '12px', border: `2px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`, borderRadius: '10px', backgroundColor: darkMode ? '#374151' : '#f9fafb', color: darkMode ? '#fff' : '#111827', resize: 'none' }} />
              </div>

              <div style={{ background: darkMode ? '#374151' : '#f3f4f6', borderRadius: '10px', padding: '12px', marginBottom: '16px', textAlign: 'center' }}>
                <span style={{ fontSize: '13px', color: darkMode ? '#9ca3af' : '#6b7280' }}>Total Value: </span>
                <span style={{ fontSize: '20px', fontWeight: '700', color: darkMode ? '#fff' : '#111827' }}>₹{formatPrice(offerData.offeredPrice * offerData.quantity)}</span>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setShowOfferPopup(false)} style={{ flex: 1, padding: '12px', background: darkMode ? '#374151' : '#f3f4f6', border: `1px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`, borderRadius: '10px', fontSize: '13px', fontWeight: '600', color: darkMode ? '#fff' : '#1f2937', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 2, padding: '12px', background: 'linear-gradient(135deg, #4CAF50, #45a049)', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '600', color: 'white', cursor: 'pointer', boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)' }}>Send Offer</button>
              </div>
            </form>
          </div>
        </>
      )}

      <style>{`
        @keyframes popIn {
          from {
            opacity: 0;
            transform: translateX(-50%) scale(0.95) translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) scale(1) translateY(0);
          }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  )
}

export default CropCard
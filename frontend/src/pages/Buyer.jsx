import { useState, useEffect } from "react"
import CropCard from "../components/CropCard"
import FilterBar from "../components/FilterBar"
import MapView from "../components/MapView"
import { useLanguage } from "../LanguageContext"
import { cropsData } from "../data/cropsData"
import { CartProvider } from "../context/CartContext"
import CartDrawer from "../components/CartDrawer"

function Buyer({ darkMode, onBackToHome, initialCategory = 'all' }) {
  const { t } = useLanguage()
  const [allCrops, setAllCrops] = useState([])
  const [filteredCrops, setFilteredCrops] = useState([])
  const [loading, setLoading] = useState(true)
  const [myOffers, setMyOffers] = useState([])
  const [myQuotes, setMyQuotes] = useState([])
  const [viewMode, setViewMode] = useState('grid')
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)  // ✅ Fixed: useSatate → useState
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    sortBy: 'newest',
    minPrice: '',
    maxPrice: '',
    location: ''
  })

  const categories = [
    { id: "all", name: t('allCrops'), icon: "🌾" },
    { id: "grains", name: t('grains'), icon: "🌾" },
    { id: "pulses", name: t('pulses'), icon: "🌱" },
    { id: "vegetables", name: t('vegetables'), icon: "🥬" },
    { id: "fruits", name: t('fruits'), icon: "🍎" }
  ]

  useEffect(() => {
    setLoading(true)
    try {
      setAllCrops(cropsData)
      
      if (initialCategory !== 'all') {
        const filtered = cropsData.filter(c => c.category === initialCategory)
        setFilteredCrops(filtered)
      } else {
        setFilteredCrops(cropsData)
      }
      
      setError(null)
    } catch (error) {
      console.error('Error loading crops:', error)
      setError(t('error'))
    } finally {
      setLoading(false)
    }
  }, [initialCategory])

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    let filtered = [...allCrops]

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(c => 
        c.category?.toLowerCase() === selectedCategory.toLowerCase()
      )
    }

    if (newFilters.minPrice) {
      filtered = filtered.filter(c => c.price >= parseInt(newFilters.minPrice))
    }
    if (newFilters.maxPrice) {
      filtered = filtered.filter(c => c.price <= parseInt(newFilters.maxPrice))
    }
    
    if (newFilters.location) {
      filtered = filtered.filter(c => 
        c.location?.toLowerCase().includes(newFilters.location.toLowerCase())
      )
    }

    switch (newFilters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        break
    }

    setFilteredCrops(filtered)
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    
    if (category === 'all') {
      setFilteredCrops(allCrops)
    } else {
      const filtered = allCrops.filter(c => 
        c.category?.toLowerCase() === category.toLowerCase()
      )
      setFilteredCrops(filtered)
    }
    
    setFilters({
      sortBy: 'newest',
      minPrice: '',
      maxPrice: '',
      location: ''
    })
  }

  const handleOfferSubmit = (offer) => {
    setMyOffers([...myOffers, { ...offer, status: 'pending' }])
    alert(`✅ Offer sent for ${offer.cropName}!`)
  }

  const handleQuoteSubmit = (quote) => {
    setMyQuotes([...myQuotes, { ...quote, status: 'pending', date: new Date().toLocaleDateString() }])
    alert(`📝 Quote request sent to ${quote.farmerName}!`)
  }

  if (error) {
    return (
      <div className="error-state">
        <h3>❌ {t('error')}</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>{t('retry')}</button>
      </div>
    )
  }

  return (
    <CartProvider>
      <div className="buyer-marketplace animate-page">
        <div className="page-header">
          <button className="back-button" onClick={onBackToHome}>
            <span className="back-icon">←</span>
            <span className="back-text">{t('backToHome')}</span>
          </button>
        </div>

        <div className="marketplace-header">
          <h1>🏢 {t('buyerMarketplace')}</h1>
          <p className="subtitle">{t('browseCrops', { count: allCrops.length })}</p>
        </div>

        <div className="category-filter">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat.id)}
            >
              {cat.icon} {cat.name} 
              {cat.id !== 'all' && `(${allCrops.filter(c => c.category === cat.id).length})`}
            </button>
          ))}
        </div>

        <div className="view-toggle">
          <button 
            className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            📇 {t('gridView')}
          </button>
          <button 
            className={`toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
            onClick={() => setViewMode('map')}
          >
            🗺️ {t('mapView')}
          </button>
        </div>

        {myOffers.length > 0 && (
          <div className="my-offers-summary">
            <h3>💰 {t('myOffers')} ({myOffers.length})</h3>
            <div className="offer-chips">
              {myOffers.map((offer, index) => (
                <div key={index} className="offer-chip">
                  <span>{offer.cropName}</span>
                  <span className="offer-chip-price">₹{offer.offeredPrice}</span>
                  <span className={`offer-status ${offer.status}`}>{offer.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {myQuotes.length > 0 && (
          <div className="my-offers-summary">
            <h3>📝 Quote Requests ({myQuotes.length})</h3>
            <div className="offer-chips">
              {myQuotes.map((quote, index) => (
                <div key={index} className="offer-chip">
                  <span>{quote.cropName}</span>
                  <span className="offer-chip-price">{quote.quantity} {quote.unit}</span>
                  <span className={`offer-status ${quote.status}`}>{quote.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <FilterBar onFilterChange={handleFilterChange} darkMode={darkMode} filters={filters} />

        {!loading && (
          <div className="results-info">
            <p>{t('showing', { filtered: filteredCrops.length, total: allCrops.length })}</p>
          </div>
        )}

        {loading ? (
          <div className="loading-state">
            <div className="loader"></div>
            <p>{t('loading')}</p>
          </div>
        ) : (
          <>
            {filteredCrops.length === 0 ? (
              <div className="no-results-marketplace">
                <span className="no-results-icon">🌾</span>
                <h3>{t('noCrops')}</h3>
                <p>{t('adjustFilters')}</p>
              </div>
            ) : (
              viewMode === 'grid' ? (
                <div className="crops-grid">
                  {filteredCrops.map((crop) => (
                    <CropCard 
                      key={crop.id} 
                      crop={crop} 
                      onViewDetails={handleOfferSubmit}
                      darkMode={darkMode}
                    />
                  ))}
                </div>
              ) : (
                <div className="map-view-section">
                  <MapView 
                    crops={filteredCrops}
                    darkMode={darkMode}
                  />
                  <div className="map-legend">
                    <div className="legend-item">
                      <span className="legend-dot green"></span>
                      <span>{t('farmerLocations')} ({filteredCrops.length})</span>
                    </div>
                    <p className="map-hint">{t('mapHint')}</p>
                  </div>
                </div>
              )
            )}
          </>
        )}
      </div>
      
      <CartDrawer darkMode={darkMode} />
    </CartProvider>
  )
}

export default Buyer
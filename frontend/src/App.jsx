import { useState, useEffect } from "react"
import Navbar from "./components/Navbar"
import Farmer from "./pages/Farmer"
import Buyer from "./pages/Buyer"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Analytics from "./pages/Analytics"
import Cart from "./pages/Cart"
import Footer from "./components/Footer"
import AIChatbot from "./components/AIChatbot"
import { useLanguage } from "./LanguageContext"
import { CartProvider } from "./context/CartContext"

function App() {
  const [role, setRole] = useState(null)
  const [currentPage, setCurrentPage] = useState('home')
  const [darkMode, setDarkMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [preselectedCategory, setPreselectedCategory] = useState('all')
  const { t } = useLanguage()
  const [pageLoaded, setPageLoaded] = useState(false)

  const allCrops = [
    { id: 1,  name: "Wheat",      price: 2200, unit: "Quintal", image: "https://cdn.britannica.com/90/94190-050-C0BA6A58/Cereal-crops-wheat-reproduction.jpg",           category: "grains",     farmer: "Rajesh Kumar",      location: "Ludhiana, Punjab" },
    { id: 2,  name: "Rice",       price: 3100, unit: "Quintal", image: "https://cdn.britannica.com/89/140889-050-EC3F00BF/Ripening-heads-rice-Oryza-sativa.jpg",          category: "grains",     farmer: "Sukhwinder Singh",  location: "Amritsar, Punjab" },
    { id: 3,  name: "Corn",       price: 1800, unit: "Quintal", image: "https://missourisouthernseed.com/wp-content/uploads/2020/02/reids-yellow-dent-corn.jpg",           category: "grains",     farmer: "Amit Patel",        location: "Varanasi, UP" },
    { id: 4,  name: "Barley",     price: 1900, unit: "Quintal", image: "https://www.farmatma.in/wp-content/uploads/2019/05/barley-crop.jpg",                              category: "grains",     farmer: "Harpreet Singh",    location: "Hapur, UP" },
    { id: 5,  name: "Millet",     price: 2600, unit: "Quintal", image: "https://img.freepik.com/premium-photo/raw-ripe-millet-crops-field-agriculture-landscape-view_656518-2279.jpg?w=2000", category: "grains", farmer: "Ramesh Rathod", location: "Jaipur, Rajasthan" },
    { id: 6,  name: "Soybean",    price: 4200, unit: "Quintal", image: "https://tse1.mm.bing.net/th/id/OIP.4Cel8y5QrH8OlID0OSGMogHaE-?rs=1&pid=ImgDetMain&o=7&rm=3",   category: "pulses",     farmer: "Priya Sharma",      location: "Indore, MP" },
    { id: 7,  name: "Green Gram", price: 6500, unit: "Quintal", image: "https://thumbs.dreamstime.com/b/green-gram-crop-field-moong-high-protein-mung-beans-plant-garden-agriculture-mong-bean-220327389.jpg", category: "pulses", farmer: "Vikram Yadav", location: "Jhansi, UP" },
    { id: 8,  name: "Black Gram", price: 5800, unit: "Quintal", image: "https://m.media-amazon.com/images/I/51pjcPf5fyL.jpg",                                             category: "pulses",     farmer: "Lakhan Singh",      location: "Sagar, MP" },
    { id: 9,  name: "Chickpea",   price: 5200, unit: "Quintal", image: "https://images.pexels.com/photos/4110252/pexels-photo-4110252.jpeg",                              category: "pulses",     farmer: "Rafiq Ahmed",       location: "Akola, Maharashtra" },
    { id: 10, name: "Pigeon Pea", price: 6000, unit: "Quintal", image: "https://images.pexels.com/photos/4110252/pexels-photo-4110252.jpeg",                              category: "pulses",     farmer: "Shyam Behari",      location: "Gulbarga, Karnataka" },
    { id: 11, name: "Potato",     price: 1200, unit: "Quintal", image: "https://images.pexels.com/photos/144248/pexels-photo-144248.jpeg",                                category: "vegetables", farmer: "Chhotelal Gupta",   location: "Agra, UP" },
    { id: 12, name: "Onion",      price: 1800, unit: "Quintal", image: "https://images.pexels.com/photos/144248/pexels-photo-144248.jpeg",                                category: "vegetables", farmer: "Dnyaneshwar Patil", location: "Nashik, Maharashtra" },
    { id: 13, name: "Tomato",     price: 1500, unit: "Quintal", image: "https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg",                                category: "vegetables", farmer: "Krishnappa Gowda",  location: "Kolar, Karnataka" },
    { id: 14, name: "Banana",     price: 2500, unit: "Quintal", image: "https://images.pexels.com/photos/61127/pexels-photo-61127.jpeg",                                  category: "fruits",     farmer: "Kannan Raj",        location: "Thanjavur, TN" },
    { id: 15, name: "Mango",      price: 5500, unit: "Quintal", image: "https://images.pexels.com/photos/61127/pexels-photo-61127.jpeg",                                  category: "fruits",     farmer: "Abdul Khan",        location: "Lucknow, UP" },
  ]

  const getCategoryFiltered = () => {
    if (activeCategory === 'all') return allCrops
    return allCrops.filter(c => c.category === activeCategory)
  }

  const featuredCrops = getCategoryFiltered().slice(0, 8)

  const filteredCrops = searchTerm
    ? allCrops.filter(crop =>
        crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : []

  useEffect(() => {
    setPageLoaded(true)
    const savedMode = localStorage.getItem('darkMode')
    if (savedMode) setDarkMode(JSON.parse(savedMode))
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode(!darkMode)
  const handleLoginClick = () => setCurrentPage('login')
  const handleSignupClick = () => setCurrentPage('signup')
  const handleBackToHome = () => { setCurrentPage('home'); setRole(null) }
  const handleCartClick = () => setCurrentPage('cart')
  const handleSearch = (term) => setSearchTerm(term)
  const handleCategoryClick = (category) => {
    setActiveCategory(category)
    setSearchTerm('')
  }

  if (currentPage === 'login')  return <Login  onBackToHome={handleBackToHome} darkMode={darkMode} />
  if (currentPage === 'signup') return <Signup onBackToHome={handleBackToHome} darkMode={darkMode} />

  return (
    <CartProvider>
      <div className={`app-container ${pageLoaded ? 'page-loaded' : ''} ${darkMode ? 'dark-mode' : ''}`}>
        <Navbar
          onLoginClick={handleLoginClick}
          onSignupClick={handleSignupClick}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          onSearch={handleSearch}
          searchTerm={searchTerm}
          onCartClick={handleCartClick}
        />

        {currentPage === 'cart' ? (
          <Cart darkMode={darkMode} onBackToHome={handleBackToHome} />
        ) : (
          <>
            {role === "farmer"    && <Farmer    darkMode={darkMode} onBackToHome={handleBackToHome} />}
            {role === "buyer"     && <Buyer     darkMode={darkMode} onBackToHome={handleBackToHome} initialCategory={preselectedCategory} />}
            {role === "analytics" && <Analytics darkMode={darkMode} onBackToHome={handleBackToHome} />}

            {!role && (
              <div className="page-content animate-page">
                {/* Hero Section */}
                <div className="hero-section">
                  <div className="hero-overlay"></div>
                  <div className="hero-content">
                    <h1 className="hero-title animate-title">{t('heroTitle')}</h1>
                    <p className="hero-subtitle animate-subtitle">{t('heroSubtitle')}</p>

                    <div className="hero-buttons animate-buttons">
                      <button className="hero-btn" onClick={() => setRole("farmer")}>
                        <span className="btn-icon">👨‍🌾</span>
                        {t('farmerBtn')}
                      </button>
                      <button className="hero-btn" onClick={() => {
                        setRole("buyer")
                        setPreselectedCategory(activeCategory)
                      }}>
                        <span className="btn-icon">🏢</span>
                        {t('buyerBtn')}
                      </button>
                      <button className="hero-btn" onClick={() => setRole("analytics")}>
                        <span className="btn-icon">📊</span>
                        Analytics
                      </button>
                    </div>

                    <div className="hero-stats animate-stats">
                      <div className="stat-item">
                        <span className="stat-number">1,247</span>
                        <span className="stat-label">{t('farmers')}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-number">89</span>
                        <span className="stat-label">{t('buyers')}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-number">28</span>
                        <span className="stat-label">{t('crops')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category Pills */}
                <div className="home-categories">
                  {[
                    { id: 'all',        label: 'All',        icon: '🌾' },
                    { id: 'grains',     label: 'Grains',     icon: '🌾' },
                    { id: 'pulses',     label: 'Pulses',     icon: '🌱' },
                    { id: 'vegetables', label: 'Vegetables', icon: '🥬' },
                    { id: 'fruits',     label: 'Fruits',     icon: '🍎' },
                  ].map(cat => (
                    <button
                      key={cat.id}
                      className={`category-pill ${activeCategory === cat.id ? 'active' : ''}`}
                      onClick={() => handleCategoryClick(cat.id)}
                    >
                      {cat.icon} {cat.label}
                      {cat.id !== 'all' && (
                        <span style={{ marginLeft: 4, opacity: 0.7, fontSize: 12 }}>
                          ({allCrops.filter(c => c.category === cat.id).length})
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Search Results OR Featured Crops */}
                {searchTerm ? (
                  <>
                    <div className="search-results-info">
                      <p>{filteredCrops.length} crops found for "{searchTerm}"</p>
                    </div>
                    <div className="featured-crops-grid">
                      {filteredCrops.length === 0 ? (
                        <div className="no-results">🌾 No crops found. Try a different search.</div>
                      ) : (
                        filteredCrops.map(crop => (
                          <CropHomeCard key={crop.id} crop={crop} />
                        ))
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="section-header">
                      <h2>
                        {activeCategory === 'all'
                          ? 'Featured Crops'
                          : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
                      </h2>
                      <p>
                        {activeCategory === 'all'
                          ? 'Fresh from the farms near you'
                          : `${allCrops.filter(c => c.category === activeCategory).length} crops available`}
                      </p>
                    </div>

                    <div className="featured-crops-grid">
                      {featuredCrops.map(crop => (
                        <CropHomeCard key={crop.id} crop={crop} />
                      ))}
                    </div>

                    {/* How It Works */}
                    <div className="how-it-works">
                      <div className="section-header">
                        <h2>How CropConnect Works</h2>
                        <p>Simple, transparent, and fair for everyone</p>
                      </div>
                      <div className="steps-grid">
                        <div className="step-card">
                          <div className="step-icon">📝</div>
                          <h3>Farmers List Crops</h3>
                          <p>Add your crops with price and quantity in minutes</p>
                        </div>
                        <div className="step-card">
                          <div className="step-icon">🔍</div>
                          <h3>Buyers Browse</h3>
                          <p>Search and filter crops by location, price, and type</p>
                        </div>
                        <div className="step-card">
                          <div className="step-icon">💬</div>
                          <h3>Make Offers</h3>
                          <p>Submit offers and negotiate directly with farmers</p>
                        </div>
                        <div className="step-card">
                          <div className="step-icon">🤝</div>
                          <h3>Close Deals</h3>
                          <p>Accept offers and complete transactions smoothly</p>
                        </div>
                      </div>
                    </div>

                    {/* Testimonials */}
                    <div className="testimonials-section">
                      <div className="section-header">
                        <h2>What Farmers & Buyers Say</h2>
                      </div>
                      <div className="testimonials-grid">
                        <div className="testimonial-card">
                          <div className="testimonial-content">
                            "CropConnect helped me sell my wheat directly to NGOs at 20% better price than local mandi."
                          </div>
                          <div className="testimonial-author">
                            <span className="author-name">Rajesh Kumar</span>
                            <span className="author-role">Farmer, Punjab</span>
                          </div>
                        </div>
                        <div className="testimonial-card">
                          <div className="testimonial-content">
                            "We now source fresh vegetables for our hostel directly from farmers. No middlemen, better quality."
                          </div>
                          <div className="testimonial-author">
                            <span className="author-name">Delhi University</span>
                            <span className="author-role">Hostel Kitchen</span>
                          </div>
                        </div>
                        <div className="testimonial-card">
                          <div className="testimonial-content">
                            "The platform is so easy to use. I found buyers for my organic millet in just 2 days!"
                          </div>
                          <div className="testimonial-author">
                            <span className="author-name">Priya Sharma</span>
                            <span className="author-role">Organic Farmer, MP</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}

        {/* AI Chatbot - Floating Button */}
        <AIChatbot />

        <Footer darkMode={darkMode} />
      </div>
    </CartProvider>
  )
}

function CropHomeCard({ crop }) {
  return (
    <div className="modern-crop-card">
      <div className="crop-image-wrapper">
        <img src={crop.image} alt={crop.name} />
        <span className="crop-category">{crop.category}</span>
      </div>
      <div className="crop-details">
        <h3>{crop.name}</h3>
        <p className="crop-farmer">👨‍🌾 {crop.farmer}</p>
        <p className="crop-location">📍 {crop.location}</p>
        <div className="crop-price-row">
          <span className="crop-price">₹{crop.price}</span>
          <span className="crop-unit">/{crop.unit}</span>
        </div>
        <button className="view-crop-btn">View Details →</button>
      </div>
    </div>
  )
}

export default App
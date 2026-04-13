import { useState, useEffect, useRef } from "react"
import { useLanguage } from "../LanguageContext"
import SearchSuggestions from "./SearchSuggestions"
import CartIcon from './CartIcon'

function Navbar({ onLoginClick, onSignupClick, darkMode, toggleDarkMode, onSearch, searchTerm, onCartClick }) {
  const { language, changeLanguage, t } = useLanguage()
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || '')
  const [showSuggestions, setShowSuggestions] = useState(false)
  
  const languageButtonRef = useRef(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    setLocalSearchTerm(searchTerm || '')
  }, [searchTerm])

  useEffect(() => {
    const handleLanguageChange = () => {
      console.log('Language change event detected');
      setShowLanguageDropdown(prev => prev);
    };
    
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          languageButtonRef.current && !languageButtonRef.current.contains(event.target)) {
        setShowLanguageDropdown(false);
      }
      
      if (!event.target.closest('.search-wrapper')) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleLanguageDropdown = () => {
    setShowLanguageDropdown(!showLanguageDropdown);
  }

  const handleLanguageChange = (lang) => {
    console.log('Navbar: Changing language to:', lang);
    changeLanguage(lang);
    setShowLanguageDropdown(false);
  }

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    onSearch(value);
    setShowSuggestions(value.length >= 2);
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
  }

  const handleSuggestionClick = (suggestion) => {
    setLocalSearchTerm(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  }

  const handleClearSearch = () => {
    setLocalSearchTerm('');
    onSearch('');
    setShowSuggestions(false);
  }

  const getLanguageText = () => {
    if (language === 'hi') return 'हिंदी';
    if (language === 'pa') return 'ਪੰਜਾਬੀ';
    return 'English';
  }

  return (
    <nav className={`navbar ${darkMode ? 'navbar-dark' : ''}`}>
      <div className="nav-left">
        <div className="logo" onClick={() => window.location.reload()}>
          <span className="logo-icon">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="16" fill="#16A34A" />
              <path d="M18 8V24" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
              <circle cx="18" cy="8" r="3" fill="#FBBF24" />
              <circle cx="12" cy="12" r="2.5" fill="#FBBF24" />
              <circle cx="24" cy="12" r="2.5" fill="#FBBF24" />
              <circle cx="15" cy="18" r="2.5" fill="#FBBF24" />
              <circle cx="21" cy="18" r="2.5" fill="#FBBF24" />
              <path d="M10 10L6 6M26 10L30 6" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
              <path d="M18 4L22 6L18 8L14 6L18 4Z" fill="#8B5A2B" />
              <circle cx="18" cy="18" r="14" stroke="white" strokeWidth="1.5" fill="none" opacity="0.3" />
            </svg>
          </span>
          <span className="logo-text">CropConnect</span>
        </div>
      </div>

      <div className="search-wrapper">
        <form onSubmit={handleSearchSubmit} className="search-container">
          <input 
            type="text" 
            placeholder={t("searchPlaceholder")} 
            className={`search-bar ${darkMode ? 'search-bar-dark' : ''}`}
            value={localSearchTerm}
            onChange={handleSearchChange}
            onFocus={() => localSearchTerm.length >= 2 && setShowSuggestions(true)}
          />
          <span className="search-icon">🔍</span>
          {localSearchTerm && (
            <button 
              type="button"
              className="clear-search"
              onClick={handleClearSearch}
            >
              ✕
            </button>
          )}
        </form>
        
        {showSuggestions && (
          <SearchSuggestions
            searchTerm={localSearchTerm}
            onSuggestionClick={handleSuggestionClick}
            darkMode={darkMode}
          />
        )}
      </div>

      <div className="nav-right">
        {/* Cart Icon */}
        <CartIcon darkMode={darkMode} onCartClick={onCartClick} />
        
        {/* Dark Mode Toggle */}
        <button 
          className={`dark-mode-toggle ${darkMode ? 'dark' : ''}`}
          onClick={toggleDarkMode}
        >
          <span className="toggle-icon">
            {darkMode ? '☀️' : '🌙'}
          </span>
          <span className="toggle-text">
            {darkMode ? t("light") : t("dark")}
          </span>
        </button>

        {/* Language Selector */}
        <div className="language-selector">
          <button 
            ref={languageButtonRef}
            className={`language-btn ${darkMode ? 'language-btn-dark' : ''}`}
            onClick={toggleLanguageDropdown}
          >
            <span className="language-icon">🌐</span>
            <span className="language-text">
              {getLanguageText()}
            </span>
            <span className="dropdown-arrow">{showLanguageDropdown ? '▲' : '▼'}</span>
          </button>
          
          {showLanguageDropdown && (
            <div 
              ref={dropdownRef}
              className={`language-dropdown ${darkMode ? 'language-dropdown-dark' : ''}`}
            >
              <button 
                className={`language-option ${language === 'en' ? 'active' : ''} ${darkMode ? 'language-option-dark' : ''}`}
                onClick={() => handleLanguageChange('en')}
              >
                <span>🇬🇧</span> English
              </button>
              <button 
                className={`language-option ${language === 'hi' ? 'active' : ''} ${darkMode ? 'language-option-dark' : ''}`}
                onClick={() => handleLanguageChange('hi')}
              >
                <span>🇮🇳</span> हिंदी
              </button>
              <button 
                className={`language-option ${language === 'pa' ? 'active' : ''} ${darkMode ? 'language-option-dark' : ''}`}
                onClick={() => handleLanguageChange('pa')}
              >
                <span>🇮🇳</span> ਪੰਜਾਬੀ
              </button>
            </div>
          )}
        </div>

        {/* Login & Signup Buttons */}
        <div className="nav-buttons">
          <button className={`login-btn ${darkMode ? 'login-btn-dark' : ''}`} onClick={onLoginClick}>
            {t("login")}
          </button>
          <button className={`signup-btn ${darkMode ? 'signup-btn-dark' : ''}`} onClick={onSignupClick}>
            {t("signup")}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
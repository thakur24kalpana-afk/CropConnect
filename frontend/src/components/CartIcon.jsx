import { useCart } from '../context/CartContext';

function CartIcon({ darkMode, onCartClick }) {
  const { getTotalItems } = useCart();
  const itemCount = getTotalItems();

  return (
    <button 
      onClick={onCartClick}
      style={{
        position: 'relative',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '8px 12px',
        borderRadius: '40px',
        backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '16px'
      }}
    >
      <span style={{ fontSize: '20px' }}>🛒</span>
      <span>Cart</span>
      {itemCount > 0 && (
        <span style={{
          position: 'absolute',
          top: '-5px',
          right: '-5px',
          backgroundColor: '#ef4444',
          color: 'white',
          borderRadius: '50%',
          width: '20px',
          height: '20px',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold'
        }}>
          {itemCount}
        </span>
      )}
    </button>
  );
}

export default CartIcon;
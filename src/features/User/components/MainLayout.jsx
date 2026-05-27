import React from 'react';
import logoImg from '../../../assets/top_icon.png';
import { Plus, LogIn, UserPlus, LogOut, Phone } from 'lucide-react';

import '../Style/MainLayout.css';

const MainLayout = ({ 
  children, 
  currentUser, 
  activeView,
  onLogoClick, 
  onRegisterClick, 
  onNewOrderClick, 
  onLoginClick, 
  onLogout,
  onProfileClick,
  onOrdersClick,
  onPricingClick ,
  onContactClick
}) => {

  return (
    <div className="city-car-wrapper">
      <nav className="top-navbar">
        <div className="nav-container">
          <div className="nav-right">
            <img 
              src={logoImg} 
              alt="City Car" 
              className="main-logo" 
              style={{ cursor: 'pointer' }} 
              onClick={onLogoClick} 
            />
            <span className="user-greeting">שלום, {currentUser?.firstName || 'אורח'}</span>
          </div>
          <div className="nav-left">
            <span className="phone-info">* 2319 | 0-2319-2319</span>
            <div className="nav-buttons">
              <button className="btn-white-outline" onClick={onNewOrderClick}>הזמנה חדשה</button>
              
            {!currentUser ? (
                <>
                  <button className="btn-white-outline" onClick={onRegisterClick}>הרשמה</button>
                  <button className="btn-white-outline" onClick={onLoginClick}>התחברות</button>
                </>
              ) : (
                <button className="btn-white-outline" onClick={onLogout}>התנתקות</button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <aside className="right-sidebar">
        <div 
          className={`sidebar-item ${activeView === 'profile' ? 'active' : ''}`} 
          onClick={onProfileClick}
        >
          👤 <span>אזור אישי</span>
        </div>
        
        <div 
          className={`sidebar-item ${activeView === 'orders' ? 'active' : ''}`} 
          onClick={onOrdersClick}
        >
          🚗 <span>הזמנות</span>
        </div>

        <div 
          className={`sidebar-item ${activeView === 'pricing' ? 'active' : ''}`} 
          onClick={onPricingClick}
        >
          ₪ <span>מחירון</span>
        </div>
        <div 
          className={`sidebar-item ${activeView === 'contact' ? 'active' : ''}`} 
          onClick={onContactClick}
          style={{ cursor: 'pointer' }}
        >
          📞 <span>צור קשר</span>
        </div>
       
      </aside>

      <div className="main-scroll-area">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
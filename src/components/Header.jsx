// src/components/Header.jsx
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo">
          <span className="logo-icon">☁️</span>
          <h1>NTU AS 測站監控平台</h1>
        </div>
        
        <nav className="main-nav">
          <ul className="nav-links">
            <li><Link to="/">即時數據</Link></li>
            <li className="nav-right"><Link to="/entertainment">積功德</Link></li>
            <li><Link to="/references">參考資料</Link></li>
          </ul>
        </nav>
        
        <div className="last-updated">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
    </header>
  );
};

export default Header;
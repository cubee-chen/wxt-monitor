// src/components/Header.jsx
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo">
          <span className="logo-icon">☁️</span>
          <h1>Real-Time Weather Monitor</h1>
        </div>
        
        <nav className="main-nav">
          <ul className="nav-links">
            <li><Link to="/">Dashboard</Link></li>
            <li className="nav-right"><Link to="/entertainment">Entertainment</Link></li>
            <li><Link to="/references">References</Link></li>
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
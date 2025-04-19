const Header = () => {
    return (
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">☁️</span>
            <h1>Real-Time Weather Monitor</h1>
          </div>
          <div className="last-updated">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
      </header>
    );
  };
  
  export default Header;
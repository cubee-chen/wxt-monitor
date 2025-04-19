// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Entertainment from './components/Entertainment';
import Footer from './components/Footer';
import { fetchWeatherData } from './services/dataService';
import './assets/styles/global.css';
import './assets/styles/entertainment.css';

function App() {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchWeatherData();
        setWeatherData(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch weather data. Please try again later.');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
    
    // Set up refresh interval (every 5 minutes)
    const interval = setInterval(loadData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleTimeRangeChange = (range) => {
    setSelectedTimeRange(range);
  };

  return (
    <Router>
      <div className="app">
        <Header />
        
        <nav className="app-nav">
          <ul className="nav-links">
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/entertainment">Entertainment</Link></li>
          </ul>
        </nav>
        
        <Routes>
          <Route path="/entertainment" element={<Entertainment />} />
          <Route path="/" element={
            <>
              {loading && <div className="loading">Loading weather data...</div>}
              
              {error && <div className="error-message">{error}</div>}
              
              {!loading && !error && (
                <Dashboard 
                  weatherData={weatherData}
                  selectedTimeRange={selectedTimeRange}
                  onTimeRangeChange={handleTimeRangeChange}
                />
              )}
            </>
          } />
        </Routes>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import CountryDetail from './pages/CountryDetail';
import Navbar from './components/Navbar';
import Favorites from './pages/Favorites';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import { AuthProvider } from './context/AuthContext';

function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen" style={{ backgroundColor: 'var(--primary-bg)' }}>
          <Navbar toggleTheme={toggleTheme} theme={theme} />
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={theme}
          />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/country/:code" element={<CountryDetail />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Reception from './pages/Reception';
import Services from './pages/Services';
import Customers from './pages/Customers';
import Billing from './pages/Billing';
import VisitDetail from './pages/VisitDetail';
import Staff from './pages/Staff';
import Products from './pages/Products';
import { LayoutDashboard, Scissors, Receipt, LogOut, Users, ClipboardList, BarChart3, Package, UserCog, Sun, Moon, Menu, X } from 'lucide-react';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const DashboardLayout = ({ theme, toggleTheme }) => {
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const navItems = [
    { path: '/', icon: ClipboardList, label: 'Reception' },
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/services', icon: Scissors, label: 'Services' },
    { path: '/products', icon: Package, label: 'Inventory' },
    { path: '/staff', icon: UserCog, label: 'Staff' },
    { path: '/customers', icon: Users, label: 'Customers' },
    // { path: '/billing', icon: Receipt, label: 'Billing' }, // Deprecated in favor of Visit flow
  ];

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="layout">
      {/* Mobile Header / Hamburger */}
      <div style={{
        display: 'none', // Hidden on desktop
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 60,
      }} className="mobile-menu-btn">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="btn btn-secondary"
          style={{ padding: '0.5rem', background: 'var(--glass-bg)', backdropFilter: 'blur(10px)' }}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-title">Salon City</div>
        <div style={{ marginBottom: '2rem', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
          <p style={{ margin: 0 }}>J-138, Main Market, Rajori Garden</p>
          <p style={{ margin: 0 }}>New Delhi-110027</p>
          <p style={{ margin: '0.5rem 0 0 0' }}>Contact: 9667722611</p>
        </div>
        <nav style={{ flex: 1 }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setActivePath(item.path)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div style={{ padding: '1rem 0', borderTop: '1px solid var(--glass-border)', marginBottom: '1rem' }}>
          <button
            onClick={toggleTheme}
            className="nav-link"
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              justifyContent: 'flex-start'
            }}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>

        <button onClick={handleLogout} className="nav-link" style={{ marginTop: 'auto', color: 'var(--danger)', border: 'none', background: 'none', cursor: 'pointer', width: '100%' }}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Reception />} />
          <Route path="/visits/:id" element={<VisitDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/services" element={<Services />} />
          <Route path="/products" element={<Products />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/billing" element={<Billing />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <DashboardLayout theme={theme} toggleTheme={toggleTheme} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

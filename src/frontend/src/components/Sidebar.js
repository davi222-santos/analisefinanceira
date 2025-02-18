import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart2, Settings, LogOut, Brain, ArrowLeftRight, X, Menu } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false); // A sidebar começa fechada
  const location = useLocation();

  const toggleSidebar = () => setSidebarVisible(prevState => !prevState);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login'; // Redirecionando para login
  };

  return (
    <>
      <button
        className={`menu-btn ${sidebarVisible ? 'open' : 'closed'}`}
        onClick={toggleSidebar}
        aria-label={sidebarVisible ? 'Fechar menu' : 'Abrir menu'}
      >
        {sidebarVisible ? <X size={24} /> : <Menu size={24} />}
      </button>

      {sidebarVisible && (
        <div className="sidebar-container">
          <div className="sidebar">
            <div className="profile-section">
              <div className="profile-icon">EAM</div>
              <div className="profile-info">
                <div className="profile-name">Olá, EAM Engenharia</div>
              </div>
            </div>

            <nav className="nav-menu">
              <Link
                to="/Dashboard"
                className={`nav-item ${location.pathname === '/Dashboard' ? 'active' : ''}`}
              >
                <Home size={20} />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/transacoes"
                className={`nav-item ${location.pathname === '/transacoes' ? 'active' : ''}`}
              >
                <ArrowLeftRight size={20} />
                <span>Transações</span>
              </Link>
              <Link
                to="/graficos"
                className={`nav-item ${location.pathname === '/graficos' ? 'active' : ''}`}
              >
                <BarChart2 size={20} />
                <span>Gráficos</span>
              </Link>
              <Link
                to="/insights"
                className={`nav-item ${location.pathname === '/insights' ? 'active' : ''}`}
              >
                <Brain size={20} />
                <span>Insights</span>
              </Link>
              <Link
                to="/configuracoes"
                className={`nav-item ${location.pathname === '/configuracoes' ? 'active' : ''}`}
              >
                <Settings size={20} />
                <span>Configurações</span>
              </Link>
              <div
                className="nav-item"
                onClick={handleLogout}
                aria-label="Sair"
              >
                <LogOut size={20} />
                <span>Sair</span>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;

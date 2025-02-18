import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, BarChart2, Settings, LogOut, Brain, ArrowLeftRight, X, Menu } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false); 
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarVisible(prevState => !prevState);

  const handleLogout = () => {
    const isConfirmed = window.confirm('Você tem certeza que deseja sair e voltar ao login?');
    if (isConfirmed) {
      localStorage.removeItem('authToken');
      navigate('/login'); // Redireciona para a página de login
    }
  };

  const closeSidebar = () => setSidebarVisible(false);

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
              <div className="profile-icon">U</div>
              <div className="profile-info">
                <div className="profile-name">Olá, Usuário</div>
              </div>
            </div>

            <nav className="nav-menu">
              <Link
                to="/Dashboard"
                className={`nav-item ${location.pathname === '/Dashboard' ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <Home size={20} />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/transacoes"
                className={`nav-item ${location.pathname === '/transacoes' ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <ArrowLeftRight size={20} />
                <span>Transações</span>
              </Link>
              <Link
                to="/graficos"
                className={`nav-item ${location.pathname === '/graficos' ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <BarChart2 size={20} />
                <span>Gráficos</span>
              </Link>
              <Link
                to="/insights"
                className={`nav-item ${location.pathname === '/insights' ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <Brain size={20} />
                <span>Insights</span>
              </Link>
              <Link
                to="/relatorios"
                className={`nav-item ${location.pathname === '/relatorios' ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <Settings size={20} />
                <span>Relatórios</span>
              </Link>
              <div
                className="nav-item"
                onClick={() => {
                  handleLogout(); // Chama a função de logout
                  closeSidebar(); 
                }}
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



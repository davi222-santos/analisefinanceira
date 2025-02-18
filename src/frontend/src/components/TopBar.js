import React from 'react';
import { useLocation } from 'react-router-dom';
import './TopBar.css';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/transacoes': 'Transações',
  '/graficos': 'Gráficos',
  '/insights': 'Insights',
  '/relatorios': 'Relatórios',
};

const Topbar = () => {
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || 'Dashboard';

  return (
    <div className="topbar">
      <div className="topbar-left">
        <h2>{pageTitle}</h2>
      </div>
      <div className="topbar-right">
      </div>
    </div>
  );
};

export default Topbar;

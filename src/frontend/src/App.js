import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from "./components/Sidebar";
import Topbar from './components/TopBar';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Transacoes from './pages/Transacoes/Transacoes';
import Graficos from './pages/Graficos/Graficos';
import Insights from './pages/Insights/Insights';
import './App.css';

function Layout() {
    const location = useLocation();

    // Condicionalmente renderiza Sidebar e Topbar
    const showSidebarAndTopbar = location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/register';

    return (
        <>
            {showSidebarAndTopbar && <Sidebar />}
            {showSidebarAndTopbar && <Topbar />}
        </>
    );
}

function App() {
    return (
        <Router>
            <Layout />
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/transacoes" element={<Transacoes />} />
                    <Route path="/graficos" element={<Graficos />} />
                    <Route path="/insights" element={<Insights />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;


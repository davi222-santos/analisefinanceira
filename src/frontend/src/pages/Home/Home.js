import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import exampleImage from '../../assets/images/1.png';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <header className="home-header">
                <div className="home-logo">$</div>
                <button className="home-login-button" onClick={() => navigate('/login')}>
                    Login
                </button>
            </header>

            <div className="home-content">
                <div className="home-text">
                    <h1>Organize suas finanças, tome decisões mais inteligentes.</h1>
                    <button
                        className="home-create-account"
                        onClick={() => navigate('/register')}
                    >
                        Crie sua conta
                        <span className="arrow">→</span>
                    </button>
                </div>

                <div className="home-image">
                    <img src={exampleImage} alt="Homem analisando gráficos no computador" />
                </div>
            </div>
        </div>
    );
};

export default Home;


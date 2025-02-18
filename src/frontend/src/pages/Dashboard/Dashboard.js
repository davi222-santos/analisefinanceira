import React, { useEffect, useState } from 'react';
import { getTransacoes } from '../../services/transacoesService';
import { Link } from "react-router-dom";
import './Dashboard.css';

const formatarValor = (valor) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
};

const Dashboard = () => {
  const userId = localStorage.getItem('userId');
  const [transacoes, setTransacoes] = useState([]);
  const [receita, setReceita] = useState(0);
  const [despesa, setDespesa] = useState(0);
  const [lucro, setLucro] = useState(0);
  const [mesSelecionado, setMesSelecionado] = useState("");

  useEffect(() => {
    getTransacoes(userId).then((data) => {
      setTransacoes(data);
    });
  }, [userId]);

  useEffect(() => {
    // Define o mês atual no formato "YYYY-MM"
    const mesAtual = new Date().toISOString().slice(0, 7);
    setMesSelecionado(mesAtual);
  }, []);

  useEffect(() => {
    if (!mesSelecionado) return;

    const transacoesFiltradas = transacoes.filter((t) => {
      const dataTransacao = new Date(t.data); 
      const mesAnoTransacao = dataTransacao.toISOString().slice(0, 7);
      return mesAnoTransacao === mesSelecionado;
    });

    const totalReceita = transacoesFiltradas
      .filter((t) => t.tipo === 'entrada')
      .reduce((acc, t) => acc + t.valor, 0);

    const totalDespesa = transacoesFiltradas
      .filter((t) => t.tipo === 'saida')
      .reduce((acc, t) => acc + t.valor, 0);

    setReceita(totalReceita);
    setDespesa(totalDespesa);
    setLucro(totalReceita - totalDespesa);
  }, [mesSelecionado, transacoes]);

  return (
    <div className="dashboard-container">
      <div className="main-content">
        {/* Seletor de mês */}
        <div className="month-selector">
          <label htmlFor="mes">Selecione o mês:</label>
          <input 
            type="month" 
            id="mes" 
            value={mesSelecionado} 
            onChange={(e) => setMesSelecionado(e.target.value)}
          />
        </div>

        <div className="summary-cards">
          <div className="card summary-card">
            <div className="card-header">
              <h2>Receita Mensal</h2>
            </div>
            <div className="card-content">
              <div className="amount income">{formatarValor(receita)}</div>
            </div>
          </div>

          <div className="card summary-card">
            <div className="card-header">
              <h2>Despesa Mensal</h2>
            </div>
            <div className="card-content">
              <div className="amount expense">{formatarValor(despesa)}</div>
            </div>
          </div>

          <div className="card summary-card">
            <div className="card-header">
              <h2>Lucro Líquido</h2>
            </div>
            <div className="card-content">
              <div className="amount profit">{formatarValor(lucro)}</div>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="card activities-card">
            <div className="card-header">
              <h2>Sua última atividade</h2>
            </div>
            <div className="card-content">
              <div className="activities-list">
                {transacoes
                  .filter((t) => new Date(t.data).toISOString().slice(0, 7) === mesSelecionado)
                  .slice(0, 5)
                  .map((t) => (
                    <p key={t._id}>{t.descricao} - {formatarValor(t.valor)}</p>
                  ))
                }
              </div>
              <Link to="/transacoes">
                <button className="view-all">Ver toda sua atividade &gt;</button>
              </Link>
            </div>
          </div>

          <div className="charts-section">
            <div className="card pie-chart-container">
              {/* Pie chart será renderizado aqui */}
            </div>
            <div className="card bar-chart-container">
              {/* Bar chart será renderizado aqui */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


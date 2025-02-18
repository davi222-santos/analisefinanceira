import React, { useEffect, useState } from 'react';
import { getTransacoes } from '../../services/transacoesService';
import { Link } from "react-router-dom";
import './Dashboard.css';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Registra os elementos do Chart.js que você vai usar
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

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

  // Dados para o gráfico de pizza (Receita vs. Despesa)
  const pieData = {
    labels: ['Receita', 'Despesa'],
    datasets: [
      {
        data: [receita, despesa],
        backgroundColor: ['#4CAF50', '#F44336'],
        borderColor: ['#388E3C', '#D32F2F'],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: ['Receita', 'Despesa', 'Lucro Líquido'],
    datasets: [
      {
        label: 'Receita',  
        data: [receita, despesa, lucro],
        backgroundColor: ['#4CAF50', '#F44336', '#2d3a67'],
        borderColor: ['#388E3C', '#D32F2F', '#1976D2'],
        borderWidth: 1,
      },
    ],
  };

  // Função para aplicar a cor de acordo com o tipo de transação
  const getTransactionClass = (tipo) => {
    return tipo === 'entrada' ? 'income' : 'expense';
  };

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
              <div className={`amount ${getTransactionClass('entrada')}`}>{formatarValor(receita)}</div>
            </div>
          </div>

          <div className="card summary-card">
            <div className="card-header">
              <h2>Despesa Mensal</h2>
            </div>
            <div className="card-content">
              <div className={`amount ${getTransactionClass('saida')}`}>{formatarValor(despesa)}</div>
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
                    <p key={t._id} className={getTransactionClass(t.tipo)}>
                      {t.descricao} - {formatarValor(t.valor)}
                    </p>
                  ))}
              </div>
              <Link to="/transacoes">
                <button className="view-all">Ver toda sua atividade &gt;</button>
              </Link>
            </div>
          </div>

          <div className="charts-section">
            <div className="card pie-chart-container">
              <Pie data={pieData} />
            </div>
            <div className="card bar-chart-container">
              <Bar data={barData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Dashboard;





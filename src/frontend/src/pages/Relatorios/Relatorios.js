import React, { useState, useEffect } from 'react';
import { getTransacoes } from '../../services/transacoesService'; 
import { jsPDF } from "jspdf"
import "./Relatorios.css"


const formatarValor = (valor) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
};

const formatarData = (data) => {
  return new Date(data).toLocaleDateString('pt-BR');
};

const Relatorios = () => {
  const userId = localStorage.getItem('userId');
  const [transacoes, setTransacoes] = useState([]);
  const [filtroMes, setFiltroMes] = useState('');
  const [filtroAno, setFiltroAno] = useState('');

  useEffect(() => {
    getTransacoes(userId).then((data) => {
      setTransacoes(data);
    });
  }, [userId]);

  const filtrarTransacoes = () => {
    return transacoes.filter((transacao) => {
      const data = new Date(transacao.data);
      return (
        (filtroMes ? data.getMonth() + 1 === parseInt(filtroMes) : true) &&
        (filtroAno ? data.getFullYear() === parseInt(filtroAno) : true)
      );
    });
  };

  const gerarRelatorioPDF = () => {
    const doc = new jsPDF();
    const transacoesFiltradas = filtrarTransacoes();
  
    doc.text("Relatório de Transações", 10, 10);
    doc.text(`Período: ${filtroMes ? `${filtroMes} de ${filtroAno}` : filtroAno ? `Ano de ${filtroAno}` : "Todos"}`, 10, 20);
  
    let y = 30; // Início para listagem
    transacoesFiltradas.forEach((transacao) => {
      const tipoTransacao = transacao.tipo === 'entrada' ? 'Receita' : 'Despesa';  // Altera para 'entrada' ou 'saída'
      doc.text(`${formatarData(transacao.data)} - ${transacao.descricao} - ${formatarValor(transacao.valor)} - ${tipoTransacao}`, 10, y);
      y += 10;
    });
  
    doc.save("relatorio_transacoes.pdf");
  };
  
  return (
    <div className="relatorios-container">
      <div className="filtros-container">
        <h2>Filtrar Relatório</h2>
        <div className="filtro-item">
          <label htmlFor="mes">Mês:</label>
          <select
            id="mes"
            value={filtroMes}
            onChange={(e) => setFiltroMes(e.target.value)}
          >
            <option value="">Todos</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(2023, i).toLocaleString('pt-BR', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>
        <div className="filtro-item">
          <label htmlFor="ano">Ano:</label>
          <input
            id="ano"
            type="number"
            value={filtroAno}
            onChange={(e) => setFiltroAno(e.target.value)}
            placeholder="Ex: 2024"
          />
        </div> 
        {/* Botão para gerar o PDF */}
        <button onClick={gerarRelatorioPDF}>Gerar Relatório em PDF</button>
      </div>
    </div>
  );
  
};

export default Relatorios;

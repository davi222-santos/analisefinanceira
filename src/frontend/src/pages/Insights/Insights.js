import React, { useState } from 'react';
import { obterInsights } from '../../services/insightsService';
import { jsPDF } from 'jspdf'; // Importando jsPDF
import "./Insights.css";

const InsightsForm = () => {
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');
  const [insights, setInsights] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const periodo = { inicio, fim };

    try {
      const data = await obterInsights(periodo);
      setInsights(data.insights);
    } catch (error) {
      console.error('Erro ao obter insights:', error);
    }
  };

  const gerarPDF = () => {
    const doc = new jsPDF();

    // Usando a fonte padrão (Helvetica)
    const text = insights || 'Nenhum insight disponível';

    doc.setFont('helvetica'); // Usando a fonte Helvetica
    doc.setFontSize(12);
    doc.text('Insights:', 10, 20); // Título

    // Dividindo o texto longo em várias linhas, se necessário
    const margins = { top: 30, left: 10, bottom: 10 };
    const maxWidth = 180; // Largura máxima do texto para caber na página
    const lineHeight = 10;

    // Ajuste automático do texto para caber na página
    const lines = doc.splitTextToSize(text, maxWidth);

    let yPosition = margins.top + lineHeight; // Início da posição Y

    // Adicionando as linhas no PDF
    lines.forEach((line) => {
      // Verifica se o texto ultrapassou o limite da página
      if (yPosition > doc.internal.pageSize.height - margins.bottom) {
        doc.addPage(); // Adiciona uma nova página
        yPosition = margins.top + lineHeight; // Reseta a posição Y para o topo da nova página
      }
      doc.text(line, margins.left, yPosition);
      yPosition += lineHeight; // Move para a próxima linha
    });

    // Baixando o PDF gerado
    doc.save('insights.pdf');
  };

  return (
    <div className="insights-form">
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Data de Início:
            <input
              type="date"
              value={inicio}
              onChange={(e) => setInicio(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Data de Fim:
            <input
              type="date"
              value={fim}
              onChange={(e) => setFim(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">Enviar</button>
      </form>

      {insights && (
        <div className="insights-result">
          <h3>Insights:</h3>
          <pre>{insights}</pre>
        </div>
      )}

      {/* Botão para gerar o PDF */}
      {insights && (
        <button onClick={gerarPDF}>Baixar Insights em PDF</button>
      )}
    </div>
  );
};

export default InsightsForm;

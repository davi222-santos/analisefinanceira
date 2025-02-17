import React, { useState } from 'react';
import { obterGrafico } from '../../services/graficosService'; // Importa o serviço

const Grafico = () => {
  const [inicio, setInicio] = useState(null); // Data de início
  const [fim, setFim] = useState(null); // Data de fim
  const [graficoTipo, setGraficoTipo] = useState('linhas'); // Tipo de gráfico
  const [dadosGrafico, setDadosGrafico] = useState(null); // Dados do gráfico
  const [erro, setErro] = useState(null); // Erros ao carregar os dados

  // Função que converte a data para o formato 'YYYY-MM-DD'
  const formatarData = (data) => {
    if (!data) return null;
    return data.toISOString().split('T')[0]; // Retorna apenas a parte da data
  };

  // Função que chama o serviço para obter os dados do gráfico
  const obterDados = async () => {
    if (!inicio || !fim) {
      setErro('Por favor, selecione as datas de início e fim');
      return;
    }

    try {
      const dados = await obterGrafico(
        { inicio: formatarData(inicio), fim: formatarData(fim) }, // Envia o período com formato correto
        graficoTipo // Envia o tipo de gráfico
      );
      setDadosGrafico(dados); // Armazena os dados obtidos
      setErro(null); // Limpa qualquer erro anterior
    } catch (erro) {
      setErro('Erro ao carregar gráfico');
    }
  };

  return (
    <div>
      <h2>Gerar gráfico</h2>
      
      {/* Seletor de data de início */}
      <div>
        <label>
          Data Início:
          <input
            type="date"
            value={inicio ? formatarData(inicio) : ''}
            onChange={(e) => setInicio(new Date(e.target.value))} // Atualiza a data de início
          />
        </label>
      </div>

      {/* Seletor de data de fim */}
      <div>
        <label>
          Data Fim:
          <input
            type="date"
            value={fim ? formatarData(fim) : ''}
            onChange={(e) => setFim(new Date(e.target.value))} // Atualiza a data de fim
            min={inicio ? formatarData(inicio) : ''} // Impede a seleção de uma data de fim anterior à de início
          />
        </label>
      </div>

      {/* Dropdown para selecionar o tipo de gráfico */}
      <div>
        <label>
          Tipo de Gráfico:
          <select value={graficoTipo} onChange={(e) => setGraficoTipo(e.target.value)}>
            <option value="linhas">Linhas</option>
            <option value="barras">Barras</option>
            <option value="pizza">Pizza</option>
            <option value="fluxo_de_caixa">Fluxo de Caixa</option>
          </select>
        </label>
      </div>

      <button onClick={obterDados}>Obter Gráfico</button>

      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      {dadosGrafico && (
        <div>
          <h2>Gráfico {graficoTipo} de {inicio ? inicio.toLocaleDateString() : 'não selecionada'} a {fim ? fim.toLocaleDateString() : 'não selecionada'}</h2>
          {/* Aqui você pode integrar a renderização do gráfico com uma biblioteca como Chart.js ou Recharts */}
          {/* Exemplo com Chart.js */}
          <canvas id="graficoCanvas"></canvas>
        </div>
      )}
    </div>
  );
};

export default Grafico;



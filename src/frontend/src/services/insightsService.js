// src/services/insightsService.js
import API_URL from './config';  // Importa a URL da API do arquivo de configuração

export const obterInsights = async (periodo) => {
    try {
      const response = await fetch(`${API_URL}/api/insights`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ periodo }),
      });
  
      if (response.ok) {
        const data = await response.json();
        return data;  // Retorna os insights e dados para o front-end
      } else {
        console.error('Erro ao obter dados da API');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };
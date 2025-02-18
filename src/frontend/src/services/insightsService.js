// src/services/insightsService.js
import API_URL from './config';

export const obterInsights = async (periodo) => {
    try {
      const response = await fetch(`${API_URL}/api/insights`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ periodo: periodo, user_id: localStorage.getItem('userId'), }),
      });
  
      if (response.ok) {
        const data = await response.json();
        return data;  // Retorna os insights e dados para o front-end
      } else {
        console.error('Erro ao obter dados da API');
        return { insights: "Erro ao obter dados" };
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };
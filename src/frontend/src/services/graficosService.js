// src/services/graficoService.js

import API_URL from "./config"; // Importa a URL da API do arquivo de configuração

export const obterGrafico = async (periodo, graficoTipo) => {
  try {
    const resposta = await fetch(`${API_URL}/api/grafico`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        periodo: periodo, // Envia o objeto periodo { inicio, fim }
        grafico: graficoTipo, // Envia o tipo de gráfico
      }),
    });

    if (!resposta.ok) {
      throw new Error('Erro ao obter gráfico');
    }

    // Converte a resposta para um blob (arquivo de imagem)
    const blob = await resposta.blob();
    const urlImagem = URL.createObjectURL(blob); // Cria um URL temporário para exibir a imagem

    return urlImagem; // Retorna a URL da imagem para ser usada no front-end
  } catch (erro) {
    console.error('Erro ao obter gráfico:', erro);
    throw erro; // Lança o erro para ser tratado no componente que chama o serviço
  }
};




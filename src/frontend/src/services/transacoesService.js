// src/services/transacaoServices.js

import API_URL from './config';

// Função para inserir uma transação
export async function inserirTransacao(dados) {
  try {
    const response = await fetch(`${API_URL}/api/transacoes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(dados),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Transação cadastrada com sucesso', data);
      return data;
    } else {
      const errorData = await response.json();
      console.error('Erro ao cadastrar transação:', errorData);
      return errorData;
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
}

// Função para obter as transações de um usuário
export async function getTransacoes(userId) {
  try {
    const response = await fetch(`${API_URL}/api/transacoes/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    });

    if (response.ok) {
      const transacoes = await response.json();
      console.log('Transações encontradas:', transacoes);
      return transacoes;
    } else {
      const errorData = await response.json();
      console.error('Erro ao obter transações:', errorData);
      return errorData;
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
}

// Função para remover uma transação
export async function removerTransacao(id) {
    try {
      const response = await fetch(`${API_URL}/api/transacoes/${id}`, {
        method: 'DELETE',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      });
  
      if (response.ok) {
        console.log('Transação removida com sucesso');
        return true;
      } else {
        const errorData = await response.json();
        console.error('Erro ao remover transação:', errorData);
        return false;
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      return false;
    }
  }
  
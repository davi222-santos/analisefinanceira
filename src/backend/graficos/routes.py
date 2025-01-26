import os, sys

# Configura o diretório base do projeto
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(BASE_DIR)

from flask import Blueprint, request, jsonify
from graficos.utils.grafico_linhas import gerar_grafico_linhas
from graficos.utils.grafico_barras import gerar_grafico_barras
from graficos.utils.grafico_pizza import gerar_grafico_pizza
from graficos.utils.grafico_fluxo_caixa import gerar_grafico_fluxo_caixa
import os

graficos_bp = Blueprint('graficos', __name__)

@graficos_bp.route('/api/grafico', methods=['POST'])
def criar_grafico():
    dados = request.get_json()
    periodo = dados.get('periodo')
    metricas = dados.get('metricas')
    grafico = dados.get('grafico')

    if not periodo or not metricas or not grafico:
        return jsonify({'error': 'Dados incompletos'}), 400

    tipos_grafico = ['linhas', 'barras', 'pizza', 'fluxo_de_caixa']
    if grafico not in tipos_grafico:
        return jsonify({'error': 'Tipo de gráfico inválido'}), 400

    if grafico == 'linhas':
        return gerar_grafico_linhas(metricas)
    elif grafico == 'barras':
        return gerar_grafico_barras(metricas)
    elif grafico == 'pizza':
        return gerar_grafico_pizza(metricas)
    elif grafico == 'fluxo_de_caixa':
        return gerar_grafico_fluxo_caixa(metricas)

@graficos_bp.after_request
def remover_imagens(response):
    arquivos = [
        'src/backend/graficos/utils/grafico_linhas.png',
        'src/backend/graficos/utils/grafico_barras.png',
        'src/backend/graficos/utils/grafico_pizza.png',
        'src/backend/graficos/utils/grafico_fluxo_caixa.png'
    ]
    
    for arquivo in arquivos:
        try:
            if os.path.exists(arquivo): 
                os.remove(arquivo)      
        except Exception as e:
            print(f"Erro ao tentar excluir o arquivo {arquivo}: {e}")
    
    return response

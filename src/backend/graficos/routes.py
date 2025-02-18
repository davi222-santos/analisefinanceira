import os, sys
from datetime import datetime

# Configura o diretório base do projeto
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(BASE_DIR)

from flask import Blueprint, request, jsonify
from graficos.utils.grafico_linhas import gerar_grafico_linhas
from graficos.utils.grafico_barras import gerar_grafico_barras
from graficos.utils.grafico_pizza import gerar_grafico_pizza
from graficos.utils.grafico_fluxo_caixa import gerar_grafico_fluxo_caixa
from db import coll_transacoes
from util.auth import token_required

graficos_bp = Blueprint('graficos', __name__)


def criar_metricas(inicio, fim):
    inicio = datetime.strptime(inicio, '%Y-%m-%d')
    fim = datetime.strptime(fim, '%Y-%m-%d')

    transacoes = coll_transacoes.find({
        'data': {'$gte': inicio, '$lte': fim}
    })

    receita = 0
    despesas = 0

    for transacao in transacoes:
        valor = float(transacao['valor'])  # Garantindo que o valor seja numérico
        if transacao['tipo'] == 'entrada':
            receita += valor
        elif transacao['tipo'] == 'saida':
            despesas += valor

    lucro = receita - despesas

    metricas = {
        "Receita": receita,
        "Despesas": despesas,
        "Lucro": lucro
    }    

    print(metricas)

    return metricas


@graficos_bp.route('/api/grafico', methods=['POST'])
@token_required
def criar_grafico(token):
    dados = request.get_json()
    
    # Verifica se os dados necessários estão presentes
    if not dados or not dados.get('periodo') or not dados.get('grafico'):
        return jsonify({'error': 'Dados incompletos'}), 400

    periodo = dados['periodo']
    grafico = dados['grafico']

    inicio = periodo.get('inicio')
    fim = periodo.get('fim')

    metricas = criar_metricas(inicio, fim)

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


@graficos_bp.route('/api/grafico/delete', methods=['POST'])
@token_required
def deletar_grafico(token):
    dados = request.get_json()
    tipo = dados.get('grafico')

    arquivos = {
        'linhas': 'src/backend/graficos/utils/grafico_linhas.png',
        'barras': 'src/backend/graficos/utils/grafico_barras.png',
        'pizza': 'src/backend/graficos/utils/grafico_pizza.png',
        'fluxo_de_caixa': 'src/backend/graficos/utils/grafico_fluxo_caixa.png'
    }

    caminho_arquivo = arquivos.get(tipo)

    if caminho_arquivo and os.path.exists(caminho_arquivo):
        try:
            os.remove(caminho_arquivo)
            return jsonify({'message': 'Arquivo excluído com sucesso'}), 200
        except Exception as e:
            return jsonify({'error': f'Erro ao excluir o arquivo: {e}'}), 500
    
    return jsonify({'error': 'Arquivo não encontrado'}), 404


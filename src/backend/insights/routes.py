import os, sys
from datetime import datetime
from util.auth import token_required
from bson import ObjectId

# Configura o diretório base do projeto
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(BASE_DIR)
from flask import Blueprint, jsonify, request
from db import coll_transacoes

from insights.prompts import format_prompt_insights
from insights.gemini import get_gemini_response

insights_bp = Blueprint('insights', __name__)


@insights_bp.route('/api/insights', methods=['POST'])
@token_required
def insights(token):
    dados = request.get_json()

    required_fields = ['periodo', 'user_id']
    if not all(field in dados for field in required_fields):
        return jsonify({'error': 'Dados incompletos'}), 400
    
    periodo = dados.get('periodo')
    user_id = dados.get('user_id')

    inicio = periodo.get('inicio')
    fim = periodo.get('fim')

    inicio = datetime.strptime(inicio, '%Y-%m-%d')
    fim = datetime.strptime(fim, '%Y-%m-%d')

    # Buscar as transações dentro do período especificado
    transacoes = coll_transacoes.find({
        'data': {'$gte': inicio, '$lte': fim},
        'user_id': ObjectId(user_id)
    })

    transacoes_list = []
    for transacao in transacoes:
        transacao.pop('_id', None)  # Remove o _id do MongoDB
        transacao.pop('data', None)  # Remove a data da transação
        transacoes_list.append(transacao)

    # Gerar o prompt para os insights com base nas transações
    prompt = format_prompt_insights(transacoes_list)

    # Obter a resposta dos insights usando a função get_gemini_response
    try:
        response = get_gemini_response(prompt)

        # Retornar a resposta como JSON para o front-end
        return jsonify({
            'insights': response
        })
    except Exception as e:
        return jsonify({'error': str(e), 'insights': "Não foi possível obter resposta do Gemini"}), 500
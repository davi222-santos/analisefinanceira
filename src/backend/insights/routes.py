import os, sys
from datetime import datetime

# Configura o diretório base do projeto
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(BASE_DIR)
from flask import Blueprint, jsonify, request
from db import coll_transacoes

from insights.prompts import format_prompt_insights
from insights.gemini import get_gemini_response

insights_bp = Blueprint('insights',__name__)

@insights_bp.route('/api/insights', methods=['POST'])
def insigths():
    dados = request.get_json()
    periodo = dados.get('periodo')

    inicio = periodo.get('inicio')
    fim = periodo.get('fim')

    inicio = datetime.strptime(inicio, '%Y-%m-%d')
    fim = datetime.strptime(fim, '%Y-%m-%d')

    transacoes = coll_transacoes.find({
        'data': {'$gte': inicio, '$lte': fim}
    })

    transacoes_list = []
    for transacao in transacoes:
        transacao.pop('_id', None)
        transacao.pop('data', None)
        transacoes_list.append(transacao)

    prompt = format_prompt_insights(transacoes_list)
    print(prompt)

    response = get_gemini_response(prompt)


    return response

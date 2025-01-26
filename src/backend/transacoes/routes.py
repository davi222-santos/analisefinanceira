import os, sys

# Configura o diretório base do projeto
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(BASE_DIR)


from flask import Blueprint, request, jsonify
import uuid

from db import *


transacoes_bp = Blueprint('transacoes', __name__)

@transacoes_bp.route('/api/transacoes', methods=['POST'])
def inserir_transacao():
    #pega dados da entrada
    dados = request.get_json()
    
    #cria variaveis para inserir no db
    documento = {
        "data" : dados.get('data'),
        "valor" : dados.get('valor'),
        "tipo" : dados.get('tipo'),
        "categoria" : dados.get('categoria'),
        "metodo" : dados.get('metodo'),
        "descricao" : dados.get('descricao'),
        "remetente" : dados.get('remetente')
    }

    coll_transacoes.insert_one(documento)

    return "Transação cadastrada com sucesso", 200

@transacoes_bp.route('/api/transacoes', methods=['GET'])
def listar_transacoes():
    transacoes = []
    for documento in coll_transacoes.find():
        documento['_id'] = str(documento['_id'])
        transacoes.append(documento)

    return transacoes


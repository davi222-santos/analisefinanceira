import os, sys
from bson import ObjectId
from flask import Blueprint, request, jsonify
from db import *
from datetime import datetime

# Configura o diretório base do projeto
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(BASE_DIR)




transacoes_bp = Blueprint('transacoes', __name__)

@transacoes_bp.route('/api/transacoes', methods=['POST'])
def inserir_transacao():
    dados = request.get_json()

    # Verifica se os campos obrigatórios estão presentes
    if not all(k in dados for k in ["valor", "tipo", "user_id"]):
        return jsonify({"erro": "Campos obrigatórios: valor, tipo, user_id"}), 400

    # Converte user_id para ObjectId
    try:
        user_id = ObjectId(dados["user_id"])
    except:
        return jsonify({"erro": "user_id inválido"}), 400

    # Converte data para datetime
    data = None
    if "data" in dados:
        try:
            data = datetime.strptime(dados["data"], "%Y-%m-%d")
        except:
            return jsonify({"erro": "Formato de data inválido. Use AAAA-MM-DD"}), 400

    # Cria o documento da transação
    documento = {
        "user_id": user_id,
        "data": data,
        "valor": dados["valor"],
        "tipo": dados["tipo"],
        "categoria": dados.get("categoria"),
        "metodo": dados.get("metodo"),
        "descricao": dados.get("descricao"),
        "remetente": dados.get("remetente")
    }

    # Insere no MongoDB
    resultado = coll_transacoes.insert_one(documento)

    return jsonify({
        "mensagem": "Transação cadastrada com sucesso",
        "transacao_id": str(resultado.inserted_id)
    }), 201

@transacoes_bp.route('/api/transacoes/<user_id>', methods=['GET'])
def get_transacoes(user_id):
    try:
        # Converte o user_id para ObjectId
        user_id = ObjectId(user_id)

        # Busca todas as transações do usuário
        transacoes_usuario = list(coll_transacoes.find({"user_id": user_id}))

        # Converte ObjectId para string para evitar erros de serialização
        for transacao in transacoes_usuario:
            transacao["_id"] = str(transacao["_id"])
            transacao["user_id"] = str(transacao["user_id"])

        return jsonify(transacoes_usuario), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 400

import os
import sys
from bson import ObjectId
from flask import Blueprint, request, jsonify
from db import *
from datetime import datetime
from util.auth import token_required

# Configura o diretório base do projeto
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(BASE_DIR)

transacoes_bp = Blueprint('transacoes', __name__)


@transacoes_bp.route('/api/transacoes', methods=['POST'])
@token_required
def inserir_transacao(token):
    dados = request.get_json()

    # Verifica se os campos obrigatórios estão presentes
    if not all(k in dados for k in ["valor", "tipo", "user_id"]):
        return jsonify({"erro": "Campos obrigatórios: valor, tipo, user_id"}), 400

    # Converte user_id para ObjectId
    try:
        user_id = ObjectId(dados["user_id"])
    except Exception as e:
        return jsonify({"erro": "user_id inválido"}), 400

    # Converte data para datetime
    data = None
    if "data" in dados:
        try:
            data = datetime.strptime(dados["data"], "%Y-%m-%d")
        except Exception as e:
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

    try:
        resultado = coll_transacoes.insert_one(documento)
        return jsonify({
            "mensagem": "Transação cadastrada com sucesso",
            "transacao_id": str(resultado.inserted_id)
        }), 201
    except Exception as e:
        return jsonify({"erro": "Erro ao inserir transação"}), 500


@transacoes_bp.route('/api/transacoes/<user_id>', methods=['GET'])
@token_required
def get_transacoes(user_id, token):
    try:
        user_id = ObjectId(user_id)
        transacoes_usuario = list(coll_transacoes.find({"user_id": user_id}))

        for transacao in transacoes_usuario:
            transacao["_id"] = str(transacao["_id"])
            transacao["user_id"] = str(transacao["user_id"])

        return jsonify(transacoes_usuario), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 400


# Função para remover uma transação
@transacoes_bp.route('/api/transacoes/<id>', methods=['DELETE'])
@token_required
def remover_transacao(id, token):
    try:
        transacao_id = ObjectId(id)

        resultado = coll_transacoes.delete_one({"_id": transacao_id})

        if resultado.deleted_count == 0:
            return jsonify({"erro": "Transação não encontrada"}), 404

        return jsonify({"mensagem": "Transação removida com sucesso"}), 200

    except Exception as e:
        return jsonify({"erro": "Erro ao remover transação"}), 500

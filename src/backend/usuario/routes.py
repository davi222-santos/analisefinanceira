import os, sys
from flask import Blueprint, request, jsonify
from db import coll_usuarios
from flask_jwt_extended import create_access_token
from util.auth import generate_password_hash, bcrypt

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(BASE_DIR)


usuario_bp = Blueprint('usuario', __name__)


@usuario_bp.route('/api/usuario/novo', methods=['POST'])
def novo_usuario():
    data = request.json

    # Verifica se todos os campos obrigatórios estão presentes
    required_fields = ['cnpj', 'nome', 'email', 'senha']
    if not all(field in data for field in required_fields):
        return jsonify({'message': 'Dados incompletos'}), 400

    # Hash da senha antes de armazenar
    hashed_password = generate_password_hash(data['senha'])

    # Inserindo o novo usuário no banco
    coll_usuarios.insert_one({
        'cnpj': data['cnpj'],
        'nome': data['nome'],
        'email': data['email'],
        'senha': hashed_password 
    })

    user_id = coll_usuarios.find_one({'cnpj': data['cnpj']}, {'_id': 1})['_id'].__str__()

    return jsonify({'message': 'Usuário criado com sucesso', 'user_id': user_id}), 201


@usuario_bp.route('/api/usuario/auth', methods=['POST'])
def autenticar_usuario():
    data = request.json
    if not all(field in data for field in ['cnpj', 'senha']):
        return jsonify({'message': 'Dados incompletos'}), 400

    usuario = coll_usuarios.find_one({'cnpj': data['cnpj']})
    if not usuario or bcrypt.checkpw(generate_password_hash(data['senha']), usuario['senha']):
        return jsonify({'message': 'Credenciais inválidas'}), 401

    # Gerar token JWT
    access_token = create_access_token(identity=str(usuario['_id']))
    user_id = usuario['_id'].__str__()
    
    return jsonify({'message': 'Usuário autenticado com sucesso', 'user_id': user_id,  'token': access_token}), 200
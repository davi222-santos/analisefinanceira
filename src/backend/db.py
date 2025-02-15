from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv('MONGODB_URI')
ENVIRONMENT = os.getenv('ENVIRONMENT', 'local')

# Garantir que MONGODB_URI está definido corretamente
if not MONGODB_URI and ENVIRONMENT in ('production', 'development'):
    raise ValueError("MONGODB_URI não está definido no arquivo .env")

# Criando conexão com o MongoDB
client = MongoClient(
    MONGODB_URI if ENVIRONMENT in ('production', 'development') else 'mongodb://localhost:27017'
)

# Obtendo o banco de dados
db = client['financIA']

# Função para obter uma coleção específica
def get_collection(collection_name):
    """Retorna uma coleção específica do banco de dados"""
    return db[collection_name]

# Função para fechar a conexão com o banco de dados
def close_db():
    """Fecha a conexão com o MongoDB"""
    client.close()

# Definição das coleções
coll_usuarios = get_collection('usuarios')
coll_transacoes = get_collection('transacoes')

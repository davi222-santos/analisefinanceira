from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')

db = client['financIA']

coll_transacoes = db['transacoes']

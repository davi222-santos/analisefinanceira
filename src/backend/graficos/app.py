from flask import Flask, request, jsonify
from utils.grafico_linhas import gerar_grafico_linhas
from utils.grafico_barras import gerar_grafico_barras
from utils.grafico_pizza import gerar_grafico_pizza
from utils.grafico_fluxo_caixa import gerar_grafico_fluxo_caixa
import os

app = Flask(__name__)

@app.route('/api/grafico', methods=['POST'])
def criar_grafico():
    #dados de entrada
    dados = request.get_json()

    periodo = dados.get('periodo')
    metricas = dados.get('metricas')
    grafico = dados.get('grafico')

    if not periodo or not metricas or not grafico:
        return jsonify({'error': 'Dados incompletos'}), 400

    tipos_grafico = ['linhas', 'barras', 'pizza', 'fluxo_de_caixa']
    if grafico not in tipos_grafico:
        return jsonify({'error': 'Tipo de gráfico inválido'}), 400

    #gerar gráfico de acordo
    if grafico == 'linhas':
        return gerar_grafico_linhas(metricas)
    elif grafico == 'barras':
        return gerar_grafico_barras(metricas)
    elif grafico == 'pizza':
        return gerar_grafico_pizza(metricas)
    elif grafico == 'fluxo_de_caixa':
        return gerar_grafico_fluxo_caixa(metricas)

@app.after_request
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

if __name__ == '__main__':
    app.run(debug=True)

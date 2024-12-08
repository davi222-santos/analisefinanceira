import matplotlib.pyplot as plt
import os
from flask import send_file, after_this_request
import os

def gerar_grafico_fluxo_caixa(metricas):
    #entrada
    entradas = [metricas['Receita']]
    saidas = [metricas['Despesas']]

    diretorio_atual = os.path.dirname(os.path.abspath(__file__))
    caminho_arquivo = os.path.join(diretorio_atual, 'grafico_fluxo_caixa.png')

    #criar gráfico
    plt.figure()
    plt.bar(['Entradas', 'Saídas'], [entradas[0], saidas[0]], color=['green', 'red'])
    plt.title('Gráfico de Fluxo de Caixa')
    plt.ylabel('Valores')
    plt.savefig(caminho_arquivo)
    plt.close()


    response = send_file(caminho_arquivo, mimetype='image/png', as_attachment=True)
    response.headers['Content-Disposition'] = 'inline; filename=grafico_fluxo_caixa.png'
    return response

import matplotlib.pyplot as plt
import os
from flask import send_file, after_this_request

def gerar_grafico_pizza(metricas):
    categorias = list(metricas.keys())
    valores = list(metricas.values())

    diretorio_atual = os.path.dirname(os.path.abspath(__file__))
    caminho_arquivo = os.path.join(diretorio_atual, 'grafico_pizza.png')  # Caminho absoluto do arquivo

    #criar gráfico
    plt.figure()
    plt.pie(valores, labels=categorias, autopct='%1.1f%%')
    plt.title('Gráfico de Pizza')
    plt.savefig(caminho_arquivo)
    plt.close()

    @after_this_request
    def remover_arquivo(response):
        try:
            if os.path.exists(caminho_arquivo):
                os.remove(caminho_arquivo)
        except Exception as e:
            print(f"Erro ao excluir o arquivo: {e}")
        return response
    
    return send_file(caminho_arquivo, mimetype='image/png', as_attachment=True)

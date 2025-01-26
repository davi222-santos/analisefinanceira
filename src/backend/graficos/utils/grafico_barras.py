import matplotlib
matplotlib.use('Agg') 

import matplotlib.pyplot as plt
import os
import tempfile
from flask import send_file, after_this_request

def gerar_grafico_barras(metricas):
    categorias = list(metricas.keys())
    valores = list(metricas.values())

    with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as tmpfile:
        caminho_arquivo = tmpfile.name 

        # Criar gráfico
        plt.figure()
        plt.bar(categorias, valores)
        plt.title('Gráfico de Barras')
        plt.xlabel('Categorias')
        plt.ylabel('Valores')
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

    response = send_file(caminho_arquivo, mimetype='image/png', as_attachment=True)
    response.headers['Content-Disposition'] = 'inline; filename=grafico_barras.png'

    return response
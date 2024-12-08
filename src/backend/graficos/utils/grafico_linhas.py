import matplotlib.pyplot as plt
import os
from flask import send_file, after_this_request

def gerar_grafico_linhas(metricas):
    diretorio_atual = os.path.dirname(os.path.abspath(__file__))
    caminho_arquivo = os.path.join(diretorio_atual, 'grafico_linhas.png')  # Caminho absoluto do arquivo

    #criar gráfico
    plt.figure()
    plt.plot(metricas['Receita'], label='Receita Total')
    plt.plot(metricas['Despesas'], label='Despesas Totais')
    plt.plot(metricas['Lucro'], label='Lucro')
    plt.title('Gráfico de Linhas')
    plt.xlabel('Período')
    plt.ylabel('Valores')
    plt.legend()
    plt.grid()
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
    response.headers['Content-Disposition'] = 'inline; filename=grafico_linhas.png'
    return response

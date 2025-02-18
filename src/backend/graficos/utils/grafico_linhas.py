import matplotlib.pyplot as plt
import tempfile
from flask import send_file

def gerar_grafico_linhas(metricas):
    with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as tmpfile:
        caminho_arquivo = tmpfile.name  # Caminho temporário para o arquivo gerado

        # Criar gráfico de linhas
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

    response = send_file(caminho_arquivo, mimetype='image/png', as_attachment=True)
    response.headers['Content-Disposition'] = 'inline; filename=grafico_linhas.png'
    return response


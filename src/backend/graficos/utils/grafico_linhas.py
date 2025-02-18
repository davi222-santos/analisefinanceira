import matplotlib.pyplot as plt
import tempfile
from flask import send_file

def gerar_grafico_linhas(metricas):
    with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as tmpfile:
        caminho_arquivo = tmpfile.name  # Caminho temporário para o arquivo gerado

        plt.figure()

        # Criar eixo X baseado no número de períodos
        num_periodos = len(next(iter(metricas.values())))  # Assume que todas as listas têm o mesmo tamanho
        x = list(range(1, num_periodos + 1))  # Criar um eixo X numérico (exemplo: [1, 2, 3, ...])

        plt.plot(x, metricas['Receita'], label='Receita Total', marker='o')
        plt.plot(x, metricas['Despesas'], label='Despesas Totais', marker='o')
        plt.plot(x, metricas['Lucro'], label='Lucro', marker='o')

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

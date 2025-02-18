import matplotlib.pyplot as plt
import tempfile
from flask import send_file

def gerar_grafico_linhas(metricas):
    with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as tmpfile:
        caminho_arquivo = tmpfile.name  # Caminho temporário para o arquivo gerado

        plt.figure()

        # Criar eixo X baseado no maior número de períodos encontrados
        num_periodos = max((len(v) for v in metricas.values()), default=0)
        if num_periodos == 0:
            return "Erro: Nenhum dado disponível para gerar o gráfico."

        x = list(range(1, num_periodos + 1))  # Criar um eixo X numérico

        # Plotar somente as métricas que não estão vazias
        for chave, valores in metricas.items():
            if valores:  # Só plota se houver valores
                plt.plot(x[:len(valores)], valores, label=chave, marker='o')

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

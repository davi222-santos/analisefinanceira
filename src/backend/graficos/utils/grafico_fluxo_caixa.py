import matplotlib.pyplot as plt
import tempfile
from flask import send_file

def gerar_grafico_fluxo_caixa(metricas):
    # Entrada e saída
    entradas = [metricas['Receita']]
    saidas = [metricas['Despesas']]

    # Criar arquivo temporário
    with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as tmpfile:
        caminho_arquivo = tmpfile.name  # Caminho temporário para o arquivo gerado

        # Criar gráfico de barras
        plt.figure()
        plt.bar(['Entradas', 'Saídas'], [entradas[0], saidas[0]], color=['green', 'red'])
        plt.title('Gráfico de Fluxo de Caixa')
        plt.ylabel('Valores')
        plt.savefig(caminho_arquivo)
        plt.close()

    response = send_file(caminho_arquivo, mimetype='image/png', as_attachment=True)
    response.headers['Content-Disposition'] = 'inline; filename=grafico_fluxo_caixa.png'
    return response


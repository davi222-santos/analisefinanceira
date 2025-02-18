import matplotlib
matplotlib.use('Agg') 

import matplotlib.pyplot as plt
import os
import tempfile
from flask import send_file

def gerar_grafico_barras(metricas):
    categorias = list(metricas.keys())
    valores = list(metricas.values())

    # Definir cores específicas para cada categoria
    cores_categoria = {
        'Receita': 'blue',   
        'Lucro': 'green',     
        'Despesas': 'yellow', 
    }

    # Atribuir cores de acordo com a categoria e se o valor é negativo
    cores = []
    for i, valor in enumerate(valores):
        if valor < 0:
            cores.append('red')  # Cor vermelha para valores negativos
        else:
            categoria = categorias[i]
            # Usa a cor definida para a categoria ou cinza como padrão
            cores.append(cores_categoria.get(categoria, 'gray'))

    with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as tmpfile:
        caminho_arquivo = tmpfile.name 

        # Criar gráfico de barras
        plt.figure()
        plt.bar(categorias, valores, color=cores)  # Aplica as cores às barras
        plt.title('Gráfico de Barras')
        plt.xlabel('Categorias')
        plt.ylabel('Valores')
        plt.savefig(caminho_arquivo)  
        plt.close() 

    response = send_file(caminho_arquivo, mimetype='image/png', as_attachment=True)
    response.headers['Content-Disposition'] = f'inline; filename=grafico_barras.png'

    return response

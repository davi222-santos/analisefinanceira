import matplotlib.pyplot as plt
import tempfile
from flask import send_file

def gerar_grafico_pizza(metricas):
    categorias = list(metricas.keys())
    valores = list(metricas.values())

    # Cores específicas para cada categoria
    cores_categoria = {
        'Receita': 'blue', 
        'Lucro': 'green',    
        'Despesas': 'yellow' 
    }

    # Tratamento para cores e personalização
    cores = []
    valores_abs = []
    explode = []  # Lista para "explodir" as fatias negativas
    for i, valor in enumerate(valores):
        categoria = categorias[i]
        cor = cores_categoria.get(categoria, 'gray')  # Cor padrão

        if valor < 0:
            cor = 'red'  # Se o valor for negativo, cor vermelha
            valores_abs.append(abs(valor))  # Usa o valor absoluto para a fatia
            explode.append(0.1)  # Aumenta a fatia negativa
        else:
            valores_abs.append(valor)
            explode.append(0)  # Não explodir a fatia positiva
        cores.append(cor)

    # Se todos os valores forem zero, tratamos o erro
    if sum(valores_abs) == 0:
        fig, ax = plt.subplots()
        ax.text(0.5, 0.5, "Nenhum dado disponível", fontsize=14, ha='center', va='center')
        ax.set_xticks([])
        ax.set_yticks([])
    else:
        fig, ax = plt.subplots()
        wedges, texts, autotexts = ax.pie(
            valores_abs,  # Usar valores absolutos
            labels=categorias,
            autopct='%1.1f%%',
            colors=cores,
            explode=explode,  # Explodir as fatias negativas
            startangle=90,  # Iniciar o gráfico com a primeira fatia no topo
            wedgeprops={'edgecolor': 'black'}  # Adicionar bordas para destacar as fatias
        )

        # Personalização do texto
        for i, autotext in enumerate(autotexts):
            if valores[i] < 0:
                autotext.set_text(f"{autotext.get_text()} (negativo)")

    plt.title('Gráfico de Pizza - Demonstração de Receita/Despesa/Lucro')

    # Criar arquivo temporário
    with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as tmpfile:
        caminho_arquivo = tmpfile.name
        plt.savefig(caminho_arquivo)
        plt.close()

    response = send_file(caminho_arquivo, mimetype='image/png', as_attachment=True)
    response.headers['Content-Disposition'] = 'inline; filename=grafico_pizza.png'
    return response

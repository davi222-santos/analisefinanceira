def format_prompt_insights(input):
    prompt = """
Instruções:
'''
-Você vai receber no input informações de finanças de um certo período de um empresa;
-Sua função é gerar insigths a partir dessa informações, com o objetivo de ajudar a empresa.
'''

Input:
'''
%s
'''
"""%(input)
    return prompt
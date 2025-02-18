import google.generativeai as genai
import os
from typing import Any
from dotenv import load_dotenv
load_dotenv()

def get_gemini_response(prompt):
    try:
        genai.configure(api_key=os.environ["Gemini_API_KEY"])
        model=genai.GenerativeModel(
            model_name="gemini-1.5-pro-latest"
            )

        response = model.generate_content(prompt).text

        print(response)
        
        return response
    except Exception as e:
        raise e

from google import genai
import os

# --- CONFIGURACIÓN ---
# Borra el símbolo # de la siguiente línea y pega tu API Key entre las comillas:
# os.environ["GOOGLE_API_KEY"] = "AIzaSyB0LQeBw8tmVZev5T7VJxqFqsPqSOXv8Ys"

# Esto conecta con Google usando tu llave
api_key = os.environ.get("GOOGLE_API_KEY")
client = genai.Client(api_key=api_key)

# Le pedimos algo a Gemini
response = client.models.generate_content(
    model="gemini-2.0-flash", 
    contents="Genera una lista de 3 módulos esenciales para un ERP de una panadería y pizzería."
)

# Esto muestra el resultado en la pantalla
print(response.text)

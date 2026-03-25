import json
import requests

BASE_URL = "http://localhost:3001/api/v1/catalog"
FILE_PATH = "importar_productos_AQUI.json"

def run_import():
    try:
        with open(FILE_PATH, 'r', encoding='utf-8') as f:
            products = json.load(f)
        
        print(f"Leídos {len(products)} productos del archivo.")
        
        payload = {"products": products}
        
        print("Enviando datos al servidor...")
        response = requests.post(f"{BASE_URL}/import-json", json=payload)
        
        if response.ok:
            print(f"Éxito: {response.json()['message']}")
        else:
            print(f"Error del servidor: {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"Ocurrió un error: {e}")

if __name__ == "__main__":
    run_import()

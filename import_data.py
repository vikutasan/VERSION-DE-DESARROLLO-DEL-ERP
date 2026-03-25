import json
import requests
import time

BASE_URL = "http://localhost:3001/api/v1/catalog"

def import_data():
    try:
        with open('importar_productos_AQUI.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error reading JSON: {e}")
        return

    # 1. Obtener categorías existentes
    print("Fetching existing categories...")
    cat_res = requests.get(f"{BASE_URL}/categories")
    existing_cats = {c['name']: c['id'] for c in cat_res.json()} if cat_res.ok else {}

    # 2. Crear categorías nuevas
    unique_cats = sorted(list(set(p['category'] for p in data if 'category' in p)))
    for cat_name in unique_cats:
        if cat_name not in existing_cats:
            print(f"Creating category: {cat_name}")
            res = requests.post(f"{BASE_URL}/categories", json={"name": cat_name, "vision_enabled": True})
            if res.ok:
                existing_cats[cat_name] = res.json()['id']
            else:
                print(f"Failed to create category {cat_name}: {res.text}")

    # 3. Importar productos
    print(f"Importing {len(data)} products...")
    count = 0
    for p in data:
        cat_id = existing_cats.get(p.get('category'))
        payload = {
            "sku": str(p['sku']),
            "name": p['name'],
            "price": float(p['price']),
            "category_id": cat_id,
            "barcode": str(p['sku']), # Usar SKU como barcode por defecto
            "active": True
        }
        res = requests.post(f"{BASE_URL}/products", json=payload)
        if res.ok:
            count += 1
            if count % 100 == 0:
                print(f"Imported {count} products...")
        else:
            # Si ya existe (UniqueViolation), intentamos ignorar o avisar
            if "already exists" in res.text.lower() or res.status_code == 400:
                pass 
            else:
                print(f"Error importing {p['name']}: {res.text}")

    print(f"Successfully imported {count} products.")

if __name__ == "__main__":
    import_data()

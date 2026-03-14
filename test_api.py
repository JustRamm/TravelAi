import requests
import json

url = "http://localhost:8000/api/generate"
payload = {
    "destination": "Kyoto",
    "travel_style": "Culture"
}
headers = {
    "Content-Type": "application/json"
}

try:
    response = requests.post(url, json=payload, headers=headers)
    print(f"Status: {response.status_code}")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Error: {e}")

import requests

def fetch_wallet_balance(address):
    api_url = "https://api.covalenthq.com"
    endpoint = f"/v1/1287/address/{address}/balances_v2/"
    url = api_url + endpoint
    response = requests.get(url, auth=("INSERT_YOUR_API_KEY", ""))
    print(response.json())
    return response.json()

# Example address request
fetch_wallet_balance("0xFEC4f9D5B322Aa834056E85946A32c35A3f5aDD8")

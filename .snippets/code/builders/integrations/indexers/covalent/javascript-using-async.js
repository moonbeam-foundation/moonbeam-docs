// Set your API key
const apiKey = 'INSERT_YOUR_API_KEY';
const address = '0xFEC4f9D5B322Aa834056E85946A32c35A3f5aDD8'; // Example
const chainId = '1287'; // Moonbase Alpha TestNet chain ID
const url = new URL(
  `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/`
);

url.search = new URLSearchParams({
  key: apiKey,
});

async function getData() {
  const response = await fetch(url);
  const result = await response.json();
  console.log(result);
  return result;
}

getData();

// Set your API key
const apiKey = 'INSERT_YOUR_API_KEY';

function getData() {
  const address = '0xFEC4f9D5B322Aa834056E85946A32c35A3f5aDD8'; // example
  const chainId = '1287'; // Moonbase Alpha TestNet chain ID
  const url = new URL(
    `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/`
  );

  url.search = new URLSearchParams({
    key: apiKey,
  });

  // Use fetch API to get Covalent data
  fetch(url)
    .then((resp) => resp.json())
    .then(function (data) {
      const result = data.data;

      console.log(result);
      return result;
    });
}

getData();

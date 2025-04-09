const axios = require('axios');

const API_KEY = 'INSERT_API_KEY';
const address = 'INSERT_WALLET_ADDRESS';
const chain = 'moonbeam';

axios.get(`https://api.zapper.xyz/v1/protocols/tokens/balances`, {
  params: { addresses: address, network: chain },
  headers: { Authorization: `Bearer ${API_KEY}` }
})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error(error);
});

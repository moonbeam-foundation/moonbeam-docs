const axios = require('axios');

const API_KEY = 'your_api_key';
const address = 'user_wallet_address';
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

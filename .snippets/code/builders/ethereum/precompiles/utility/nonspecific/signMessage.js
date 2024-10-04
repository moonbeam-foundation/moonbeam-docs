const { Web3 } = require('web3');
const web3 = new Web3('https://rpc.api.moonbase.moonbeam.network');

// Address and private key
const address = 'INSERT_RECEIVER_ADDRESS';
const pk1 =
  'INSERT_SENDER_PRIVATE_KEY';
const msg = web3.utils.sha3('supercooltestmessage');

async function signMessage(pk) {
  try {
    // Sign and get signed message
    const smsg = await web3.eth.accounts.sign(msg, pk);
    console.log(smsg);
  } catch (error) {
    console.error(error);
  }
}

signMessage(pk1);

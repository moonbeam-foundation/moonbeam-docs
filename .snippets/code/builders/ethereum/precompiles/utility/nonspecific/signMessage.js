const { Web3 } = require('web3');
const web3 = new Web3('https://rpc.api.moonbase.moonbeam.network');

// Address and Private Key
const address = '0xCD8Bcd9A793a7381b3C66C763c3f463f70De4e12';
const pk1 =
  '0x3f6e4d3bd1f8f465c8f1c8cb32fd79d123a6deda7965a1f7bc36bc79b5abe162';
const msg = web3.utils.sha3('supercooltestmessage');

async function signMessage(pk) {
  try {
    // Sign and get Signed Message
    const smsg = await web3.eth.accounts.sign(msg, pk);
    console.log(smsg);
  } catch (error) {
    console.error(error);
  }
}

signMessage(pk1);

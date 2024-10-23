const { Web3 } = require('web3');

// Provider
const web3 = new Web3('https://rpc.api.moonbase.moonbeam.network');

// Address and Private Key
const address = '0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b';
const pk1 = '99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342';
const msg = web3.utils.sha3('supercalifragilisticexpialidocious');

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

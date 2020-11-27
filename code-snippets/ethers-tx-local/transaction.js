const ethers = require('ethers');

// Variables definition
const privKey =
   '0x99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342';
const addressTo = 'ADDRESSTO';
const providerURL = 'http://localhost:9933';
// Define Provider
let provider = new ethers.providers.JsonRpcProvider(providerURL);
// Create Wallet
let wallet = new ethers.Wallet(privKey, provider);

// Deploy Transaction
const send = async () => {
   console.log(
      `Attempting to send transaction from ${wallet.address} to ${addressTo}`
   );

   // Create Tx Object
   const tx = {
      to: addressTo,
      value: ethers.utils.parseEther('100'),
   };

   const createReceipt = await wallet.sendTransaction(tx);
   await createReceipt.wait();
   console.log(`Transaction successful with hash: ${createReceipt.hash}`);
};

send();

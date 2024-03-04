const fs = require('fs');
const solc = require('solc');
const { Web3 } = require('web3');

const web3 = new Web3('https://rpc.api.moonbeam.network');

const compile = () => {
  // Get path and load contract
  const source = fs.readFileSync('OracleClient.sol', 'utf8');

  // Create input object
  const input = {
    language: 'Solidity',
    sources: {
      'OracleClient.sol': {
        content: source,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
    },
  };
  // Compile the contract
  const tempFile = JSON.parse(solc.compile(JSON.stringify(input)));
  const contractFile = tempFile.contracts['OracleClient.sol']['OracleClient'];

  // Save ABI to a file
  fs.writeFileSync(
    './resources/oracleClient.json',
    JSON.stringify(contractFile.abi, null, 4),
    'utf8'
  );

  return { abi: contractFile.abi, bytecode: contractFile.evm.bytecode.object };
};

const deploy = async () => {
  // Compile the contract
  const { abi, bytecode } = compile();

  // Create contract instance
  const contract = new web3.eth.Contract(abi);

  // Create the deployment transaction and pass in the Pull Oracle contract address
  const deployTx = contract.deploy({
    data: bytecode,
    arguments: ['0x2FA6DbFe4291136Cf272E1A3294362b6651e8517'],
  });

  // Sign transaction with PK
  const createTransaction = await web3.eth.accounts.signTransaction(
    {
      data: deployTx.encodeABI(),
      gas: await deployTx.estimateGas(),
      gasPrice: await web3.eth.getGasPrice(),
      nonce: await web3.eth.getTransactionCount('INSERT_ADDRESS'),
    },
    'INSERT_PRIVATE_KEY'
  );

  // Send transaction and wait for receipt
  const createReceipt = await web3.eth.sendSignedTransaction(
    createTransaction.rawTransaction
  );

  console.log(`Contract deployed at address: ${createReceipt.contractAddress}`);
};

deploy();

import Web3 from 'web3';

// Define the transaction hash to check finality
const txHash = 'INSERT_TRANSACTION_HASH';

// Define the Web3 provider for Moonbeam
// This can be adapted for Moonriver or Moonbase Alpha
const web3Provider = new Web3('INSERT_RPC_API_ENDPOINT');

// Define the function for the custom Web3 request
const customWeb3Request = async (web3Provider, method, params) => {
  try {
    return await requestPromise(web3Provider, method, params);
  } catch (error) {
    throw new Error(error);
  }
};

// In Web3.js you need to return a promise
const requestPromise = async (web3Provider, method, params) => {
  return new Promise((resolve, reject) => {
    web3Provider.send(
      {
        jsonrpc: '2.0',
        id: 1,
        method,
        params,
      },
      (error, result) => {
        if (error) {
          reject(error.message);
        } else {
          if (result.error) {
            reject(result.error.message);
          }
          resolve(result);
        }
      }
    );
  });
};

const main = async () => {
  // Check if the transaction has been finalized
  const isFinalized = await customWeb3Request(
    web3Provider.currentProvider,
    'moon_isTxFinalized',
    [txHash]
  );

  console.log(JSON.stringify(isFinalized));
  console.log(`Transaction is finalized? ${isFinalized}`);
};

main();

import { ApiPromise, WsProvider } from '@polkadot/api'; // Version 10.13.1
import { ethers } from 'ethers'; // Version 6.0.2
import BN from 'bn.js'; // Importing directly from bn.js

// 1. Input Data
const providerWsURL = 'wss://wss.api.moonbase.moonbeam.network';
const uniswapV2Router = '0x8a1932D6E26433F3037bd6c3A40C816222a6Ccd4';
const contractCall =
  '0x7ff36ab50000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000061cd3e07fe7d7f6d4680e3e322986b7877f108dd00000000000000000000000000000000000000000000000000000000A036B1B90000000000000000000000000000000000000000000000000000000000000002000000000000000000000000d909178cc99d318e4d46e7e66a972955859670e10000000000000000000000001fc56b105c4f0a1a8038c2b429932b122f6b631f';

const generateCallData = async () => {
  // 2. Create Substrate API Provider
  const substrateProvider = new WsProvider(providerWsURL);
  const ethProvider = new ethers.providers.WebSocketProvider(providerWsURL);
  const api = await ApiPromise.create({ provider: substrateProvider });

  // 3. Estimate Gas for EVM Call
  const gasLimit = await ethProvider.estimateGas({
    to: uniswapV2Router,
    data: contractCall,
    value: ethers.utils.parseEther('0.01'),
  });
  console.log(`Gas required for call is ${gasLimit.toString()}`);

  // Convert ethers' BigNumber to Polkadot's BN and add some extra
  const totalGasLimit = new BN(gasLimit.toString()).add(new BN(10000));

  // 4. Call Parameters
  const callParams = {
    V2: {
      gasLimit: totalGasLimit, // Estimated plus some extra gas
      action: { Call: uniswapV2Router }, // Uniswap V2 router address
      value: new BN(ethers.utils.parseEther('0.01').toString()), // 0.01 DEV
      input: contractCall, // Swap encoded calldata
    },
  };

  // 5. Create the Extrinsic
  const tx = api.tx.ethereumXcm.transact(callParams);

  // 6. Get SCALE Encoded Calldata
  const encodedCall = tx.method.toHex();
  console.log(`Encoded Calldata: ${encodedCall}`);

  api.disconnect();
};

generateCallData();
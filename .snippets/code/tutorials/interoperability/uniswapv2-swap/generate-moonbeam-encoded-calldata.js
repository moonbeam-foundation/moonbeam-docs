import { ApiPromise, WsProvider } from '@polkadot/api'; // Version 9.13.6
import { ethers } from 'ethers'; // Version 6.0.2

// 1. Input Data
const providerWsURL = 'wss://wss.api.moonbase.moonbeam.network';
const uniswapV2Router = '0x8a1932D6E26433F3037bd6c3A40C816222a6Ccd4';
const contractCall =
  '0x7ff36ab50000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000004e21340c3465ec0aa91542de3d4c5f4fc1def52600000000000000000000000000000000000000000000000000000000647464250000000000000000000000000000000000000000000000000000000000000002000000000000000000000000d909178cc99d318e4d46e7e66a972955859670e10000000000000000000000001fc56b105c4f0a1a8038c2b429932b122f6b631f';

const generateCallData = async () => {
  // 2. Create Substrate API Provider
  const substrateProvider = new WsProvider(providerWsURL);
  const ethProvider = new ethers.WebSocketProvider(providerWsURL);
  const api = await ApiPromise.create({ provider: substrateProvider });

  // 3. Estimate Gas for EVM Call
  const gasLimit = await ethProvider.estimateGas({
    to: uniswapV2Router,
    data: contractCall,
    value: ethers.parseEther('0.01'),
  });
  console.log(`Gas required for call is ${gasLimit.toString()}`);

  // 4. Call Parameters
  const callParams = {
    V2: {
      gasLimit: gasLimit + 10000n, // Estimated plus some extra gas
      action: { Call: uniswapV2Router }, // Uniswap V2 router address
      value: ethers.parseEther('0.01'), // 0.01 DEV
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
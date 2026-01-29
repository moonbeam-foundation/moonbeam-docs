// 1. Import ethers
const ethers = require('ethers');

// 2. Define network configurations
const providerRPC = {
  moonbeam: {
    name: 'moonbeam',
    rpc: '{{ networks.moonbeam.rpc_url }}', // Insert your RPC URL here
    chainId: {{ networks.moonbeam.chain_id }}, // {{ networks.moonbeam.hex_chain_id }} in hex,
  },
};
// 3. Create ethers provider
const provider = new ethers.JsonRpcProvider(providerRPC.moonbeam.rpc, {
  chainId: providerRPC.moonbeam.chainId,
  name: providerRPC.moonbeam.name,
});

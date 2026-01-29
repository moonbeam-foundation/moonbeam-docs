// 1. Import ethers
const ethers = require('ethers');

// 2. Define network configurations
const providerRPC = {
  moonriver: {
    name: 'moonriver',
    rpc: '{{ networks.moonriver.rpc_url }}', // Insert your RPC URL here
    chainId: {{ networks.moonriver.chain_id }}, // {{ networks.moonriver.hex_chain_id }} in hex,
  },
};
// 3. Create ethers provider
const provider = new ethers.JsonRpcProvider(providerRPC.moonriver.rpc, {
  chainId: providerRPC.moonriver.chainId,
  name: providerRPC.moonriver.name,
});

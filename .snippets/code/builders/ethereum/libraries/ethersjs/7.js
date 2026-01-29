// 1. Import ethers
const ethers = require('ethers');

// 2. Define network configurations
const providerRPC = {
  dev: {
    name: 'moonbeam-development',
    rpc: '{{ networks.development.rpc_url }}',
    chainId: {{ networks.development.chain_id }}, // {{ networks.development.hex_chain_id }} in hex,
  },
};
// 3. Create ethers provider
const provider = new ethers.JsonRpcProvider(providerRPC.dev.rpc, {
  chainId: providerRPC.dev.chainId,
  name: providerRPC.dev.name,
});

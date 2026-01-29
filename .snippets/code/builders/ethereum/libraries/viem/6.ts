import { createPublicClient, http } from 'viem';
import { moonriver } from 'viem/chains';

const rpcUrl = '{{ networks.moonriver.rpc_url }}'
const publicClient = createPublicClient({
  chain: moonriver,
  transport: http(rpcUrl),
});

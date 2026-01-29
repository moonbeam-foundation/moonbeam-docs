import { createPublicClient, http } from 'viem';
import { moonbaseAlpha } from 'viem/chains';

const rpcUrl = '{{ networks.moonbase.rpc_url }}'
const publicClient = createPublicClient({
  chain: moonbaseAlpha,
  transport: http(rpcUrl),
});

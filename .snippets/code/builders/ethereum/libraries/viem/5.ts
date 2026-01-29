import { createPublicClient, http } from 'viem';
import { moonbeam } from 'viem/chains';

const rpcUrl = '{{ networks.moonbeam.rpc_url }}'
const publicClient = createPublicClient({
  chain: moonbeam,
  transport: http(rpcUrl),
});

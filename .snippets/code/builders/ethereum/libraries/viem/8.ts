import { createPublicClient, http } from 'viem';
import { moonbeamDev } from 'viem/chains';

const rpcUrl = '{{ networks.development.rpc_url }}'
const publicClient = createPublicClient({
  chain: moonbeamDev,
  transport: http(rpcUrl),
})

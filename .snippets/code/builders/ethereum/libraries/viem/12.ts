import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { moonbeamDev } from 'viem/chains';

const account = privateKeyToAccount('INSERT_PRIVATE_KEY');
const rpcUrl = '{{ networks.development.rpc_url }}'
const walletClient = createWalletClient({
  account,
  chain: moonbeamDev,
  transport: http(rpcUrl),
});

import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { moonbeam } from 'viem/chains';

const account = privateKeyToAccount('INSERT_PRIVATE_KEY');
const rpcUrl = '{{ networks.moonbeam.rpc_url }}'
const walletClient = createWalletClient({
  account,
  chain: moonbeam,
  transport: http(rpcUrl),
});

import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { moonbaseAlpha } from 'viem/chains';

const account = privateKeyToAccount('INSERT_PRIVATE_KEY');
const rpcUrl = '{{ networks.moonbase.rpc_url }}'
const walletClient = createWalletClient({
  account,
  chain: moonbaseAlpha,
  transport: http(rpcUrl),
});

import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { moonriver } from 'viem/chains';

const account = privateKeyToAccount('INSERT_PRIVATE_KEY');
const rpcUrl = '{{ networks.moonriver.rpc_url }}'
const walletClient = createWalletClient({
  account,
  chain: moonriver,
  transport: http(rpcUrl),
});

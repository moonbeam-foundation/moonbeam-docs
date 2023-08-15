import { ApiPromise, WsProvider } from '@polkadot/api';
import Keyring from '@polkadot/keyring';

const main = async () => {
  // Construct API provider
  const wsProvider = new WsProvider('WSS_API_ENDPOINT_HERE');
  const api = await ApiPromise.create({ provider: wsProvider });

  // Create a keyring instance (ECDSA)
  const keyring = new Keyring({ type: 'ethereum' });

  // Initialize wallet key pairs
  const alice = keyring.addFromUri('ALICE_ACCOUNT_PRIVATE_KEY');
  const bob = 'BOB_ACCOUNT_PUBLIC_KEY';

  // Form the transaction
  const tx = await api.tx.balances.transfer(bob, BigInt(12345));

  // Retrieve the encoded calldata of the transaction
  const encodedCalldata = tx.method.toHex();
  console.log(`Encoded calldata: ${encodedCalldata}`);

  // Sign and send the transaction
  const txHash = await tx.signAndSend(alice);

  // Show the transaction hash
  console.log(`Submitted with hash ${txHash}`);

  // Disconnect the API
  await api.disconnect();
};

main();

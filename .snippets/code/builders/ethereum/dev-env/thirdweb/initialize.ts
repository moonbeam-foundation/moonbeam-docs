import { sendTransaction } from 'thirdweb';
// MetaMask wallet used for example, the pattern is the same for all wallets
import { createWallet } from 'thirdweb/wallets';

// Initialize the wallet. thirdweb supports 300+ wallet connectors
const wallet = createWallet('io.metamask');

// Connect the wallet. This returns a promise that resolves to the connected account
const account = await wallet.connect({
  // Pass the client you created with `createThirdwebClient()`
  client,
});

// Sign and send a transaction with the account. Returns the transaction hash
const { transactionHash } = await sendTransaction({
  // Assuming you have called `prepareTransaction()` or `prepareContractCall()` before, which returns the prepared transaction to send
  transaction,
  // Pass the account to sign the transaction with
  account,
});
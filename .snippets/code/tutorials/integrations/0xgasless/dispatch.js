require('dotenv').config();
const ethers = require('ethers');
const {
  PaymasterMode,
  createSmartAccountClient,
} = require("@0xgasless/smart-account");

const CHAIN_ID = 1284; // Moonbeam mainnet
const BUNDLER_URL = `https://bundler.0xgasless.com/${CHAIN_ID}`;
const PAYMASTER_URL = 'https://paymaster.0xgasless.com/v1/1284/rpc/INSERT_API_KEY';
const CONTRACT_ADDRESS = '0x3aE26f2c909EB4F1EdF97bf60B36529744b09213';
const FUNCTION_SELECTOR = '0xd09de08a';

async function main() {
  console.log("Starting the script...");
  try {
    // Set up provider and wallet
    console.log("Setting up provider and wallet...");
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    // Check connection and balance
    console.log("Checking network connection...");
    const network = await provider.getNetwork();
    console.log(`Connected to network: ${network.name} (Chain ID: ${network.chainId})`);
    const balance = await provider.getBalance(wallet.address);
    console.log(`Wallet balance: ${ethers.utils.formatEther(balance)} GLMR`);

    // Initialize smart account
    console.log("Initializing smart account...");
    const smartWallet = await createSmartAccountClient({
      signer: wallet,
      paymasterUrl: PAYMASTER_URL,
      bundlerUrl: BUNDLER_URL,
      chainId: CHAIN_ID,
    });
    const smartWalletAddress = await smartWallet.getAddress();
    console.log("Smart Account Address:", smartWalletAddress);

    // Create a transaction for contract interaction
    console.log("Creating contract transaction...");
    const transaction = {
      to: CONTRACT_ADDRESS,
      value: '0', // No native token transfer
      data: FUNCTION_SELECTOR, // The function selector for the method we want to call
    };

    // Send the transaction
    console.log("Sending transaction...");
    const userOpResponse = await smartWallet.sendTransaction(transaction, {
      paymasterServiceData: { mode: PaymasterMode.SPONSORED },
    });
    console.log("UserOp Hash:", userOpResponse.hash);

    console.log("Waiting for transaction receipt...");
    const userOpReceipt = await waitForUserOpReceipt(userOpResponse, 60000); // Wait for up to 60 seconds
    
    if (userOpReceipt.success) {
      console.log("Transaction successful!");
      console.log("Transaction hash:", userOpReceipt.receipt.transactionHash);
    } else {
      console.log("Transaction failed");
      console.log("Receipt:", userOpReceipt);
    }
  } catch (error) {
    console.error("An error occurred:");
    console.error(error);
  }
}

async function waitForUserOpReceipt(userOpResponse, timeoutMs = 60000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const checkReceipt = async () => {
      try {
        const receipt = await userOpResponse.wait();
        resolve(receipt);
      } catch (error) {
        if (Date.now() - startTime > timeoutMs) {
          reject(new Error(`Transaction wait timeout after ${timeoutMs}ms`));
        } else {
          setTimeout(checkReceipt, 5000); // Retry every 5 seconds
        }
      }
    };
    checkReceipt();
  });
}

main().catch((error) => {
  console.error("Unhandled error in main function:");
  console.error(error);
});
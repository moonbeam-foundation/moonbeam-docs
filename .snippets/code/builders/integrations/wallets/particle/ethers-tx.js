import {useSmartAccount } from "@particle-network/connectkit";
import { AAWrapProvider, SendTransactionMode } from "@particle-network/aa";

const smartAccount = useSmartAccount();

// Init custom provider with gasless transaction mode
const customProvider = smartAccount
? new ethers.BrowserProvider(
    new AAWrapProvider(
        smartAccount,
        SendTransactionMode.Gasless
    ) as Eip1193Provider,
    "any"
    )
: null;

/**
 * Sends a transaction using the ethers.js library.
 * This transaction is gasless since the customProvider is initialized as gasless
*/
const executeTxEthers = async () => {
    if (!customProvider) return;
  
    const signer = await customProvider.getSigner();
    const tx = {
      to: recipientAddress,
      value: parseEther("0.01").toString(),
    };
  
    const txResponse = await signer.sendTransaction(tx);
    const txReceipt = await txResponse.wait();
    console.log(txReceipt?.hash)
  };
  
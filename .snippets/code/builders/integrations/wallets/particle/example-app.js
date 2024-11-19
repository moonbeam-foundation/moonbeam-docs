"use client";
import React, { useEffect, useState } from "react";

// Particle imports
import {
  ConnectButton,
  useAccount,
  usePublicClient,
  useSmartAccount,
} from "@particle-network/connectkit";

// Eip1193 and AA Provider
import { AAWrapProvider, SendTransactionMode } from "@particle-network/aa"; // Only needed with Eip1193 provider
import { ethers, type Eip1193Provider } from "ethers";
import { formatEther, parseEther } from "viem";

export default function Home() {
  const { isConnected, chain } = useAccount();
  const publicClient = usePublicClient();
  const smartAccount = useSmartAccount();

  const [userAddress, setUserAddress] = useState<string>("");
  const [balance, setBalance] = useState<string | null>(null);
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

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
   * Fetches the balance of a given address.
   * @param {string} address - The address to fetch the balance for.
   */
  const fetchBalance = async (address: string) => {
    try {
      const balanceResponse = await publicClient?.getBalance({
        address: address as `0x${string}`,
      });
      if (balanceResponse) {
        const balanceInEther = formatEther(balanceResponse).toString();
        setBalance(balanceInEther);
      } else {
        setBalance("0.0");
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalance("0.0");
    }
  };

  /**
   * Loads the user's account data, including address and balance.
   */
  useEffect(() => {
    const loadAccountData = async () => {
      if (isConnected && smartAccount) {
        try {
          const address = await smartAccount.getAddress();
          setUserAddress(address);
          await fetchBalance(address);
        } catch (error) {
          console.error("Error loading account data:", error);
        }
      }
    };
    loadAccountData();
  }, [isConnected, smartAccount]);

  /**
   * Sends a transaction using the ethers.js library.
   * This transaction is gasless since the customProvider is initialized as gasless
   */
  const executeTxEthers = async () => {
    if (!customProvider) return;

    const signer = await customProvider.getSigner();
    try {
      const tx = {
        to: recipientAddress,
        value: parseEther("0.01").toString(),
      };

      const txResponse = await signer.sendTransaction(tx);
      const txReceipt = await txResponse.wait();

      setTransactionHash(txReceipt?.hash || null);
    } catch (error) {
      console.error("Failed to send transaction using ethers.js:", error);
    }
  };

  return (
    <div className="container min-h-screen flex flex-col justify-center items-center mx-auto gap-4 px-4 md:px-8">
      <div className="w-full flex justify-center mt-4">
        <ConnectButton label="Click to login" />
      </div>
      {isConnected && (
        <>
          <div className="border border-purple-500 p-6 rounded-lg w-full">
            <h2 className="text-lg font-semibold mb-2 text-white">
              Address: <code>{userAddress || "Loading..."}</code>
            </h2>
            <h2 className="text-lg font-semibold mb-2 text-white">
              Balance: {balance || "Loading..."} {chain?.nativeCurrency.symbol}
            </h2>
            <input
              type="text"
              placeholder="Recipient Address"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="mt-4 p-3 w-full rounded border border-gray-700 bg-gray-900 text-white focus:outline-none"
            />
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={executeTxEthers}
              disabled={!recipientAddress}
            >
              Send 0.001 {chain?.nativeCurrency.name}
            </button>
            {transactionHash && (
              <p className="text-green-500 mt-4">
                Transaction Hash: {transactionHash}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

"use client";
import { ConnectButton, useAccount } from "@particle-network/connectkit";

const HomePage = () => {
  const { address, isConnected, chainId } = useAccount();

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <ConnectButton />
        {isConnected && (
          <>
            <h2>Address: {address}</h2>
            <h2>Chain ID: {chainId}</h2>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;

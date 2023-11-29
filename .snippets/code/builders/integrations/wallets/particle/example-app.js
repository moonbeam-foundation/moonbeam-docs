import React, { useState, useEffect } from 'react';
import { ParticleNetwork } from '@particle-network/auth';
import { ParticleProvider } from '@particle-network/provider';
import { Moonbeam } from '@particle-network/chains';
import { AAWrapProvider, SmartAccount } from '@particle-network/aa';
import { ethers } from 'ethers';

// Retrieved from the Particle Network dashboard
const config = {
  projectId: process.env.REACT_APP_PROJECT_ID,
  clientKey: process.env.REACT_APP_CLIENT_KEY,
  appId: process.env.REACT_APP_APP_ID,
};

// Core configuration
const particle = new ParticleNetwork({
  ...config,
  chainName: Moonbeam.name,
  chainId: Moonbeam.id,
  wallet: { displayWalletEntry: true },
});

// ERC-4337 AA configuration
const smartAccount = new SmartAccount(new ParticleProvider(particle.auth), {
  ...config,
  aaOptions: {
    accountContracts: {
      SIMPLE: [
        {
          version: '1.0.0',
          chainIds: [Moonbeam.id],
        },
      ],
    },
  },
});

// Uses custom EIP-1193 AA provider
const customProvider = new ethers.BrowserProvider(
  new AAWrapProvider(smartAccount)
);

// Sets wallet UI to use AA mode
particle.setERC4337({
  name: 'SIMPLE',
  version: '1.0.0',
});

const App = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    if (userInfo) {
      fetchBalance();
    }
  }, [userInfo]);

  const fetchBalance = async () => {
    const address = await smartAccount.getAddress();
    const balance = await customProvider.getBalance(address);
    setBalance(ethers.formatEther(balance));
  };

  const handleLogin = async (preferredAuthType) => {
    const user = !particle.auth.isLogin()
      ? await particle.auth.login({ preferredAuthType })
      : particle.auth.getUserInfo();
    setUserInfo(user);
  };

  // Sample burn transaction
  const executeUserOp = async () => {
    const signer = customProvider.getSigner();
    const tx = {
      to: '0x000000000000000000000000000000000000dEaD',
      value: ethers.parseEther('0.001'),
    };
    const txResponse = await signer.sendTransaction(tx);
    const txReceipt = await txResponse.wait();
    console.log('Transaction hash:', txReceipt.transactionHash);
  };

  return (
    <div className="App">
      {!userInfo ? (
        <div>
          <button onClick={() => handleLogin('google')}>
            Sign in with Google
          </button>
          <button onClick={() => handleLogin('twitter')}>
            Sign in with Twitter
          </button>
        </div>
      ) : (
        <div>
          <h2>{userInfo.name}</h2>
          <div>
            <small>{balance}</small>
            <button onClick={executeUserOp}>Execute User Operation</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

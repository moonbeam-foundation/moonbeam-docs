import React, { useEffect, useState } from 'react';
import { ConnectButton, TransactionButton } from 'thirdweb/react';
import thirdwebIcon from './thirdweb.svg';
import { client } from './client';
import { getNumber, getTimestamp } from './contract';
import { prepareContractCall, getContract, defineChain } from 'thirdweb';
import { createWallet, inAppWallet } from 'thirdweb/wallets';

// Define the wallet options
const wallets = [
  inAppWallet(),
  createWallet('io.metamask'),
  createWallet('com.coinbase.wallet'),
  createWallet('me.rainbow'),
];

export function App() {
  const [contract, setContract] = useState(null);
  const [number, setNumber] = useState<string>('Loading...');
  const [timestamp, setTimestamp] = useState<string>('Loading...');

  const ABI = [
    {
      inputs: [],
      name: 'increment',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'number',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'timestamp',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
  ];
  const CONTRACT_ADDRESS = '0xa72f549A1a12b9b49f30a7F3aEb1f4E96389c5d8'; // Replace with your actual contract address

  const moonbase = defineChain({
    id: 1287,
    rpc: 'https://rpc.api.moonbase.moonbeam.network',
  });

  const myContract = getContract({
    client,
    chain: moonbase,
    address: CONTRACT_ADDRESS,
    abi: ABI,
  });

  useEffect(() => {
    async function fetchContractAndData() {
      try {
        const loadedContract = myContract;
        setContract(loadedContract);

        const num = await getNumber();
        const time = await getTimestamp();
        console.log('Data fetched:', {
          num: num.toString(),
          time: time.toString(),
        });

        setNumber(num.toString());
        setTimestamp(
          time
            ? new Date(Number(time) * 1000).toLocaleString()
            : 'No timestamp yet'
        );
      } catch (error) {
        console.error('Failed to fetch data or contract:', error);
        setNumber('Failed to load');
        setTimestamp('Failed to load');
      }
    }
    fetchContractAndData();
  }, []);

  return (
    <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
      <div className="py-20">
        <Header />
        <div className="flex justify-center mb-20">
          <ConnectButton
            client={client}
            wallets={wallets}
            appMetadata={{
              name: 'Example app',
              url: 'https://example.com',
            }}
            label="Connect Your Wallet" // Custom button text
            style={{ backgroundColor: 'blue', color: 'white' }} // Custom styles
          />
        </div>
        <div>
          <h2>Current Number: {number}</h2>
          <h2>Last Updated: {timestamp}</h2>
        </div>
        {contract && <IncrementButton contract={contract} />}
      </div>
    </main>
  );
}

function Header() {
  return (
    <header className="flex flex-col items-center mb-20 md:mb-20">
      <img
        src={thirdwebIcon}
        alt=""
        className="size-[150px] md:size-[150px]"
        style={{
          filter: 'drop-shadow(0px 0px 24px #a726a9a8)',
        }}
      />
      <h1 className="text-2xl md:text-6xl font-bold tracking-tighter mb-6 text-zinc-100">
        thirdweb SDK
        <span className="text-zinc-300 inline-block mx-1"> + </span>
        <span className="inline-block -skew-x-6 text-violet-500"> vite </span>
      </h1>
      <p className="text-zinc-300 text-base">
        Read the{' '}
        <code className="bg-zinc-800 text-zinc-300 px-2 rounded py-1 text-sm mx-1">
          README.md
        </code>{' '}
        file to get started.
      </p>
    </header>
  );
}

function IncrementButton({ contract }) {
  return (
    <TransactionButton
      transaction={() => {
        console.log('Preparing to call increment...');
        // Verify that 'contract' is not undefined
        if (!contract) {
          console.error('Contract is undefined.');
          return;
        }
        const tx = prepareContractCall({
          contract,
          method: 'increment',
          params: [],
        });
        return tx;
      }}
      onTransactionSent={(result) => {
        console.log('Transaction submitted', result.transactionHash);
      }}
      onTransactionConfirmed={(receipt) => {
        console.log('Transaction confirmed', receipt.transactionHash);
      }}
      onError={(error) => {
        console.error('Transaction error', error);
      }}
    >
      Increment Counter
    </TransactionButton>
  );
}

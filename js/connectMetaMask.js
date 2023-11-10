const provider = window.ethereum;
const supportedNetworks = {
  moonbeam: {
    name: 'moonbeam',
    chainId: '0x504',
    chainName: 'Moonbeam',
    rpcUrls: ['https://rpc.api.moonbeam.network'],
    blockExplorerUrls: ['https://moonbeam.moonscan.io/'],
    nativeCurrency: {
      name: 'Glimmer',
      symbol: 'GLMR',
      decimals: 18,
    },
  },
  moonriver: {
    name: 'moonriver',
    chainId: '0x505',
    chainName: 'Moonriver',
    rpcUrls: ['https://rpc.api.moonriver.moonbeam.network'],
    blockExplorerUrls: ['https://moonriver.moonscan.io/'],
    nativeCurrency: {
      name: 'Moonriver',
      symbol: 'MOVR',
      decimals: 18,
    },
  },
  moonbase: {
    name: 'moonbase',
    chainId: '0x507',
    chainName: 'Moonbase Alpha',
    rpcUrls: ['https://rpc.api.moonbase.moonbeam.network'],
    blockExplorerUrls: ['https://moonbase.moonscan.io/'],
    nativeCurrency: {
      name: 'DEV',
      symbol: 'DEV',
      decimals: 18,
    },
  },
};

// If user clicks on "Connect Wallet", show the networks they can connect to
const connectMetaMaskNav = document.querySelector('.connectMetaMask-nav');
connectMetaMaskNav.addEventListener('click', async (e) => {
  e.preventDefault();

  // Is user already connected? If so, to which network and which account?
  // If not, throw an error
  if (provider) {
    networkModalContainer.style.display = 'block';
    // Get the connected network
    const { connectedMoonbeamNetwork, connectedMoonbeamNetworkButton } = await getConnectedNetwork();
    const accounts = await provider.request({ method: 'eth_accounts' });

    // If you have added Moonbeam to your wallet and have an account connected to Moonbeam, display it
    // Otherwise, don't display the account
    if (connectedMoonbeamNetwork && accounts.length > 0) {
      await displayConnectedAccount(connectedMoonbeamNetwork, connectedMoonbeamNetworkButton);
    }
  } else {
    const errorMessage = `It looks like you don't have any Ethereum-compatible wallets installed. Please install an Etheruem-compatible wallet, such as <a href="https://metamask.io/download.html" target="_blank" rel="noreferrer noopener">MetaMask</a>, and try again.`;
    handleError(errorMessage);
  }

  // Add logic for connecting to any of the Moonbeam networks
  const moonbeamNetworkButtons = document.querySelectorAll(`.connect-network`);
  if (moonbeamNetworkButtons) {
    moonbeamNetworkButtons.forEach((button) => {
      e.preventDefault();
      // If user isn't already connected to a network, allow them to connect to it
      // and then hide the modal
      if (!button.classList.contains('disabled-button')) {
        button.addEventListener('click', (e) => {
          connectNetwork(e.target.attributes['data-value'].value);
          networkModalContainer.style.display = 'none';
        });
      }
    });
  }
});

const connectNetwork = async (network) => {
  try {
    const targetNetwork = { ...supportedNetworks[network] };
    delete targetNetwork.name;

    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [targetNetwork],
    });
    await provider.request({ method: 'eth_requestAccounts' });

  } catch (e) {
    /** Code 4001 is user rejected, we don't need to notify the user if they rejected the request */
    if (e.code !== 4001 && e.code !== -32002) {
      handleError(e.message);
    }
  }
};

// Get the network that the user is currently connected to
const getConnectedNetwork = async () => {
  // Get the chain ID of the connected account
  const chainId = await provider.request({
    method: 'eth_chainId',
  });

  // Check if the connected network is a Moonbeam network
  const connectedMoonbeamNetwork = Object.values(supportedNetworks).find(
    (network) => network.chainId === chainId
  );

  // If the connected network is a Moonbeam network, update the button text
  // to say "Connected" along with the address of the connected account
  if (connectedMoonbeamNetwork) {
    const connectedMoonbeamNetworkButton = document.querySelector(
      `.connect-network[data-value="${connectedMoonbeamNetwork.name}"]`
    );

    return { connectedMoonbeamNetwork, connectedMoonbeamNetworkButton };
  } else {
    return { connectedMoonbeamNetwork: null, connectedMoonbeamNetworkButton: null };
  }
};

// Display the account that is connected and the Moonbeam network the account is connected to
const displayConnectedAccount = async (connectedNetwork, networkButton) => {
  // Get the connected accounts
  const accounts = await provider.request({ method: 'eth_requestAccounts' });

  const shortenedAccount = `${accounts[0].slice(0, 6)}...${accounts[0].slice(
    -4
  )}`;
  networkButton.innerHTML = `Connected to ${connectedNetwork.chainName}: ${shortenedAccount}`;
  networkButton.className +=
    ' disabled-button';
};

const handleError = (message) => {
  const errorModalContainer = document.querySelector('.error-modal-container');
  const errorMessage = document.querySelector('.error-message');
  errorModalContainer.style.display = 'block';
  errorMessage.innerHTML = message;
};

if (provider) {
  /** Reload the page if the chain changes */
  provider.on('chainChanged', () => {
    window.location.reload();
  });
  /** When the account changes update the button text */
  provider.on('accountsChanged', async (accounts) => {
    if (accounts.length > 0) {
      // Get the connected network
      const { connectedMoonbeamNetwork, connectedMoonbeamNetworkButton } = await getConnectedNetwork();
      if (connectedMoonbeamNetwork) {
        await displayConnectedAccount(connectedMoonbeamNetwork, connectedMoonbeamNetworkButton);
      }
    } else {
      window.location.reload();
    }
  });
}

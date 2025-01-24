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

/*
  -connectNetwork - Add or switch to the specified network, then request accounts
  -NOTE: This calls "eth_requestAccounts" at the end, which prompts for wallet connection
 */
const connectNetwork = async (network) => {
  try {
    const targetNetwork = { ...supportedNetworks[network] };
    delete targetNetwork.name; // remove 'name' property if needed

    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [targetNetwork],
    });
    // This line requests user accounts, which triggers a "connect" prompt if not already connected:
    await provider.request({ method: 'eth_requestAccounts' });
  } catch (e) {
    // 4001: user rejected, -32002: request already pending
    if (e.code !== 4001 && e.code !== -32002) {
      handleError(e.message);
    }
  }
};

// Original getConnectedNetwork
const getConnectedNetwork = async () => {
  const chainId = await provider.request({ method: 'eth_chainId' });
  const connectedMoonbeamNetwork = Object.values(supportedNetworks).find(
    (network) => network.chainId === chainId
  );
  if (connectedMoonbeamNetwork) {
    const connectedMoonbeamNetworkButton = document.querySelector(
      `.connect-network[data-value="${connectedMoonbeamNetwork.name}"]`
    );
    return { connectedMoonbeamNetwork, connectedMoonbeamNetworkButton };
  } else {
    return { connectedMoonbeamNetwork: null, connectedMoonbeamNetworkButton: null };
  }
};

// Original displayConnectedAccount
const displayConnectedAccount = async (connectedNetwork, networkButton) => {
  const accounts = await provider.request({ method: 'eth_requestAccounts' });
  if (!accounts || accounts.length === 0) return;

  const shortenedAccount = `${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`;
  networkButton.innerHTML = `Connected to ${connectedNetwork.chainName}: ${shortenedAccount}`;
  networkButton.className += ' disabled-button';
};

// Original handleError
const handleError = (message) => {
  const errorModalContainer = document.querySelector('.error-modal-container');
  const errorMessage = document.querySelector('.error-message');
  errorModalContainer.style.display = 'block';
  errorMessage.innerHTML = message;
};

/*
  -NAV BUTTON: Already working code (DON'T touch it THIS IS FINE)
  -Shows modal and sets up .connect-network links inside the modal
*/

const connectMetaMaskNav = document.querySelector('.connectMetaMask-nav');
connectMetaMaskNav.addEventListener('click', async (e) => {
  e.preventDefault();

  if (provider) {
    networkModalContainer.style.display = 'block';
    const { connectedMoonbeamNetwork, connectedMoonbeamNetworkButton } = await getConnectedNetwork();
    const accounts = await provider.request({ method: 'eth_accounts' });

    if (connectedMoonbeamNetwork && accounts.length > 0) {
      await displayConnectedAccount(connectedMoonbeamNetwork, connectedMoonbeamNetworkButton);
    }
  } else {
    const errorMessage = `It looks like you don't have any Ethereum-compatible wallets installed. Please install an Ethereum-compatible wallet, such as MetaMask, and try again.`;
    handleError(errorMessage);
  }

  // Attach click handlers to .connect-network buttons in the modal
  const moonbeamNetworkButtons = document.querySelectorAll('.connect-network');
  if (moonbeamNetworkButtons) {
    moonbeamNetworkButtons.forEach((button) => {
      
      if (!button.classList.contains('disabled-button')) {
        button.addEventListener('click', (ev) => {
          ev.preventDefault();
          connectNetwork(ev.target.getAttribute('data-value'));
          networkModalContainer.style.display = 'none';
        });
      }
    });
  }
});

/*
 - BODY BUTTON: NEW code
 - Directly connect to the network specified in 'value'
 */
const connectMetaMaskBodyButtons = document.querySelectorAll('.connectMetaMask');
connectMetaMaskBodyButtons.forEach((btn) => {
  btn.addEventListener('click', async (e) => {
    e.preventDefault();

    if (!provider) {
      handleError(`No Ethereum-compatible wallet found. Please install MetaMask.`);
      return;
    }

  
    const network = btn.getAttribute('value');
    if (!network || !supportedNetworks[network]) {
      handleError(`The network "${network}" is not supported or not defined.`);
      return;
    }

    
    await connectNetwork(network);
  });
});


if (provider) {
  provider.on('chainChanged', () => {
    window.location.reload();
  });
  provider.on('accountsChanged', async (accounts) => {
    if (accounts.length > 0) {
      const { connectedMoonbeamNetwork, connectedMoonbeamNetworkButton } = await getConnectedNetwork();
      if (connectedMoonbeamNetwork) {
        await displayConnectedAccount(connectedMoonbeamNetwork, connectedMoonbeamNetworkButton);
      }
    } else {
      window.location.reload();
    }
  });
}

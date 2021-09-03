const provider = window.ethereum;
const moonbaseAlphaChainId = '0x507';
const moonriverChainId = '0x505';

/**  Add event listener to the Connect MetaMask buttons */
const metaMaskButtons = document.querySelectorAll('.connectMetaMask');
const connectMetaMaskNav = document.querySelector('.connectMetaMask-nav');

const supportedNetworks = {
  moonbase: {
    chainId: moonbaseAlphaChainId,
    chainName: 'Moonbeam TestNet Moonbase Alpha',
    rpcUrls: ['https://rpc.testnet.moonbeam.network'],
    blockExplorerUrls: [
      'https://moonbase-blockscout.testnet.moonbeam.network/',
    ],
    nativeCurrency: {
      name: 'DEV',
      symbol: 'DEV',
      decimals: 18,
    },
  },
  moonriver: {
    chainId: moonriverChainId,
    chainName: 'Moonriver Kusama',
    rpcUrls: ['https://rpc.moonriver.moonbeam.network'],
    blockExplorerUrls: ['https://blockscout.moonriver.moonbeam.network/'],
    nativeCurrency: {
      name: 'Moonriver',
      symbol: 'MOVR',
      decimals: 18,
    },
  },
};

/** If we are already connected, show disbled button with 'Connected' text */
const displayConnected = async (buttons, network, title) => {
  const accounts = await ethereum.request({ method: 'eth_accounts' });
  for (let i = 0; i < buttons.length; i++){
    let button = buttons[i]
    if (button && button.attributes.value.value === network && accounts.length > 0) {
      const shortenedAccount = `${accounts[0].slice(
        0,
        6
        )}...${accounts[0].slice(-4)}`;
        button.innerHTML = `Connected to ${title}: ${shortenedAccount}`;
        button.className += ' disabled-button';
      }
    }
  }

  const isConnectedToMoonbeam = async (buttons) => {
    const chainId = await provider.request({
      method: 'eth_chainId',
    });
    if (chainId === moonbaseAlphaChainId){
      displayConnected(buttons, "moonbase", "Moonbase Alpha")
    } else if (chainId === moonriverChainId) {
      displayConnected(buttons, "moonriver", "Moonriver");
    }
  };
  
  const connect = async (network) => {
    /** In case we need to throw an error, let's grab the error modal & error message */
    const errorModalContainer = document.querySelector('.error-modal-container');
    const errorMessage = document.querySelector('.error-message');
  
    if (provider) {
      try {
        const currentNetwork = provider.chainId;
        const targetNetwork = supportedNetworks[network];
        if (targetNetwork.chainId === currentNetwork) {
          throw new Error(`You are already connected to the ${targetNetwork.chainName} network`)
        }
        await provider.request({ method: 'eth_requestAccounts' });
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [targetNetwork],
        });
      } catch (e) {
        /** Code 4001 is user rejected, we don't need to notify the user if they rejected the request */
        if (e.code !== 4001) {
          errorModalContainer.style.display = 'block';
          errorMessage.innerHTML = e.message;
        }
      }
    } else {
      errorModalContainer.style.display = 'block';
      errorMessage.innerHTML = `It looks like MetaMask hasn't been installed. Please <a href="https://metamask.io/download.html" target="_blank" rel="noreferrer noopener">install MetaMask</a> and try again.`;
    }
  };

// If user is not on Integrate MetaMask page, connectMetaMask will not be available so
// we need to check if it's there before adding the event listener to it
if (metaMaskButtons) {
  metaMaskButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault()
        if (!button.classList.contains("disabled-button")){
          connect(e.target.attributes.value.value);
        }
      });
  });
  /** Check if user is connected to Moonbeam and display correct button text */
  isConnectedToMoonbeam(metaMaskButtons);
}
connectMetaMaskNav.addEventListener('click', (e) => {
  e.preventDefault()
  const networkModalContainer = document.querySelector('.network-modal-container');
  networkModalContainer.style.display = 'block'

  const networkOptions = document.querySelectorAll('.connect-network');
  if (networkOptions){
    networkOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        e.preventDefault();
        if (!option.classList.contains("disabled-button")){
          connect(e.target.attributes.value.value);
          networkModalContainer.style.display = 'none'
        }
      })
    })
    isConnectedToMoonbeam(networkOptions)
  }
});

if (provider) {
  /** Reload the page if the chain changes */
  provider.on('chainChanged', () => {
    // MetaMask recommends reloading the page unless we have good reason not to
    // Plus, everytime the window reloads, we call isConnectedToMoonbaseAlpha again
    // and can show the correct 'Connected' or 'Connect MetaMask' button text
    window.location.reload();
  });
  /** When the account changes update the button text */
  provider.on('accountsChanged', (accounts) => {
    if (accounts.length > 0) {
      isConnectedToMoonbeam(metaMaskButtons)
    } else {
      window.location.reload();
    }
  });
}
const metaMaskSelectWrapper = document.querySelector(".metamask-select-wrapper");
const metamaskSelect = document.querySelector(".metamask-select");
const networkOptions = document.querySelectorAll(".metamask-select-wrapper .metamask-select li");
const metaMaskSelectLabel = document.querySelector(".metamask-select-label");

const provider = window.ethereum;
const moonbaseAlphaChainId = "0x507";
const moonriverChainId = "0x505";

const supportedNetworks = 
  {
    moonbase: {
      chainId: moonbaseAlphaChainId,
      chainName: "Moonbase Alpha",
      rpcUrls: ["https://rpc.testnet.moonbeam.network"],
      blockExplorerUrls: ["https://moonbase-blockscout.testnet.moonbeam.network/"],
      nativeCurrency: {
        name: 'DEV',
        symbol: 'DEV',
        decimals: 18
      },
    },
    moonriver: {
      chainId: moonriverChainId,
      chainName: "Moonriver",
      rpcUrls: ["https://rpc.moonriver.moonbeam.network"],
      nativeCurrency: {
        name: 'Moonriver',
        symbol: 'MOVR',
        decimals: 18
      },
    }
  };

const displayConnected = async () => {
  const accounts = await ethereum.request({ method: 'eth_accounts' });
  if (accounts.length > 0){
    const shortenedAccount = `${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`;
    metaMaskSelectLabel.textContent =`Connected: ${shortenedAccount}`;
  }
}

const isConnectedToMoonbeam = async () => {
  const chainId = await provider.request({
      method: 'eth_chainId'
  })
  if (chainId === moonbaseAlphaChainId || chainId === moonriverChainId) {
    displayConnected(); 
  }
}

/* If user is connected to MetaMask, show "Connected: 0x00aa...aa0" */
if (provider) {
  isConnectedToMoonbeam();

  provider.on("chainChanged", () => {
    // MetaMask recommends reloading the page unless we have good reason not to
    // Plus, everytime the window reloads, we call isConnectedToMoonbaseAlpha again
    // and can show the correct 'Connected' or 'Connect MetaMask' button text
    window.location.reload();
  })

  /** When the account changes update the button text */
  provider.on("accountsChanged", (accounts) => {
    if (accounts.length > 0) {
      displayConnected();
    } else {
      window.location.reload()
    }
  })
}

/* Add event listeners */
metaMaskSelectWrapper.addEventListener("click", (e) => {
  e.preventDefault();
  metaMaskSelectWrapper.classList.toggle("active");
})

/** Connect to Moonbase Alpha */
const connect = async (network) => {
    /** In case we need to throw an error, let's grab the error modal & error message */
    const errorModalContainer = document.querySelector(".error-modal-container");
    const errorMessage = document.querySelector(".error-message");

    if (provider) {
        try {
            await provider.request({ method: "eth_requestAccounts"});
            await provider.request({
                method: "wallet_addEthereumChain",
                params: [supportedNetworks[network]]
            })
        } catch(e) {
            /** Code 4001 is user rejected, we don't need to notify the user if they rejected the request */
            if (e.code !== 4001) {
                errorModalContainer.style.display = "block";
                errorMessage.innerHTML = e.message;
            }
        }
    } else {
        errorModalContainer.style.display = "block";
        errorMessage.innerHTML = `It looks like MetaMask hasn't been installed. Please <a href="https://metamask.io/download.html" target="_blank" rel="noreferrer noopener">install MetaMask</a> and try again.`
    }
}

networkOptions.forEach(option => {
  option.addEventListener("click", (e) => {
    e.preventDefault();
    
    connect(e.target.className);
  })
})

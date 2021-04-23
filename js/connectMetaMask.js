const provider = window.ethereum;
const moonbaseAlphaChainId = "0x507";

/** Connect to Moonbase Alpha */
const setupMoonbaseAlpha = async () => {
    /** In case we need to throw an error, let's grab the error modal & error message */
    const errorModalContainer = document.querySelector(".error-modal-container");
    const errorMessage = document.querySelector(".error-message");

    if (provider) {
        try {
            await provider.request({ method: "eth_requestAccounts"});
            await provider.request({
                method: "wallet_addEthereumChain",
                params: [
                    {
                        chainId: moonbaseAlphaChainId,
                        chainName: "Moonbase Alpha",
                        nativeCurrency: {
                            name: 'DEV',
                            symbol: 'DEV',
                            decimals: 18
                        },
                       rpcUrls: ["https://rpc.testnet.moonbeam.network"],
                       blockExplorerUrls: ["https://moonbase-blockscout.testnet.moonbeam.network/"]
                    },
                ]
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

/**  Add event listener to the Connect MetaMask buttons */
const connectMetaMask = document.querySelector(".connectMetaMask");
const connectMetaMaskNav = document.querySelector(".connectMetaMask-nav");

// If user is not on Integrate MetaMask page, connectMetaMask will not be available so
// we need to check if it's there before adding the event listener to it
if (connectMetaMask) {
    connectMetaMask.addEventListener("click", () => {
        setupMoonbaseAlpha();
    })
}
connectMetaMaskNav.addEventListener("click", () => {
    setupMoonbaseAlpha();
})

/** If we are already connected to Moonbase Alpha, show disbled button with 'Connected' text */
const connectButtons = [connectMetaMask, connectMetaMaskNav];
const displayConnectedButton = async () => {
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    connectButtons.forEach((button) => {
        if (button && accounts.length > 0){
            const shortenedAccount = `${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`;
            button.innerHTML =`Connected: ${shortenedAccount}`;
            button.className += " disabled-button";
            button.removeEventListener("click", () => {});
        }     
    })
}

const isConnectedToMoonbaseAlpha = async () => {
    const chainId = await provider.request({
        method: 'eth_chainId'
    })
    if (chainId === moonbaseAlphaChainId){
        displayConnectedButton();
    }
}

if (provider) {
    /** Check if user is connected to Moonbase Alpha and display correct button text */
    isConnectedToMoonbaseAlpha();
    
    /** Reload the page if the chain changes */
    provider.on("chainChanged", () => {
        // MetaMask recommends reloading the page unless we have good reason not to
        // Plus, everytime the window reloads, we call isConnectedToMoonbaseAlpha again
        // and can show the correct 'Connected' or 'Connect MetaMask' button text
        window.location.reload();
    })

    /** When the account changes update the button text */
    provider.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
            displayConnectedButton();
        } else {
            window.location.reload()
        }
    })
}

const provider = window.ethereum;

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
                        chainId: "0x507",
                        chainName: "Moonbase Alpha",
                        nativeCurrency: {
                            name: 'DEV',
                            symbol: 'DEV',
                            decimals: 18
                        },
                       rpcUrls: ["https://rpc.testnet.moonbeam.network"],
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
const isConnectedToMoonbaseAlpha = async () => {
    const chainId = await provider.request({
        method: 'eth_chainId'
    })
    if (chainId === "0x507"){
        connectMetaMask.innerHTML = "Connected";
        connectMetaMask.className += " disabled-button";
        connectMetaMaskNav.innerHTML = "Connected";
        connectMetaMaskNav.className += " disabled-button";
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
}

---
title: Integrate WalletConnect
description: Learn how to integrate WalletConnect into a dApp built on any of the Moonbeam networks
---

# Integrate WalletConnect into a DApp

![WalletConnect Banner](/images/builders/tools/walletconnect/walletconnect-banner.png)

## Introduction {: #introduction } 

[WalletConnect](https://walletconnect.com/) is an open protocol to communicate securely between wallets and DApps. 

// Brief overview of how it works

WalletConnect is a widely supported standard that is chain agnostic, making it ideal to integrate into your DApp.

In this guide, you'll learn how to integrate WalletConnect into a simple DApp built on the Moonbase Alpha TestNet. The guide will be divided into a few different sections. The first section will cover connecting your DApp to MetaMask mobile. After the connection has been established, the guide will cover disconnections. This way, when you are testing your DApp you will be able to connect and then disconnect so you don't end up with a bunch of unnecessary WalletConnect sessions lingering in MetaMask mobile. Afterwards you will learn how to display network and account details when connected, and send transactions from your DApp to MetaMask mobile for confirmation.

This guide is an adaptation of the [WalletConnect Example Dapp](https://example.walletconnect.org/){target=blank} ([source code](https://github.com/WalletConnect/walletconnect-example-dapp){target=blank}).

## Checking Prerequisites {: #checking-prerequisites }

Throughout this guide, you'll use a simple front-end DApp built with [React](https://reactjs.org/) to connect to a mobile wallet via WalletConnect. So you will need a React project and a mobile wallet installed for testing purposes.

To get started quickly with a bare-bone React project, you can use [Create React App](https://create-react-app.dev/). This example uses version 4.0.3 of Create React App.

To explicitly use version 4.0.3, you can add your app name and run the following command:

```
npx create-react-app INSERT-APP-NAME-HERE --scripts-version 4.0.3
```

Once you have spun up a React project, you will need to install [Ethers](https://docs.ethers.io/v5/) and a couple of [WalletConnect](https://docs.walletconnect.com/quick-start/dapps/client#install) packages:

```
npm install ethers @walletconnect/client @walletconnect/qrcode-modal
```

This guide will use MetaMask mobile for testing purposes. You can install MetaMask mobile from the [Apple App Store](https://apps.apple.com/us/app/metamask-blockchain-wallet/id1438144202) or [Google Play Store](https://play.google.com/store/apps/details?id=io.metamask&hl=en_US&gl=US).

Lastly, you will need to have an account funded with DEV tokens, so that you can test out sending a transaction. To [get tokens](/builders/get-started/moonbase/#get-tokens) you can head to the faucet on [Discord](https://discord.com/invite/PfpUATX).

## Getting Started {: #getting-started }

This guide will not cover any styling, but you can refer to the [demo app](LINK-TO-DEMO-APP) styles, which uses the [Styled Components](https://styled-components.com/) library. You can also add in your own custom styling as you go. 

### Setup the App.js File {: #setup-the-appjs-file }

For simplicity, you can add the buttons and the logic to the `App.js` file located in the `src` directory. If you spun up your React project using Create React App, the `App.js` file will include a `App` function that returns some generic content. To get started, you can remove the content in the `return` statement so that you have a fresh slate to work with.

Your `App.js` file should look something like this:

```js

function App() {
    // Logic will go here

    return (
        // Buttons will go here
    )
}

export default App;
```

### Setup MetaMask Mobile {: #setup-metamask-mobile }

As you go through the guide, you can use MetaMask mobile to test the WalletConnect connection and confirm transactions. Before getting started, you will need to connect to the Moonbase Alpha TestNet. When working with MetaMask directly you can typically prompt users to switch networks, however, this is not possible when connecting via WalletConnect. Therefore, you will need to be on the correct network for testing purposes. Later on in the guide, you will learn how to check if the connected network is a supported network, and if not display an error that will suggest users to switch to a network that is supported. 

There are a couple of ways you can connect your MetaMask mobile wallet to the Moonbase Alpha TestNet. You can manually add Moonbase Alpha from the **Networks** section of the **Settings** menu. Or you can also open up the **Browser** from MetaMask mobile and navigate to docs.moonbeam.network, click on **Connect MetaMask** at the top of the page, and select **Moonbase Alpha** from the menu. This will prompt you to automatically add Moonbase Alpha as a custom network and saves you from inputting the network configurations manually.

## Connect DApp to MetaMask Mobile {: #connect-dapp-to-metamask-mobile }

In this section, you will learn how to make a connection between your DApp and MetaMask mobile. WalletConnect establishes a remote connection between a DApp and mobile wallet by using a bridge server to relay payloads. The connection is initiated via a QR code displayed in the DApp, which will need to be scanned and approved by the mobile wallet.

To get started, you will need to import the WalletConnect client and QR code modal libraries. In addition, you will also need to import the `useState` hook from React. The [state hook](https://reactjs.org/docs/hooks-state.html){target=blank} is a special React function that enables you to add state to function components. This way you don't have to convert function components to classes in order to use state.

```js
import { useState } from "react";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
```

To keep track of changes to the WalletConnect connector and when data is being fetched, you will need a `connector` and `fetching` state hook. 

```js
const [connector, setConnector] = useState(null);
const [fetching, setFetching] = useState(false);
```

With the necessary imports and state hooks, you can now create the `connect` function that will handle the connection logic. In this function, you will need to:

1. Use the `setFetching` function to update the `fetching` state variable to `true` while the connection is being established
2. Create a new instance of the WalletConnect connector and pass in the URL for the bridge server and the default QR code modal
3. Use the `setConnector` function to update the `connector` state variable
4. Check if the connection has been established, and if not create a new session request

```js
const connect = async () => { 
    // 1. Update the fetching state
    setFetching(true);

    // 2. Create connector
    const connector = new WalletConnect({ bridge: "https://bridge.walletconnect.org", qrcodeModal: QRCodeModal });

    // 3. Update the connector state
    setConnector(connector);

    // 4. If not connected, create a new session
    if (!connector.connected) {
      await connector.createSession();
    }
};
```

Now that you have the `connect` function setup, you can create a **Connect Wallet** button that will call it `onClick`. You can wrap the button in a [fragment](https://reactjs.org/docs/fragments.html) so that as you continue on through the guide, you can add additional elements as needed.

```js
<>
    <button onClick={connect}>Connect Wallet</button>
</>
```

Altogether, your `App.js` file should resemble the following:

```js
import { useState } from "react";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

function App() {
    const [connector, setConnector] = useState(null);
    const [fetching, setFetching] = useState(false);

    const connect = async () => { 
        // 1. Update the fetching state
        setFetching(true);

        // 2. Create connector
        const connector = new WalletConnect({ bridge: "https://bridge.walletconnect.org", qrcodeModal: QRCodeModal });

        // 3. Update the connector state
        setConnector(connector);

        // 4. If not connected, create a new session
        if (!connector.connected) {
            await connector.createSession();
        }
    };

    return (
        <>
            <button onClick={connect}>Connect Wallet</button>
        </>
    )
}

export default App;
```

To test out the code so far, you can run `npm start` to spin up a local instance of your DApp. Then click on **Connect Wallet**. The WalletConnect QR code modal will pop-up. To scan the QR code, you can open up MetaMask mobile and click on the scan icon in the top right corner and scan it. A window will pop-up at the bottom of the screen and prompt you to connect to the DApp. Click **Connect**. If you were able to successfully connect, you will see a pop-up in MetaMask that says **Connected to React App**.

## Update DApp on Connection {: #update-dapp-on-connection}

Now that you have connected your mobile wallet, your DApp needs to be updated to reflect that a connection has been established. Upon connection, WalletConnect will emit a `connect` event. When this occurs, you will need to update the `fetching` state to `false`.

To subscribe to events, such as the `connect` event and later on the `disconnect` event, you will use the [React Effect Hook](https://reactjs.org/docs/hooks-effect.html){target=blank}. The effect hook lets you perform side effects in function components such as fetching data and setting up a subscription.

First you will need to update the existing React import and add the `useEffect` hook.

```js
    import { useState, useEffect } from "react";
```

Next you will want to use the `useEffect` function to listen for the `disconnect` event. Then in the callback, you can use the `setFetching` hook to set the `fetching` state variable to `false`. You will need to add the `connector` to the dependecy array for the `useEffect` hook, so that anytime the `connector` changes the effect hook will run again.

```js
useEffect(() => {
    if (connector) {
        connector.on("connect", async (error, payload) => {
            if (error) {
                // Handle errors as you see fit
                console.error(error)
            }

            // Logic for handling the payload will eventually go here

            setFetching(false);
        })
    }
}, [connector])
```

In the next section you will add the disconnection logic, once this is done, you will be able to see that when a user is connected, the **Connect Wallet** button will no longer be displayed and a **Disconnect** button will be rendered instead.

## Handle Disconnections

When you're developing your DApp and the WalletConnect integration, it is important to handle disconnections so that you can properly test the flow of the integration. You also don't want to end up with a bunch of unnecessary lingering sessions within MetaMask mobile.

If at any time, you need to manually end a session, you can do so from MetaMask mobile by naivgating to **Settings**. From there select **Experimental**, and under **WalletConnect Sessions**, tap on **View Sessions**. To remove a specific session, you can hold down on the session until a pop-up appears at the bottom of the screen where you can then tap **End**. Although this is important for development, this way of disconnecting a session can also be done by a user. The next couple of sections will cover the logic for how to handle disconnections from your DApp and from MetaMask mobile.

### Disconnect from DApp {: #disconnect-from-dapp }

To make it easy for users, your DApp should have a **Disconnect** button that will end the active session on their mobile wallet. First you can create the logic and then you can create the button.

Upon disconnecting, you will need to reset the state of your DApp back to the initial state. To reset the state, you can create a `resetApp` function that uses the state hooks.

```js
const resetApp = () => {
    setConnector(null);
    setFetching(false);
}
```

In addition to resetting the state of the DApp, you will also need to kill the session using the `connector` and the WalletConnect `killSession` function. Since all of this functionality should happen when the user clicks on the **Disconnect** button, you can create a single `killSession` function to handle the reset and the disconnection.

```js
const killSession = () => {
    // Make sure the connector exists before trying to kill the session
    if (connector) {
      connector.killSession();
    }
    resetApp();
}
```

Now that you have all of the logic required to handle the disconnection, you will need the **Disconnect** button that `onClick` will call the `killSession` function. Since you only want to display the **Disconnect** button once a user is connected, you can use [conditional renderering](https://reactjs.org/docs/conditional-rendering.html){target=blank}. Conditional rendering allows you to check against certain variables and if a condition applies, if you are not fetching the initial connection and the connector exists, you can render the **Disconnect** button, otherwise render the **Connect Wallet** button.

```html
return (
    <>
        {connector && !fetching ? 
            <button onClick={killSession}>Disconnect</button>
            :
            <button onClick={connect}>Connect Wallet</button>
        }
    </>
)
```

If you go to test the disconnection logic and nothing happens when you click **Connect Wallet**, make sure you have manually ended any pre-existing sessions from MetaMask mobile. If you're still running into problems, do a hard refresh on your browser.

Now when a user clicks on **Disconnect** the DApp will be reset, the connection will be disconnected on the user's mobile wallet, and the **Connect Wallet** button will be displayed again.

### Disconnect from MetaMask Mobile {: #disconnect-from-metamask-mobile }

As previously mentioned, a user can also disconnect and end the session from within their mobile wallet. If this happens, WalletConnect emits a `disconnect` event that the DApp will need to listen for. Upon receiving the `disconnect` event, the state will need to be reset back to the initial state. In this scenario, there is no reason to use `killSession` to end the session on the mobile wallet as the user has already ended the session on their mobile wallet.

Similar to the `connect` event, you will want to use the `useEffect` function to listen for the `disconnect` event. Then in the callback, you can add the `resetApp` function so that whenever a `disconnect` event is emitted, you reset the state of your DApp. 

```js
useEffect(() => {
    if (connector) {
        connector.on("connect", async (error, payload) => {
            if (error) {
                // Handle errors as you see fit
                console.error(error)
            }

            // Logic for handling the payload will eventually go here

            setFetching(false);
        })
        connector.on("disconnect", async (error) => {
            if (error) {
                // Handle errors as you see fit
                console.error(error)
            }
            resetApp();
        })
    }
}, [connector])
```

Altogether, your `App.js` file should now resemble the following:

```js
import { useState, useEffect } from "react";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

function App() {
    const [connector, setConnector] = useState(null);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        if (connector) {
            connector.on("connect", async (error, payload) => {
                if (error) {
                    // Handle errors as you see fit
                    console.error(error)
                }

                // Logic for handling the payload will eventually go here
                
                setFetching(false);
            })
            connector.on("disconnect", async (error) => {
                if (error) {
                    // Handle errors as you see fit
                    console.error(error)
                }
                resetApp();
            })
        }
    }, [connector])

    const connect = async () => { 
        setFetching(true);

        const connector = new WalletConnect({ bridge: "https://bridge.walletconnect.org", qrcodeModal: QRCodeModal });

        setConnector(connector);

        if (!connector.connected) {
            await connector.createSession();
        }
    };

    const resetApp = () => {
      setConnector(null);
      setFetching(false);
    }

    const killSession = () => {
      // Make sure the connector exists before trying to kill the session
      if (connector) {
        connector.killSession();
      }
      resetApp();
    }

    return (
      <>
          {connector && !fetching ? 
              <button onClick={killSession}>Disconnect</button>
              :
              <button onClick={connect}>Connect Wallet</button>
          }
      </>
    )
}

export default App;
```

Now that you have the logic in place for connecting and disconnecting your DApp and the user's mobile wallet, you can move on to checking the network to make sure it's supported and if so, display network and account details.

## Create List of Supported Networks {: #create-list-of-supported-networks }

When interacting with MetaMask directly, you can typically prompt the user to add a network and switch to it. However, with WalletConnect the user will need to already be connected to the correct network on MetaMask mobile. Therefore, you have to check the user is connected to the correct network, in this case Moonbase Alpha. If they are connected to Moonbase Alpha already you can display network and account details. On the other hand, if they aren't connected to Moonbase Alpha, you will need to prompt them to switch networks.

In the `src` directory, you can create a new directory and name it `helpers`, and within that directory you can create a file called `networks.js`. In `networks.js` you can include a list of supported networks and their associated network details. At a bare minimum, you will need the following data, but can expand on it if you find that you need additional networks or network details:

```js
export const SUPPORTED_NETWORKS = [
  {
    name: "Moonbase Alpha",
    chain_id: 1287,
    rpc_url: "https://rpc.api.moonbase.moonbeam.network",
    native_currency: {
      symbol: "DEV",
      decimals: "18",
    },
  },
  // You can add more networks here such as Moonbeam and Moonriver
]
```

Now that you have a list of supported networks, you can import that list into your `App.js` file to be referenced in the next section.

```js
import { SUPPORTED_NETWORKS } from "./helpers/networks";
```

## Check Network Support & Display Results {: #check-network-support-display-result }

Once a user connects to your DApp, the first thing you will want to do is check if the network they are on is supported and if not display a message that requests them to switch the network. You can create a function called `onConnect` and this function can be called from the callback function of the `connect` event.

The `onConnect` function will be used to save the connected account to state and filter through the list of supported networks and, if supported, save the network details to state. Before you get started creating the `onConnect` function, you will need the following state variables and hooks:

```js
const [chainId, setChainId] = useState(null);
const [supported, setSupported] = useState(false);
const [account, setAccount] = useState(null);
const [network, setNetwork] = useState(null);
const [symbol, setSymbol] = useState(null);
```

Make sure that you add all of these state hooks in the `resetApp` function, and use them to reset the variables to their initial state.

You will need to pass a couple of variables from the `connect` event payload, including the chain ID and the connected account, to the `onConnect` function.

```js
connector.on("connect", async (error, payload) => {
    if (error) {
        // Handle errors as you see fit
        console.error(error)
    }

    const { chainId, accounts } = payload.params[0];
    await onConnect(chainId, accounts[0]);
                
    setFetching(false);
})
```

Next, you can create the `onConnect` function and add it to the `useEffect` hook. In the function, you will:

1. Save the connected account to state
2. Filter through the list of supported networks using the connected chain ID and if it exists return the network details for the given chain ID
3. If the chain ID doesn't exist, you can use the `setSupported` hook to set it to `false`
4. If the chain ID exists, you can then update the `supported`, `network`, `symbol`, and `chainId` state variables using the network details


```js
const onConnect = async (chainId, address) => {
    // 1. Save account to state
    setAccount(address);

    // 2. Get Chain Data
    const chainData = SUPPORTED_NETWORKS.filter((network) => network.chain_id === chainId)[0];    

    if (!chainData){
        // 3. If not supported, set state as needed
        setSupported(false)
    } else {
        // 4. If supported, set state as needed
        setSupported(true)
        setNetwork(chainData.name)
        setSymbol(chainData.native_currency.symbol)
        setChainId(chainId);

        // Eventually you will add logic here to get the account balance
    }
};
```

In order for the page to update accordingly, you will need to add the `chainId` and `account` variables to the `useEffect` dependency array.

```js
useEffect(() => {
    ...
}, [connector, chainId, account])
```

Finally, depending on whether the network is supported or not, you can display either the network details or a message to users requesting that they switch networks. For simplicity, you can do this by using conditional rendering and checking the `supported` state variable.

```html
return (
    <>
        {connector && !fetching ? 
            <>
                <div>
                    <strong>Connected Account: </strong>
                    { account }
                </div>
                { supported ? 
                    <>
                        <div>
                            <strong>Network: </strong>
                            { network }
                        </div>
                        <div>
                            <strong>Chain ID: </strong>
                            { chainId }
                        </div>
                    </>
                    :
                    <strong>Network not supported. Please disconnect, switch networks, and connect again.</strong>
                }
                <button onClick={killSession}>Disconnect</button>
            </>
            :
            <button onClick={connect}>Connect Wallet</button>
        }
    </>
)
```

You can adapt the above code snippet as needed to provide better error handling.

## Use Ethers to Fetch Account Balance {: #use-ethers-to-fetch-account-balances }

Depending on your needs, you might want to show the connected account's balance for the connected network. To do so, you can import [Ethers](https://docs.ethers.io/){target=blank}.

```js
import { ethers } from "ethers"
```

Next you will need to add another state variable for `balance`.

```js
const [balance, setBalance] = useState(null);
```

Make sure that you add this state hook in the `resetApp` function, and use it to reset the balance variable to its initial state.

For simplicity, you can add the logic for fetching the account balance and saving it to state directly in the `onConnect` function. You will need to:

1. Create an Ethers provider by passing in the network's RPC url, chain ID, and name
2. Use the provider to call `getBalance`, which will return the balance as a `BigNumber`
3. Convert the `BigNumber` representation of the balance to a string representation of the balance in Ether
4. Use the `setBalance` state hook to save the balance to state

```js
const onConnect = async (chainId, address) => {
    setAccount(address);

    const chainData = SUPPORTED_NETWORKS.filter((network) => network.chain_id === chainId)[0];    

    if (!chainData){
        setSupported(false)
    } else {
        setSupported(true)
        setNetwork(chainData.name)
        setSymbol(chainData.native_currency.symbol)
        setChainId(chainId);

        // 1. Create an Ethers provider
        const provider = new ethers.providers.StaticJsonRpcProvider(chainData.rpc_url, {
          chainId,
          name: chainData.name
        });

        // 2. Get the account balance
        const balance = await provider.getBalance(address);
        // 3. Format the balance
        const formattedBalance = ethers.utils.formatEther(balance);
        // 4. Save the balance to state
        setBalance(formattedBalance)
    }
};
```

You will need to add the `balance` state variable to the `useEffect` dependency array alongside the `connector`, `chainId`, and `account` variables.

Finally, you can display the account balance when the user is connected.

```html
return (
    <>
        {connector && !fetching ? 
            <>
                <div>
                    <strong>Connected Account: </strong>
                    { account }
                </div>
                { supported ?
                    <> 
                        <div>
                            <strong>Network: </strong>
                            { network }
                        </div>
                        <div>
                            <strong>Chain ID: </strong>
                            { chainId }
                        </div>
                        <div>
                            <strong>Balance: </strong>
                            { balance } { symbol }
                        </div>
                    </>
                    :
                    <strong>Network not supported. Please disconnect, switch networks, and connect again.</strong>
                }
                <button onClick={killSession}>Disconnect</button>
            </>
            :
            <button onClick={connect}>Connect Wallet</button>
        }
    </>
)
```

This example can be adapted to retrieve other data from Ethers as needed.

## Send a Transaction {: #send-a-transaction }

To truly take advantage of the value that WalletConnect provides, you can send a transaction which will be initiated from within your DApp and then confirmed and signed from MetaMask mobile.

To get started, you can create a function called `sendTransaction` which will use the WalletConnect `connector` to send a transaction. For example purposes, you can send 2 DEV tokens on Moonbase Alpha to your own account.

```js
  const sendTransaction = async () => {
    try {
      await connector.sendTransaction({ from: account, to: account, value: "0x1BC16D674EC80000" })
    } catch (e) {
      // Handle the error as you see fit
      console.error(e)
    }
  }
```

To initiate the transaction from the DApp, you will need to create a button, that `onClick` calls the `sendTransaction` function.

```html
return (
    <>
        {connector && !fetching ? 
            <>
                <div>
                    <strong>Connected Account: </strong>
                    { account }
                </div>
                { supported ? 
                    <>
                        <div>
                            <strong>Network: </strong>
                            { network }
                        </div>
                        <div>
                            <strong>Chain ID: </strong>
                            { chainId }
                        </div>
                        <div>
                            <strong>Balance: </strong>
                            { balance }
                        </div>
                        <button onClick={sendTransaction}>Send Transaction</button>
                    </>
                    :
                    <strong>Network not supported. Please disconnect, switch networks, and connect again.</strong>
                }
                <button onClick={killSession}>Disconnect</button>
            </>
            :
            <button onClick={connect}>Connect Wallet</button>
        }
    </>
)
```

When you click on **Send Transaction**, a pop-up will appear in MetaMask mobile with the transaction details. To sign and send the transaction, you can click on **Confirm**. If successful you should see a notification in the MetaMask mobile app. You can also confirm by searching for your account in a block explorer such as [Moonscan](https://moonbase.moonscan.io/){target=blank}.

## Final Code {: #final-code }

Now that you have completed the guide, your `App.js` file should resemble the following:

```js
function App() {
    const [connector, setConnector] = useState(null);
    const [fetching, setFetching] = useState(false);
    const [chainId, setChainId] = useState(null);
    const [supported, setSupported] = useState(false);
    const [account, setAccount] = useState(null);
    const [network, setNetwork] = useState(null);
    const [symbol, setSymbol] = useState(null);
    const [balance, setBalance] = useState(null);

    useEffect(() => {
      const onConnect = async (chainId, address) => {
        setAccount(address);
    
        const chainData = SUPPORTED_NETWORKS.filter((network) => network.chain_id === chainId)[0];    
    
        if (!chainData){
            setSupported(false)
        } else {
            setSupported(true)
            setNetwork(chainData.name)
            setSymbol(chainData.native_currency.symbol)
            setChainId(chainId);
    
            const provider = new ethers.providers.StaticJsonRpcProvider(chainData.rpc_url, {
              chainId,
              name: chainData.name
            });

            const balance = await provider.getBalance(address);
            const formattedBalance = ethers.utils.formatEther(balance);
            setBalance(formattedBalance)
        }
      };

      if (connector) {
          connector.on("connect", async (error, payload) => {
              if (error) {
                  // Handle errors as you see fit
                  console.error(error)
              }
              
              const { chainId, accounts } = payload.params[0];
              await onConnect(chainId, accounts[0]);
                        
              setFetching(false);
          })
          connector.on("disconnect", async (error) => {
              if (error) {
                  // Handle errors as you see fit
                  console.error(error)
              }
              resetApp();
          })
      }
    }, [connector, chainId, account, balance])

    const connect = async () => { 
        setFetching(true);

        const connector = new WalletConnect({ bridge: "https://bridge.walletconnect.org", qrcodeModal: QRCodeModal });
        setConnector(connector);

        if (!connector.connected) {
          await connector.createSession();
        }
    };

    const resetApp = () => {
      setConnector(null);
      setFetching(false);
    }

    const killSession = () => {
      // Make sure the connector exists before trying to kill the session
      if (connector) {
        connector.killSession();
      }
      resetApp();
    }

    const sendTransaction = async () => {
      try {
        await connector.sendTransaction({ from: account, to: account, value: "0x1BC16D674EC80000" })
      } catch (e) {
        // Handle the error as you see fit
        console.error(e)
      }
    }

    console.log(connector, fetching)

    return (
      <>
          {connector && !fetching ? 
              <>
                  <div>
                      <strong>Connected Account: </strong>
                      { account }
                  </div>
                  { supported ?
                      <> 
                          <div>
                              <strong>Network: </strong>
                              { network }
                          </div>
                          <div>
                              <strong>Chain ID: </strong>
                              { chainId }
                          </div>
                          <div>
                              <strong>Balance: </strong>
                              { balance } { symbol }
                          </div>
                          <button onClick={sendTransaction}>Send Transaction</button>
                      </>
                      :
                      <strong>Network not supported. Please disconnect, switch networks, and connect again.</strong>
                  }
                  <button onClick={killSession}>Disconnect</button>
              </>
              :
              <button onClick={connect}>Connect Wallet</button>
          }
      </>
  )
}

export default App;
```

## Additional Considerations {: #additional-considerations }

This guide covers the basics for setting up a WalletConnect connection, but there are many ways in which you can improve the experience for your users or yourself as you develop the integration. You might want to consider adding in support for the following items:

- Adding a loader for when your transaction is waiting to be confirmed or a message that informs your users to check their mobile wallet and confirm the transaction from there
- Adding notifications on your DApp for the status of sent transactions
- Adding appropriate error handling
- Adding in logic to automatically update your users balances
- Adding in logic to handle page refreshes

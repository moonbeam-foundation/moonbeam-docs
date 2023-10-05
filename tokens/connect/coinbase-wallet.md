---
title: Connect Coinbase Wallet Mobile App to Moonbeam
description: This guide walks you through how to configure the Coinbase Wallet extension and mobile app for Moonbeam and how to create a wallet and send funds on Moonbeam. 
---

# Interacting with Moonbeam Using the Coinbase Wallet Mobile App  

## Introduction {: #introduction } 

[Coinbase Wallet](https://wallet.coinbase.com/?_branch_match_id=977295450874474909&_branch_referrer=H4sIAAAAAAAAA8soKSkottLXT8%2FXS07SLddLzs%2FVD8%2FJynFKSy02zE4CAFZ0JzQfAAAA){target=_blank} is a self-custody (non-custodial) wallet like [MetaMask](/tokens/connect/metamask/){target=_blank} available as a mobile application for iOS and Android. There is also a browser extension version of Coinbase Wallet, but the extension does not support the addition of custom networks and is thus incompatible with Moonbeam at this time. Coinbase Wallet is an entirely different product from Coinbase Exchange, a custodial platform for buying and selling cryptocurrency. You can interact with Moonbeam, Moonriver, and the Moonbase Alpha testnet in Coinbase Wallet after adding them as custom networks.
    
In this guide, you'll go through the process of setting up the Coinbase Wallet mobile application and configuring it for the Moonbeam Network. 

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## Install the Coinbase Wallet App {: #install-the-coinbase-wallet-app } 

You can [download the Coinbase Wallet app](https://wallet.coinbase.com/?_branch_match_id=977295450874474909&_branch_referrer=H4sIAAAAAAAAA8soKSkottLXT8%2FXS07SLddLzs%2FVD8%2FJynFKSy02zE4CAFZ0JzQfAAAA){target=_blank} from the iOS App Store or the Google Play Store.

## Create a Wallet {: #create-a-wallet } 

 After installing and opening the app, you'll be greeted with an option to create a new wallet or import an existing wallet. For this exercise, set up a new wallet. First, you'll be prompted to review legal terms of use. Then, you'll be asked to create a unique username. Choose **private** if you'd like your username to remain hidden from other wallet users. Next, you'll be presented with your wallet's secret recovery phrase. Your secret recovery phrase grants direct access to your funds, so make sure to store it in a secure place and never share this with anyone. 

![Coinbase Wallet Image 1](/images/tokens/connect/coinbase-wallet/coinbase-wallet-1.png)

Next, you'll be prompted to create a passcode or you can use your phone's built-in authentication method such as Face ID. The next screen will remind you of the importance of backing up your secret recovery phrase. On iOS, you have the option of making an encrypted backup of the seed phrase to iCloud, or you can save the phrase manually. On the following screen you'll be asked to confirm your secret recovery phrase. As a reminder, your secret recovery phrase grants full and unlimited access to your funds. You should never share this with anyone. 

![Coinbase Wallet Image 2](/images/tokens/connect/coinbase-wallet/coinbase-wallet-2.png)

Congratulations! You've completed the setup steps and your wallet is now fully initialized. In the next step, you'll see how you can connect Coinbase Wallet to the Moonbeam network. 

## Connect Coinbase Wallet to Moonbeam {: #connect-coinbase-wallet-extension-to-moonbeam } 

Although Coinbase Wallet has a built-in browser, it doesn't currently support automatically adding custom networks, so you'll have to add the network details manually. To do so, perform the following steps:

 1. Navigate to the Settings tab via the button on the bottom toolbar
 2. Tap on **Default Network**
 3. Tap on the **+** icon in the upper right corner
 4. Here, you can fill in the network details for Moonbeam, Moonriver, or the Moonbase Alpha TestNet. Press **Save** once finished 
 5. After returning to the Default Network Page, you can switch your default network to Moonbeam or Moonriver

![Coinbase Wallet Image 3](/images/tokens/connect/coinbase-wallet/coinbase-wallet-3.png)

You can find all of the relevant parameters for each network below:

=== "Moonbeam"
    |         Variable          |                                      Value                                       |
    |:-------------------------:|:--------------------------------------------------------------------------------:|
    |       Network Name        |                                    `Moonbeam`                                    |
    |          RPC URL          |                       `{{ networks.moonbeam.public_rpc_url }}`                       |
    |          ChainID          | `{{ networks.moonbeam.chain_id }}` (hex: `{{ networks.moonbeam.hex_chain_id }}`) |
    |     Symbol (Optional)     |                                      `GLMR`                                      |
    | Block Explorer (Optional) |                     `{{ networks.moonbeam.block_explorer }}`                     |

=== "Moonriver"
    |         Variable          |                                       Value                                        |
    |:-------------------------:|:----------------------------------------------------------------------------------:|
    |       Network Name        |                                    `Moonriver`                                     |
    |          RPC URL          |                       `{{ networks.moonriver.public_rpc_url }}`                        |
    |          ChainID          | `{{ networks.moonriver.chain_id }}` (hex: `{{ networks.moonriver.hex_chain_id }}`) |
    |     Symbol (Optional)     |                                       `MOVR`                                       |
    | Block Explorer (Optional) |                     `{{ networks.moonriver.block_explorer }}`                      |

=== "Moonbase Alpha"
    |         Variable          |                                      Value                                       |
    |:-------------------------:|:--------------------------------------------------------------------------------:|
    |       Network Name        |                                 `Moonbase Alpha`                                 |
    |          RPC URL          |                       `{{ networks.moonbase.rpc_url }}`                       |
    |          ChainID          | `{{ networks.moonbase.chain_id }}` (hex: `{{ networks.moonbase.hex_chain_id }}`) |
    |     Symbol (Optional)     |                                      `DEV`                                       |
    | Block Explorer (Optional) |                     `{{ networks.moonbase.block_explorer }}`                     |

## Receiving Funds {: #receiving-funds } 

Since you created a new wallet in this demo, the app displays an empty home screen with a **No coins found** message. You can change this by sending some GLMR to this account. To send funds to your Coinbase Wallet app, take the following steps:

 1. From the wallet tab (or homescreen) of the app, tap **Receive**
 2. Search for "GLMR"
 3. Tap on **Moonbeam** 
 4. On the next screen, you'll see a QR code of your address. Press **Share address** to send your address to another device

For demonstration purposes, 1 GLMR has been sent to this Coinbase Wallet account. In the next section, you'll learn how to send funds from the Coinbase Wallet app. 

![Receiving funds](/images/tokens/connect/coinbase-wallet/coinbase-wallet-4.png)

## Sending Funds {: #sending-funds } 

To send funds from your Coinbase Wallet, tap the desired asset from the wallet tab (or homescreen) of the app, then take the following steps:

 1. Tap **Send**
 2. On the next screen, enter the amount of the asset you'd like to send. Tap the asset name at the bottom if you need to select a different asset
 3. Tap **Next** 
 4. To view the gas fee for the transaction, tap **Details**. Moonbeam has no miners; this wording here is a default from proof-of-work networks
 5. Review the transaction details to ensure accuracy then press **Send**

![Send funds](/images/tokens/connect/coinbase-wallet/coinbase-wallet-5.png)

And that's it! You've successfully set up your Coinbase Wallet app, connected it to the Moonbeam network, and learned how to send and receive funds. 


## Limitations {: #limitations } 

 - At this time, Coinbase Wallet displays only outgoing transactions in your transaction history in the app. You can see your full transaction history, including incoming transactions, by looking up your address on a blockchain explorer such as [Moonscan](https://moonscan.io/){target=_blank}
 - Coinbase Wallet does not support the importing or exporting of private keys. If you need to import additional preexisting accounts to your wallet, you should use another wallet such as [MetaMask](/tokens/connect/metamask/){target=_blank} 
 - Remember that Coinbase Wallet and Coinbase Exchange are distinct products - holding a token in your Coinbase Wallet does not imply it is supported on Coinbase Exchange. If you send a token from your Coinbase Wallet to Coinbase Exchange that is not supported by the exchange, you will lose those funds forever.  

## Additional Resources {: #additional-resources } 

 - [Coinbase Wallet FAQ](https://wallet.coinbase.com/faq/){target=_blank}
 - [Coinbase Wallet Getting Started Guide](https://www.coinbase.com/wallet/getting-started-mobile){target=_blank}


--8<-- 'text/_disclaimers/third-party-content.md'
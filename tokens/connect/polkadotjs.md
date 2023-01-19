---
title: Create an Account on Polkadot.js Apps
description: Follow this quick tutorial to learn how to use Moonbeam’s Ethereum-standard H160 addresses and send transactions with Polkadot.js.
---

# Interacting with Moonbeam Using Polkadot.js Apps

![Intro diagram](/images/tokens/connect/polkadotjs/polkadotjs-banner.png)

## Introduction {: #introduction } 

With the [release of the v3 upgrade](https://www.purestake.com/news/moonbeam-network-upgrades-account-structure-to-match-ethereum/) for the Moonbase Alpha TestNet, we have made significant updates to the underlying account system on Moonbeam, replacing the default Substrate-style accounts and keys with Ethereum-style accounts and keys.

The Polkadot.js Apps interface was updated as well so that it natively supports H160 addresses and ECDSA keys. So, in this tutorial you can check out this new integration of Ethereum-based accounts on the Polkadot.js Apps site.

--8<-- 'text/disclaimers/third-party-content-intro.md'

## Connecting to Moonbase Alpha {: #connecting-to-moonbase-alpha } 

First, you need to connect it to the Moonbase Alpha TestNet by clicking the logo in the top left corner, then scroll down to the **Test Networks** section, select Moonbase Alpha, and scroll back to the top and click **Switch**. 

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-1.png)

After switching, the Polkadot.js site will not only connect to Moonbase Alpha, but also change its styling to make a perfect match.

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-2.png)

## Creating or Importing an H160 Account {: #creating-or-importing-an-h160-account } 

In this section, you'll learn how you can create a new account, or import an already existing MetaMask account to Polkadot.js Apps.

1. Navigate to the accounts section
2. Click on the **Add account** button

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-3.png)

This will open a wizard pop-up that will guide you through the process of adding an account to the Polkadot.js Apps interface.

1. Click on the drop-down menu 
2. Change the selection from **Mnemonic** to **Private Key**, this allows you to add an account through a private key

!!! note
    Currently, you can only create or import accounts in Polkadot.js via a private key. Doing so with the mnemonic will result in a different public address if you later try to import this account to an Ethereum wallet such as MetaMask. This is because Polkadot.js uses BIP39, whereas Ethereum uses BIP32 or BIP44.

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-4.png)

Next, if you want to create a new account make sure you store the private key displayed by the wizard. If you want to import an existing account, enter your private key that you can export from MetaMask.

!!! note
    Never reveal your private keys as they give direct access to your funds. The steps in this guide are for demonstration purposes only. 
    
Make sure to include the prefix in the private key, i.e., `0x`. If you entered the information correctly, the corresponding public address should appear in the upper left corner of the window, and then click **Next**.

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-5.png)

To finish the wizard, you can set an account name and password. After a confirmation message, you should see in the main **Accounts** tab the address with the corresponding balance: in this case, Bob's address. Moreover, you can overlay the MetaMask extension to see that both balances are the same.

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-6.png)

## Sending a Transaction Through Substrate's API {: #sending-a-transaction-through-substrates-api } 

Now, to demonstrate the potential of Moonbeam's [unified accounts](/learn/features/unified-accounts){target=_blank} scheme you can make a transfer through the Substrate API using Polkadot.js Apps. Remember that you are interacting with Substrate using an Ethereum-style H160 address. To do so, you can import another account.

Next, click on Bob's **send** button, which opens another wizard that guides you through the process of sending a transaction. 

1. Set the **send to address**
2. Enter the **amount** to send, which for this example is 1 DEV token
3. When ready, click on the **Make Transfer** button

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-7.png)

Then you'll be prompted to enter your password and sign and submit the transaction. Once the transaction is confirmed, you should see the balances updated for each account.

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-8.png)

And that is it! We are excited about being able to support H160 accounts in Polkadot.js Apps, as we believe this will greatly enhance the user experience in the Moonbeam Network and its Ethereum compatibility features.

--8<-- 'text/disclaimers/third-party-content.md'
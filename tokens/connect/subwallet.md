---
title: How to Connect SubWallet
description: This guide will walk you through how to connect SubWallet, a comprehensive non-custodial wallet solution for Ethereum ecosystems, to Moonbeam.
---

# Interacting with Moonbeam Using SubWallet


## Introduction {: #introduction }
## Đoạn intro này em chưa biết nên viết như nào cho hay nên em làm đoạn hướng dẫn connect trước ạ

SubWallet is the comprehensive non-custodial wallet solution for Polkadot, Substrate & Ethereum ecosystems, available on 

[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network%2Fpublic-ws#/accounts){target=_blank} supports H160 accounts injected into the browser via an extension like [Talisman](https://www.talisman.xyz/){target=_blank}. Note, Polkadot.js Apps is phasing out support for [accounts stored locally in the browser's cache](/tokens/connect/polkadotjs/). While you can continue to use any accounts that you've imported and stored in your browser locally via Polkadot.js Apps, you won't be able to add any new ones. This means that you'll need to use an extension like Talisman. Furthermore, injecting your account from an extension like Talisman is generally regarded to be safer than storing the account directly in the browser.

This guide will include all of the steps for setting up an account in Talisman and using it to interact with Moonbeam through Polkadot.js Apps.

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## Installing and creating a SubWallet account {: #install-and-create-subwallet-account }

### SubWallet Browser Extension { :subwallet-browser-extension }

Browser extension of the comprehensive non-custodial Polkadot, Subtrate & Ethereum wallet is available on Google Chrome, Brave, Firefox & MS Edge.

* Download the extension on [Chrome Web Store](https://chrome.google.com/webstore/detail/subwallet-polkadot-extens/onhogfjeacnfoofkfgppdlbmlmnplgbn){target=_blank}
* Download the extension on [Firefox Browser Add-ons](https://mzl.la/3AoAMmd){target=_blank}

Once you have installed the extension, you can either [create a new account](https://docs.subwallet.app/main/extension-user-guide/account-management/create-a-new-account){target=_blank} or [import an existing account](https://docs.subwallet.app/main/extension-user-guide/account-management/import-and-restore-an-account){target=_blank} to SubWallet, create a master password and save your seed phrase/recovery phrase somewhere secure if you are creating a new account.

![Create a new wallet or import an existing one into SubWallet.](/images/tokens/connect/subwallet/subwallet-1.png)

#### Connect to Moonbeam { :#connect-to-moonbeam-extension }

After creating or importing an account to SubWallet, you will be directed to the home screen. Here, you can connect your EVM account to Moonbeam, Moonriver and Moonbase Alpha:
1. Choose the **Customize your asset display** next to the search icon.
2. Search for **Moonbeam**, **Moonriver** and **Moonbase Alpha**
3. **Toggle** to connect to each network.

![Connecting your account to Moonbeam.](/images/tokens/connect/subwallet/subwallet-2.png)

!!! Note Substrate Account
    If you are using your Substrate account, you will also need to enable the token on the chain that you would like to view:

    ![Substrate Account.](/images/tokens/connect/subwallet/subwallet-3.png)

#### Receiving tokens { :receive-tokens-extension }

To receive tokens on Moonbeam using your SubWallet account, you will need to retrieve your address on Moonbeam:

1. On the home screen, choose the **Get address** icon.
2. Search for the token that you would like to receive and click on **Copy address**.

Alternatively, you can get your address as a QR code:

1. Click on the **QR code icon** next to the **Copy address** icon.
2. **Copy the QR code** and give it to the sender.

!!! Note Receiving tokens on another chain
    For Substrate accounts, if you want to receive cross-chain tokens e.g GLMR on Acala, you should pay attention to the small network icon under the token icon:

    ![Receiving cross-chain tokens](/images/tokens/connect/subwallet/subwallet-11.png)

#### Transfering tokens { :transfer-token-extension }

To transfer tokens on Moonbeam using your SubWallet account, follow these steps:

1. On the home screen, choose ***Send tokens***.
2. **Choose the token** that you would like to send *(a)*.
3. **Enter the address** of the account that you would like to send tokens to. You can also use the **address book** *(b)* for quick access to saved accounts or **scan the QR code** *(c)* of the recipient.

![Transferring tokens on Moonbeam.](/images/tokens/connect/subwallet/subwallet-4.png)


### SubWallet Mobile App { :subwallet-mobile-app }

The SubWallet Mobile App is available on both [Apple Store](https://apps.apple.com/us/app/subwallet-polkadot-wallet/id1633050285){target=_blank} and [Google Play Store](https://play.google.com/store/apps/details?id=app.subwallet.mobile){target=_blank}.

Once the app is installed on your device, you can [create a new account](https://docs.subwallet.app/main/extension-user-guide/account-management/create-a-new-account){target=_blank} or [import an existing account](https://docs.subwallet.app/main/extension-user-guide/account-management/import-and-restore-an-account){target=_blank} similarly to the browser extension.

![Create new or import account to SubWallet Mobile.](/images/tokens/connect/subwallet/subwallet-6.png)

#### Connect to Moonbeam { :connect-to-moonbeam-mobile }

![Connecting your account to Moonbeam.](/images/tokens/connect/subwallet/subwallet-7.png)

To connect your SubWallet account to Moonbeam on mobile, take the following steps:

1. On the home screen, choose the menu ![Menu](/images/tokens/connect/subwallet/subwallet-9.png).
2. Choose **Manage networks** on the menu
3. Search for **Moonbeam, Moonriver and Moonbase Alpha**.
4. **Toggle** to connect the networks. 

!!! Note Substrate Account
    If you are using your Substrate account, you will also need to enable the token on the chain that you would like to view:

    ![Connecting your account to Moonbeam.](/images/tokens/connect/subwallet/subwallet-10.png)

#### Transfer tokens { :transfer-tokens-mobile }

To transfer tokens on Moonbeam using your SubWallet account, follow these steps:

1. On the home screen, choose ***Send tokens***.
2. **Choose the token** that you would like to send *(a)*.
3. **Enter the address** of the account that you would like to send tokens to. You can also use the **address book** *(b)* for quick access to saved accounts or **scan the QR code** *(c)* of the recipient.

![Transferring tokens on Moonbeam.](/images/tokens/connect/subwallet/subwallet-8.png)
--8<-- 'text/_disclaimers/third-party-content.md'

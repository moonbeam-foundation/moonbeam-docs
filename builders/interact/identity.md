---
title: Managing an Identity
description: Learn how to create and clear an identity, including personal information such as your name and social handles, on Moonbeam-based networks.
---

# Managing your Account Identity

![Managing your Account Identity](/images/builders/interact/identity/identity-banner.png)

## Introduction {: #introduction } 

The [Substrate](/learn/platform/technology/#substrate-framework) Identity pallet is an out-of-the-box solution for adding personal information to your on-chain account. Personal information can include default fields such as your legal name, display name, website, Twitter handle, Riot (now known as Element) name. You can also take advantage of custom fields to include any other relevant information. 

This guide will show you how to set an identity, and then clear it, on the Moonbase Alpha TestNet. This guide can also be adapted to be used on Moonriver.

## Checking Prerequisites { : #checking-prerequisites }

You'll need to connect to the [Moonbase Alpha TestNet](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network){target=_blank} on the Polkadot.js Apps explorer. You can also follow along and adapt the instructions for [Moonriver](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.moonriver.moonbeam.network){target=_blank}.

You will also need to create or import an account into Polkadot.js Apps. If you haven't already created or imported an account, please follow our guide on [Creating or Importing an H160 Account](/tokens/connect/polkadotjs/#creating-or-importing-an-h160-account). Make sure you fund your account with DEV tokens if you’re on Moonbase Alpha, or MOVR if you’re on Moonriver. For more information on the DEV token faucet, check out the [Get Tokens](/builders/get-started/moonbase/#get-tokens) section of the Moonbase Alpha documentation.

## General Definitions

To store your information on-chain, you must bond some funds, which eventually will be returned once the identity has been cleared. There are two categories of fields: default and custom. If custom fields are used, you will be required to submit an additional deposit for each field. 

- **Default fields include** - your legal name, display name, website, Twitter handle, Riot (now known as Element) name
 
- **Custom fields include** - any other relevant information. For example, you could include your Discord handle

=== "Moonriver"
    |       Variable        |                               Definition                                |                      Value                       |
    |:---------------------:|:-----------------------------------------------------------------------:|:------------------------------------------------:|
    |     Basic Deposit     |           The amount held on deposit for setting an identity            | {{ networks.moonriver.identity.basic_dep }} MOVR |
    |     Field Deposit     | The amount held on deposit per additional field for setting an identity | {{ networks.moonriver.identity.field_dep }} MOVR |
    | Max Additional Fields |     Maximum number of additional fields that may be stored in an ID     |   {{ networks.moonriver.identity.max_fields }}   |

=== "Moonbase Alpha"
    |       Variable        |                               Definition                                |                     Value                      |
    |:---------------------:|:-----------------------------------------------------------------------:|:----------------------------------------------:|
    |     Basic Deposit     |           The amount held on deposit for setting an identity            | {{ networks.moonbase.identity.basic_dep }} DEV |
    |     Field Deposit     | The amount held on deposit per additional field for setting an identity | {{ networks.moonbase.identity.field_dep }} DEV |
    | Max Additional Fields |     Maximum number of additional fields that may be stored in an ID     |  {{ networks.moonbase.identity.max_fields }}   |

## Getting Started

There are a couple different ways to set and clear an identity using the Polkadot.js Apps, depending on the information to be included. If you intend to register your identity using only the default fields, you can follow the instructions for [Managing an Identity via the Accounts UI](#managing-an-identity-via-accounts).

If you are looking for a more customizable experience and want to add custom fields beyond the default fields, you can follow the instructions for [Managing an Identity via the Extrinsics UI](#managing-an-identity-via-extrinsics).

## Managing an Identity via Accounts

### Set an Identity

To get started with setting an identity using the Accounts UI, head to the [Accounts tab](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/accounts){target=_blank} on the Polkadot.js Apps explorer.

You should already have an account connected, so you can go ahead and click on your account name to verify and take note of your balances. After you send the transaction to set an identity, the deposit(s) you submitted will be moved from your transferable balance to your reserved balance. 

![Starting account balances](/images/builders/interact/identity/identity-1.png)

To set your identity, you'll need to:

1. Click on the 3 vertical dots next to the account you would like to set an identity for
2. A menu will pop up. Click **Set on-chain identity**

![Set on-chain identity](/images/builders/interact/identity/identity-2.png)

Next, the menu to register and set your identity will pop-up and you can start filling in your information. You are not required to enter information for every single field, you can choose to fill in just one field or all of them, it's up to you. For this example:

1. Set your display name
2. Click on the **include field** toggle for email and then enter in your email
3. Click on the **include field** toggle for Twitter and then enter in your Twitter handle
4. After you're done filling in your information and the deposit amount looks alright to you, click **Set Identity**

![Set your identity](/images/builders/interact/identity/identity-3.png)

You will then be prompted to sign the transaction. If everything looks good, you can enter your password and click Sign and Submit to sign and send the transaction.

![Authorize transaction](/images/builders/interact/identity/identity-4.png)

You should see status notifications pop-up in the top right hand corner. Once the transaction has been confirmed, you can click on your account name again and the panel will slide out on the right side of the page. Your balances will have changed, and you’ll also see your new identity information.

![Updated account balances](/images/builders/interact/identity/identity-5.png)

If the identity information matches what you entered, you’ve successfully set an identity! 

Once you clear your identity, the deposit in your reserved balance will get transferred back to your transferable balance. If you need to make changes to your identity, you can go through the process of setting your identity again. Please note that you will need to ensure all fields are re-entered, even if only one field needs to be changed, or they will be overwritten. You will not need to pay another deposit, unless custom fields are used, but you will need to pay gas fees.

### Clear an Identity

To clear your identity from the [Accounts tab](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/accounts){target=_blank} of the Polkadot.js Apps UI, you'll need to:

1. Click on the 3 vertical dots next to the account you would like to add identity information for
2. A menu will pop up. Click **Set on-chain identity**

![Set on-chain identity](/images/builders/interact/identity/identity-6.png)

The identity menu will pop-up with your information already filled out. You'll need to click **Clear Identity**.

![Clear identity](/images/builders/interact/identity/identity-7.png)

You will then be prompted to sign the transaction. If everything looks good, you can enter your password and click Sign and Submit to sign and send the transaction.

![Authorize transaction](/images/builders/interact/identity/identity-8.png)

You should see status notifications pop-up in the top right hand corner. Once the transaction has been confirmed, you can click on your account name again and the panel will slide out on the right side of the page. You can see your reserved balance was transferred back to your transferable balance, and your identity information has been removed.

![Updated account balances](/images/builders/interact/identity/identity-9.png)

That’s it! You’ve successfully cleared your identity. If you want to add a new identity, you can do so at any time. 

## Managing an Identity via Extrinsics

### Set an Identity

To register an identity using the extrinsics UI, navigate to the [Extrinsics page](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/extrinsics){target=_blank} on Polkadot.js Apps. Then, you'll need to:

1. Select your account
2. Select identity from the **submit the following extrinsic** dropdown
3. Then select the **setIdentity(info)** function
4. Start filling in your identity information
    1. Select the format of the data. For this example, you can use **Raw** data but you also have the option of entering your data in BlackTwo256, Sha256, Keccak256, and ShaThree256 hashed format
    2. Enter the data in that format

![Set your identity using the Extrincs UI](/images/builders/interact/identity/identity-10.png)

Optionally, if you would like to enter custom fields, you can do so by:

1. Scrolling to the top and clicking on **Add item** 
2. Two fields will appear: the first for the field name and the second for the value. Fill in the field name
    1. Select the format of the data for the field name. Again, you can use **Raw** data
    2. Enter the field name in the selected format
3. Fill in the value
    1. Select the format of the data for the value. Again, you can use **Raw** data
    2. Enter the value in the selected format

![Add custom fields](/images/builders/interact/identity/identity-11.png)

Finally, once all of your identity information has been added, you can scroll to the bottom of the page and click **Submit Transaction**.

![Submit identity information](/images/builders/interact/identity/identity-12.png)

You will then be prompted to sign the transaction. Remember, there is an additional deposit required for each additional custom field. If everything looks good, you can enter your password and click **Sign and Submit** to sign and send the transaction.

![Authorize transaction](/images/builders/interact/identity/identity-13.png)

You should see status notifications pop-up in the top right hand corner confirming the transaction. If successful, you’ve set an identity! Congratulations! To make sure everything went through and your identity information looks good, next you can confirm your identity.

### Confirm an Identity

To verify the addition of your identity information, you can click on the **Developer** tab and then navigate to [Chain state](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/chainstate){target=_blank}.

![Navigate to Chain State](/images/builders/interact/identity/identity-14.png)

On the **Chain State** UI, make sure **Storage** is selected. Then you can start to request your identity information:

1. Set **selected state query** to **identity**
2. Select the **identityOf(AccountId)** function
3. Select your account
4. Click the **+** button to get your identity information

![Request identity information](/images/builders/interact/identity/identity-15.png)

You can see now that you’ve successfully set an identity! Once you clear your identity, the deposit in your reserved balance will get transferred back to your transferable balance. If you need to make changes to your identity, you can go through the process of setting your identity again. Please note that you will need to ensure all fields are re-entered, even if only one field needs to be changed, or they will be overwritten. You will not need to pay another deposit, unless custom fields are used, but you will need to pay gas fees.

### Clear an Identity

To clear your identity from the [Extrinsics tab](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/extrinsics){target=_blank} of the Polkadot.js Apps UI, you'll need to:

1. Select your account from the **using the selected account** dropdown
2. Select identity from the **submit the following extrinsic** dropdown
3. Then select the **clearIdentity()** function
4. Click **Submit Transaction**

![Clear an identity using the Extrinsics UI](/images/builders/interact/identity/identity-16.png)

You will then be prompted to sign the transaction. If everything looks good, you can enter your password and click **Sign and Submit** to sign and send the transaction.

![Authorize transaction](/images/builders/interact/identity/identity-17.png)

You should see status notifications pop-up in the top right hand corner confirming the transaction. 

To verify the removal of your identity information, you can follow the steps in the [Confirm an Identity](#confirm-an-identity) section again. Instead of seeing your identity information, this time you'll get a response of **none**. Meaning, you no longer have any identity information associated with your account. If you check your balances, you should see that the initial deposit for setting your identity has been returned to your transferable balance. That’s it! Your identity has been cleared. 



---
title: Moonbase Alpha
description: The Moonbeam TestNet, named Moonbase Alpha, is the easiest way to get started with a Polkadot environment. Follow this tutorial to connect to the TestNet.
---

# Connect to Moonbase Alpha

## Introduction {: #introduction } 

Moonbase Alpha has two endpoints available for users to connect to: one for HTTPS and one for WSS.

--8<-- 'text/testnet/connect.md'

## Get Tokens {: #get-tokens } 

To start building on Moonbase Alpha, you can get DEV tokens from our [faucet](/builders/get-started/moonbase/#get-tokens/).

### Discord - Mission Control {: #discord-mission-control } 

To request tokens automatically, we've created a Discord bot (named Mission Control :sunglasses:) that will automatically send a maximum of 5 DEV tokens every 24 hours (per Discord user) when you enter your address. You can check it out on our [Discord channel](https://discord.gg/PfpUATX).
 
Under the category "Miscellaneous," you will find our AlphaNet bot channel. 

![Discord1](/images/testnet/testnet-discord1.png)

To check your balance, enter the following message, replacing `<enter-address-here->` with your H160 address:

```
!balance <enter-address-here->
```

To get DEV tokens, enter the following message, replacing `<enter-address-here->` with your H160 address:
 
```
!faucet send <enter-address-here->
```

Mission Control will send you 5 DEV tokens and display your current account balance. Remember that Mission Control is limited to dispense once every 24 hours per Discord user.

![Discord2](/images/testnet/testnet-discord2.png)

### Manual Procedure {: #manual-procedure } 

For token requests of more than the limited account allowed by our Discord bot, contact a moderator directly via our [Discord channel](https://discord.gg/PfpUATX). We are happy to provide the tokens needed to test your applications.

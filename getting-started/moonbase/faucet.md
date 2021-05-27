---
title: Faucet
description: Learn how to use the automated faucet bot on Discord to get test tokens for the Moonbeam TestNet, nicknamed Moonbase Alpha.
---

# Moonbase Alpha Faucet

## Introduction

Tokens on Moonbase Alpha, named DEV, will be issued on demand. Currently, there are two ways to get access to this token: through a Discord bot or manually.

## Discord - Mission Control

To request tokens automatically, we've created a Discord bot (named Mission Control :sunglasses:) that will automatically send a maximum of 10 DEV tokens every 24 hours (per Discord user) when you enter your address. You can check it out on our [Discord channel](https://discord.gg/PfpUATX).
 
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

Mission Control will send you 10 DEV tokens and display your current account balance. Remember that Mission Control is limited to dispense once every 24 hours per Discord user.

![Discord2](/images/testnet/testnet-discord2.png)

## Manual Procedure

For token requests of more than the limited account allowed by our Discord bot, contact a moderator directly via our [Discord channel](https://discord.gg/PfpUATX). We are happy to provide the tokens needed to test your applications.

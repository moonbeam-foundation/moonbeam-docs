---
title: Unified Accounts
description:  Moonbeam replaced the default Substrate account system with native support for the Ethereum-based H160 accounts and ECDSA keys. Find out more information!
---

# Unified Accounts

## Introduction {: #introduction }

As Moonbeam is designed to be an Ethereum-compatible parachain on Polkadot, the underlying account system replaces the default Substrate-style accounts and keys with Ethereum-style accounts and keys. As a result, you can interact with your Moonbeam account using [MetaMask](/tokens/connect/metamask/){target=\_blank} and Ethereum tools you may already be familiar with, such as [Remix](/builders/ethereum/dev-env/remix/){target=\_blank} and [Hardhat](/builders/ethereum/dev-env/hardhat/){target=\_blank}.

You can also interact with your Moonbeam account using Polkadot.js Apps as it natively supports H160 addresses and ECDSA keys. For more information on this integration, you can check out the [Interacting with Moonbeam Using Polkadot.js Apps](/tokens/connect/polkadotjs/){target=\_blank} guide.

## Substrate EVM Compatible Blockchain {: #substrate-evm-compatible-blockchain }

Any parachain in the Polkadot ecosystem can offer a full EVM implementation, which provides the possibility of executing Solidity-based smart contracts with minimal to no changes. Substrate makes this integration possible - just plug the [EVM pallet](https://docs.rs/pallet-evm/2.0.1/pallet_evm){target=\_blank} into your runtime for EVM support, and the [Ethereum Pallet with Frontier](https://github.com/polkadot-evm/frontier){target=\_blank} to have Ethereum RPC compatibility. The availability of these open-source modules that Moonbeam has developed with Parity has led multiple parachains to offer Ethereum compatibility on their chains.

But there is an important catch. With the configuration described above, a user, for example, Alice, can have an Ethereum-style address (H160 format), which is 40+2 hex-characters long, in a Substrate based chain. This address matches a private key, which can be used to sign transactions in the Ethereum side of the chain. Furthermore, the address is mapped into a storage slot inside the Substrate Balance pallet to a Substrate-style address (H256 format).

However, Alice only knows the private key of the H160 address, and not of the mapped version. Therefore, she is unable to send transactions with her H256 address and is limited only to do read-only operations through Substrate’s API. As a consequence, Alice needs another H256 address matching a different private key to be able to operate in the Substrate side of the chain, which include, among others, staking, balances, and governance.

The following diagram illustrates this configuration.

![Old account system diagram](/images/learn/core-concepts/unified-accounts/unified-accounts-1.webp)

This can creates friction and a poor user experience for Alice. First, she has to move tokens to her H160 mapped H256 address to be able to make transactions and deploy contracts through the EVM. Second, she also needs to hold a balance in her other H256 address (which she has a different private key for) to use Substrate-based features. So in short, Alice needs a minimum of two private keys to have the best of both worlds.

## Moonbeam Unified Accounts {: #moonbeam-unified-accounts }

Moonbeam’s focus is to create a fully Ethereum-compatible environment on Polkadot with the best user experience possible. This extends beyond the base Ethereum feature set, with additional features such as on-chain governance, staking, and cross-chain integrations.

With unified accounts, a user, for example, Bob, will only need a single H160 address, with its corresponding private key, to do everything we mentioned above, including both EVM and Substrate functions.

The diagram for this new configuration looks as follows.

![New account system diagram](/images/learn/core-concepts/unified-accounts/unified-accounts-2.webp)

That is it, Bob only holds one private key that matches one address. He does not need to move balances between 2 different accounts and is able to access all the features with a single account and private key. We have standardized this single account to conform to the Ethereum-style H160 address and ECDSA key standards.

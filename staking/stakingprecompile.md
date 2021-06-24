---
title: Staking Precompile
description: Moonbeam Parachain Staking Ethereum Solidity Precompile Interface Demo
---

# Staking Precompile

![Staking Moonbeam Banner](/images/staking/staking-stake-banner.png)

## Moonbeam Parachain-Staking

A delegated proof of stake pallet recently debuted called [Parachain-Staking](https://github.com/PureStake/moonbeam/tree/master/pallets/parachain-staking/src), allowing token holders (nominators) to express exactly which collator candidates they would like to support and with what quantity of stake. The design of the Parachain-Staking pallet is such that it enforces shared risk/reward on chain between delegators and collators.

The Staking module is coded in Rust and it is part of a pallet that is normally not accessible from the Ethereum side of Moonbeam. However, a Staking Precompile allows developers to access the staking features as a precompiled contract located at address 0x0000000000000000000000000000000000000800. The Staking Precompile is included in our [Moonbase Alpha v8 release](https://moonbeam.network/announcements/testnet-upgrade-moonbase-alpha-v8/).

## The Parachain-Staking Solidity Interface

[StakingInterface.sol](https://github.com/PureStake/moonbeam/blob/master/runtime/precompiles/src/StakingInterface.sol) is an interface through which solidity contracts can interact with Parachain-Staking. The beauty is that solidity developers don’t have to learn the Substrate API. Instead, they can interact with staking functions using the Ethereum interface they are familiar with.

The interface includes the following functions:

 - `is_nominator(address collator)` checks whether the specified address is currently a staking nominator
 - `is_candidate(address collator)` - checks whether the specified address is currently a collator candidate
 - `min_nomination()` gets the minimum nomination amount
 - `join_candidates(uint256 amount)` allows the account to join the set of collator candidates with a specified bond amount
 - `leave_candidates()` - immediately removes the account from the candidate pool to prevent others from selecting it as a collator and triggers unbonding after BondDuration rounds have elapsed
 - `go_offline()` - temporarily leave the set of collator candidates without unbonding
 - `go_online()` - rejoin the set of collator candidates after previously calling go_offline()
 - `candidate_bond_more(uint256 more)` - collator candidate increases bond by specified amount
 - `candidate_bond_less(uint256 less)` - collator candidate decreases bond by specified amount
 - `nominate(address collator, uint256 amount)` - if the caller is not a nominator, this function adds them to the set of nominators. If the caller is already a nominator, then it adjusts their nomination amount
 - `leave_nominators()` - leave the set of nominators and revoke all ongoing nominations
 - `revoke_nominations(address collator)` - revoke a specific nomination
 - `nominator_bond_more(address collator, uint256 more)` - nominator increases bond to a collator by specified amount
 - `nominator_bond_less(address collator, uint256 less` - nominator decreases bond to a collator by specified amount

## Interacting with the Staking Precompile

### Checking Prerequisites

 - Have MetaMask installed and [connected to Moonbase Alpha](/getting-started/moonbase/metamask/)
 - Have an account with over {{networks.moonbase.staking.min_nom_stake}} tokens. You can get this from [Mission Control](/getting-started/moonbase/faucet/)

### Remix Set Up
1. Get a copy of the [latest staking interface](https://github.com/PureStake/moonbeam/blob/master/runtime/precompiles/src/StakingInterface.sol)
2. Copy and paste the file contents into a Remix file named StakingInterface.sol

![Copying and Pasting the Staking Interface into Remix](/images/staking/stakinginterface1.png)

### Compile the Contract
1. Click on the Compile Tab, second from top
2. Compile [Staking Interface.sol](https://github.com/PureStake/moonbeam/blob/master/runtime/precompiles/src/StakingInterface.sol)

![Compiling StakingInteface.sol](/images/staking/compile4.png)

### Access the Contract
1. Click on the Deploy and Run Tab, directly below the Compile Tab in Remix
2. Make sure "Injected Web3" is selected in the Environment drop down
3. Make sure “ParachainStaking - StakingInterface.sol” is selected in the Contract dropdown. Since this is a precompiled contract on Moonbase Alpha there is no need to deploy, instead we are going to provide the address of the precompile in the “AtAddress” Field
4. Provide the address of the Staking precompile: `{{networks.moonbase.staking.precompile_address}}` and Click “At Address”

![Provide the addressl](/images/staking/deploy1export.png)

### Nominate a Collator
For this example, we are going to be nominating a collator. Nominators are token holders who stake tokens, vouching for specific collators. Any user that holds a minimum amount of {{networks.moonbase.staking.min_nom_stake}} tokens as free balance can become a nominator. 

1. Expand the panel with the contract address and find the nominate function and expand the panel to see the parameters.
2. Provide the address of a collator such as `{{ networks.moonbase.staking.collators.address1 }}`
3. Provide the amount to nominate in WEI. There is a minimum of {{networks.moonbase.staking.min_nom_stake}} DEV to nominate, so the lowest amount in WEI is `5000000000000000000`
4. Press Transact and Confirm the Transaction in Metamask

![Nominate a Collator](/images/staking/nominateexport.png)

### Verify Nomination
To verify your nomination was successful, you can check the chain state in Polkadot.js Apps. First, add your metamask address to the [address book in Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/addresses). If you've already completed this step you can skip ahead to the next section. 

#### Add Metamask Address to Address Book
1. Click on Add Contact
2. Add your Metamask Moonbase Alpha Address
3. Provide a nickname for the account

![Add to Address Book](/images/staking/addressbook.png)

#### Verify Nominator State
1. To verify your nomination was successful, head to [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/chainstate) and navigate to Developer -> Chain State
2. Select the parachainStaking pallet
3. Select the nominatorState query
4. Click the Plus Button to return the results and verify your nomination

![Verify Nomination](/images/staking/verifynomination.png)

### Revoking a Nomination
To revoke a nomination and receive your tokens back, call the revoke_nomination method, providing the same address you started the nomination with above. You can check your Nominator state again on Polkadot.js Apps to confirm.

![Revoke Nomination](/images/staking/revokenomination.png)

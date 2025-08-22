---
title: Proxy Pallet
description: Learn how to use the available extrinsics, storage methods, and constants in the Proxy Pallet on Moonbeam to make calls on an account's behalf.
keywords: proxy, substrate, moonbeam, polkadot
categories: Substrate Toolkit
---

# The Proxy Pallet

## Introduction {: #introduction }

Proxy accounts can be set up to perform a limited number of actions on behalf of users and are useful for keeping the underlying accounts safe. They allow users to keep their primary account secured safely in cold storage while enabling the proxy to actively perform functions and participate in the network with the weight of the tokens in the primary account.

[Substrate's proxy pallet](https://wiki.polkadot.com/learn/learn-proxies/){target=\_blank} enables you to create proxy accounts, remove proxy accounts, make calls as a proxy account, and announce proxy transactions. To add and remove proxy accounts, you can use the proxy precompile: a Solidity interface that can be interacted through the Ethereum API. For more information on how to use this contract, please refer to the [Proxy Precompile](/builders/ethereum/precompiles/account/proxy/){target=\_blank} guide.

This page will provide an overview of the extrinsics, storage methods, and getters for the pallet constants available in the proxy pallet.

## Proxy Pallet Interface {: #proxy-pallet-interface }

### Extrinsics {: #extrinsics }

The proxy pallet provides the following extrinsics (functions):

??? function "**addProxy**(delegate, proxyType, delay) - registers a proxy account for the sender that is able to make calls on the sender's behalf. If `delay` is set to a value greater than 0, the proxy account will have to announce a transaction and wait that value of blocks before attempting to execute it as a proxy. Emits a `ProxyAdded` event"

    === "Parameters"

        - `delegate` - The account that will act as proxy (H160 format address, e.g., '0x123...'). This address will be able to submit transactions on behalf of the caller
        - `proxyType` - The permissions granted to the proxy account. Available options are:
            - `Any`: Allows all transactions
            - `NonTransfer`: Allows all transactions except balance transfers
            - `Governance`: Allows governance-related transactions
            - `Staking`: Allows staking-related transactions
            - `CancelProxy`: Only allows canceling other proxies
            - `Balances`: Allows balance transfers
            - `AuthorMapping`: Allows author mapping transactions
            - `IdentityJudgement`: Allows providing identity judgements
        - `delay` - Number of blocks that must pass after announcing a proxy transaction before it can be executed (u32). Set to `0` for immediate execution

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/proxy/add-proxy.js'
        ```

    === "Example Response"

        ```
        Validation checks:
        Account address: 0x3B939FeaD1557C741Ff06492FD0127bd287A421e
        Proxy account address: 0x569BE8d8b04538318e1722f6e375FD381D2da865
        Proxy type: {"Staking":null}
        Delay: 0
        Transaction included in block hash: 0xd9763b3eec3e50dfeec246f1537421a632ec5a3ab821a5e5e6b507c12930cd64
            balances.Withdraw: ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e",3431276154061]
            balances.Reserved: ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e",2100000000000000]
            proxy.ProxyAdded: ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e","0x569BE8d8b04538318e1722f6e375FD381D2da865","Staking",0]
        Proxy successfully added!
            balances.Deposit: ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e",0]
            balances.Deposit: ["0x6d6F646c70632f74727372790000000000000000",686255230813]
            transactionPayment.TransactionFeePaid: ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e",3431276154061,0]
            system.ExtrinsicSuccess: [{"weight":{"refTime":398219506,"proofSize":4310},"class":"Normal","paysFee":"Yes"}]
        ```



??? function "**announce**(real, callHash) - registers an announcement of a proxy transaction by proxy accounts that require a delay. Emits an `Announced` event"

    === "Parameters"

        - `real` - The account being proxied (H160 format address, e.g., '0x123...'). This is the account on whose behalf the delayed proxy intends to execute a call
        - `callHash` - The hash of the call that the proxy intends to execute after the delay period (32-byte hex string, e.g., '0x570ff355...'). This hash is derived from the actual call data that will be executed later


    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/proxy/announce.js'
        ```

    === "Example Response"

        ```
        Validation checks:
        Proxy account address: 0x569BE8d8b04538318e1722f6e375FD381D2da865
        Real account address: 0x3B939FeaD1557C741Ff06492FD0127bd287A421e
        Call hash: 0x570ff355e1471d3528cb4e2586bee7eafebc2efc89dd6f827188c69b15fff965
        Transaction included in block hash: 0xdb5b9bb961ce3153387d2131911de218c08b8b09d8a625f36271ad98b2abf567
        balances.Withdraw: ["0x569BE8d8b04538318e1722f6e375FD381D2da865",3682233905542]
        balances.Reserved: ["0x569BE8d8b04538318e1722f6e375FD381D2da865","0x00000000000000000df77377c5f40000"]
        proxy.Announced: ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e","0x569BE8d8b04538318e1722f6e375FD381D2da865","0x570ff355e1471d3528cb4e2586bee7eafebc2efc89dd6f827188c69b15fff965"]
        Proxy call successfully announced!
        You can execute the actual call after the delay period
        balances.Deposit: ["0x569BE8d8b04538318e1722f6e375FD381D2da865",0]
        balances.Deposit: ["0x6d6F646c70632f74727372790000000000000000",736446781109]
        transactionPayment.TransactionFeePaid: ["0x569BE8d8b04538318e1722f6e375FD381D2da865",3682233905542,0]
        system.ExtrinsicSuccess: [{"weight":{"refTime":577384531,"proofSize":5302},"class":"Normal","paysFee":"Yes"}]
            
        ```

??? function "**proxy**(real, forceProxyType, call) - makes a transaction as a proxy. Emits a `ProxyExecuted` event"

    === "Parameters"

        - `real` - The account being proxied (H160 format address, e.g., '0x123...'). This is the account on whose behalf the proxy will execute the call
        - `forceProxyType` - The type of proxy right required to execute this call. Must match the proxy type that was specified when the proxy was added. Available options are:
            - `Any`: Allows all transactions
            - `NonTransfer`: Allows all transactions except balance transfers
            - `Governance`: Allows governance-related transactions
            - `Staking`: Allows staking-related transactions
            - `CancelProxy`: Only allows canceling other proxies
            - `Balances`: Allows balance transfers
            - `AuthorMapping`: Allows author mapping transactions
            - `IdentityJudgement`: Allows providing identity judgements
        - `call` - The actual call data to be executed by the proxy on behalf of the real account. This is the transaction that will be performed (e.g., a transfer, a stake, or any other valid runtime call)

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/proxy/proxy.js'
        ```

    === "Example Response"

        ```
        Validation checks:
        Proxy account: 0x3B939FeaD1557C741Ff06492FD0127bd287A421e
        Real account: 0x569BE8d8b04538318e1722f6e375FD381D2da865
        Destination account: 0x8c9c5F11d162a69E979F2DB9047A862ecbcA23Cb
        Transfer amount: 1000000000000000000 Wei (1 DEV)
        Force proxy type: Balances
        Transaction included in block hash: 0xc347d714324e795c0e27ef574c8f924d7a52935314044cf2e2a395bc32ef5070
            balances.Withdraw: ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e",3817444390449]
            balances.Transfer: ["0x569BE8d8b04538318e1722f6e375FD381D2da865","0x8c9c5F11d162a69E979F2DB9047A862ecbcA23Cb","0x00000000000000000de0b6b3a7640000"]

        Transfer successfully executed via proxy!
        From: 0x569BE8d8b04538318e1722f6e375FD381D2da865
        To: 0x8c9c5F11d162a69E979F2DB9047A862ecbcA23Cb
        Amount: 1000000000000000000
            proxy.ProxyExecuted: [{"ok":null}]
            balances.Deposit: ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e",0]
            balances.Deposit: ["0x6d6F646c70632f74727372790000000000000000",763488878090]
            transactionPayment.TransactionFeePaid: ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e",3817444390449,0]
            system.ExtrinsicSuccess: [{"weight":{"refTime":684752866,"proofSize":8691},"class":"Normal","paysFee":"Yes"}]
        ```


??? function "**proxyAnnounced**(delegate, real, forceProxyType, call) - makes a transaction as a proxy and removes previous corresponding announcements. Emits a `ProxyExecuted` event"

    === "Parameters"
        - `delegate` - The account that previously made the announcement (H160 format address, e.g., '0x123...'). This must match the proxy account that called the announce function
        - `real` - The account being proxied (H160 format address, e.g., '0x123...'). This is the account on whose behalf the proxy will execute the call
        - `forceProxyType` - The type of proxy right required to execute this call. Must match the proxy type that was specified when the proxy was added. Available options are:
            - `Any`: Allows all transactions
            - `NonTransfer`: Allows all transactions except balance transfers
            - `Governance`: Allows governance-related transactions
            - `Staking`: Allows staking-related transactions
            - `CancelProxy`: Only allows canceling other proxies
            - `Balances`: Allows balance transfers
            - `AuthorMapping`: Allows author mapping transactions
            - `IdentityJudgement`: Allows providing identity judgements
        - `call` - The actual call to be executed (must match the call that was previously announced). This is the transaction that will be performed (e.g., a transfer, a stake, or any other valid runtime call)

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/proxy/proxy-announced.js'
        ```

    === "Example Response"

        ```
            Validation checks:
            Proxy account: 0x3B939FeaD1557C741Ff06492FD0127bd287A421e
            Real account: 0x569BE8d8b04538318e1722f6e375FD381D2da865
            Destination account: 0x8c9c5F11d162a69E979F2DB9047A862ecbcA23Cb
            Transfer amount: 1000000000000000000 Wei (1 DEV)
            Force proxy type: Balances
            Transaction included in block hash: 0xc347d714324e795c0e27ef574c8f924d7a52935314044cf2e2a395bc32ef5070
                balances.Withdraw: ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e",3817444390449]
                balances.Transfer: ["0x569BE8d8b04538318e1722f6e375FD381D2da865","0x8c9c5F11d162a69E979F2DB9047A862ecbcA23Cb","0x00000000000000000de0b6b3a7640000"]

            Transfer successfully executed via proxy!
            From: 0x569BE8d8b04538318e1722f6e375FD381D2da865
            To: 0x8c9c5F11d162a69E979F2DB9047A862ecbcA23Cb
            Amount: 1000000000000000000
                proxy.ProxyExecuted: [{"ok":null}]
                balances.Deposit: ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e",0]
                balances.Deposit: ["0x6d6F646c70632f74727372790000000000000000",763488878090]
                transactionPayment.TransactionFeePaid: ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e",3817444390449,0]
                system.ExtrinsicSuccess: [{"weight":{"refTime":684752866,"proofSize":8691},"class":"Normal","paysFee":"Yes"}]
        ```

??? function "**rejectAnnouncement**(delegate, callHash) - if the sender is a prime account, this removes a specific announcement from their proxy account"

    === "Parameters"

        - `delegate` - The account that previously made the announcement (H160 format address, e.g., '0x123...'). This must match the proxy account that called the announce function
        - `callHash` - The hash call to be executed (must match the call that was previously announced)

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/proxy/reject-announcement.js'
        ```

    === "Example Response"

        Validation checks:
        Real account (rejector): 0x569BE8d8b04538318e1722f6e375FD381D2da865
        Delegate account to reject: 0x569BE8d8b04538318e1722f6e375FD381D2da865
        Call hash to reject: 0xaf2dd398c8ee31d963d1f24764b8857e27314b3e937385c3ff60c034a36e925c
        Transaction included in block hash: 0x76073a7b5eae1b9efb4a8142916fb33fa9f11a31f9e1f231ecb1ebd1af7a2a47
            balances.Withdraw: ["0x569BE8d8b04538318e1722f6e375FD381D2da865",3621382860542]
            balances.Deposit: ["0x569BE8d8b04538318e1722f6e375FD381D2da865",0]
            balances.Deposit: ["0x6d6F646c70632f74727372790000000000000000",724276572109]
            transactionPayment.TransactionFeePaid: ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e",3621382860542,0]
            ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e",3817444390449,0]
                system.ExtrinsicSuccess: [{"weight":{"refTime":684752866,"proofSize":8691},"class":"Normal","paysFee":"Yes"}]


??? function "**removeAnnouncement**(real, callHash) - if the sender is a proxy account, this removes a specific announcement to their prime account"

    === "Parameters"

        - `real` - The account that was designated as the real account in the original announcement (H160 format address, e.g., '0x123...'). This is the account on whose behalf the proxy had announced a future transaction
        - `callHash` - The hash of the call from the original announcement (32-byte hex string, e.g., '0x570ff355...'). This uniquely identifies which announced transaction should be removed

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/proxy/remove-announcement.js'
        ```

    === "Example Response"

        ```
        Validation checks:
        Proxy account (remover): 0x3B939FeaD1557C741Ff06492FD0127bd287A421e
        Real account: 0x569BE8d8b04538318e1722f6e375FD381D2da865
        Call hash to remove: 0x570ff355e1471d3528cb4e2586bee7eafebc2efc89dd6f827188c69b15fff965
        Transaction included in block hash: 0x767724a583d93b558c56f2e241d2334bf91773269ceb1e0a60435f7cbbe2205a
            balances.Withdraw: ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e",3621330308042]
            balances.Deposit: ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e",0]
            balances.Deposit: ["0x6d6F646c70632f74727372790000000000000000",724266061609]
            transactionPayment.TransactionFeePaid: ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e",3621330308042,0]
            ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e",3817444390449,0]
                system.ExtrinsicSuccess: [{"weight":{"refTime":684752866,"proofSize":8691},"class":"Normal","paysFee":"Yes"}]
        ```

??? function "**removeProxies**() - unregisters all proxy accounts for the sender"

    === "Parameters"

        None

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/proxy/remove-all-proxies.js'
        ```

    === "Example Response"

        ```
        Validation checks:
        Account removing all proxies: 0x3B939FeaD1557C741Ff06492FD0127bd287A421e

        Current proxies before removal: [
          [
            {
              delegate: '0x0000000000000000000000000000000000000000',
              proxyType: 'Governance',
              delay: '0'
            },
            {
              delegate: '0x4b8C667590E6a28497Ea4be5FACB7e9869A64EAE',
              proxyType: 'Staking',
              delay: '0'
            },
            {
              delegate: '0x569BE8d8b04538318e1722f6e375FD381D2da865',
              proxyType: 'Staking',
              delay: '0'
            },
            {
              delegate: '0x569BE8d8b04538318e1722f6e375FD381D2da865',
              proxyType: 'Balances',
              delay: '100'
            }
          ],
          '1,009,200,000,000,000,000'
        ]

        Transaction included in block hash: 0x2ef80fe655c98f47ba82cc2ee7937e03d2c6211195dc03ef02e6d47fbbdcd944
            balances.Withdraw: ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e",3403192090986]
            balances.Unreserved: ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e","0x00000000000000000e01660d93530000"]
            balances.Deposit: ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e",0]
            balances.Deposit: ["0x6d6F646c70632f74727372790000000000000000",680638418198]
            transactionPayment.TransactionFeePaid: ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e",3403192090986,0]
            system.ExtrinsicSuccess: [{"weight":{"refTime":395752965,"proofSize":4310},"class":"Normal","paysFee":"Yes"}]

        Proxies after removal: [ [], '0' ]
        ```

??? function "**removeProxy**(delegate, proxyType, delay) - unregisters a specific proxy account for the sender. Emits a `ProxyRemoved` event"

    === "Parameters"

        - `delegate` - The proxy account to remove (H160 format address, e.g., '0x123...'). This must be an existing proxy account that was previously registered using addProxy
           - `proxyType` - The type of proxy to remove. Must match exactly what was set when the proxy was added. Available options are:
               - `Any`: Allows all transactions
               - `NonTransfer`: Allows all transactions except balance transfers
               - `Governance`: Allows governance-related transactions
               - `Staking`: Allows staking-related transactions
               - `CancelProxy`: Only allows canceling other proxies
               - `Balances`: Allows balance transfers
               - `AuthorMapping`: Allows author mapping transactions
               - `IdentityJudgement`: Allows providing identity judgements
           - `delay` - The announcement delay in blocks that was set when adding the proxy (u32). Must match exactly what was set when the proxy was added (e.g., if proxy was added with delay=100, must use delay=100 to remove it)

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/proxy/remove-proxy.js'
        ```

    === "Example Response"

        ```
        Validation checks:
        Account removing proxy: 0x3B939FeaD1557C741Ff06492FD0127bd287A421e
        Proxy being removed: 0x569BE8d8b04538318e1722f6e375FD381D2da865
        Proxy type: {"Any":null}
        Delay: 0

        Current proxies before removal: [
          [
            {
              delegate: '0x569BE8d8b04538318e1722f6e375FD381D2da865',
              proxyType: 'Any',
              delay: '0'
            }
          ],
          '1,002,900,000,000,000,000'
        ]

        Transaction included in block hash: 0x8402c11ca656798ad54eea16c5c05b5fefa5d5d23beb590d214d2fa4168d8af9
            balances.Withdraw: ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e",3431367169061]
            balances.Unreserved: ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e","0x00000000000000000deb043c853d4000"]
            proxy.ProxyRemoved: ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e","0x569BE8d8b04538318e1722f6e375FD381D2da865","Any",0]

        Proxy successfully removed!
        Delegator: 0x3B939FeaD1557C741Ff06492FD0127bd287A421e
        Removed delegate: 0x569BE8d8b04538318e1722f6e375FD381D2da865
        Proxy type: Any
        Delay: 0
            balances.Deposit: ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e",0]
            balances.Deposit: ["0x6d6F646c70632f74727372790000000000000000",686273433813]
            transactionPayment.TransactionFeePaid: ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e",3431367169061,0]
            system.ExtrinsicSuccess: [{"weight":{"refTime":398292318,"proofSize":4310},"class":"Normal","paysFee":"Yes"}]

        Proxies after removal: [ [], '0' ]
        ```


!!! note
    Anonymous proxies are disabled on Moonbeam networks because they are easy to misuse. Incorrect usage can cause a permanent loss of funds and unreserved balances.

### Storage Methods {: #storage-methods }

The proxy pallet includes the following read-only storage methods to obtain chain state data:

??? function "**announcements**(AccountId20) - returns all announcements made by the specified proxy account"
    === "Parameters"
        - `AccountId20` - The proxy account's address in H160 format (e.g., '0x123...') whose announcements you want to query
    === "Returns"
        Returns a tuple containing:
        - Array of announcements, each containing:
            - real: AccountId20 (The account the announcement was made for)
            - callHash: H256 (The hash of the announced call)
            - height: BlockNumber (The block number when announced)
        - Balance (The amount reserved to place the announcements)
    === "Polkadot.js API Example"
        ```js
        --8<-- 'code/builders/substrate/interfaces/account/proxy/announcements.js'
        ```

??? function "**palletVersion**() - returns the current pallet version"
    === "Parameters"
        - None
    === "Returns"
        Returns a single number representing the current version of the proxy pallet
    === "Polkadot.js API Example"
        ```js
        --8<-- 'code/builders/substrate/interfaces/account/proxy/pallet-version.js'
        ```

??? function "**proxies**(AccountId20) - returns a map and count of all proxy accounts for a specified primary account"
    === "Parameters"
        - `AccountId20` - The primary account's address in H160 format (e.g., '0x123...') whose proxies you want to query
    === "Returns"
        Returns a tuple containing:
        - Array of ProxyDefinition, each containing:
            - delegate: AccountId20 (The proxy account address)
            - proxyType: Enum (The type of proxy)
            - delay: Number (The announcement delay in blocks)
        - Balance (The amount reserved to place the proxies)
    === "Polkadot.js API Example"
        
        ```js
        --8<-- 'code/builders/substrate/interfaces/account/proxy/proxies.js'
        ```

### Pallet Constants {: #constants }

The proxy pallet includes the following read-only functions to obtain pallet constants:

??? function "**announcementDepositBase**() - returns the base amount of currency needed to reserve for creating an announcement"

    === "Parameters"
           - None

    === "Returns"
           Returns a Balance value representing the base deposit amount in Wei required for creating a proxy announcement

    === "Polkadot.js API Example"
           ```js
           --8<-- 'code/builders/substrate/interfaces/account/proxy/announcement-deposit-base.js'
           ```

??? function "**announcementDepositFactor**() - returns the amount of currency needed per announcement made"

    === "Parameters"
        None

    === "Returns"

        Returns a Balance value representing the additional deposit amount in Wei required for each announcement made

    === "Polkadot.js API Example"
        ```js
        --8<-- 'code/builders/substrate/interfaces/account/proxy/announcement-deposit.js'
        ```

??? function "**maxPending**() - returns the maximum amount of time-delayed announcements that are allowed to be pending"

    === "Parameters"
        None

    === "Returns"

        Returns a u32 value representing the maximum number of announcements that can be pending for a proxy account

    === "Polkadot.js API Example"
        ```js
        --8<-- 'code/builders/substrate/interfaces/account/proxy/max-pending.js'
        ```

??? function "**maxProxies**() - returns the maximum amount of proxies allowed for a single account"

    === "Parameters"
        None

    === "Returns"

        Returns a u32 value representing the maximum number of proxy accounts that can be registered to a single account

    === "Polkadot.js API Example"
           ```js
            --8<-- 'code/builders/substrate/interfaces/account/proxy/max-proxies.js'
           ```

??? function "**proxyDepositBase**() - returns the base amount of currency needed to reserve for creating a proxy"

    === "Parameters"
        None

    === "Returns"
        Returns a Balance value representing the base deposit amount in Wei required for creating a proxy

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/proxy/proxy-deposit-base.js'
        ```

??? function "**proxyDepositFactor**() - returns the amount of currency needed per proxy added"

    === "Parameters"
    
        None

    === "Returns"
        Returns a Balance value representing the additional deposit amount in Wei required for each proxy registered

    === "Polkadot.js API Example"
        
        ```js
        --8<-- 'code/builders/substrate/interfaces/account/proxy/proxy-deposit-factor.js'
        ```
---
title: Identity Pallet
description: This guide covers the available functions in the Identity Pallet on Moonbeam, which are used to create and manage on-chain identities.
---

# The Identity Pallet

## Introduction {: #introduction }

The [Substrate](/learn/platform/technology/#substrate-framework){target=\_blank} Identity Pallet is an out-of-the-box solution for adding personal information to your on-chain account. Personal information can include default fields such as your legal name, display name, website, Twitter handle, and Riot (now known as Element) name. You can also take advantage of custom fields to include any other relevant information.

The pallet also includes functionality to request judgments and verify on-chain identities from registrars, which are accounts appointed via governance to verify the identity information submitted and provide judgment on their findings for a fee.

This guide will provide an overview of the extrinsics, storage methods, and getters for the pallet constants available in the Identity Pallet on Moonbeam. This guide assumes you are familiar with identity-related terminology; if not, please check out the [Managing your Account Identity](/tokens/manage/identity/){target=\_blank} page for more information.

## Identity Pallet Interface {: #preimage-pallet-interface }

### Extrinsics {: #extrinsics }

The Identity Pallet provides the following extrinsics (functions):

??? function "**addRegistrar**(account) - adds an account as a registrar. Must be executed by the General Admin Origin"

    === "Parameters"

        - `account` - the account to add as a registrar

    === "Polkadot.js API Example"

        ```js
        import { ApiPromise, WsProvider } from '@polkadot/api';

        const account = INSERT_ACCOUNT;

        const main = async () => {
          const api = await ApiPromise.create({
            provider: new WsProvider('INSERT_WSS_ENDPOINT'),
          });

          const tx = api.tx.identity.addRegistrar(account);
          const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');
          
          api.disconnect();
        };

        main();
        ```

??? function "**addSub**(sub, data) - adds an account as a sub-account of the caller. You can optionally provide a name for the sub-account"

    === "Parameters"

        - `sub` - the account to add as a sub-account
        - `data` - an object that specifies the name of the sub-account, where the key is the data type and the value is the data. You can use any of the following data types to define the name of the sub-account:
            - `None` - no name should be used
            - `Raw` - a raw value using hex or ascii
            - `BlakeTwo256` - a BLAKE2-256 hash value
            - `Sha256` - a SHA-256 value
            - `Keccak256` - a Keccak-256 value
            - `ShaThree256` - a SHA3-256 value

    === "Polkadot.js API Example"

        ```js
        import { ApiPromise, WsProvider } from '@polkadot/api';

        const sub = 'INSERT_SUB_ACCOUNT';
        const data = { 'INSERT_DATA_TYPE': 'INSERT_DATA' };
        /* 
        For None, use the following format:
        const data = { 'None': null };

        For all other data types, use the name of the data type
        and the value formatted in that specific type. For example:
        const data = { 'Raw': 'Alice' };
        */

        const main = async () => {
          const api = await ApiPromise.create({
            provider: new WsProvider('INSERT_WSS_ENDPOINT'),
          });

          const tx = api.tx.identity.addSub(sub, data);
          const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');
          
          api.disconnect();
        };

        main();
        ```

??? function "**cancelRequest**(regIndex) - cancels the caller's request for judgment from a given registrar"

    === "Parameters"

        - `regIndex` - the index of the registrar

    === "Polkadot.js API Example"

        ```js
        import { ApiPromise, WsProvider } from '@polkadot/api';

        const regIndex = 'INSERT_INDEX_OF_REGISTRAR';

        const main = async () => {
          const api = await ApiPromise.create({
            provider: new WsProvider('INSERT_WSS_ENDPOINT'),
          });

          const tx = api.tx.identity.cancelRequest(regIndex);
          const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');
          
          api.disconnect();
        };

        main();
        ```

??? function "**clearIdentity**() - clears the identity for the caller"

    === "Parameters"

        None.

    === "Polkadot.js API Example"

        ```js
        import { ApiPromise, WsProvider } from '@polkadot/api';

        const main = async () => {
          const api = await ApiPromise.create({
            provider: new WsProvider('INSERT_WSS_ENDPOINT'),
          });

          const tx = api.tx.identity.clearIdentity();
          const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');
          
          api.disconnect();
        };

        main();
        ```

??? function "**killIdentity**(target) - removes an account's identity and sub-accounts. Must be executed by the General Admin Origin"

    === "Parameters"

        - `target` - the account to remove the identity and sub-accounts for

    === "Polkadot.js API Example"

        ```js
        import { ApiPromise, WsProvider } from '@polkadot/api';

        const target = 'INSERT_TARGET_ACCOUNT';

        const main = async () => {
          const api = await ApiPromise.create({
            provider: new WsProvider('INSERT_WSS_ENDPOINT'),
          });

          const tx = api.tx.identity.killIdentity(target);
          const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');
          
          api.disconnect();
        };

        main();
        ```

??? function "**provideJudgement**(regIndex, target, judgement, identity) - provides judgment on an account's identity.  The caller must be the registrar account that corresponds to the `index`. Must be executed by a registrar"

    === "Parameters"

        - `regIndex` - the index of the registrar submitting the judgement
        - `target` - the account to provide the judgment for
        - `judgement` - the judgement or level of confidence in the identity information provided. There are seven levels of confidence, you can either provide the name or the index of the confidence level:
            - `Unknown` or `0` - no judgement made yet. This is the default value
            - `FeePaid` or `1` - indicates a user has requested judgement and it is in progress
            - `Reasonable` or `2` - the information appears reasonable, but no in-depth checks were performed using legal identity documents
            - `KnownGood` or `3` - the information is correct and is based upon review of legal identity documents
            - `OutOfDate` or `4` - the information used to be good, but is now out of date
            - `LowQuality` or `5` - the information is low quality or imprecise, but can be updated as needed
            - `Erroneous` or `6` - the information is erroneous and may indicate malicious intent. This state cannot be modified and can only be removed if the entire identity has been removed
        - `identity` - the 32-byte hash of the identity

    === "Polkadot.js API Example"

        ```js
        import { ApiPromise, WsProvider } from '@polkadot/api';

        const regIndex = 'INSERT_REGISTRAR_INDEX';
        const target = 'INSERT_TARGET_ACCOUNT';
        const judgement = 'INSERT_JUDGEMENT';
        const identity = 'INSERT_IDENTITY';

        const main = async () => {
          const api = await ApiPromise.create({
            provider: new WsProvider('INSERT_WSS_ENDPOINT'),
          });

          const tx = api.tx.identity.provideJudgement(
            regIndex,
            target,
            judgement,
            identity
          );
          const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');

          api.disconnect();
        };

        main();
        ```

??? function "**quitSub**() - removes the caller as a sub-identity account"

    === "Parameters"

        None.

    === "Polkadot.js API Example"

        ```js
        import { ApiPromise, WsProvider } from '@polkadot/api';

        const main = async () => {
          const api = await ApiPromise.create({
            provider: new WsProvider('INSERT_WSS_ENDPOINT'),
          });

          const tx = api.tx.identity.quitSub();
          const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');
          
          api.disconnect();
        };

        main();
        ```

??? function "**removeSub**(sub) - removes a sub-identity account for the caller"

    === "Parameters"

        - `sub` - the sub-identity account to remove

    === "Polkadot.js API Example"

        ```js
        import { ApiPromise, WsProvider } from '@polkadot/api';

        const sub = 'INSERT_ACCOUNT';

        const main = async () => {
          const api = await ApiPromise.create({
            provider: new WsProvider('INSERT_WSS_ENDPOINT'),
          });

          const tx = api.tx.identity.removeSub(sub);
          const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');
          
          api.disconnect();
        };
        ```

??? function "**renameSub**(sub) - renames a sub-identity account for the caller"

    === "Parameters"

        - `sub` - the sub-identity account to rename

    === "Polkadot.js API Example"

        ```js
        import { ApiPromise, WsProvider } from '@polkadot/api';

        const sub = 'INSERT_ACCOUNT';

        const main = async () => {
          const api = await ApiPromise.create({
            provider: new WsProvider('INSERT_WSS_ENDPOINT'),
          });

          const tx = api.tx.identity.rename(sub);
          const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');
          
          api.disconnect();
        };
        ```

??? function "**requestJudgement**(regIndex, maxFee) - requests judgment from a given registrar along with the maximum fee the caller is willing to pay"

    === "Parameters"

        - `regIndex` - the index of the registar to request judgement from
        - `maxFee` - the maximum fee in Wei that can be paid to the registrar for providing judgement

    === "Polkadot.js API Example"

        ```js
        import { ApiPromise, WsProvider } from '@polkadot/api';

        const regIndex = INSERT_REGISTRAR_INDEX;
        const maxFee = INSERT_MAX_FEE;

        const main = async () => {
          const api = await ApiPromise.create({
            provider: new WsProvider('INSERT_WSS_ENDPOINT'),
          });

          const tx = api.tx.identity.requestJudgement(regIndex, maxFee);
          const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');
          
          api.disconnect();
        };

        main();
        ```

??? function "**setAccountId**(index, new) - sets a new account for an existing registrar. Must be executed by the registrar account that corresponds to the `index`."

    === "Parameters"

        - `index` - the index of the registrar
        - `new` - the account to set as the registrar's new account

    === "Polkadot.js API Example"

        ```js
        import { ApiPromise, WsProvider } from '@polkadot/api';

        const index = INSERT_REGISTRAR_INDEX;
        const new = 'INSERT_NEW_ACCOUNT';

        const main = async () => {
          const api = await ApiPromise.create({
            provider: new WsProvider('INSERT_WSS_ENDPOINT'),
          });

          const tx = api.tx.identity.setAccountId(index, new);
          const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');
          
          api.disconnect();
        };

        main();
        ```

??? function "**setFee**(index, fee) - sets the fee for a registar. Must be executed by the registrar account that corresponds to the `index`"

    === "Parameters"

        - `index` - the index of the registrar
        - `fee` - the fee in Wei required to be paid to the registrar for a judgement

    === "Polkadot.js API Example"

        ```js
        import { ApiPromise, WsProvider } from '@polkadot/api';

        const index = INSERT_REGISTRAR_INDEX;
        const fee = INSERT_FEE;

        const main = async () => {
          const api = await ApiPromise.create({
            provider: new WsProvider('INSERT_WSS_ENDPOINT'),
          });

          const tx = api.tx.identity.setFee(index, fee);
          const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');
          
          api.disconnect();
        };

        main();
        ```

??? function "**setFields**(index, fields) - sets the fields that a registrar cares about when providing judgements. Must be executed by the registrar account that corresponds to the `index`"

    === "Parameters"

        - `index` - the index of the registrar
        - `fields` - an array of the fields that the registrar cares about. The fields can be any of the following:
            - `Display` - a display name
            - `Legal` - a legal name
            - `Web` - a website
            - `Riot` - a Riot username
            - `Email` - an email address
            - `PpgFingerprint` - a PPG fingerprint
            - `Image` - an image
            - `Twitter` - a Twitter username

    === "Polkadot.js API Example"

        ```js
        import { ApiPromise, WsProvider } from '@polkadot/api';

        const index = INSERT_REGISTRAR_INDEX;
        const fields = [INSERT_FIELDS];

        const main = async () => {
          const api = await ApiPromise.create({
            provider: new WsProvider('INSERT_WSS_ENDPOINT'),
          });

          const tx = api.tx.identity.setFields(index, fields);
          const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');
          
          api.disconnect();
        };

        main();
        ```

??? function "**setIdentity**(info) - sets the identity for the caller"

    === "Parameters"

        - `info` - the identity information. The identity information can include any of the following optional fields:
            - `display` - a display name
            - `legal` - a legal name
            - `web` - a website
            - `riot` - a Riot username
            - `email` - an email address
            - `ppgFingerprint` - a PPG fingerprint
            - `image` - an image
            - `twitter` - a Twitter username
            - `additional` - an array that contains custom fields for additional information. Each additional item is represented as an array that contains two objects: one for the field name and one for the field value. You can define the additional field names and values in the following formats:
                - `None` - no additional information should be used
                - `Raw` - a raw value using hex or ascii
                - `BlakeTwo256` - a BLAKE2-256 hash value
                - `Sha256` - a SHA-256 value
                - `Keccak256` - a Keccak-256 value
                - `ShaThree256` - a SHA3-256 value
            
        When setting an identity, a deposit is required. If setting additional fields, an additional deposit will be required per each additional field. For more information, please refer to the [Manage an Identity](/tokens/manage/identity#general-definitions){target=_blank} documentation.
  
    === "Polkadot.js API Example"

        ```js
        import { ApiPromise, WsProvider } from '@polkadot/api';

        /*
        Add as many or as few fields as you would like
        */
        const info = {
          display: 'INSERT_DISPLAY_NAME',
          legal: 'INSERT_LEGAL_NAME',
          additional: [[{ Raw: 'Discord' }, { Raw: 'INSERT_DISCORD_USERNAME' }]],
        };

        const main = async () => {
          const api = await ApiPromise.create({
            provider: new WsProvider('INSERT_WSS_ENDPOINT'),
          });

          const tx = api.tx.identity.setIdentity(info);
          const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');

          api.disconnect();
        };

        main();
        ```

??? function "**setSubs**(subs) - sets the sub-accounts for the caller"

    === "Parameters"

        - `subs` - an array that defines the sub-accounts. Each sub-account is represented as an array itself, with the address of the sub-account as the zero index and the name as the first index. The name is an object that can be defined in the following formats:
            - `None` - no additional information should be used
            - `Raw` - a raw value using hex or ascii
            - `BlakeTwo256` - a BLAKE2-256 hash value
            - `Sha256` - a SHA-256 value
            - `Keccak256` - a Keccak-256 value
            - `ShaThree256` - a SHA3-256 value

    === "Polkadot.js API Example"

        ```js
        import { ApiPromise, WsProvider } from '@polkadot/api';

        const subs = [
          [ INSERT_ACCOUNT, { Raw: 'INSERT_SUB_ACCOUNT_NAME' }],
          [ INSERT_ACCOUNT, { None: null }]
        ];

        const main = async () => {
          const api = await ApiPromise.create({
            provider: new WsProvider('INSERT_WSS_ENDPOINT'),
          });

          const tx = api.tx.identity.setSubs(subs);
          const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');

          api.disconnect();
        };

        main();
        ```

### Storage Methods {: #storage-methods }

The Identity Pallet includes the following read-only storage methods to obtain chain state data:

??? function "**identityOf**(account) - returns identity information for a given account"

    === "Parameters"

        - `account` - the account to get identity information for

    === "Returns"

        Identity information for the given account, including judgements (if account has requested a judgement from a registrar), the deposit being held for the identity, and the identity information. If the account does not have an identity set, `null` is returned.

        ```js
        // If using Polkadot.js API and calling toJSON() on the query results
        {
          judgements: [],
          deposit: '0x00000000000000000e53d254821d0000',
          info: {
            additional: [ [Array] ],
            display: { raw: '0x416c697468' },
            legal: { none: null },
            web: { none: null },
            riot: { none: null },
            email: { raw: '0x616c69746840616c6974682e636f6d' },
            pgpFingerprint: null,
            image: { none: null },
            twitter: { none: null }
          }
        }
        ```

    === "Polkadot.js API Example"

        ```js
        TODO
        ```

??? function "**palletVersion**() - returns the current pallet version"

    === "Parameters"

        - `` -

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        TODO
        ```

??? function "**registrars**() - returns the set of registrars"

    === "Parameters"

        - `` -

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        TODO
        ```

??? function "**subsOf**(AccountId20) - returns the sub identities for all accounts or for a given account"

    === "Parameters"

        - `AccountId20` -

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        TODO
        ```

??? function "**superOf**(AccountId20) - returns the super identity of all sub-accounts or for a given sub-account"

    === "Parameters"

        - `AccountId20` -

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        TODO
        ```

### Pallet Constants {: #constants }

The Identity Pallet includes the following read-only functions to obtain pallet constants:

??? function "**basicDeposit**() - returns the amount held on deposit for a registered identity"

    === "Parameters"

        - `` -

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        TODO
        ```

??? function "**fieldDeposit**() - returns the amount held on deposit per additional field for a registered identity"

    === "Parameters"

        - `` -

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        TODO
        ```

??? function "**maxAdditionalFields**() - returns the maximum number of fields that can be stored in an ID"

    === "Parameters"

        - `` -

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        TODO
        ```

??? function "**maxRegistrars**() - returns the maximum number of registrars allowed in the system"

    === "Parameters"

        - `` -

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        TODO
        ```

??? function "**maxSubAccounts**() - returns the maximum number of sub-accounts allowed per account"

    === "Parameters"

        - `` -

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        TODO
        ```

??? function "**subAccountDeposit**() - returns the amount held on deposit for a registered sub-account"

    === "Parameters"

        - `` -

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        TODO
        ```

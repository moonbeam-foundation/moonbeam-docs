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
        import { ApiPromise, WsProvider } from '@polkadot/api';

        // Helper function to decode hex to string
        const hexToString = (hex) => {
          // Remove '0x' prefix if present
          const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
          // Convert hex to string
          const str = Buffer.from(cleanHex, 'hex').toString('utf8');
          return str;
        };

        const main = async () => {
          const api = await ApiPromise.create({
            provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io')
          });

          try {
            const account = 'INSERT_ACCOUNT';
            const identity = await api.query.identity.identityOf(account);
            
            console.log('Raw identity response:', identity.toString());

            if (identity) {
              // Parse the raw response
              const rawResponse = JSON.parse(identity.toString());
              
              if (rawResponse[0]) {
                const formattedIdentity = {
                  judgements: rawResponse[0].judgements,
                  deposit: rawResponse[0].deposit,
                  info: {
                    additional: rawResponse[0].info.additional,
                    display: rawResponse[0].info.display.raw ? 
                      hexToString(rawResponse[0].info.display.raw) : null,
                    legal: rawResponse[0].info.legal,
                    web: rawResponse[0].info.web,
                    riot: rawResponse[0].info.riot,
                    email: rawResponse[0].info.email,
                    pgpFingerprint: rawResponse[0].info.pgpFingerprint,
                    image: rawResponse[0].info.image,
                    twitter: rawResponse[0].info.twitter
                  }
                };

                console.log('Formatted Identity:', JSON.stringify(formattedIdentity, null, 2));
              } else {
                console.log('No identity data found in the response');
              }
            } else {
              console.log('No identity found for this account');
            }
          } catch (error) {
            console.error('Error querying identity:', error);
          } finally {
            await api.disconnect();
          }
        };

        main().catch(error => {
          console.error('Script error:', error);
          process.exit(1);
        });
        ```

??? function "**palletVersion**() - returns the current pallet version"

    === "Parameters"

        None

    === "Returns"

        The version of the pallet, e.g. `1`

    === "Polkadot.js API Example"

        ```js
        import { ApiPromise, WsProvider } from '@polkadot/api';

        const main = async () => {
          // Create the API instance
          const api = await ApiPromise.create({
            provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io')
          });

          // Query the identity pallet version
          const version = await api.query.identity.palletVersion();
          
          // Log the version to console
          console.log('Identity Pallet Version:', version.toString());

          // Disconnect from the API
          await api.disconnect();
        };

        main().catch(console.error);
        ```

??? function "**registrars**() - returns the set of registrars"

    === "Parameters"

        None

    === "Returns"

        The set of registrators as a vector

    === "Polkadot.js API Example"

        ```js
        import { ApiPromise, WsProvider } from '@polkadot/api';

        const main = async () => {
          // Create the API instance
          const api = await ApiPromise.create({
            provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io')
          });

          // Query the registrars
          const registrars = await api.query.identity.registrars();
          
          // Format and log the registrars data
          const formattedRegistrars = registrars.map(reg => {
            if (!reg.isSome) return null;
            const { account, fee, fields } = reg.unwrap();
            return {
              account: account.toString(),
              fee: fee.toHuman(),
              fields: fields.toNumber()
            };
          }).filter(reg => reg !== null);

          console.log('Registrars:', JSON.stringify(formattedRegistrars, null, 2));

          // Disconnect from the API
          await api.disconnect();
        };

        main().catch(console.error);
        ```

??? function "**subsOf**(AccountId20) - returns the sub identities for all accounts or for a given account"

    === "Parameters"

        - `AccountId20` the account to check the sub identities for

    === "Returns"

        The sub identities, if any.

        ```
        Raw subs response: [0,[]]
            Formatted Subs: {
              "deposit": "0",
              "subAccounts": []
            }
            Number of sub accounts: 0
        ```

    === "Polkadot.js API Example"

        ```js
        import { ApiPromise, WsProvider } from '@polkadot/api';

        const main = async () => {
          const api = await ApiPromise.create({
            provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io')
          });

          try {
            const account = 'INSERT_ACCOUNT';
            const subs = await api.query.identity.subsOf(account);
            
            // Log raw response for debugging
            console.log('Raw subs response:', subs.toString());

            if (subs) {
              // The response includes a tuple of [deposit, accounts]
              const [deposit, subAccounts] = subs;
              
              const formattedSubs = {
                deposit: deposit.toHuman(),
                subAccounts: subAccounts.toHuman()
              };

              console.log('Formatted Subs:', JSON.stringify(formattedSubs, null, 2));
              console.log('Number of sub accounts:', subAccounts.length);
            } else {
              console.log('No sub identities found for this account');
            }
          } catch (error) {
            console.error('Error querying sub identities:', error);
          } finally {
            await api.disconnect();
          }
        };

        main().catch(error => {
          console.error('Script error:', error);
          process.exit(1);
        });
        ```

??? function "**superOf**(AccountId20) - returns the super identity of all sub-accounts or for a given sub-account"

    === "Parameters"

        - `AccountId20` - the account to check the super identities of

    === "Returns"

        The super identities, if any.

    === "Polkadot.js API Example"

        ```js
        import { ApiPromise, WsProvider } from '@polkadot/api';

        const main = async () => {
          const api = await ApiPromise.create({
            provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io')
          });

          try {
            const account = 'INSERT_ACCOUNT';
            const superOf = await api.query.identity.superOf(account);
            
            // Log raw response for debugging
            console.log('Raw superOf response:', superOf.toString());

            if (superOf.isSome) {
              // The response includes a tuple of [parentAccount, dataName]
              const [parentAccount, dataName] = superOf.unwrap();
              
              const formattedSuper = {
                parentAccount: parentAccount.toString(),
                dataName: dataName.toHuman()
              };

              console.log('Formatted Super Identity:', JSON.stringify(formattedSuper, null, 2));
            } else {
              console.log('This account is not a sub-identity of any other account');
            }
          } catch (error) {
            console.error('Error querying super identity:', error);
          } finally {
            await api.disconnect();
          }
        };

        main().catch(error => {
          console.error('Script error:', error);
          process.exit(1);
        });
        ```

### Pallet Constants {: #constants }

The Identity Pallet includes the following read-only functions to obtain pallet constants:

??? function "**basicDeposit**() - returns the amount held on deposit for a registered identity"

    === "Parameters"

        None

    === "Polkadot.js API Example"

        ```js
        import { ApiPromise, WsProvider } from '@polkadot/api';

        const main = async () => {
          const api = await ApiPromise.create({
            provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io')
          });

          try {
            // Query the basicDeposit constant
            const basicDeposit = api.consts.identity.basicDeposit;
            
            // Log raw response for debugging
            console.log('Raw basicDeposit response:', basicDeposit.toString());

            // Format the deposit amount
            console.log('Basic Deposit (formatted):', basicDeposit.toHuman());
            
          } catch (error) {
            console.error('Error querying basic deposit:', error);
          } finally {
            await api.disconnect();
          }
        };

        main().catch(error => {
          console.error('Script error:', error);
          process.exit(1);
        });
        ```

    === "Example Response"

        ```bash
        Raw basicDeposit response: 1025800000000000000
        Basic Deposit (formatted): 1,025,800,000,000,000,000
        ```

??? function "**byteDeposit**() - returns the amount held on deposit per additional bytes of data for a registered identity"

    === "Parameters"

        None


    === "Polkadot.js API Example"

        ```js
        import { ApiPromise, WsProvider } from '@polkadot/api';

        const main = async () => {
          const api = await ApiPromise.create({
            provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io')
          });

          try {
            // Query the byteDeposit constant
            const byteDeposit = api.consts.identity.byteDeposit;
            
            // Log raw response for debugging
            console.log('Raw byteDeposit response:', byteDeposit.toString());

            // Format the deposit amount
            console.log('Byte Deposit (formatted):', byteDeposit.toHuman());
            
            } catch (error) {
            console.error('Error querying byte deposit:', error);
          } finally {
            await api.disconnect();
          }
        };

        main().catch(error => {
          console.error('Script error:', error);
          process.exit(1);
        });
        ```

    === "Example Response"
        ```
        Raw byteDeposit response: 100000000000000
        Byte Deposit (formatted): 100,000,000,000,000
        ```

??? function "**maxRegistrars**() - returns the maximum number of registrars allowed in the system"

    === "Parameters"
        None
    === "Returns"
        - `u32` - Maximum number of registrars allowed
    === "Polkadot.js API Example"
        ```js
        import { ApiPromise, WsProvider } from '@polkadot/api';

        const main = async () => {
          const api = await ApiPromise.create({
            provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io')
          });

          try {
            // Query the maxRegistrars constant
            const maxRegistrars = api.consts.identity.maxRegistrars;
            
            // Get the number as a plain integer
            console.log('Max Registrars (number):', maxRegistrars.toNumber());

          } catch (error) {
            console.error('Error querying max registrars:', error);
          } finally {
            await api.disconnect();
          }
        };

        main().catch(error => {
          console.error('Script error:', error);
          process.exit(1);
        });
        ```

??? function "**maxSubAccounts**() - returns the maximum number of sub-accounts allowed per account"

    === "Parameters"
        None
    === "Returns"
        - `u32` - Maximum number of sub-accounts allowed per identity
    === "Polkadot.js API Example"
        ```js
        import { ApiPromise, WsProvider } from '@polkadot/api';

        const main = async () => {
          const api = await ApiPromise.create({
            provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io')
          });

          try {
            const maxSubAccounts = api.consts.identity.maxSubAccounts;
            console.log('Max SubAccounts (number):', maxSubAccounts.toNumber());
          } catch (error) {
            console.error('Error querying max subaccounts:', error);
          } finally {
            await api.disconnect();
          }
        };

        main().catch(error => {
          console.error('Script error:', error);
          process.exit(1);
        });
        ```

??? function "**subAccountDeposit**() - returns the amount held on deposit for a registered sub-account"

    === "Parameters"
        None
    === "Returns"
        - `Balance` - Amount of currency held on deposit for a sub-account
    === "Polkadot.js API Example"
        ```js
        TODO
        ```

??? function "**pendingUsernameExpiration**() - returns the time period for which a username remains pending"

    === "Parameters"
        None
    === "Returns"
        - `BlockNumber` - Number of blocks before a pending username expires
    === "Polkadot.js API Example"
        ```js
        TODO
        ```

??? function "**maxSuffixLength**() - returns the maximum length allowed for a username suffix"

    === "Parameters"
        None
    === "Returns"
        - `u32` - Maximum number of characters allowed in a username suffix
    === "Polkadot.js API Example"
        ```js
        TODO
        ```

??? function "**maxUsernameLength**() - returns the maximum length allowed for a username"
    === "Parameters"
        None
    === "Returns"
        - `u32` - Maximum number of characters allowed in a username
    === "Polkadot.js API Example"
        ```js
        TODO
        ```
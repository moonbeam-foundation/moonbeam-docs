import { ApiPromise, WsProvider } from '@polkadot/api';

// Input data
const originChainProviderWsURL = 'INSERT_ORIGIN_CHAIN_WSS_URL';
const computedOriginAccount = 'INSERT_COMPUTED_ORIGIN_ADDRESS';
const localXC20Address = 'INSERT_LOCAL_XC20_ADDRESS';
const transferAmount = 'INSERT_AMOUNT_TO_TRANSFER';

// Transfer multiassets parameters
const assets = {
  V4: [
    {
      // xcDEV
      id: {
        parents: 1,
        interior: {
          X2: [
            { Parachain: 1000 }, // Parachain ID
            { PalletInstance: 3 }, // Index of the Balances Pallet
          ],
        },
      },
      fun: {
        Fungible: '100000000000000000', // 0.1 DEV as an estimation for XCM and EVM transaction fee
      },
    },
    {
      // Local XC-20 token
      id: {
        parents: 1,
        interior: {
          X3: [
            { Parachain: 1000 }, // Parachain ID
            { PalletInstance: 48 }, // Index of the ERC-20 XCM Bridge Pallet
            {
              AccountKey20: {
                key: localXC20Address,
              },
            },
          ],
        },
      },
      fun: {
        Fungible: transferAmount,
      },
    },
  ],
};
const feeItem = 0;
const destination = {
  V4: {
    parents: 1,
    interior: {
      X2: [
        { Parachain: 1000 },
        { AccountKey20: { key: computedOriginAccount } },
      ],
    },
  },
};
const weightLimit = 'Unlimited';

export const getTransferMultiassetsCall = async () => {
  // Create origin chain API provider
  const originChainProvider = new WsProvider(originChainProviderWsURL);
  const originChainAPI = await ApiPromise.create({
    provider: originChainProvider,
  });

  // Create the transferMultiasset extrinsic
  const transferMultiassets = originChainAPI.tx.xTokens.transferMultiassets(
    assets,
    feeItem,
    destination,
    weightLimit
  );

  originChainAPI.disconnect();

  return transferMultiassets;
};

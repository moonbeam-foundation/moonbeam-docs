const originChainProvider = new WsProvider(ORIGIN_CHAIN_WS_ENDPOINT);
const originChainPolkadotJsAPI = await ApiPromise.create({ provider: originChainProvider });

const xTokensExtrinsic = originChainPolkadotJsAPI.tx.xTokens.transferMultiassets(
  { // assets
    V3: [
      { // xcDEV
        id: {
          Concrete: {
            parents: 1,
            interior: {
              X2: [
                { Parachain: 1000 },
                // 3 on Moonbase Alpha, 10 on MainNet
                { PalletInstance: BALANCE_PALLET },
              ]
            }
          }
        },
        fun: {
          // 0.1 DEV as an estimation for XCM and EVM transaction fees. Can be lowered.
          Fungible: "100000000000000000",
        }
      },
      { // ERC-20 token
        id: {
          Concrete: {
            parents: 1,
            interior: {
              X3: [
                { Parachain: 1000 },
                { PalletInstance: 48 },
                { AccountKey20: { key: ADDRESS_OF_THE_TOKEN_HERE } }
              ]
            }
          }
        },
        fun: {
          Fungible: AMOUNT_OF_TOKEN_YOU_WANT_TO_SEND,
        }
      }
    ]
  },
  0, // feeItem
  { // destination
    V3: {
      parents: 1,
      interior: {
        X2: [
          { Parachain: 1000 },
          { AccountKey20: { key: MLD_ACCOUNT } }
        ]
      }
    }
  },
  'Unlimited' // weight limit
);
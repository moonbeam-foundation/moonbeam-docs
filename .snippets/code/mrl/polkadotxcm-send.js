const txWeight = (await ethereumTx.paymentInfo(MLD_ACCOUNT)).weight;
const xcmExtrinsic = originChainPolkadotJsAPI.tx.polkadotXcm.send(
  { V3: { parents: new BN(1), interior: { X1: { Parachain: 1000 } } } },
  {
    V3: [
      // Withdraw DEV asset (0.06) from the target account
      {
        WithdrawAsset: [
          {
            id: { Concrete: { parents: new BN(0), interior: { X1: { PalletInstance: BALANCE_PALLET } } } },
            fun: { Fungible: new BN("60000000000000000") }
          }
        ]
      },
      // Buy execution with the DEV asset
      {
        BuyExecution: {
          fees:
          {
            id: { Concrete: { parents: new BN(0), interior: { X1: { PalletInstance: 3 } } } },
            fun: { Fungible: new BN("60000000000000000") }
          },
          weightLimit: 'Unlimited'
        }
      },
      {
        Transact: {
          originKind: "SovereignAccount",
          // https://docs.moonbeam.network/builders/interoperability/xcm/remote-evm-calls/#estimate-weight-required-at-most
          requireWeightAtMost: { refTime: txWeight.refTime, proofSize: txWeight.proofSize },
          call: {
            encoded: ethereumTx.method.toHex()
          }
        }
      },
      {
        RefundSurplus: {}
      },
      {
        DepositAsset: {
          // Note that this must be AllCounted and not All, since All has too high of a gas requirement
          assets: { Wild: { AllCounted: 1 } },
          beneficiary: {
            parents: new BN(0),
            interior: { X1: { AccountKey20: { key: MLD_ACCOUNT } } },
          },
        },
      }
    ]
  });
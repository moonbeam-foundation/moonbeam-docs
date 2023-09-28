// Rest of script
// ...

const sendBatchTx = async () => {
  // Rest of sendBatchTx logic
  // ...

  const txWeight = (await transact.paymentInfo(multilocationDerivativeAccount))
    .weight;
  
  const sendXCM = originChainAPI.tx.polkadotXcm.send(
    { V3: { parents: 1, interior: { X1: { Parachain: 1000 } } } },
    {
      V3: [
        {
          // Withdraw DEV asset (0.06) from the target account
          WithdrawAsset: [
            {
              id: {
                Concrete: {
                  parents: 0,
                  interior: { X1: { PalletInstance: 3 } },
                },
              },
              fun: { Fungible: 60000000000000000n },
            },
          ],
        },
        {
          // Buy execution with the DEV asset
          BuyExecution: {
            fees: {
              id: {
                Concrete: {
                  parents: 0,
                  interior: { X1: { PalletInstance: 3 } },
                },
              },
              fun: { Fungible: 60000000000000000n },
            },
            weightLimit: 'Unlimited',
          },
        },
        {
          Transact: {
            originKind: 'SovereignAccount',
            requireWeightAtMost: {
              refTime: txWeight.refTime,
              proofSize: txWeight.proofSize,
            },
            call: {
              encoded: transact.method.toHex(),
            },
          },
        },
        {
          RefundSurplus: {},
        },
        {
          DepositAsset: {
            // Note that this must be AllCounted and not All, since All has too high of a gas requirement
            assets: { Wild: { AllCounted: 1 } },
            beneficiary: {
              parents: 0,
              interior: {
                X1: { AccountKey20: { key: multilocationDerivativeAccount } },
              },
            },
          },
        },
      ],
    }
  );
}

sendBatchTx();

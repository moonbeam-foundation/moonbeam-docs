When DOT is transferred from Polkadot to Moonbeam, the following XCM instructions are executed in sequence:

1. [`TransferReserveAsset`](/builders/interoperability/xcm/core-concepts/instructions/#transfer-reserve-asset){target=_blank} - executes on Polkadot, moving the DOT from the sender and depositing it into Moonbeam’s Sovereign account on Polkadot

2. [`ReserveAssetDeposited`](/builders/interoperability/xcm/core-concepts/instructions/#reserve-asset-deposited){target=_blank} - executes on Moonbeam, minting the corresponding ERC-20 representation of DOT (xcDOT) on Moonbeam

3. [`ClearOrigin`](/builders/interoperability/xcm/core-concepts/instructions/#clear-origin){target=_blank} - executes on Moonbeam, clearing any origin data—previously set to Polkadot’s Sovereign account

4. [`BuyExecution`](/builders/interoperability/xcm/core-concepts/instructions/#buy-execution){target=_blank} - executes on Moonbeam, determining the execution fees. Here, a portion of the newly minted xcDOT is used to pay the cost of XCM

5. [`DepositAsset`](/builders/interoperability/xcm/core-concepts/instructions/#deposit-asset){target=_blank} - executes on Moonbeam, delivering the xcDOT to the intended recipient’s account on Moonbeam
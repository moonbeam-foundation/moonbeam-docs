For example, to move DOT to Moonbeam, the following XCM instructions are used:

1. [`TransferReserveAsset`](/builders/interoperability/xcm/core-concepts/instructions#transfer-reserve-asset){target=_blank} - executed in Polkadot. Assets are transferred from the origin account and deposited into Moonbeam's Sovereign account on Polkadot
2. [`ReserveAssetDeposited`](/builders/interoperability/xcm/core-concepts/instructions#reserve-asset-deposited){target=_blank} - executed in Moonbeam. Mints the DOT representation on Moonbeam, called xcDOT
3. [`ClearOrigin`](/builders/interoperability/xcm/core-concepts/instructions#clear-origin){target=_blank} - executed in Moonbeam. Clears origin information, which was Polkadot's Sovereign account on Moonbeam
4. [`BuyExecution`](/builders/interoperability/xcm/core-concepts/instructions#buy-execution){target=_blank} - executed in Moonbeam. As such, execution fees are determined by Moonbeam. In this particular scenario, part of the minted xcDOT is used to pay for XCM execution
5. [`DepositAsset`](/builders/interoperability/xcm/core-concepts/instructions#deposit-asset){target=_blank} - executed in Moonbeam. Ultimately, it sends assets to a destination account on Moonbeam

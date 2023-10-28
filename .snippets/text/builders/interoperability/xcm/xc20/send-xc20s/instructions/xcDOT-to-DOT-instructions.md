To move xcDOT from Moonbeam back to Polkadot, the instructions that are used are:

1. [`WithdrawAsset`](/builders/interoperability/xcm/core-concepts/instructions#withdraw-asset){target=_blank} - gets executed in Moonbeam
2. [`InitiateReserveWithdraw`](/builders/interoperability/xcm/core-concepts/instructions#initiate-reserve-withdraw){target=_blank} - gets executed in Moonbeam
3. [`WithdrawAsset`](/builders/interoperability/xcm/core-concepts/instructions#withdraw-asset){target=_blank} - gets executed in Polkadot
4. [`ClearOrigin`](/builders/interoperability/xcm/core-concepts/instructions#clear-origin){target=_blank} - gets executed in Polkadot
5. [`BuyExecution`](/builders/interoperability/xcm/core-concepts/instructions#buy-execution){target=_blank} - gets executed in Polkadot. As such, execution fees are determined by Polkadot
6. [`DepositAsset`](/builders/interoperability/xcm/core-concepts/instructions#deposit-asset){target=_blank} - gets executed in Polkadot. Ultimately, it sends assets to a destination account on Polkadot

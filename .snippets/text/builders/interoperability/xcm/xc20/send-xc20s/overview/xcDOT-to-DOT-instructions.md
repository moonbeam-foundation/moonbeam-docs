To move xcDOT from Moonbeam back to Polkadot, the instructions that are used are:

1. [`WithdrawAsset`](/builders/interoperability/xcm/core-concepts/instructions#withdraw-asset){target=_blank} - gets executed in Moonbeam. Takes the funds from the sender
2. [`InitiateReserveWithdraw`](/builders/interoperability/xcm/core-concepts/instructions#initiate-reserve-withdraw){target=_blank} - gets executed in Moonbeam. Burns the funds while sending an XCM message to the destination chain to execute the remainder of the token transfer
3. [`WithdrawAsset`](/builders/interoperability/xcm/core-concepts/instructions#withdraw-asset){target=_blank} - gets executed in Polkadot. Takes the funds from Moonbeam's Sovereign account on Polkadot
4. [`ClearOrigin`](/builders/interoperability/xcm/core-concepts/instructions#clear-origin){target=_blank} - gets executed in Polkadot. Clears origin information, which was Moonbeam's Sovereign account on Moonbeam
5. [`BuyExecution`](/builders/interoperability/xcm/core-concepts/instructions#buy-execution){target=_blank} - gets executed in Polkadot. As such, Polkadot determines the execution fees. In this scenario, part of the DOTs being sent are used to pay for the execution of the XCM
6. [`DepositAsset`](/builders/interoperability/xcm/core-concepts/instructions#deposit-asset){target=_blank} - gets executed in Polkadot. Ultimately, it sends assets to a destination account on Polkadot

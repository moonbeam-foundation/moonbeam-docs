In scenarios where you want to move an asset back to its reserve chain, such as sending xcDOT from Moonbeam to Polkadot, Moonbeam uses the following set of XCM instructions:

1. [`WithdrawAsset`](/builders/interoperability/xcm/core-concepts/instructions/#withdraw-asset){target=_blank} – Executes on Moonbeam, taking the specified token (xcDOT) from the sender

2. [`InitiateReserveWithdraw`](/builders/interoperability/xcm/core-concepts/instructions/#initiate-reserve-withdraw){target=_blank} – Executes on Moonbeam, which, burns the token on Moonbeam (removing the wrapped representation), and sends an XCM message to Polkadot, indicating the tokens should be released there 

3. [`WithdrawAsset`](/builders/interoperability/xcm/core-concepts/instructions/#withdraw-asset){target=_blank} – Executes on Polkadot, removing the tokens from Moonbeam’s Sovereign account on Polkadot

4. [`ClearOrigin`](/builders/interoperability/xcm/core-concepts/instructions/#clear-origin){target=_blank} – Gets executed on Polkadot. Clears any origin data (e.g., the Sovereign account on Moonbeam)

5. [`BuyExecution`](/builders/interoperability/xcm/core-concepts/instructions/#buy-execution){target=_blank} – Polkadot determines the execution fees and uses part of the DOT being transferred to pay for them

6. [`DepositAsset`](/builders/interoperability/xcm/core-concepts/instructions/#deposit-asset){target=_blank} – Finally, the native DOT tokens are deposited into the specified Polkadot account

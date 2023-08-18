async function batchApproveTransferEVMTx(moonbeamAPI) {
  // Get Batch, IERC20, ITokenBridge contracts
  const Batch = new ethers.utils.Interface(abi.Batch);
  const WrappedFTM = new ethers.utils.Interface(abi.IERC20);
  // https://github.com/wormhole-foundation/example-token-bridge-relayer/blob/main/evm/src/token-bridge-relayer/TokenBridgeRelayer.sol
  const TokenRelayer = new ethers.Contract(
    XLABS_RELAYER_ADDRESS,
    abi.TokenRelayer,
    new providers.JsonRpcProvider('https://moonbase-alpha.public.blastapi.io')
  );

  // Create approve contract calls & batch them
  const approveTx = WrappedFTM.encodeFunctionData("approve", [XLABS_RELAYER_ADDRESS, AMOUNT_OF_TOKEN_YOU_WANT_TO_SEND]);

  // Print out the relayer fee. If we're sending too little tokens, the transaction will fail.
  const relayerFee = await TokenRelayer.calculateRelayerFee(YOUR_DESTINATION_CHAIN_ID, ADDRESS_OF_THE_TOKEN_HERE, 18);
  console.log(`The relayer fee for this token will be ${relayerFee}.`);

  // Create a transferTokensWithRelay transaction. Use wrapAndTransferEthWithRelay if the token is GLMR
  const transferTx = TokenRelayer.interface.encodeFunctionData("transferTokensWithRelay", [
    ADDRESS_OF_THE_TOKEN_HERE,
    AMOUNT_OF_TOKEN_YOU_WANT_TO_SEND,
    0,
    YOUR_DESTINATION_CHAIN_ID, // Target chain, like Ethereum MainNet or Fantom
    '0x0000000000000000000000000' + YOUR_TARGET_RECIPIENT_ADDRESS_WITHOUT_0x,
    0 // batchId
  ]);

  const batchTx = Batch.encodeFunctionData('batchAll', [
    [ADDRESS_OF_THE_TOKEN_HERE, XLABS_RELAYER_ADDRESS],
    [0, 0],
    [approveTx, transferTx],
    []
  ]);

  // Create the ethereumXCM extrinsic that uses the batch precompile
  const batchXCMTx = moonbeamAPI.tx.ethereumXcm.transact({
    V1: {
      gasLimit: new BN(350000),
      feePayment: 'Auto',
      action: {
        Call: BATCH_PRECOMPILE_ADDRESS
      },
      value: new BN(0),
      input: batchTx
    }
  });

  return batchXCMTx;
}
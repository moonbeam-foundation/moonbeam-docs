const estimateGasUsed = 400000;
const gasFee = await axelarSDK.estimateGasFee(
  ORIGIN_CHAIN,
  DESTINATION_CHAIN,
  GasToken.GLMR,
  estimateGasUsed
);
const gasFeeToHuman = ethers.utils.formatEther(ethers.BigNumber.from(gasFee));
console.log(`Cross-Chain Gas Fee: ${gasFee} Wei / ${gasFeeToHuman} Ether`);

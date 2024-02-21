const sdk = new AxelarGMPRecoveryAPI({
	environment: Environment.TESTNET,
});
const txStatus = await axelarSDK.queryTransactionStatus(txHash);
console.log(txStatus);
const MOONBASE_WDEV_ADDRESS = await gateway.tokenAddresses('WDEV');

// Wrap + Approve WDEV to be used by the NFT contract
// wrap => transfer to contract => contract transfers to Gateway
const wDEVPayment = ethers.utils.parseUnits('0.13', 'ether');
const wDEV = await ethers.getContractAt('WETH9', MOONBASE_WDEV_ADDRESS);

const wrapTx = await wDEV.deposit({ value: wDEVPayment });
console.log('Wrap transaction hash: ', wrapTx.hash);

const approveTx = await wDEV.approve(ORIGIN_CHAIN_ADDRESS, wDEVPayment);
console.log('Approve transaction hash: ', approveTx.hash);

console.log('Awaiting transaction confirmations...');
await ethers.provider.waitForTransaction(approveTx.hash, 1);

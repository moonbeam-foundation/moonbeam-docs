const simpleDexAddress = 'INSERT_ADDRESS_OF_DEX';

async function checkBalances(demoToken) {
  // Get the signer
  const signers = await ethers.getSigners();
  const signer = signers[0];
  const signerAddress = signer.address;

  // Get the balance of the DEX and print it
  const dexBalance = ethers.formatEther(
    await demoToken.balanceOf(simpleDexAddress)
  );
  console.log(`Dex ${simpleDexAddress} has a balance of: ${dexBalance} DTOKs`);

  // Get the balance of the signer and print it
  const signerBalance = ethers.formatEther(
    await demoToken.balanceOf(signer)
  );
  console.log(`Account ${signerAddress} has a balance of: ${signerBalance} DTOKs`);
}

async function main() {
  // Create instance of SimpleDex.sol
  const simpleDex = await ethers.getContractAt('SimpleDex', simpleDexAddress);

  // Create instance of DemoToken.sol
  const demoTokenAddress = await simpleDex.token();
  const demoToken = await ethers.getContractAt('DemoToken', demoTokenAddress);

  // Create instance of Batch.sol
  const batchAddress = '0x0000000000000000000000000000000000000808';
  const batch = await ethers.getContractAt('Batch', batchAddress);

  // Parse the value to swap to Wei
  const amountDtok = ethers.parseEther('INSERT_AMOUNT_OF_DEV_TO_SWAP');

  // Get the encoded call data for the approval and swap
  const approvalCallData = demoToken.interface.encodeFunctionData('approve', [
    simpleDexAddress,
    amountDtok,
  ]);
  const swapCallData = simpleDex.interface.encodeFunctionData(
    'swapDemoTokenForDev',
    [amountDtok]
  );

  const batchAll = await batch.batchAll(
    [demoTokenAddress, simpleDexAddress], // to address
    [], // value of the native token to send
    [approvalCallData, swapCallData], // call data
    [] // gas limit
  );
  await batchAll.wait();
  console.log(`Approve and swap demo tokens for dev tokens: ${batchAll.hash}`);

  // Check balances after the swap
  await checkBalances(demoToken);
}
main();

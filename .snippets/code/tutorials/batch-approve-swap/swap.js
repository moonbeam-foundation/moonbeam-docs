const simpleDexAddress = "INSERT-ADDRESS-OF-DEX";

async function checkBalances(demoToken) {
  // Get the signer
  const signer = (await ethers.getSigner()).address;
  
  // Get the balance of the DEX and print it
  const dexBalance = ethers.utils.formatEther(
    await demoToken.balanceOf(simpleDexAddress)
  );
  console.log(`Dex ${simpleDexAddress} has a balance of: ${dexBalance} DTOKs`);
  
  // Get the balance of the signer and print it
  const signerBalance = ethers.utils.formatEther(
    await demoToken.balanceOf(signer)
  );
  console.log(
    `Account ${signer} has a balance of: ${signerBalance} DTOKs`
  );
}

async function main() {
  // Create instance of SimpleDex.sol
  const simpleDex = await ethers.getContractAt(
    "SimpleDex",
    simpleDexAddress
  );

  // Create instance of DemoToken.sol
  const demoTokenAddress = await simpleDex.token();
  const demoToken = await ethers.getContractAt(
    "DemoToken",
    demoTokenAddress
  );

  // Create instance of Batch.sol
  const batchAddress = "{{ networks.moonbase.precompiles.batch }}";
  const batch = await ethers.getContractAt("Batch", batchAddress);

  // Swap DEV for DTOKs and print the transaction hash
  const amountDev = ethers.utils.parseEther( "INSERT-AMOUNT-OF-DEV-TO-SWAP")
  const swapDevForDemoToken = await simpleDex.swapDevForDemoToken({
    amountDev
  });
  await swapDevForDemoToken.wait();
  console.log(`Swapped dev for demo tokens: ${swapDevForDemoToken.hash}`);
  
  // Check balances after the swap
  await checkBalances(demoToken);


  // Parse the value to swap to Wei
  const amountDtok = ethers.utils.parseEther( "INSERT-AMOUNT-DtokOF-DEV-TO-SWAP")

  // Get the encoded call data for the approval and swap
  const approvalCallData = demoToken.interface.encodeFunctionData("approve", [
    simpleDexAddress,
    amountDtok,
  ]);
  const swapCallData = simpleDex.interface.encodeFunctionData(
    "swapDemoTokenForDev",
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
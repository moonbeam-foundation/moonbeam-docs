// Consumes a workflow for execution
async handleWorkflow(
  workflow: Workflow,
  providers: Providers,
  execute: ActionExecutor
): Promise<void> {
  this.logger.info(`Workflow ${workflow.id} received...`);

  const { vaa } = this.parseWorkflowPayload(workflow);
  const parsed = wh.parseVaa(vaa);
  this.logger.info(`Parsed VAA. seq: ${parsed.sequence}`);

  // Here we are parsing the payload so that we can send it to the right recipient
  const hexPayload = parsed.payload.toString('hex');
  let [recipient, destID, sender, message] =
    ethers.utils.defaultAbiCoder.decode(
      ['bytes32', 'uint16', 'bytes32', 'string'],
      '0x' + hexPayload
    );
  recipient = this.formatAddress(recipient);
  sender = this.formatAddress(sender);
  const destChainID = destID as ChainId;
  this.logger.info(
    `VAA: ${sender} sent "${message}" to ${recipient} on chain ${destID}.`
  );

  // Execution logic
  if (wh.isEVMChain(destChainID)) {
    // This is where you do all of the EVM execution.
    // Add your own private wallet for the executor to inject in 
    // relayer-engine-config/executor.json
    await execute.onEVM({
      chainId: destChainID,
      f: async (wallet, chainId) => {
        const contract = new ethers.Contract(recipient, abi, wallet.wallet);
        const result = await contract.processMyMessage(vaa);
        this.logger.info(result);
      },
    });
  } else {
    // The relayer plugin has a built-in Solana wallet handler, which you could use
    // here. NEAR & Algorand are supported by Wormhole, but they're not supported by
    // the relayer plugin. If you want to interact with NEAR or Algorand you'd have
    // to make your own wallet management system, that's all
    this.logger.error(
      'Requested chainID is not an EVM chain, which is currently unsupported.'
    );
  }
};

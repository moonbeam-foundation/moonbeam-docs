await execute.onEVM({
  chainId: destChainID,
  f: async (wallet, chainId) => {
    const contract = new ethers.Contract(recipient, abi, wallet.wallet);
    const result = await contract.processMyMessage(vaa);
    this.logger.info(result);
  },
});

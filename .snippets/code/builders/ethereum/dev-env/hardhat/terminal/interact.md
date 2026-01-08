<div id="termynal" data-termynal>
    <span data-ty="input">npx hardhat console --network moonbase</span>
    <br>
    <span data-ty>Welcome to Node.js v22.10.0.</span>
    <span data-ty>Type ".help" for more information.</span>
    <span data-ty="input" data-ty-prompt=">"> const Box = await ethers.getContractFactory('Box');</span>
    <span data-ty>undefined</span>
    <br>
    <span data-ty="input" data-ty-prompt=">"> const box = await Box.attach('0xfBD78CE8C9E1169851119754C4Ea2f70AB159289');</span>
    <span data-ty>undefined</span>
    <br>
    <span data-ty="input" data-ty-prompt=">"> await box.store(5);</span>
    <span data-ty>ContractTransactionResponse {<br>
      provider: HardhatEthersProvider { ... },<br>
      blockNumber: null,<br>
      blockHash: null,<br>
      index: undefined,<br>
      hash: '0x1c49a64a601fc5dd184f0a368a91130cb49203ec0f533c6fcf20445c68e20264',<br>
      type: 2,<br>
      to: '0xa84caB60db6541573a091e5C622fB79e175E17be',<br>
      from: '0x3B939FeaD1557C741Ff06492FD0127bd287A421e',<br>
      nonce: 87,<br>
      gasLimit: 45881n,<br>
      gasPrice: 1107421875n,<br>
      maxPriorityFeePerGas: 1n,<br>
      maxFeePerGas: 1107421875n,<br>
      data: '0x6057361d0000000000000000000000000000000000000000000000000000000000000005',<br>
      value: 0n,<br>
      chainId: 5678n,<br>
      signature: Signature { r: "0x9233b9cc4ae6879b7e08b9f1a4bfb175c8216eee0099966eca4a305c7f369ecc", s: "0x7663688633006b5a449d02cb08311569fadf2f9696bd7fe65417860a3b5fc57d", yParity: 0, networkV: null },<br>
      accessList: [],<br>
      blobVersionedHashes: null<br>}</span>
    <span data-ty="input" data-ty-prompt=">"> await box.retrieve();</span>
    <span data-ty>5n</span>
    <br>
</div>

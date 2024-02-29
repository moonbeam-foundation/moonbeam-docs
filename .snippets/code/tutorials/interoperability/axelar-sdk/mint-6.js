// Begin the minting
const mintRes = await nft.mintXCNFT(
  DESTINATION_CHAIN_ADDRESS,
  DESTINATION_CHAIN,
  wDEVPayment,
  { value: gasFee }
);
console.log('Minting transaction hash: ', mintRes.hash);

// Retrieve the chain name
const chain = await api.rpc.system.chain();

// Retrieve the latest header
const lastHeader = await api.rpc.chain.getHeader();

// Log the information
console.log(
  `${chain}: last block #${lastHeader.number} has hash ${lastHeader.hash}`
);

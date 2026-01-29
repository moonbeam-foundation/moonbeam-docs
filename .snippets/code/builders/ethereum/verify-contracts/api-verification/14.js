// Submit Contract Source Code and Metadata for Verification
const response = await axios.post('https://sourcify.dev/server/verify', {
  address: 'INSERT_CONTRACT_ADDRESS',
  chain: {{ networks.moonbeam.chain_id }}, // chain ID of Moonbeam
  files: {
    'metadata-1.json': 'INSERT_JSON_FILE', // metadata file for contract file 1
    'metadata-2.json': 'INSERT_JSON_FILE', // metadata file for contract file 2
    'file1-name.sol': 'INSERT_SOL_FILE', // contract source file 1
    'file2-name.sol': 'INSERT_SOL_FILE', // contract source file 2
    //...
  },
  chosenContract: 1, // (optional) index of the contract, if the provided files contain multiple metadata files
});

if (result.status == 'perfect') {
  // perfect match
  console.log(result.status + ';' + result.address);
} else if (result.status == 'partial') {
  // partial match
  console.log(result.status + ';' + result.address);
} else {
  // non-matching
  console.log(result.status + ';' + result.address);
}

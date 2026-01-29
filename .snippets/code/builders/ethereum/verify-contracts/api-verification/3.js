// Submit Source Code for Verification
const response = await axios.post(
  'https://api-moonbase.moonscan.io/api', 
  {
    apikey: 'INSERT_API_KEY',
    module: 'contract',
    action: 'verifysourcecode',
    contractAddress: 'INSERT_CONTRACT_ADDRESS',
    sourceCode: 'INSERT_SOURCE_CODE', // flattened if necessary
    codeformat: 'solidity-single-file', // or you can use "solidity-standard-json-input"
    contractname: 'INSERT_CONTRACT_NAME', // if codeformat = solidity-standard-json-input, then enter contractname as ex: erc20.sol:erc20
    compilerversion: 'INSERT_COMPILER_VERSION', // see https://etherscan.io/solcversions for list of support versions
    optimizationUsed: 0, // 0 = no optimization, 1 = optimization was used (applicable when codeformat=solidity-single-file)
    runs: 200, // set to 200 as default unless otherwise (applicable when codeformat=solidity-single-file)
    constructorArguments: 'INSERT_CONSTRUCTOR_ARGUMENTS', // if applicable
    evmversion: 'INSERT_EVM_VERSION', // options: homestead, tangerineWhistle, spuriousDragon, byzantium, constantinople, petersburg, istanbul (applicable when codeformat=solidity-single-file)
    licenseType: 1, // valid codes 1-14 where 1=No License ... 14=Business Source License 1.1, see https://etherscan.io/contract-license-types
    libraryname1: 'INSERT_LIBRARY_NAME', // if applicable, enter the name of the first library used, i.e. SafeMath (up to 10 libraries can be used)
    libraryaddress1: 'INSERT_LIBRARY_ADDRESS', // if applicable, enter the address of the first library used
    libraryname2: 'INSERT_LIBRARY_NAME', // if applicable, enter the name of the second library used
    libraryaddress2: 'INSERT_LIBRARY_ADDRESS', // if applicable, enter the address of the second library used
    // ...
  },
  { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
);

if (response.data.status == '1') {
  // 1 = submission success, use the guid returned (response.data.result) to check the status of your submission
  // average time of processing is 30-60 seconds
  console.log(
    response.data.status +
      '; ' +
      response.data.message +
      '; ' +
      response.data.result
  );
  // response.data.result is the GUID receipt for the submission, you can use this guid for checking the verification status
} else {
  // 0 = error
  console.log(
    response.data.status +
      '; ' +
      response.data.message +
      '; ' +
      response.data.result
  );
}

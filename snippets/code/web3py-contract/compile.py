import solcx

# If you haven't already installed the Solidity compiler, uncomment the following line
# solcx.install_solc()

# Compile contract
temp_file = solcx.compile_files('Incrementer.sol')

# Export contract data
abi = temp_file['Incrementer.sol:Incrementer']['abi']
bytecode = temp_file['Incrementer.sol:Incrementer']['bin']

import solcx

# Install Solidity Compiler
solcx.install_solc()

# Compile Contract
temp_file = solcx.compile_files('Incrementer.sol')

# Export Contract Data
abi = temp_file['Incrementer.sol:Incrementer']['abi']
bytecode = temp_file['Incrementer.sol:Incrementer']['bin']

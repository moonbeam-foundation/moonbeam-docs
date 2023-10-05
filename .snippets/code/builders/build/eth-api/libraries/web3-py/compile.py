# 1. Import solcx
import solcx

# 2. If you haven't already installed the Solidity compiler, uncomment the following line
# solcx.install_solc()

# 3. Compile contract
temp_file = solcx.compile_files(
    'Incrementer.sol',
    output_values=['abi', 'bin'],
    # solc_version='0.8.19'
)

# 4. Export contract data
abi = temp_file['Incrementer.sol:Incrementer']['abi']
bytecode = temp_file['Incrementer.sol:Incrementer']['bin']

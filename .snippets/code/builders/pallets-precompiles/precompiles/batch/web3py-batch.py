# Import the ABI and bytecode
from compile import abi, bytecode

# Create contract instance
your_contract = web3.eth.contract(abi=abi, bytecode=bytecode)

# Encode the contract call
call_data = your_contract.encodeABI(
    fn_name="INSERT_FUNCTION_NAME", args=["INSERT_INPUT_1", "INSERT_INPUT_2", ...]
)

from ape import Contract, accounts


def main():
    account = accounts.load("alice")
    box = Contract("INSERT_CONTRACT_ADDRESS")
    store = box.store(4, sender=account)
    print("Transaction hash for updating the stored value:", store.txn_hash)

    retrieve = box.retrieve()
    print("Stored value:", retrieve)

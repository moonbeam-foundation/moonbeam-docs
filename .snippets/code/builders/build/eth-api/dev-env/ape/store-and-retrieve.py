# scripts/store-and-retrieve.py
from ape import Contract, accounts


def main():
    account = accounts.load("alice")
    box = Contract("0x68039277300E8B104dDf848029dCA04C2EFe8610")
    store = box.store(4, sender=account)
    print("Transaction hash for updating the stored value:", store.txn_hash)

    retrieve = box.retrieve()
    print("Stored value:", retrieve)

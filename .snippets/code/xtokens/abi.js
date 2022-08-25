export default [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "currency_address",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "components": [
                    {
                        "internalType": "uint8",
                        "name": "parents",
                        "type": "uint8"
                    },
                    {
                        "internalType": "bytes[]",
                        "name": "interior",
                        "type": "bytes[]"
                    }
                ],
                "internalType": "struct Xtokens.Multilocation",
                "name": "destination",
                "type": "tuple"
            },
            {
                "internalType": "uint64",
                "name": "weight",
                "type": "uint64"
            }
        ],
        "name": "transfer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "components": [
                            {
                                "internalType": "uint8",
                                "name": "parents",
                                "type": "uint8"
                            },
                            {
                                "internalType": "bytes[]",
                                "name": "interior",
                                "type": "bytes[]"
                            }
                        ],
                        "internalType": "struct Xtokens.Multilocation",
                        "name": "location",
                        "type": "tuple"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct Xtokens.MultiAsset[]",
                "name": "assets",
                "type": "tuple[]"
            },
            {
                "internalType": "uint32",
                "name": "fee_item",
                "type": "uint32"
            },
            {
                "components": [
                    {
                        "internalType": "uint8",
                        "name": "parents",
                        "type": "uint8"
                    },
                    {
                        "internalType": "bytes[]",
                        "name": "interior",
                        "type": "bytes[]"
                    }
                ],
                "internalType": "struct Xtokens.Multilocation",
                "name": "destination",
                "type": "tuple"
            },
            {
                "internalType": "uint64",
                "name": "weight",
                "type": "uint64"
            }
        ],
        "name": "transfer_multi_assets",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "currency_address",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct Xtokens.Currency[]",
                "name": "currencies",
                "type": "tuple[]"
            },
            {
                "internalType": "uint32",
                "name": "fee_item",
                "type": "uint32"
            },
            {
                "components": [
                    {
                        "internalType": "uint8",
                        "name": "parents",
                        "type": "uint8"
                    },
                    {
                        "internalType": "bytes[]",
                        "name": "interior",
                        "type": "bytes[]"
                    }
                ],
                "internalType": "struct Xtokens.Multilocation",
                "name": "destination",
                "type": "tuple"
            },
            {
                "internalType": "uint64",
                "name": "weight",
                "type": "uint64"
            }
        ],
        "name": "transfer_multi_currencies",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "uint8",
                        "name": "parents",
                        "type": "uint8"
                    },
                    {
                        "internalType": "bytes[]",
                        "name": "interior",
                        "type": "bytes[]"
                    }
                ],
                "internalType": "struct Xtokens.Multilocation",
                "name": "asset",
                "type": "tuple"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "components": [
                    {
                        "internalType": "uint8",
                        "name": "parents",
                        "type": "uint8"
                    },
                    {
                        "internalType": "bytes[]",
                        "name": "interior",
                        "type": "bytes[]"
                    }
                ],
                "internalType": "struct Xtokens.Multilocation",
                "name": "destination",
                "type": "tuple"
            },
            {
                "internalType": "uint64",
                "name": "weight",
                "type": "uint64"
            }
        ],
        "name": "transfer_multiasset",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "uint8",
                        "name": "parents",
                        "type": "uint8"
                    },
                    {
                        "internalType": "bytes[]",
                        "name": "interior",
                        "type": "bytes[]"
                    }
                ],
                "internalType": "struct Xtokens.Multilocation",
                "name": "asset",
                "type": "tuple"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "fee",
                "type": "uint256"
            },
            {
                "components": [
                    {
                        "internalType": "uint8",
                        "name": "parents",
                        "type": "uint8"
                    },
                    {
                        "internalType": "bytes[]",
                        "name": "interior",
                        "type": "bytes[]"
                    }
                ],
                "internalType": "struct Xtokens.Multilocation",
                "name": "destination",
                "type": "tuple"
            },
            {
                "internalType": "uint64",
                "name": "weight",
                "type": "uint64"
            }
        ],
        "name": "transfer_multiasset_with_fee",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "currency_address",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "fee",
                "type": "uint256"
            },
            {
                "components": [
                    {
                        "internalType": "uint8",
                        "name": "parents",
                        "type": "uint8"
                    },
                    {
                        "internalType": "bytes[]",
                        "name": "interior",
                        "type": "bytes[]"
                    }
                ],
                "internalType": "struct Xtokens.Multilocation",
                "name": "destination",
                "type": "tuple"
            },
            {
                "internalType": "uint64",
                "name": "weight",
                "type": "uint64"
            }
        ],
        "name": "transfer_with_fee",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
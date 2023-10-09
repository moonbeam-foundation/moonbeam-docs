export default [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "currencyAddress",
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
                "name": "feeItem",
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
        "name": "transferMultiAssets",
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
                        "name": "currencyAddress",
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
                "name": "feeItem",
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
        "name": "transferMultiCurrencies",
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
        "name": "transferMultiasset",
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
        "name": "transferMultiassetWithFee",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "currencyAddress",
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
        "name": "transferWithFee",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
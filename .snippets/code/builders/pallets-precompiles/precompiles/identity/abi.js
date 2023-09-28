[
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "who",
				"type": "address"
			}
		],
		"name": "IdentityCleared",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "who",
				"type": "address"
			}
		],
		"name": "IdentitySet",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "target",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint32",
				"name": "registrarIndex",
				"type": "uint32"
			}
		],
		"name": "JudgementGiven",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "who",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint32",
				"name": "registrarIndex",
				"type": "uint32"
			}
		],
		"name": "JudgementRequested",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "who",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint32",
				"name": "registrarIndex",
				"type": "uint32"
			}
		],
		"name": "JudgementUnrequested",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sub",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "main",
				"type": "address"
			}
		],
		"name": "SubIdentityAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sub",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "main",
				"type": "address"
			}
		],
		"name": "SubIdentityRemoved",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sub",
				"type": "address"
			}
		],
		"name": "SubIdentityRevoked",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sub",
				"type": "address"
			},
			{
				"components": [
					{
						"internalType": "bool",
						"name": "hasData",
						"type": "bool"
					},
					{
						"internalType": "bytes",
						"name": "value",
						"type": "bytes"
					}
				],
				"internalType": "struct Identity.Data",
				"name": "data",
				"type": "tuple"
			}
		],
		"name": "addSub",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "regIndex",
				"type": "uint32"
			}
		],
		"name": "cancelRequest",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "clearIdentity",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "who",
				"type": "address"
			}
		],
		"name": "identity",
		"outputs": [
			{
				"components": [
					{
						"internalType": "bool",
						"name": "isValid",
						"type": "bool"
					},
					{
						"components": [
							{
								"internalType": "uint32",
								"name": "registrarIndex",
								"type": "uint32"
							},
							{
								"components": [
									{
										"internalType": "bool",
										"name": "isUnknown",
										"type": "bool"
									},
									{
										"internalType": "bool",
										"name": "isFeePaid",
										"type": "bool"
									},
									{
										"internalType": "uint256",
										"name": "feePaidDeposit",
										"type": "uint256"
									},
									{
										"internalType": "bool",
										"name": "isReasonable",
										"type": "bool"
									},
									{
										"internalType": "bool",
										"name": "isKnownGood",
										"type": "bool"
									},
									{
										"internalType": "bool",
										"name": "isOutOfDate",
										"type": "bool"
									},
									{
										"internalType": "bool",
										"name": "isLowQuality",
										"type": "bool"
									},
									{
										"internalType": "bool",
										"name": "isErroneous",
										"type": "bool"
									}
								],
								"internalType": "struct Identity.Judgement",
								"name": "judgement",
								"type": "tuple"
							}
						],
						"internalType": "struct Identity.JudgementInfo[]",
						"name": "judgements",
						"type": "tuple[]"
					},
					{
						"internalType": "uint256",
						"name": "deposit",
						"type": "uint256"
					},
					{
						"components": [
							{
								"components": [
									{
										"components": [
											{
												"internalType": "bool",
												"name": "hasData",
												"type": "bool"
											},
											{
												"internalType": "bytes",
												"name": "value",
												"type": "bytes"
											}
										],
										"internalType": "struct Identity.Data",
										"name": "key",
										"type": "tuple"
									},
									{
										"components": [
											{
												"internalType": "bool",
												"name": "hasData",
												"type": "bool"
											},
											{
												"internalType": "bytes",
												"name": "value",
												"type": "bytes"
											}
										],
										"internalType": "struct Identity.Data",
										"name": "value",
										"type": "tuple"
									}
								],
								"internalType": "struct Identity.Additional[]",
								"name": "additional",
								"type": "tuple[]"
							},
							{
								"components": [
									{
										"internalType": "bool",
										"name": "hasData",
										"type": "bool"
									},
									{
										"internalType": "bytes",
										"name": "value",
										"type": "bytes"
									}
								],
								"internalType": "struct Identity.Data",
								"name": "display",
								"type": "tuple"
							},
							{
								"components": [
									{
										"internalType": "bool",
										"name": "hasData",
										"type": "bool"
									},
									{
										"internalType": "bytes",
										"name": "value",
										"type": "bytes"
									}
								],
								"internalType": "struct Identity.Data",
								"name": "legal",
								"type": "tuple"
							},
							{
								"components": [
									{
										"internalType": "bool",
										"name": "hasData",
										"type": "bool"
									},
									{
										"internalType": "bytes",
										"name": "value",
										"type": "bytes"
									}
								],
								"internalType": "struct Identity.Data",
								"name": "web",
								"type": "tuple"
							},
							{
								"components": [
									{
										"internalType": "bool",
										"name": "hasData",
										"type": "bool"
									},
									{
										"internalType": "bytes",
										"name": "value",
										"type": "bytes"
									}
								],
								"internalType": "struct Identity.Data",
								"name": "riot",
								"type": "tuple"
							},
							{
								"components": [
									{
										"internalType": "bool",
										"name": "hasData",
										"type": "bool"
									},
									{
										"internalType": "bytes",
										"name": "value",
										"type": "bytes"
									}
								],
								"internalType": "struct Identity.Data",
								"name": "email",
								"type": "tuple"
							},
							{
								"internalType": "bool",
								"name": "hasPgpFingerprint",
								"type": "bool"
							},
							{
								"internalType": "bytes",
								"name": "pgpFingerprint",
								"type": "bytes"
							},
							{
								"components": [
									{
										"internalType": "bool",
										"name": "hasData",
										"type": "bool"
									},
									{
										"internalType": "bytes",
										"name": "value",
										"type": "bytes"
									}
								],
								"internalType": "struct Identity.Data",
								"name": "image",
								"type": "tuple"
							},
							{
								"components": [
									{
										"internalType": "bool",
										"name": "hasData",
										"type": "bool"
									},
									{
										"internalType": "bytes",
										"name": "value",
										"type": "bytes"
									}
								],
								"internalType": "struct Identity.Data",
								"name": "twitter",
								"type": "tuple"
							}
						],
						"internalType": "struct Identity.IdentityInfo",
						"name": "info",
						"type": "tuple"
					}
				],
				"internalType": "struct Identity.Registration",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "regIndex",
				"type": "uint32"
			},
			{
				"internalType": "address",
				"name": "target",
				"type": "address"
			},
			{
				"components": [
					{
						"internalType": "bool",
						"name": "isUnknown",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "isFeePaid",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "feePaidDeposit",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "isReasonable",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "isKnownGood",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "isOutOfDate",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "isLowQuality",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "isErroneous",
						"type": "bool"
					}
				],
				"internalType": "struct Identity.Judgement",
				"name": "judgement",
				"type": "tuple"
			},
			{
				"internalType": "bytes32",
				"name": "identity",
				"type": "bytes32"
			}
		],
		"name": "provideJudgement",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "quitSub",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "registrars",
		"outputs": [
			{
				"components": [
					{
						"internalType": "bool",
						"name": "isValid",
						"type": "bool"
					},
					{
						"internalType": "uint32",
						"name": "index",
						"type": "uint32"
					},
					{
						"internalType": "address",
						"name": "account",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "fee",
						"type": "uint256"
					},
					{
						"components": [
							{
								"internalType": "bool",
								"name": "display",
								"type": "bool"
							},
							{
								"internalType": "bool",
								"name": "legal",
								"type": "bool"
							},
							{
								"internalType": "bool",
								"name": "web",
								"type": "bool"
							},
							{
								"internalType": "bool",
								"name": "riot",
								"type": "bool"
							},
							{
								"internalType": "bool",
								"name": "email",
								"type": "bool"
							},
							{
								"internalType": "bool",
								"name": "pgpFingerprint",
								"type": "bool"
							},
							{
								"internalType": "bool",
								"name": "image",
								"type": "bool"
							},
							{
								"internalType": "bool",
								"name": "twitter",
								"type": "bool"
							}
						],
						"internalType": "struct Identity.IdentityFields",
						"name": "fields",
						"type": "tuple"
					}
				],
				"internalType": "struct Identity.Registrar[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sub",
				"type": "address"
			}
		],
		"name": "removeSub",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sub",
				"type": "address"
			},
			{
				"components": [
					{
						"internalType": "bool",
						"name": "hasData",
						"type": "bool"
					},
					{
						"internalType": "bytes",
						"name": "value",
						"type": "bytes"
					}
				],
				"internalType": "struct Identity.Data",
				"name": "data",
				"type": "tuple"
			}
		],
		"name": "renameSub",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "regIndex",
				"type": "uint32"
			},
			{
				"internalType": "uint256",
				"name": "maxFee",
				"type": "uint256"
			}
		],
		"name": "requestJudgement",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "regIndex",
				"type": "uint32"
			},
			{
				"internalType": "address",
				"name": "newAccount",
				"type": "address"
			}
		],
		"name": "setAccountId",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "regIndex",
				"type": "uint32"
			},
			{
				"internalType": "uint256",
				"name": "fee",
				"type": "uint256"
			}
		],
		"name": "setFee",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "regIndex",
				"type": "uint32"
			},
			{
				"components": [
					{
						"internalType": "bool",
						"name": "display",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "legal",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "web",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "riot",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "email",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "pgpFingerprint",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "image",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "twitter",
						"type": "bool"
					}
				],
				"internalType": "struct Identity.IdentityFields",
				"name": "fields",
				"type": "tuple"
			}
		],
		"name": "setFields",
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
								"components": [
									{
										"internalType": "bool",
										"name": "hasData",
										"type": "bool"
									},
									{
										"internalType": "bytes",
										"name": "value",
										"type": "bytes"
									}
								],
								"internalType": "struct Identity.Data",
								"name": "key",
								"type": "tuple"
							},
							{
								"components": [
									{
										"internalType": "bool",
										"name": "hasData",
										"type": "bool"
									},
									{
										"internalType": "bytes",
										"name": "value",
										"type": "bytes"
									}
								],
								"internalType": "struct Identity.Data",
								"name": "value",
								"type": "tuple"
							}
						],
						"internalType": "struct Identity.Additional[]",
						"name": "additional",
						"type": "tuple[]"
					},
					{
						"components": [
							{
								"internalType": "bool",
								"name": "hasData",
								"type": "bool"
							},
							{
								"internalType": "bytes",
								"name": "value",
								"type": "bytes"
							}
						],
						"internalType": "struct Identity.Data",
						"name": "display",
						"type": "tuple"
					},
					{
						"components": [
							{
								"internalType": "bool",
								"name": "hasData",
								"type": "bool"
							},
							{
								"internalType": "bytes",
								"name": "value",
								"type": "bytes"
							}
						],
						"internalType": "struct Identity.Data",
						"name": "legal",
						"type": "tuple"
					},
					{
						"components": [
							{
								"internalType": "bool",
								"name": "hasData",
								"type": "bool"
							},
							{
								"internalType": "bytes",
								"name": "value",
								"type": "bytes"
							}
						],
						"internalType": "struct Identity.Data",
						"name": "web",
						"type": "tuple"
					},
					{
						"components": [
							{
								"internalType": "bool",
								"name": "hasData",
								"type": "bool"
							},
							{
								"internalType": "bytes",
								"name": "value",
								"type": "bytes"
							}
						],
						"internalType": "struct Identity.Data",
						"name": "riot",
						"type": "tuple"
					},
					{
						"components": [
							{
								"internalType": "bool",
								"name": "hasData",
								"type": "bool"
							},
							{
								"internalType": "bytes",
								"name": "value",
								"type": "bytes"
							}
						],
						"internalType": "struct Identity.Data",
						"name": "email",
						"type": "tuple"
					},
					{
						"internalType": "bool",
						"name": "hasPgpFingerprint",
						"type": "bool"
					},
					{
						"internalType": "bytes",
						"name": "pgpFingerprint",
						"type": "bytes"
					},
					{
						"components": [
							{
								"internalType": "bool",
								"name": "hasData",
								"type": "bool"
							},
							{
								"internalType": "bytes",
								"name": "value",
								"type": "bytes"
							}
						],
						"internalType": "struct Identity.Data",
						"name": "image",
						"type": "tuple"
					},
					{
						"components": [
							{
								"internalType": "bool",
								"name": "hasData",
								"type": "bool"
							},
							{
								"internalType": "bytes",
								"name": "value",
								"type": "bytes"
							}
						],
						"internalType": "struct Identity.Data",
						"name": "twitter",
						"type": "tuple"
					}
				],
				"internalType": "struct Identity.IdentityInfo",
				"name": "info",
				"type": "tuple"
			}
		],
		"name": "setIdentity",
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
						"name": "account",
						"type": "address"
					},
					{
						"components": [
							{
								"internalType": "bool",
								"name": "hasData",
								"type": "bool"
							},
							{
								"internalType": "bytes",
								"name": "value",
								"type": "bytes"
							}
						],
						"internalType": "struct Identity.Data",
						"name": "data",
						"type": "tuple"
					}
				],
				"internalType": "struct Identity.SubAccount[]",
				"name": "subs",
				"type": "tuple[]"
			}
		],
		"name": "setSubs",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "who",
				"type": "address"
			}
		],
		"name": "subsOf",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "deposit",
						"type": "uint256"
					},
					{
						"internalType": "address[]",
						"name": "accounts",
						"type": "address[]"
					}
				],
				"internalType": "struct Identity.SubsOf",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "who",
				"type": "address"
			}
		],
		"name": "superOf",
		"outputs": [
			{
				"components": [
					{
						"internalType": "bool",
						"name": "isValid",
						"type": "bool"
					},
					{
						"internalType": "address",
						"name": "account",
						"type": "address"
					},
					{
						"components": [
							{
								"internalType": "bool",
								"name": "hasData",
								"type": "bool"
							},
							{
								"internalType": "bytes",
								"name": "value",
								"type": "bytes"
							}
						],
						"internalType": "struct Identity.Data",
						"name": "data",
						"type": "tuple"
					}
				],
				"internalType": "struct Identity.SuperOf",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
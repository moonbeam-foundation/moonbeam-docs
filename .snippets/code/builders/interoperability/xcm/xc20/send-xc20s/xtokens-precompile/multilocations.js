// Multilocation targeting the relay chain or its asset from a parachain
[
  1, // parents = 1
  [], // interior = here
]

// Multilocation targeting Moonbase Alpha DEV token from another parachain
[
  1, // parents = 1
  [  // interior = X2 (the array has a length of 2)
    '0x00000003E8', // Parachain selector + Parachain ID 1000 (Moonbase Alpha)
    '0x0403', // Pallet Instance selector + Pallet Instance 3 (Balances Pallet)
  ],
]

// Multilocation targeting Alice's account on the relay chain from Moonbase Alpha
[
  1, // parents = 1
  [  // interior = X1 (the array has a length of 1)
     // AccountKey32 selector + AccountId32 address in hex + Network(Option) Null
    '0x01c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300', 
  ],
]
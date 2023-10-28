// Multilocation targeting the relay chain asset from a parachain
[
  1, // parents = 1
  [], // interior = here
]

// Multilocation targeting Moonbase Alpha DEV token from another parachain
[
  1, // parents = 1
  [  // interior = X2 (the array has a length of 2)
    "0x00000003E8", // Parachain selector + Parachain ID 1000 (Moonbase Alpha)
    "0x0403", // Pallet Instance selector + Pallet Instance 3 (Balances Pallet)
  ],
]

// Multilocation targeting aUSD asset on Acala
[
  1, // parents = 1
  [  // interior = X2 (the array has a length of 2)
    "0x00000007D0", // Parachain selector + Parachain ID 2000 (Acala)
    "0x060001", // General Key selector + Asset Key
  ],
]
 - **Sovereign account** —  an account each chain in the ecosystem has, one for the relay chain and the other for other parachains. It is calculated as the `blake2` hash of a specific word and parachain ID concatenated (`blake2(para+ParachainID)` for the Sovereign account in the relay chain, and `blake2(sibl+ParachainID)` for the Sovereign account in other parachains), truncating the hash to the correct length. The account is owned by root and can only be used through SUDO (if available) or [governance (referenda)](/learn/features/governance){target=_blank}. The Sovereign account typically signs XCM messages in other chains in the ecosystem
 - **Multilocation** —  a way to specify a point in the entire relay chain/parachain ecosystem relative to a given origin. For example, it can be used to specify a specific parachain, asset, account, or even a pallet inside a parachain. In general terms, a multilocation is defined with a `parents` and an `interior`:
 
    - `parents` - refers to how many "hops" into a parent blockchain you need to take from a given origin
    - `interior` - refers to how many fields you need to define the target point. 
    
    For example, to target a parachain with ID `1000` from another parachain, the multilocation would be `{ "parents": 1, "interior": { "X1": [{ "Parachain": 1000 }]}}`

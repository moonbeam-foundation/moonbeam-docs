The multilocation will include the parachain ID of Moonbeam, the pallet instance, and the address of the ERC-20. The pallet instance corresponds to the index of the ERC-20 XCM Bridge Pallet, as this is the pallet that enables any ERC-20 to be transferred via XCM.

**ERC-20s on Moonbeam that aim to become XC-20s, that is, going to be registered on other chains, must comply with the standard ERC-20 interface as described in [EIP-20](https://eips.ethereum.org/EIPS/eip-20){target=_blank}**.

You can use the following multilocation to register a local XC-20:

=== "Moonbeam"

    ```js
    {
      'parents': 1,
      'interior': {
        'X3': [
          { 
            'Parachain': 2004
          },
          {
            'PalletInstance': 110
          },
          {
            'AccountKey20': {
              'key': 'INSERT_ERC20_ADDRESS'
            }
          }
        ]
      }
    }
    ```

=== "Moonriver"

    ```js
    {
      'parents': 1,
      'interior': {
        'X3': [
          { 
            'Parachain': 2023
          },
          {
            'PalletInstance': 110
          },
          {
            'AccountKey20': {
              'key': 'INSERT_ERC20_ADDRESS'
            }
          }
        ]
      }
    }
    ```

=== "Moonbase Alpha"

    ```js
    {
      'parents': 1,
      'interior': {
        'X3': [
          { 
            'Parachain': 1000
          },
          {
            'PalletInstance': 48
          },
          {
            'AccountKey20': {
              'key': 'INSERT_ERC20_ADDRESS'
            }
          }
        ]
      }
    }
    ```
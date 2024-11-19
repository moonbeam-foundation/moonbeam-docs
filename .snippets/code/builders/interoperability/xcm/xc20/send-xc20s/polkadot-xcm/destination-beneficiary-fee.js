      // dest
      {
        V3: {
          parents: 1,
          interior: 'Here'
        }
      },
      // beneficiary
      {
        V3: {
          parents: 0,
          interior: {
            X1: {
              AccountId32: {
                id: Array.from(beneficiaryRaw),
                network: null
              }
            }
          }
        }
      },
      // assets
      {
        V3: [
          {
            id: {
              Concrete: {
                parents: 1,
                interior: 'Here'
              }
            },
            fun: {
              Fungible: '1000000000000'
            }
          }
        ]
      },
      0, // feeAssetItem
      'Unlimited' // weightLimit
    );
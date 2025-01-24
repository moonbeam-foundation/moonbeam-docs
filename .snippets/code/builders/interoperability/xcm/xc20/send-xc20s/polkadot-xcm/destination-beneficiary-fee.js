 // dest
      {
        V4: {
          parents: 1,
          interior: {
            Here: null
          }
        }
      },
      // beneficiary
      {
        V4: {
          parents: 1,                   
          interior: {
            X1: [                        
              {
                AccountId32: {
                  id: Array.from(beneficiaryRaw),
                  network: null
                }
              }
            ]
          }
        }
      },
      // assets
      {
        V4: [                           
          {
            fun: {                      
              Fungible: 1000000000000n 
            },
            id: {                       
              parents: 1,
              interior: {
                Here: null              
              }
            }
          }
        ]
      },
      0,           // feeAssetItem
      'Unlimited'  // weightLimit
    );
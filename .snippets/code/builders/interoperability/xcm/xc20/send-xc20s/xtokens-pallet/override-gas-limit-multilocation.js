// Multilocation for a local XC-20 on Moonbeam
const asset = {
  V4: {
    id: {
      parents: 0,
      interior: {
        X3: [
          { PalletInstance: 48 },
          { AccountKey20: { key: INSERT_ERC_20_ADDRESS } },
          {
            GeneralKey: {
              // gas_limit: 300000
              data: '0x6761735f6c696d69743ae0930400000000000000000000000000000000000000',
              length: 32,
            },
          },
        ],
      },
    },
    fun: {
      Fungible: { Fungible: 1000000000000000000n }, // 1 token
    },
  },
};
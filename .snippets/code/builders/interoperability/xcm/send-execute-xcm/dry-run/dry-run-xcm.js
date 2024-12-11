import { ApiPromise, WsProvider } from '@polkadot/api';
import { hexToU8a } from '@polkadot/util';

const main = async () => {
  try {
    // Construct API provider
    const wsProvider = new WsProvider('INSERT_WSS_ENDPOINT');
    const api = await ApiPromise.create({ provider: wsProvider });
    console.log('Connected to the API. Preparing dry run XCM call...');

    // Define the origin
    const origin = { V4: { parents: 1, interior: 'Here' } };
    const amountToSend = 1000000000000;

    const message = {
      V4: [
        {
          WithdrawAsset: [
            {
              id: { parents: 1, interior: 'Here' },
              fun: { Fungible: amountToSend },
            },
          ],
        },
        {
          BuyExecution: {
            fees: {
              id: { parents: 1, interior: 'Here' },
              fun: { Fungible: amountToSend },
            },
            weightLimit: { Unlimited: null },
          },
        },
        {
          DepositAsset: {
            assets: { Wild: { AllOf: { id: { parents: 1, interior: 'Here' } } } },
            maxAssets: 1,
            beneficiary: {
              parents: 0,
              interior: {
                X1: [
                  {
                    AccountKey20: {
                      network: null,
                      key: hexToU8a('0x3B939FeaD1557C741Ff06492FD0127bd287A421e')
                    }
                  }
                ]
              }
            }
          }
        }
      ],
    };

    // Perform the dry run XCM call
    const result = await api.call.dryRunApi.dryRunXcm(origin, message);
    
    console.log(
      'Dry run XCM result:',
      JSON.stringify(result.toJSON(), null, 2)
    );

    await api.disconnect();
    console.log('Disconnected from the API.');
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

main().catch(console.error);
import { ApiPromise, WsProvider } from '@polkadot/api';
import { hexToU8a } from '@polkadot/util';

const main = async () => {
  try {
    // Construct API provider
    const wsProvider = new WsProvider('INSERT_WSS_ENDPOINT');
    const api = await ApiPromise.create({ provider: wsProvider });

    console.log('Connected to the API. Preparing dry run call...');

    // Create a test account (you should replace this with an actual account)
    const testAccount = api.createType(
      'AccountId20',
      '0x88bcE0b038eFFa09e58fE6d24fDe4b5Af21aa798'
    );

    // The call data (replace with your actual call data)
    const callData =
      '0x030088bce0b038effa09e58fe6d24fde4b5af21aa79813000064a7b3b6e00d'; // Your hex-encoded call data

    // Convert hex to Uint8Array
    const callDataU8a = hexToU8a(callData);

    // Perform the dry run call
    const result = await api.call.dryRunApi.dryRunCall(
      { system: { Signed: testAccount } }, // origin
      callDataU8a // call
    );

    console.log(
      'Dry run XCM result:',
      JSON.stringify(result.toJSON(), null, 2)
    );

    // Disconnect the API
    await api.disconnect();
    console.log('Disconnected from the API.');
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

main().catch(console.error);

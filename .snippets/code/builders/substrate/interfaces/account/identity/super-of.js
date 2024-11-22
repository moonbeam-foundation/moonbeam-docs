import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io'),
  });

  try {
    const account = 'INSERT_ACCOUNT';
    const superOf = await api.query.identity.superOf(account);

    // Log raw response for debugging
    console.log('Raw superOf response:', superOf.toString());

    if (superOf.isSome) {
      // The response includes a tuple of [parentAccount, dataName]
      const [parentAccount, dataName] = superOf.unwrap();

      const formattedSuper = {
        parentAccount: parentAccount.toString(),
        dataName: dataName.toHuman(),
      };

      console.log(
        'Formatted Super Identity:',
        JSON.stringify(formattedSuper, null, 2)
      );
    } else {
      console.log('This account is not a sub-identity of any other account');
    }
  } catch (error) {
    console.error('Error querying super identity:', error);
  } finally {
    await api.disconnect();
  }
};

main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});
import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Create the API instance
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io'),
  });

  // Query the registrars
  const registrars = await api.query.identity.registrars();

  // Format and log the registrars data
  const formattedRegistrars = registrars
    .map((reg) => {
      if (!reg.isSome) return null;
      const { account, fee, fields } = reg.unwrap();
      return {
        account: account.toString(),
        fee: fee.toHuman(),
        fields: fields.toNumber(),
      };
    })
    .filter((reg) => reg !== null);

  console.log('Registrars:', JSON.stringify(formattedRegistrars, null, 2));

  // Disconnect from the API
  await api.disconnect();
};

main().catch(console.error);

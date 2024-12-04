import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io'),
  });

  try {
    const subAccountDeposit = api.consts.identity.subAccountDeposit;
    console.log('SubAccount Deposit:', subAccountDeposit.toHuman());
  } catch (error) {
    console.error('Error querying subaccount deposit:', error);
  } finally {
    await api.disconnect();
  }
};

main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});

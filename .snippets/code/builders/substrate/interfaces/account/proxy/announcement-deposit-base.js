import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io'),
  });

  // Query the base deposit
  const baseDeposit = await api.consts.proxy.announcementDepositBase;

  console.log('Announcement Base Deposit:', baseDeposit.toHuman());

  process.exit(0);
};

main().catch(console.error);

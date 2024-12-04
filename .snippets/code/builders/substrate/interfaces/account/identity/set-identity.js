import { ApiPromise, WsProvider } from '@polkadot/api';

/*
        Add as many or as few fields as you would like
        */
const info = {
  display: 'INSERT_DISPLAY_NAME',
  legal: 'INSERT_LEGAL_NAME',
  additional: [[{ Raw: 'Discord' }, { Raw: 'INSERT_DISCORD_USERNAME' }]],
};

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('INSERT_WSS_ENDPOINT'),
  });

  const tx = api.tx.identity.setIdentity(info);
  const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');

  api.disconnect();
};

main();

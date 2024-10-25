       import { ApiPromise, WsProvider } from '@polkadot/api';

       const main = async () => {
         // Initialize the API
         const api = await ApiPromise.create({
           provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io')
         });

         // Query the deposit factor
         const depositFactor = await api.consts.proxy.announcementDepositFactor;
         
         console.log('Announcement Deposit Factor:', depositFactor.toHuman());
         
         process.exit(0);
       };

       main().catch(console.error);
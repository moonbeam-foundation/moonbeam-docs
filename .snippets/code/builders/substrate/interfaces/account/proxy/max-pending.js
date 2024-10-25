       import { ApiPromise, WsProvider } from '@polkadot/api';

       const main = async () => {
         // Initialize the API
         const api = await ApiPromise.create({
           provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io')
         });

         // Query max pending announcements
         const maxPending = await api.consts.proxy.maxPending;
         
         console.log('Maximum Pending Announcements:', maxPending.toHuman());
         
         process.exit(0);
       };

       main().catch(console.error);
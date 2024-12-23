const { Web3 } = require('web3');
const web3 = new Web3('wss://wss.api.moonbase.moonbeam.network');

const main = async () => {
  const subscription = await web3.eth.subscribe(
    'logs',
    {
      address: 'INSERT_CONTRACT_ADDRESS',
      topics: [
        null,
        [
          '0x00000000000000000000000044236223aB4291b93EEd10E4B511B37a398DEE55',
          '0x0000000000000000000000008841701Dba3639B254D9CEe712E49D188A1e941e',
        ],
      ],
    },
    (error, result) => {
      if (error) console.error(error);
    }
  );

  console.log("🕔 Subscription set up. Waiting for new logs")

  subscription.on('connected', function (subscriptionId) {
    console.log(subscriptionId);
  });
  subscription.on('data', function (log) {
    console.log(log);
  });
};

main();
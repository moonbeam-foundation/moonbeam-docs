const { Web3 } = require('web3');
const web3 = new Web3('wss://wss.api.moonbase.moonbeam.network');

const main = async () => {
  const subscsription = await web3.eth.subscribe(
    'logs',
    {
      address: 'INSERT_CONTRACT_ADDRESS',
      topics: [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      ],
    },
    (error, result) => {
      if (error) console.error(error);
    }
  );

  console.log('🕔 Subscription set up. Waiting for new logs');

  subscsription.on('connected', function (subscriptionId) {
    console.log(subscriptionId);
  });
  subscsription.on('data', function (log) {
    console.log(log);
  });
};

main();

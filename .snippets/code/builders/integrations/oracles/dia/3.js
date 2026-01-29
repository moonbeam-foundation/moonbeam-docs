const axios = require('axios');

const url = 'https://api.diadata.org/graphql/query';

const query = `
  {
    GetFeed(
      Filter: "mair",
      BlockSizeSeconds: 480,
      BlockShiftSeconds: 480,
      StartTime: 1690449575,
      EndTime: 1690535975,
      FeedSelection: [
        {
          Address: "0x0000000000000000000000000000000000000000",
          Blockchain:"Bitcoin",
          Exchangepairs:[],
        },
      ],
    )
    {
      Name
      Time
      Value
      Pools
      Pairs
    }
  }`;

const data = {
  query: query,
};

axios
  .post(url, data)
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error('Request failed:', error.message);
  });

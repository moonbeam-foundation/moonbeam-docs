import axios from 'axios';

const graphqlQuery = `query MyQuery {
  gameAssetMinteds {
    blockNumber
    transactionHash
    id
    tokenId
  }
}`;

const queryUrl =
  'INSERT_QUERY_URL'; // Will look something like this: 
  // https://api.studio.thegraph.com/query/80185/moonbeam-demo/version/latest

const graphQLRequest = {
  method: 'post',
  url: queryUrl,
  data: {
    query: graphqlQuery,
  },
};

// Send the GraphQL query
axios(graphQLRequest)
  .then((response) => {
    // Handle the response here
    const data = response.data.data;
    console.log(data);
  })
  .catch((error) => {
    // Handle any errors
    console.error(error);
  });

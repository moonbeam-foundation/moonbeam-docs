import { defineChain } from 'thirdweb';

/**
 * All chains should be exported from this file
 */
export { avalancheFuji, sepolia, polygonAmoy } from 'thirdweb/chains';

/**
 * Define the Moonbase Alpha test network
 */
export const moonbase = defineChain({
  id: 1287,
  rpc: 'https://rpc.api.moonbase.moonbeam.network',
});

import axios from "axios";

// CoinGecko IDs for the networks
const NETWORK_IDS = {
  GLMR: "moonbeam",
  MOVR: "moonriver",
};

async function calculateRelativePrice(
  assetPrice: number,
  network: "GLMR" | "MOVR"
): Promise<string> {
  try {
    // Fetch the native token price from CoinGecko
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${NETWORK_IDS[network]}&vs_currencies=usd`
    );

    const nativeTokenPrice = response.data[NETWORK_IDS[network]].usd;

    // Calculate relative price with 18 decimal places
    // Formula: (assetPrice / nativeTokenPrice) * 10^18
    // This gives us how many units of the asset we need to equal 1 unit of native token
    const relativePrice = ( assetPrice / nativeTokenPrice ) * Math.pow(10, 18);

    // Return as string to preserve precision
    return relativePrice.toFixed(0);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to calculate relative price: ${error.message}`);
    }
    throw error;
  }
}

function validateInput(
  price: string,
  network: string
): { assetPrice: number; network: "GLMR" | "MOVR" } {
  // Validate price
  const assetPrice = parseFloat(price);
  if (isNaN(assetPrice) || assetPrice <= 0) {
    throw new Error("Price must be a positive number");
  }

  // Validate network
  const upperNetwork = network.toUpperCase() as "GLMR" | "MOVR";
  if (!["GLMR", "MOVR"].includes(upperNetwork)) {
    throw new Error("Network must be either GLMR or MOVR");
  }

  return { assetPrice, network: upperNetwork };
}

function printUsage() {
  console.log("\nUsage:");
  console.log("npx ts-node relative-price-calculator.ts <price> <network>");
  console.log("\nExample:");
  console.log("npx ts-node relative-price-calculator.ts 0.25 GLMR");
  console.log("\nParameters:");
  console.log("price   - The price of your asset in USD");
  console.log("network - Either GLMR or MOVR");
}

async function main() {
  try {
    // Get command line arguments
    const [, , price, network] = process.argv;

    // Check if help flag is passed
    if (price === "--help" || price === "-h") {
      printUsage();
      return;
    }

    // Check if required arguments are provided
    if (!price || !network) {
      console.error("Error: Missing required arguments");
      printUsage();
      process.exit(1);
    }

    // Validate inputs
    const { assetPrice, network: validNetwork } = validateInput(price, network);

    console.log(
      `\nCalculating relative price for asset worth $${assetPrice} against ${validNetwork}...`
    );
    const relativePrice = await calculateRelativePrice(assetPrice, validNetwork);
    const nativeTokenPrice = (
      await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${NETWORK_IDS[validNetwork]}&vs_currencies=usd`
      )
    ).data[NETWORK_IDS[validNetwork]].usd;

    const decimalRatio = nativeTokenPrice / assetPrice;

    console.log(`\nResults:`);
    console.log(`Asset Price: $${assetPrice}`);
    console.log(`Network: ${validNetwork}`);
    console.log(`Native Token Price (from CoinGecko): $${nativeTokenPrice}`);
    console.log(`\nRelative Price Analysis:`);
    console.log(
      `1 ${validNetwork} is equal to approximately ${decimalRatio.toFixed(
        3
      )} of your specified token.`
    );
    console.log(
      `With 18 decimals, 1 ${validNetwork} or in WEI, 1000000000000000000 is equal to a relative price of ${relativePrice} units of your token`
    );
    console.log(`\nRelative Price: ${relativePrice}`);
    console.log(
      `\nThe relative price you should specify in asset registration steps is ${relativePrice}\n`
    );
  } catch (error) {
    console.error("\nError:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();

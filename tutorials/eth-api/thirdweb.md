---
title: Build an NFT Marketplace DApp with thirdweb
description: Learn how to build an NFT marketplace DApp with thirdweb, including both frontend and smart contract components, in an end-to-end fashion.
---

# How to Build an NFT Marketplace DApp with thirdweb

_by Kevin Neilson_


[thirdweb](https://thirdweb.com/explore){target=\_blank} is a powerful development platform that simplifies building and deploying Web3 applications on the blockchain. It provides pre-built smart contracts and tools, enabling developers to quickly launch applications that interact with NFTs, tokens, and more with less coding and configuration effort.  

In this guide, we'll go step by step through the process of building an NFT marketplace DApp with thirdweb on Moonbeam. We'll deploy all of the associated contracts, including an ERC-721 NFT contract and a marketplace smart contract to Moonbase Alpha with thirdweb, and then we'll integrate them into the DApp.

For a more nuts and bolts approach to thirdweb with information about available methods, the thirdweb CLI and deployment tools, be sure to check out the [thirdweb guide in the Builders section](/builders/ethereum/dev-env/thirdweb). 

## Clone the Template {: #clone-the-template }

thirdweb has an [NFT marketplace template](https://github.com/thirdweb-example/marketplace-template){target=\_blank} that is a perfect starting point for our needs. We'll only need to make minor customizations to it. Please note, thirdweb frequently updates their templates and tutorials, so ensure that you're using the latest and greatest, which may be located in another repository.

1. In your CLI run the following command:

    ```bash
    git clone https://github.com/thirdweb-example/marketplace-template
    ```

2. Navigate to your project directory and install dependencies with your preferred package manager:

    === "npm"

        ```bash
        npm install
        ```

    === "yarn"

        ```bash
        yarn
        ```

    === "pnpm"

        ```bash
        pnpm install
        ```

Next, you'll need to create a client ID for your thirdweb project and specify it in a `.env` file. 

## Specify Client ID {: #specify-client-id }

Before you launch your DApp (locally or publicly deployed), you must have a thirdweb Client ID associated with your project. A thirdweb Client ID is synonymous with an API key. You can create a free API key by [signing into your thirdweb account and navigating to **Settings** then click on **API Keys**](https://thirdweb.com/dashboard/settings/api-keys){target=\_blank}.

Press **Create API Key** then take the following steps:

1. Give your API key a name
2. Enter the allowed domains that the API key should accept requests from. It's recommended that you allow only necessary domains, but for development purposes, you can select **Allow all domains**
3. Press **Next** and confirm the prompt on the next page

![thirdweb create API key](/images/tutorials/eth-api/thirdweb/thirdweb-1.webp "Creating an API key on thirdweb")

Now, create a file a called `.env.local` at the root level directory of your project. Add your client ID as follows:

```bash title=".env.local"
NEXT_PUBLIC_TW_CLIENT_ID="INSERT_CLIENT_ID"
```

There are no other fields that you need to specify in your `.env` file at this time. If you're uncertain about formatting, you can refer to the `.env.example` file included in the project.

## Run the project {: #run-the-project }

We're not finished with the project yet, but it should be at a stage where you can launch the template and see the web app load successfully in your browser. 

=== "npm"

    ```bash
    npm run dev
    ```

=== "yarn"

    ```bash
    yarn dev
    ```

=== "pnpm"

    ```bash
    pnpm dev
    ```

If you see a blank screen, this typically means that you've failed to properly configure your client ID. 

## Add Support for Moonbase Alpha {: #add-support-for-moonbase-alpha }

thirdweb offers a small number of chains from `@thirdweb/chains` and does not include Moonbeam networks in that list, so you'll need to specify the network details including chain ID and RPC URL. You can create a custom chain with [`defineChain`](https://portal.thirdweb.com/references/typescript/v5/defineChain){target=\_blank} as follows:

=== "Moonbeam"

    ```typescript title="chains.ts"
    import { defineChain } from 'thirdweb';
    const moonbeam = defineChain({
      id: {{ networks.moonbeam.chain_id }},
      rpc: '{{ networks.moonbeam.public_rpc_url }}',
    });
    ```

=== "Moonriver"

    ```typescript title="chains.ts"
    import { defineChain } from 'thirdweb';
    const moonriver = defineChain({
      id: {{ networks.moonriver.chain_id }},
      rpc: '{{ networks.moonriver.public_rpc_url }}',
    });
    ```

=== "Moonbase Alpha"

    ```typescript title="chains.ts"
    import { defineChain } from 'thirdweb';
    const moonbase = defineChain({
      id: {{ networks.moonbase.chain_id }},
      rpc: '{{ networks.moonbase.rpc_url }}',
    });
    ```

The NFT marketplace template includes a `chains.ts` file under `src/consts/chains.ts`. To add support for Moonbase Alpha to the DApp, add the following lines: 

```typescript title="chains.ts"
export const moonbase = defineChain({
  id: 1287,
  rpc: 'https://rpc.api.moonbase.moonbeam.network',
});
```

We don't need to add any import statements because `defineChain` is already imported by default as part of the template. Feel free to add additional chains if you'd like to add support for Moonbeam, Moonriver, or other networks. The full file can be viewed below:

??? code "View chains.ts"
    ```typescript
    --8<-- 'code/tutorials/eth-api/thirdweb/chains.ts'
    ```

## Deploy ERC-721 NFT Contract {: #deploy-erc-721-nft-contract }

Of course, we'll need to have an NFT contract to showcase as part of the marketplace. You can use an existing NFT contract, but for demo purposes we'll walk through the steps of deploying a new ERC-721 contract with thirdweb. 

Head to [thirdweb Explore](https://thirdweb.com/explore){target=\_blank} and choose the `OpenEditionERC721` NFT standard. You can also access the [NFT contract directly](https://thirdweb.com/thirdweb.eth/OpenEditionERC721){target=\_blank}. Press **Deploy Now**, then take the following steps:

1. Add a name for your NFT
2. Optionally add a token symbol
3. Upload the image for your NFT. This will be uploaded to IPFS
4. Review the royalty information. By default, this is set to the address of your currently connected wallet and the royalty is set by default to 0%
5. Review the address to receive the proceeds of initial NFT sales. By default, this is set to the address of your currently connected wallet
6. Select your Network as **Moonbase Alpha**
7. Press **Deploy Now**

![Configure ERC-721](/images/tutorials/eth-api/thirdweb/thirdweb-2.webp "Configuring an ERC-721 contract on thirdweb")

You'll be asked for three wallet confirmations - the first two are transactions and the third is a signature. The first transaction deploys the NFT contract and the second sets the NFT metadata. The signature request is simply to add the NFT contract to your dashboard on thirdweb - this is highly recommended as it makes it easy to find your previously deployed NFTs from one easily-accessible place. 

### Set Claim Condition {: #set-claim-condition }

Before any NFTs can be minted, you'll need to configure the claim condition. If you try to mint any NFTs before setting the claim condition, the transaction will be reverted. To configure the claim condition for an open public mint, follow these steps:

1. Head to the **Claim Conditions** page
2. Select **Public phase**
3. Optionally, choose a price to charge per mint. You can also leave this as 0 for a free mint
4. Press **Save Phases**

![Set claim conditions](/images/tutorials/eth-api/thirdweb/thirdweb-3.webp "Setting claim conditions on thirdweb")

### Mint Some NFTs {: #mint-some-nfts } 

For aesthetic purposes, we'd like to have some NFTs show up in the marketplace that we created. Under the **Extensions**, **NFTs** section, press **Claim**. Then, you can mint some NFTs by taking the following steps:

1. Enter the address to receive the NFTs
2. Enter the desired quantity to mint
3. Press **Claim NFT** and confirm the transaction in your wallet

![Mint some NFTs](/images/tutorials/eth-api/thirdweb/thirdweb-4.webp "Minting some NFTs on thirdweb")

### Add NFT Contract to the DApp {: #add-nft-contract-to-the-dapp } 

After deploying and minting your NFTs, you'll need to specify your NFT contract in `src/consts/nft_contract.ts`. First, add `moonbase` to the list of imports as follows: 

```typescript title="nft_contracts.ts"
import { moonbase, avalancheFuji, polygonAmoy, sepolia } from "./chains";
```

Then, add your NFT contract to the array of marketplace contracts as follows:

```typescript title="nft_contracts.ts"
  {
    address: '0x5647fb3dB4e47f25659F74b4e96902812f5bE9Fb',
    chain: moonbase,
    title: 'Moonbase NFT',
    thumbnailUrl:
      'https://258c828e8cc853bf5e0efd001055fb39.ipfscdn.io/ipfs/QmTDyLBf2LaG6mzPniPjpX3P4DTFvjAk3gtUgrAb8EVPUF/2024-05-22%2008.17.59.jpg',
    type: 'ERC721',
  },
```

To get the IPFS URL of the image of your NFT that you uploaded when creating the NFT contract, head to the **Events** tab of your NFT contract and locate the `SharedMetadataUpdated` event. Expand the dropdown and you'll see the image URI. You can concatenate this to an IPFS CDN as shown above. 

![Get IPFS URL](/images/tutorials/eth-api/thirdweb/thirdweb-5.webp "Getting the IPFS URL from thirdweb")

The finished file can be viewed below:

??? code "View nft-contracts.ts"
    ```typescript
    --8<-- 'code/tutorials/eth-api/thirdweb/nft-contracts.ts'
    ```

## Deploy Marketplace Contract {: #deploy-marketplace-contract }

While the template includes existing marketplace contracts for a couple of TestNets, let's deploy a similar one for Moonbase Alpha. Head to [thirdweb Explore](https://thirdweb.com/explore){target=\_blank} and choose the `MarketplaceV3` contract. You can also access [`MarketplaceV3` directly](https://thirdweb.com/thirdweb.eth/MarketplaceV3){target=\_blank}. Press **Deploy Now**, then take the following steps:

1. Add a name for the marketplace
2. Select **Moonbase Alpha** as the network
3. Press **Deploy Now**

You'll be asked to confirm a transaction and provide a signature. The former deploys the marketplace contract and the latter adds the contract to your dashboard on thirdweb (which is not required but highly recommend for keeping track of your contracts).

![Deploy marketplace contract](/images/tutorials/eth-api/thirdweb/thirdweb-6.webp "Deploying a marketplace contract on thirdweb")

### Add Marketplace Contract to the DApp {: #add-marketplace-contract-to-the-dapp }

After deploying your marketplace contract you'll need to specify it in `src/consts/marketplace_contract.ts`. To add support for the Moonbase marketplace first add `moonbase` to the list of imports as follows: 

```typescript title="marketplace_contract.ts"
import { moonbase, avalancheFuji, polygonAmoy, sepolia } from "./chains";
```

Then, add your marketplace contract in the array of marketplace contracts as follows:

```typescript title="marketplace_contract.ts"
  {
    address: '0xA76C6E534aa651756Af8c222686fC1D3abF6952A',
    chain: moonbase,
  },
```

The finished file can be viewed below:

??? code "View marketplace-contracts.ts"
    ```typescript
    --8<-- 'code/tutorials/eth-api/thirdweb/marketplace-contracts.ts'
    ```

## Wrapping Up {: #wrapping-up }

And that's it! Congratulations on making it through the tutorial. You can head to `http://localhost:3000` after running the DApp locally via one of the following: 

=== "npm"

    ```bash
    npm run dev
    ```

=== "yarn"

    ```bash
    yarn dev
    ```

=== "pnpm"

    ```bash
    pnpm dev
    ```

On the homepage you should see your newly added NFT contract. Click on the NFT collection and you'll see something that looks like the below:

![View finished product](/images/tutorials/eth-api/thirdweb/thirdweb-7.webp "Viewing the finished product of the NFT marketplace on thirdweb")

For more information on what you can do with thirdweb on Moonbeam be sure to check out the [thirdweb guide in the Builders section](/builders/ethereum/dev-env/thirdweb) or the [thirdweb documentation site](https://portal.thirdweb.com/){target=\_blank}.

--8<-- 'text/_disclaimers/educational-tutorial.md'

--8<-- 'text/_disclaimers/third-party-content.md'

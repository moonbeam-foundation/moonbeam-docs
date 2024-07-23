---
title: Add RainbowKit to a dApp
description: Learn how to integrate RainbowKit into a dApp to allow users to connect their mobile wallets to Moonbeam, Moonriver, or Moonbase Alpha networks.
---

# Integrate RainbowKit into a DApp

## Introduction {: #introduction }

[RainbowKit](https://www.rainbowkit.com/docs/introduction){target=\_blank} is a React library that adds wallet connection capabilities to a dApp. It supports numerous wallets and enables features such as switching connection chains, ENS address resolution, and balance display out-of-the-box. RainbowKit uses [Wagmi](https://wagmi.sh/){target=\_blank} and [viem](https://viem.sh/){target=\_blank} under the hood to connect to blockchains and perform operations. [WalletConnect](https://walletconnect.com/){target=\_blank} adds encrypted connections and enhanced UX experiences like connecting a mobile wallet by scanning a QR code. Finally, [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview){target=\_blank} helps manage and update server state within the application. 

## Quick Start {: #quick-start }

If you are starting a new project, RainbowKit can scaffold a project from the CLI, combining RainbowKit and wagmi in a [Next.js](https://nextjs.org/docs){target=\_blank} application. Use your package manager of choice to run the CLI command and start your project:

=== "npm"

    ```bash
    npm init @rainbow-me/rainbowkit@latest 
    ```
=== "pnpm"

    ```bash
    pnpm create @rainbow-me/rainbowkit@latest
    ```
=== "yarn"

    ```bash
    yarn create @rainbow-me/rainbowkit
    ```

The script will prompt you for a project name, generate a new directory with the boilerplate starter code, and install all required dependencies. 

--8<-- 'code/builders/integrations/wallets/rainbowkit/terminal/cli-quickstart.md'

You can now navigate to the project directory and start the development server to view your project locally:

=== "npm"

    ```bash
    cd <project-name>
    npm run dev 
    ```
=== "pnpm"

    ```bash
    cd <project-name>
    pnpm run dev
    ```
=== "yarn"

    ```bash
    cd <project-name>
    yarn dev
    ```

Your starting screen should look like this:

![Scaffolded RainbowKit project landing page](/images/builders/integrations/wallets/rainbowkit/rainbowkit-1.webp)

You may notice that neither Moonbeam, Moonriver, nor Moonbase Alpha is included in the list of networks on the default menu. RainbowKit provides a [manual setup](https://www.rainbowkit.com/docs/installation#manual-setup){target=\_blank} option for builders who want to customize their application further, including the ability to add networks and chains. The following guide demonstrates how to use the RainbowKit manual setup to add support for Moonbeam networks.


## Checking Prerequisites {: #checking-prerequisites }

Following this guide requires a basic frontend dApp built with [React](https://react.dev/){target=\_blank} to connect to a mobile wallet via RainbowKit. This example uses [Next.js](https://nextjs.org/docs){target=\_blank} with the App Router. You can find examples for additional frameworks in the RainbowKit examples [repo](https://github.com/rainbow-me/rainbowkit/tree/main/examples){target=\_blank}.

Another essential requirement is a mobile wallet of your choice. This example uses [MetaMask](https://metamask.io/){target=\_blank}. However, RainbowKit supports a variety of wallets, and you can find a complete list on the RainbowKit [Custom Wallet List](https://www.rainbowkit.com/docs/custom-wallet-list){target=\_blank}.

Lastly, visit [WalletConnect Cloud](https://cloud.walletconnect.com/){target=\_blank} to obtain a WalletConnect `projectId`. Every dApp relying on WalletConnect is required to have an associated `projectId`. This is absolutely free and only takes a few minutes. 
 
## Getting Started {: #getting-started }

Ensure you are in the root directory for your project, then install RainbowKit and its peer dependencies:

=== "npm"

    ```bash
    npm install @rainbow-me/rainbowkit wagmi viem@2.x @tanstack/react-query
    ```
=== "pnpm"

    ```bash
    pnpm install @rainbow-me/rainbowkit wagmi viem@2.x @tanstack/react-query
    ```
=== "yarn"

    ```bash
    yarn add @rainbow-me/rainbowkit wagmi viem@2.x @tanstack/react-query
    ```

Run `npm run dev`, `pnpm run dev` or `yarn dev` to create a local dApp instance. You will see the starter Next.js page when viewing the dApp in your browser.

You will use the MetaMask mobile app to test the RainbowKit connection. For the purposes of this guide, you need to already be connected to the Moonbase Alpha TestNet on the MetaMask mobile app. 

There are a couple of ways you can connect your MetaMask mobile wallet to the Moonbase Alpha TestNet. You can manually add the Moonbase Alpha TestNet configurations from the **Networks** section of the **Settings** menu. Or you can also open up the **Browser** from MetaMask mobile and navigate to [docs.moonbeam.network](/){target=\_blank}, click on **Connect MetaMask** at the top of the page, and select **Moonbase Alpha** from the menu. This will prompt you to automatically add Moonbase Alpha as a custom network and saves you from inputting the network configurations manually.

Next, add a file called `.env.local` to your root project directory for storing your WalletConnect `projectId`. Ensure your project contains a `.gitignore` file in this same directory and `.env*.local` is added to the list of files to ignore. Add your `projectId` to the `.env.local` file as follows:

`NEXT_PUBLIC_PROJECT_ID='INSERT_PROJECT_ID'`

You will use this stored `projectId` when setting up the `wagmi` config in the next section.

## Connect DApp to MetaMask Mobile {: #connect-dapp-to-metamask-mobile }

In this section, you will complete the needed steps to use RainbowKit to connect your dApp to MetaMask's mobile wallet:

1. Import RainbowKit, Wagmi and TanStack Query
2. Setup configuration for Wagmi
3. Wrap your application with providers
4. Add the connect button

### Import RainbowKit, Wagmi and TanStack Query

Ensure you are still in the root directory of your project, then create a new file called `wagmi.ts`. This file will contain the imports and configuration needed to connect your dApp to mobile wallets and interact with blockchains. 

Start by adding the imports for RainbowKit, Wagmi, and TanStack Query. Make note of the list of chains imported from `wagmi/chains`.  Wagmi provides an extensive list of [supported chains](https://wagmi.sh/core/api/chains#:~:text=core/chains%27-,Available,-Chains){target=\_blank} you can reference for the expected name of Moonbeam related chains. You can see `moonbaseAlpha` added to the imported chains in the example code:

<!--TODO: code block for imports goes here-->

### Configure Wagmi to Support Moonbase Alpha 

Next, configure the supported chains and setup a `wagmi` config .  Add `moonbaseAlpha` to the config list of chains to add it to the list of your dApp's supported networks. 

<!--TODO: code block for wagmi config goes here-->

### Wrap Your Application with Providers

With the configuration in place, the next step is to wrap your application with the `RainbowKitProvider`, `WagmiProvider`, and `QueryClientProvider` to make them available throughout your dApp. Inside the `app` directory, create a file named `providers.tsx` and add the following code to define `Providers`:

<!--TODO: code block for providers.tsx goes here-->

Now open the `layout.tsx` file and modify the code to import `Providers` and wrap the application:

<!--TODO: code block for wrapping app in providers goes here-->

### Add the Connect Button

RainbowKit offers a `ConnectButton` component which renders the **Connect** and **Disconnect** buttons along with the UI elements for switching chains. This example imports the `ConnectButton` into the `page.tsx` file for simplicity but, you may want to add it to an element like a **Header** or **Navbar** so it appears at the top of each page. Update the code in `page.tsx` as follows:

<!--TODO: code block for adding connect button goes here-->

If you haven't already, start the development server and spin up a local version of your dApp. Your home page should now include a visbile **Connect Wallet** button. Click the button to test the connection. You should now see the RainbowKit modal with options to get or connect a wallet. Select **MetaMask** and follow the prompts to connect your wallet.

The current configuration defaults to connecting to Ethereum and displaying the current network, native token balance, an ENS or fallback avatar and the connected wallet address. Select the arrow next to **Ethereum** to open the **Switch Networks** modal. Select **Moonbase Alpha** and sign the MetaMask transaction to authorize switching networks. You should now see **Moonbase Alpha** listed as connected network with your DEV token balance, avatar, and account number displayed. 

## Customize Rainbow Kit

Not only does RainbowKit abstract away the complexities of managing wallet connections, the library offers several options for customizing UI and functionality to meet the needs of your dApp. You can find a full list of customization options in the RainbowKit [documentation](https://www.rainbowkit.com/docs/introduction){target=\_blank}. This section covers customizing the **Connect Wallet** button to connect initially to Moonbase Alpha, and render in a custom color. 

### Set Custom Initial Chain

RainbowKit will connect by default to the first chain supplied to Wagmi in the config. In fact, if you compare the order of chains listed in `wagmi.ts` to those on the **Switch Networks** modal, you will see they are the same. A simple fix would be to move `moonbaseAlpha` to the top of the chain list; however, relying on this default behavior is not the most reliable option. 

Instead, you can make use of the `initialChain` prop that is part of the `RainbowKitProvider` element to ensure the correct desired initial chain is used each time the user clicks **Connect Wallet**. Open your `providers.tsx` file and update the code to configure the `initialChain` prop. You can pass either a chain ID or chain name from the [Wagmi Chains list](https://wagmi.sh/core/api/chains){target=\_blank}.

<!--TODO: code snippet with initialChain prop added-->

### Define Custom Theme Colors

RainbowKit offers three built-in theme functions: `lightTheme`, `darkTheme`, and `midnightTheme`. These theme functions return a theme object which you can pass into the `RainbowKitProvider` prop `theme` to set custom colors, border radius, font stack, and overlay blur. Update `providers.tsx` with the following code. Be sure to add `darkTheme` to the `@rainbow-me/rainbowkit`import statement to allow your changes to render properly.

<!--TODO: code snippet adding theme customization-->

## Handle Disconnections

Now it is time to disconnect MetaMask from your dApp and then reconnect to test out your customizations. There are two options for completing this step.  

### Disconnect from DApp {: #disconnect-from-dapp }

RainbowKit includes a **Disconnect** button out of the box. Select the arrow next to your account number to open the modal. Click the **Disconnect** button. You should now see **Connect Wallet** and your account information should no longer be visible. 

![Built in Disconnect button](/images/builders/integrations/wallets/rainbowkit/rainbowkit-2.webp)

### Disconnect from MetaMask Mobile {: #disconnect-from-metamask-mobile }

Some users prefer to disconnect from within their mobile wallet rather than using a button within a dApp. To use this method: 

- click on the MetaMask extension in your browser to open the modal
- click the three dots in the upper right corner of the MetaMask modal
- select **Connected sites**
- review the list of sites connected to your wallet
- select **Disconnect** for each site you want to disconnect

## Final Result {: #final-result }

The **Connect Wallet** button on your home page should now render in the color you entered for `accentColor` when customizing the theme. When you click **Connect Wallet**, you will see the same accent color in use. Select MetaMask and sign the transaction to authorize the connection. You should now see **Moonbase Alpha** as the connected network and your DEV token balance for the account balance without needing to manually switch networks. 

![Theme customization on the user modal](/images/builders/integrations/wallets/rainbowkit/rainbowkit-3.webp)

This guide includes only a few of the customization options available through RainbowKit. You can learn more about the capabilities and options of this library by visiting [RainbowKit Docs](https://www.rainbowkit.com/docs/introduction){target=\_blank}.

You can view the complete example code in the [rainbow-manual-build-demo repository](https://github.com/papermoonio/rainbowkit-manual-build-demo){target=\_blank}

--8<-- 'text/_disclaimers/third-party-content-intro.md'


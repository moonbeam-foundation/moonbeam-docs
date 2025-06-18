---
title: Add RainbowKit to a DApp
description: Learn how to integrate RainbowKit into a dApp to allow users to connect their mobile wallets to Moonbeam, Moonriver, or Moonbase Alpha networks.
---

# Integrate RainbowKit into a DApp

## Introduction {: #introduction }

[RainbowKit](https://rainbowkit.com/docs/introduction){target=\_blank} is a React library that adds wallet connection capabilities to a dApp. It supports numerous wallets and enables features such as switching connection chains, ENS address resolution, and balance display out-of-the-box. RainbowKit offers customization options for all EVM-compatible chains, making it possible to easily connect mobile wallets to your Moonbeam dApps.

RainbowKit bundles together multiple tools to simplify adding wallet connection to your dApp: 

- [Wagmi](https://wagmi.sh/){target=\_blank} - a React Hooks library for interacting with Ethereum accounts, wallets, contracts, transactions, signing, ENS, and more
- [viem](https://viem.sh/){target=\_blank} - TypeScript interface which provides low-level stateless primitives for interacting with Ethereum
- [WalletConnect](https://walletconnect.com/){target=\_blank} - adds encrypted connections and enhanced UX experiences like connecting a mobile wallet by scanning a QR code
- [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview){target=\_blank} - helps manage and update server state within the application

This guide takes you through adding RainbowKit to a dApp using the CLI, adding support for Moonbeam networks, and some options for further customizing your integration.

## Quick Start {: #quick-start }

If you are starting a new project, RainbowKit can scaffold a project from the CLI, combining RainbowKit and Wagmi in a [Next.js](https://nextjs.org/docs){target=\_blank} application. Use your package manager of choice to run the CLI command and start your project:

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

You can now navigate to the project directory, start the development server, and navigate to `http://localhost:3000` to view your project locally:

=== "npm"

    ```bash
    cd INSERT_PROJECT_NAME
    npm run dev 
    ```

=== "pnpm"

    ```bash
    cd INSERT_PROJECT_NAME
    pnpm run dev
    ```

=== "yarn"

    ```bash
    cd INSERT_PROJECT_NAME
    yarn dev
    ```

Your starting screen should look like this:

![Scaffolded RainbowKit project landing page](/images/builders/integrations/wallets/rainbowkit/rainbowkit-1.webp)

Open the project in your code editor and take a look at the directory and file structure, making note of the `wagmi.ts` file. This file is where you can customize which chains to include in the list of networks users can connect to through your dApp. 

Moonbeam, Moonriver, and Moonbase Alpha are not on the list of default supported networks. You can customize your dApp's supported networks in the `wagmi.ts` file by updating the chain entrypoints imported from `wagmi/chains` and passed to the `chains` property when `config` is defined. Wagmi uses [chain definitions](https://wagmi.sh/core/api/chains#available-chains) established by viem, primarily the chain name. The `wagmi/chains` names for Moonbeam networks are as follows: 

=== "Moonbeam"

    ```js
    moonbeam
    ```

=== "Moonriver"

    ```js
    moonriver
    ```

=== "Moonbase Alpha"

    ```js
    moonbaseAlpha
    ```

To add support for Moonbeam networks, update `wagmi.ts` as follows. You will learn how to generate the `projectId` value in the next section. 

```js title="src/wagmi.ts"

--8<-- 'code/builders/integrations/wallets/rainbowkit/wagmi.ts'

```
## Manual Setup 

If you want to add RainbowKit to an existing React application, you can complete a manual setup. The following sections will guide you through using the manual setup to install and import needed dependencies, configure chain connections to support Moonbeam networks, and make RainbowKit functionality available to users of your dApp. You will also learn how to specify which chain the **Connect Wallet** button should connect to by default and how to customize the RainbowKit theme to fit your project.

### Checking Prerequisites {: #checking-prerequisites }

The following guide assumes you have:

- An existing dApp built with [React](https://react.dev/){target=\_blank} and you want to use the manual setup to connect to a mobile wallet via RainbowKit

    - The [RainbowKit examples repository](https://github.com/rainbow-me/rainbowkit/tree/main/examples){target=\_blank} includes templates for multiple React frameworks
    
    - To follow this guide, visit [Next.js](https://nextjs.org/docs){target=\_blank} and follow the **Automatic Installation** instructions, selecting Typescript and the App Router options during setup 

- A mobile wallet which supports Moonbeam out of the box or allows for adding custom networks

- A WalletConnect `projectId` - every dApp relying on WalletConnect is required to have an associated `projectId`. It is free to create an account, and you can instantly generate an ID

To obtain a WalletConnect `projectId`:

1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com/){target=\_blank}
2. On the **Projects** page, select **Create** 
3. Add your project information (you can leave **Homepage URL** blank if you have not deployed your dApp)
4. Select the **AppKit** SDK
5. Select your coding environment or platform (select React for this guide)
6. Locate your `projectId` in the left menu. You can also find it in the **Get started** code snippet of the WalletConnect Quickstart
 
### Getting Started {: #getting-started }

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

Next, start the development server to create a local dApp instance:

=== "npm"

    ```bash
    npm run dev
    ```

=== "pnpm"

    ```bash
    pnpm run dev
    ```

=== "yarn"

    ```bash
    yarn dev
    ```

If you navigate to `http://localhost:3000`,  you should see the starter Next.js application in your browser.

To test the RainbowKit connection, you will use the MetaMask mobile app. To follow this guide, you must have established a connection to the Moonbase Alpha TestNet on the MetaMask mobile app.

You can connect your MetaMask mobile wallet to the Moonbase Alpha TestNet in a couple of ways. You can manually add the Moonbase Alpha TestNet configurations from the **Networks** section of the **Settings** menu. Or you can also open up the **Browser** from MetaMask mobile and navigate to the [Moonbeam documentation site (docs.moonbeam.network)](/){target=\_blank}, click on **Connect MetaMask** at the top of the page, and select **Moonbase Alpha** from the menu. Follow the prompts to automatically add Moonbase Alpha as a custom network.

Next, safely add your `projectId` to your application: 

1. Create a `.env.local` file in the root directory of your project

    ```bash
    touch .env.local
    ```

2. Add your `projectId` to this file

    ```text title=".env.local"
    NEXT_PUBLIC_PROJECT_ID='INSERT_PROJECT_ID'
    ```

3. Locate your `.gitignore` file in this same directory and ensure `.env*.local` is included in the list of files to ignore. This will prevent committing your `projectId` to GitHub

In the next section, you will use this stored `projectId` when setting up the `wagmi` config.

### Connect DApp to MetaMask Mobile {: #connect-dapp-to-metamask-mobile }

In the next sections, you will complete the steps needed to use RainbowKit to connect your dApp to MetaMask's mobile wallet:

1. Import RainbowKit, Wagmi, and TanStack Query
2. Setup configuration for Wagmi
3. Wrap your application with providers
4. Add the connect button

### Import RainbowKit, Wagmi, and TanStack Query

Ensure you are still in your project's root directory, then create a new file called `wagmi.ts`. This file will contain the imports and configuration needed to connect your dApp to mobile wallets and interact with blockchains. 

```bash
touch wagmi.ts
```

=== "Moonbeam"

    ```js
    moonbeam
    ```

=== "Moonriver"

    ```js
    moonriver
    ```

=== "Moonbase Alpha"

    ```js
    moonbaseAlpha
    ```

Add the `wagmi/chains` import with `moonbeam`, `moonriver`, and `moonbaseAlpha` as the supported chains. 

```ts title="wagmi.ts"
--8<-- 'code/builders/integrations/wallets/rainbowkit/wagmi.ts::5'
```

Now, setup the `config` to include Moonbeam networks by ensuring the `chains` array matches the list of chains in the `import` statement. Finally, update the `projectId` value to use the one stored in your `.env.local` file.

```ts title="wagmi.ts"
--8<-- 'code/builders/integrations/wallets/rainbowkit/wagmi.ts:7:12'
```

### Wrap Your Application with Providers

With the configuration in place, the next step is to wrap your application with the `RainbowKitProvider`, `WagmiProvider`, and `QueryClientProvider` to make them available throughout your dApp. In your terminal, navigate to the `app` directory in your project and create a file named `providers.tsx`:

```bash
cd app &&
touch providers.tsx
```

Open `providers.tsx` and add the following code to define `Providers`:

```ts title="providers.tsx"
--8<-- 'code/builders/integrations/wallets/rainbowkit/plainProviders.tsx::18'
```

Now locate the `layout.tsx` file inside the `app` directory and modify the code to import `Providers` and wrap the application:

```ts title="layout.tsx"
--8<-- 'code/builders/integrations/wallets/rainbowkit/layout.tsx::26'
```

Wrapping the application in the providers makes the functionalities of RainbowKit, Wagmi, and TanStack Query available throughout your dApp. This setup gives you the flexibility to add a wallet connection button anywhere in your project. 

### Add the Connect Button

RainbowKit offers a `ConnectButton` component, which renders the **Connect** and **Disconnect** buttons and UI elements for switching chains. This example imports the `ConnectButton` into the existing `page.tsx` file for simplicity, but you may want to add it to an element like a **Header** or **Navbar** so it appears at the top of each page. Update the code in `page.tsx` as follows:

```ts title="page.tsx"
--8<-- 'code/builders/integrations/wallets/rainbowkit/page.tsx::11'
```

If you haven't already, start the development server and spin up a local version of your dApp. Your home page should now include a visible **Connect Wallet** button. Click the button to test the connection. You should now see the RainbowKit modal with options to get or connect a wallet. Select **MetaMask** and follow the prompts to connect your wallet.

The current configuration defaults to connecting to Moonbeam and displaying the current network, native token balance, an ENS or fallback avatar, and the connected wallet address. Select the arrow next to **Moonbeam** to open the **Switch Networks** modal. Select **Moonbase Alpha** and sign the MetaMask transaction to authorize switching networks. You should now see **Moonbase Alpha** listed as the connected network with your DEV token balance, avatar, and account number displayed. 

## Customize Rainbow Kit

Not only does RainbowKit abstract away the complexities of managing wallet connections, but the library offers several options for customizing UI and functionality to meet the needs of your dApp. You can find a complete list of customization options in the RainbowKit [documentation](https://rainbowkit.com/docs/introduction){target=\_blank}. This section covers customizing the **Connect Wallet** button to connect initially to Moonbase Alpha and render it in a custom color. 

### Set Custom Initial Chain

RainbowKit will connect by default to the first chain supplied to Wagmi in the config. If you compare the order of chains listed in `wagmi.ts` to those on the **Switch Networks** modal, you will see they are the same. If you wanted to always connect to the TestNet first, a simple fix would be to move `moonbaseAlpha` to the top of the chain list. However, assuming this default behavior will never change is not the most reliable option. 

Instead, you can use the `initialChain` prop that is part of the `RainbowKitProvider` element to define which chain the wallet should initially connect to when the user selects **Connect Wallet**. Open your `providers.tsx` file and update the code to configure the `initialChain` prop. You can pass either a chain ID or chain name from the [Wagmi Chains list](https://wagmi.sh/core/api/chains){target=\_blank}.

### Define Custom Theme Colors

RainbowKit offers three built-in theme functions: `lightTheme`, `darkTheme`, and `midnightTheme`. These theme functions return a theme object, which you can pass into the `RainbowKitProvider` prop `theme` to set custom colors, border radius, font stack, and overlay blur. Update `providers.tsx` with the following code. Be sure to add `darkTheme` to the `@rainbow-me/rainbowkit`import statement to allow your changes to render correctly. After customizing the initial chain and theme, your `providers.tsx` file should look like the following:

```js title="providers.tsx"
--8<-- 'code/builders/integrations/wallets/rainbowkit/providers.tsx'
```

## Handle Disconnections

You can now disconnect MetaMask from your dApp and then reconnect to test your customizations. There are two options for completing this step.  

### Disconnect from DApp {: #disconnect-from-dapp }

RainbowKit includes a **Disconnect** button out of the box. To open the modal, select the arrow next to your account number. Click the **Disconnect** button. You should now see **Connect Wallet**; your account information should no longer be visible. 

![Built in Disconnect button](/images/builders/integrations/wallets/rainbowkit/rainbowkit-2.webp)

### Disconnect from MetaMask Mobile {: #disconnect-from-metamask-mobile }

Some users prefer to disconnect from their mobile wallet rather than use a button within a dApp. To use this method: 

1. Select the MetaMask extension in your browser to open the modal
2. Select the three dots in the upper right corner of the MetaMask modal
3. Select **Connected sites**
4. Review the list of sites connected to your wallet
5. Select **Disconnect** for each site you want to disconnect

## Final Result {: #final-result }

The **Connect Wallet** button on your home page should now render in the color you entered for `accentColor` when customizing the theme. When you click **Connect Wallet**, you will see the same accent color in use. Select MetaMask and sign the transaction to authorize the connection. You should now see **Moonbase Alpha** as the connected network and your DEV token balance for the account balance without manually switching networks. 

![Theme customization on the user modal](/images/builders/integrations/wallets/rainbowkit/rainbowkit-3.webp)

This guide includes only a few of the customization options available through RainbowKit. You can learn more about the capabilities and options of this library by visiting [RainbowKit Docs](https://rainbowkit.com/docs/introduction){target=\_blank}.

You can view the complete example code in the [rainbow-manual-build-demo repository](https://github.com/papermoonio/rainbowkit-manual-build-demo){target=\_blank}

--8<-- 'text/_disclaimers/third-party-content.md'


---
title: Add Particle Network to a dApp
description: Learn how to integrate Particle Network's Wallet-as-a-Service into a dApp built on Moonbeam to enable MPC-based onboarding and ERC-4337 AA interaction.
---

# Particle Network Smart Wallet-as-a-Service

## Introduction {: #introduction }

[Particle Network](https://particle.network){target=\_blank} is a [Smart Wallet-as-a-Service](https://docs.particle.network/getting-started/smart-wallet-as-a-service){target=\_blank} provider that enhances user experience with modular and customizable Externally Owned Account (EOA) and [Account Abstraction (AA)](https://docs.particle.network/developers/account-abstraction){target=\_blank} embedded wallet components.

One key component of Particle's Smart Wallet-as-a-Service stack is [Particle Connect](https://developers.particle.network/api-reference/connect/desktop/web){target=\_blank}, which streamlines user onboarding by supporting familiar Web2 accounts—like Google, email, and phone numbers—alongside Web3 methods. This functionality is powered by [Multi-Party Computation-based Threshold Signature Scheme (MPC-TSS)](https://docs.particle.network/developers/auth-service){target=\_blank} technology for secure and efficient key management.

For a full overview of Particle's stack, see the blog post: [Introducing Our Smart Wallet-as-a-Service Modular Stack](https://blog.particle.network/announcing-our-smart-wallet-as-a-service-modular-stack-upgrading-waas-with-erc-4337){target=\_blank}.

Particle Network supports Moonbeam, Moonriver, and the Moonbase Alpha TestNet with both standard EOA interactions and native [ERC-4337](https://eips.ethereum.org/EIPS/eip-4337){target=\_blank} SimpleAccount implementations, providing full-stack account abstraction.

Key components of Particle Network's Moonbeam integration include:

- **Particle Connect**: Particle's flagship Wallet-as-a-Service solution, offering embedded wallets powered by MPC-TSS for smooth, Web2-like onboarding and interactions, with Account Abstraction support integrated within a single SDK.
- **Particle Network Modular [AA Stack](https://docs.particle.network/developers/account-abstraction){target=\_blank}**: Beyond the default EOA-based interactions, Particle also offers a modular AA stack for ERC-4337 account abstraction on Moonbeam, allowing flexibility in the smart account, bundler, and paymaster configurations to suit AA-enabled applications.

![Particle Network Smart WaaS map](/images/builders/integrations/wallets/particle/particle-1.webp)

In this guide, you'll go through a step-by-step example of using Particle Connect on Moonbeam.

## Create an Application {: #create-an-application }

To use Particle Connect on Moonbeam, you'll need to begin by creating an account on the [Particle Network dashboard](https://dashboard.particle.network) and spinning up an application.

1. Navigate to the Particle Network dashboard, then sign up or log in

    ![Dashboard login](/images/builders/integrations/wallets/particle/particle-2.webp)

2. Once logged in, click **Add New Project** to create a new project

    ![Project creation](/images/builders/integrations/wallets/particle/particle-3.webp)

3. Enter the project name and click **Save**

    ![Application creation](/images/builders/integrations/wallets/particle/particle-4.webp)

4. From the project's dashboard, scroll down to the **Your Apps** section and create a new app by selecting **iOS**, **Android**, or **Web** and providing the requested information

    ![Application creation](/images/builders/integrations/wallets/particle/particle-5.webp)

5. Finally, copy the **Project ID**, **Client Key**, and **App ID**

    ![Application dashboard](/images/builders/integrations/wallets/particle/particle-6.webp)

## Install Dependencies {: #install-dependencies }

To integrate Particle Connect into your Moonbeam application, you’ll need just a few dependencies. Particle Connect includes built-in Account Abstraction (AA) support.

=== "yarn"

    ```bash
    yarn add @particle-network/connectkit viem@^2
    ```

> Note that this tutorial is based on a [Next.js app](https://nextjs.org/docs/getting-started/installation){target=\_blank} with TypeScript and Tailwind CSS.

## Configure Particle Connect {: #configure-particle-network }

To start, we’ll configure and initialize Particle Connect (Particle's flagship authentication SDK). Begin by creating a new file called `ConnectKit.tsx` in your project’s root directory, where we’ll set up the `ParticleConnectKit` component as the main interface for configuration.

Before proceeding, head back to the [Particle dashboard](https://dashboard.particle.network){target=\_blank} and retrieve the following API keys:

- **`projectId`** – your project’s unique ID.
- **`clientKey`** – your client-specific key.
- **`appId`** – your application ID.

These keys are essential as they connect your Particle Connect instance with the Particle dashboard, enabling features like no-code customization, user activity tracking, and API request authentication.

Place the API keys in a `.env` file in the following format:

```shell
NEXT_PUBLIC_PROJECT_ID='PROJECT_ID'
NEXT_PUBLIC_CLIENT_KEY='CLIENT_KEY'
NEXT_PUBLIC_APP_ID='APP_ID'
```

This setup ensures that your API keys are securely accessible to the Next.js application while protecting them from unauthorized access.

Here’s the code to add to your `ConnectKit.tsx` file:

```js
--8<-- 'code/builders/integrations/wallets/particle/configure-particle.js'
```

This setup initializes the `ParticleConnectKit` component with your project keys and defines essential SDK configurations, including supported chains (such as Moonbeam), wallet positioning and visibility options, and an instance of a `SIMPLE` smart account.

For further customization options, refer to the [Particle Connect documentation](https://developers.particle.network/api-reference/connect/desktop/web#configuration){target=\_blank}.


At this point, you've signed up and created an application, installed all required dependencies, and configured `ParticleConnectKit`, along with `SmartAccount`, if applicable.

## Integrate the `ParticleConnectKit` Component in Your App {: #integrate-particleconnectkit }

After completing the configuration, wrap your application with the `ParticleConnectKit` component to enable global access to the Particle Connect SDK. Update your `layout.tsx` file in `src` as shown below:

```js
--8<-- 'code/builders/integrations/wallets/particle/layout-code.js'
```

Wrapping your application in `ParticleConnectKit` provides global access to the SDK, making features like social logins and wallet generation available throughout your app. This setup in `layout.tsx` ensures all components can access Particle Connect’s capabilities.

## Example of Utilization {: #example-of-utilization }

With the aforementioned established, Particle Connect can be used similarly, as shown in the example application below.

Specifically, this application creates a smart account on Moonbeam MainNet through social login, then uses it to send a gasless transaction of 0.001 GLMR.

```js
--8<-- 'code/builders/integrations/wallets/particle/example-app.js'
```

That concludes the brief introduction to Particle's Smart Wallet-as-a-Service stack and how to get started with Particle on Moonbeam. For more information, you can check out [Particle Network's documentation](https://docs.particle.network){target=\_blank}.

--8<-- 'text/_disclaimers/third-party-content.md'

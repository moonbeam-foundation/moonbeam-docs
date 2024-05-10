---
title: MetaFab Gaming Toolkit
description: Develop your own blockchain game on Moonbeam using MetaFab! MetaFab streamlines game development with its easy-to-use API and language and framework SDKs.
---

# Build Web3 Games on Moonbeam with MetaFab's Developer Toolkit

## Introduction {: #introduction } 

Build frictionless blockchain games with [MetaFab](https://www.trymetafab.com){target=\_blank}’s API, the free, end-to-end, self-serve solution for games and gamified apps to integrate robust blockchain infrastructure in minutes, not months.

## MetaFab on Moonbeam {: #metafab-on-moonbeam }

Game developers within the Moonbeam ecosystem can use [MetaFab’s API](https://docs.trymetafab.com/reference/getcollections){target=\_blank} and dashboard with SDKs for Unity, Unreal Engine, and other top programming languages to integrate frictionless blockchain systems for free, without any blockchain or Web3 development.

**Note on player UX**: Players don’t care about the technology, which is why MetaFab allows developers to bury the wires of Web3 as deep under the game's surface as they choose. 

It's imperative for the experience of any game or gamified application to be as frictionless as possible for players or users. MetaFab holds this principle at the core of every tool or product created.

**Note to developers**: MetaFab is a team of game developers that scaled their Web3 games platform to 100,000 players through single sign-on (SSO) player authentication, non-custodial wallets, an abstracted gas and transactional layer, and more. MetaFab adds, improves, and continually innovates around the needs of game developers and prioritizes simple but flexible integration and usage patterns.

This guide will dive into the MetaFab product suite at a high level.

## MetaFab's Language & Framework SDKs {: #language-framework-sdks }

MetaFab offers a handful of SDKs for popular languages and frameworks. These SDKs are generated through MetaFab's internal systems to match their OpenAPI specification, which is always in sync with their API reference. 

The SDKs available are as follows:

- [Unity](https://docs.trymetafab.com/docs/c-unity){target=\_blank}
- [Android](https://docs.trymetafab.com/docs/android){target=\_blank}
- [C#](https://docs.trymetafab.com/docs/c-sdk){target=\_blank}
- [C++ (UE4)](https://docs.trymetafab.com/docs/c-unreal-engine-4-sdk){target=\_blank}
- [GO](https://docs.trymetafab.com/docs/go){target=\_blank}
- [Java](https://docs.trymetafab.com/docs/java){target=\_blank}
- [JavaScript](https://docs.trymetafab.com/docs/javascript){target=\_blank}
- [PHP](https://docs.trymetafab.com/docs/php){target=\_blank}
- [Python](https://docs.trymetafab.com/docs/python){target=\_blank}
- [Rust](https://docs.trymetafab.com/docs/rust){target=\_blank}
- [Swift](https://docs.trymetafab.com/docs/swift-ios){target=\_blank}
- [TypeScript](https://docs.trymetafab.com/docs/typescript){target=\_blank}

## MetaFab's Developer Dashboard {: #developer-dashboard }

The MetaFab Dashboard is a home base for a quick game overview, players, currencies, items, shops, loot boxes, contracts, and more. Intuitive management functionality, such as configuration and creation (plus more), is available. However, most opt to use their dashboard as a hub and work directly with the endpoints and code. [Create a dashboard and retrieve your developer keys](https://dashboard.trymetafab.com/auth/register){target=\_blank}.

![MetaFab's developer dashboard.](/images/builders/integrations/gaming/metafab/metafab-1.webp)

## Players & Wallets {: #players-wallets }

Think of a player as an account controlled (self-custody) by the player and managed by the game. Each player account created through MetaFab interacts with a game's currencies and smart contracts, of which can be [custom smart contracts](https://docs.trymetafab.com/docs/implementing-gasless-transactions){target=\_blank}, on Moonbeam and any other supported chain by that game without worrying about gas.

**External wallets**: MetaFab supports an industry-first system called approval delegation. Through a one-time external wallet connection, players can frictionlessly transact through that external wallet without ever needing to sign transactions, deal with wallet pop-ups and prompts, or share private keys.

MetaFab and games built on MetaFab never store private keys. With MetaFab, you can handle external and managed wallets through a single logic set. Read more about [MetaFab’s security considerations](https://docs.trymetafab.com/docs/security){target=\_blank}.

## Authentication & Registration {: #authentication-registration }

Games can either brand MetaFab’s out-of-the-box and fully customizable player authentication, registration, and wallet connection flow, or build their own from the ground up as needed.

![Register your game with MetaFab.](/images/builders/integrations/gaming/metafab/metafab-2.webp)

**White-label authentication and registration**: Quickly design a flow to match a game's theme and domain and automatically handle player login, registration, and relaying of credentials, such as a player's ID and access token. Check out a [demo of our unbranded authentication page](https://connect.trymetafab.com/?chain=MATIC&flow=register&game=880c664b-3ce4-40a2-bf61-83b174ce5f94&redirectUri=https://trymetafab.com){target=\_blank}.

**Build from the ground up**: MetaFab’s endpoints are flexible and work for games that choose to handle authentication and registration flows through their own implementation, methods, launcher, or other custom use cases.

## Ecosystems, Cross-Game Interoperability, & SSO {: #ecosystems-interop-sso }

Support a network of games with a consistent and standard SSO authentication flow. Enable new degrees of interoperability, frictionless player experiences, and more through a highly configurable organizational structure within an ecosystem of owned, portfolio, or partner games.

![MetaFab's instrastructure diagram.](/images/builders/integrations/gaming/metafab/metafab-3.webp)

**Seamlessly onboard new and existing games**: Integrate a “sign in with (XYZ)” button or method into any game and vertically integrate with MetaFab’s systems, including gas and transaction abstraction.

MetaFab’s Ecosystem product allows unified achievement tracking (and more), permissioning flows, control, and security across games, and it is frictionless for players and easy to integrate for developers. Read more [about ecosystems](https://docs.trymetafab.com/docs/ecosystems-cross-game-interoperability){target=\_blank}.

## Configure & Deploy Smart Contracts {: #configure-deploy-smart-contracts }

![Use MetaFab's template smart contracts: Digital Collectibles (ERC1155), Game Currencies (ERC20), Lootboxes, and Shops](/images/builders/integrations/gaming/metafab/metafab-4.webp)

**MetaFab’s smart contracts**: Configure MetaFab’s pre-written smart contracts and cover various implementation patterns in a few lines of code. These include deploying in-game currencies to forging new items and enabling player-to-player trading through shops and crafting.

**Import custom contracts**: Deploy custom smart contracts on any supported chain and leverage the full MetaFab product suite, including gasless transactions for players, simplified authentication flows, delegated EOA support, and more.

## Resources for Learning More {: #learn-more }

To build on Moonbeam with MetaFab and explore the entire suite of what MetaFab offers, [get started](https://dashboard.trymetafab.com/auth/register){target=\_blank}; it’s free, forever. There are no lock-ins, rate limits, transaction fees, or catches. MetaFab’s [future monetization strategy](https://docs.trymetafab.com/docs/free-pricing-business-model){target=\_blank} does not gate these core services.

We look forward to building alongside you!

Check out MetaFab's [complete developer documentation](https://docs.trymetafab.com/docs){target=\_blank} to learn more.

### Reference Links {: #reference-links }

- [Sign-up](https://www.trymetafab.com/register){target=\_blank}
- [Website](https://www.trymetafab.com){target=\_blank}
- [Twitter](https://www.trymetafab.com){target=\_blank}
- [Docs](https://docs.trymetafab.com){target=\_blank}
- [API Reference](https://docs.trymetafab.com/reference){target=\_blank}
- [GitHub Repos](https://github.com/orgs/MetaFabInc/repositories){target=\_blank}

--8<-- 'text/_disclaimers/third-party-content.md'
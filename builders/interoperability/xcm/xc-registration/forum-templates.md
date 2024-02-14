---
title: Forum Templates for XCM Integrations
description: Learn about and how to craft the two posts you need to make on the Moonbeam Community Forum when creating a cross-chain integration with Moonbeam.
---

# Moonbeam Community Forum Templates for XCM Integrations

## Introduction {: #introduction }

When starting an XCM integration on Moonriver or Moonbeam MainNet, there are two preliminary posts that must be made on the [Moonbeam Community Forum](https://forum.moonbeam.foundation/){target=\_blank} so that the voting community has the chance to provide feedback. The two preliminary posts are an XCM disclosure and an XCM proposal. **This step is not necessary when connecting to Moonbase Alpha.**

If only an asset is being registered, the cross-chain channel must already be established, and so only an XCM proposal post is required to register the asset.

It is recommended that this be done five days before the actual proposal is submitted on chain to provide time for community feedback.

## XCM Disclosures {: #xcm-disclosure }

The first post that should be made are the key disclosures within the [XCM Disclosures category](https://forum.moonbeam.foundation/c/xcm-hrmp/xcm-disclosures/15){target=\_blank}, which highlight key information that is important to a voter's decision. This post is only required when establishing an XCM integration; it is not necessary if the integration already exists and you only need to register an asset.

Once you hit the **New Topic** button, a template is provided with the relevant information to be filled in. Please use either the Moonbeam/Moonriver tag, depending on the network you are integrating with.

In the post, please provide the following information:

- **Title** - XCM Disclosure: *YOUR_NETWORK_NAME*
- **Network Information** — one sentence summarizing your network and relevant links to your website, Twitter, and other social channels

You'll also need to provide answers to the following questions:

- Is the blockchain network's code open source? If so, please provide the GitHub link. If not, provide an explanation of why not
- Is SUDO disabled on the network? If SUDO is disabled, is the network controlled by a select group of addresses?  
- Has the integration of the network been tested completely on the Moonbase Alpha TestNet?  
- (For Moonbeam HRMP proposals only) Does your network have a Kusama deployment? If so, provide its network name and whether the Kusama deployment is integrated with Moonriver
- Is the blockchain network's code audited? If so, please provide:
  - Auditor name(s)
  - Dates of audit reports
  - Links to audit reports

## XCM Proposals {: #xcm-proposals }

The second post is a preliminary draft of the proposal in the [XCM Proposals category](https://forum.moonbeam.foundation/c/xcm-hrmp/xcm-proposals/14){target=\_blank}. Once a proposal is submitted on-chain and available for voting, you must also add a description to it in either the [Moonbeam Polkassembly](https://moonbeam.polkassembly.io/opengov){target=\_blank} or [Moonriver Polkassembly](https://moonriver.polkassembly.io/opengov){target=\_blank}.

Once you hit the **New Topic** button, a template is provided with the relevant information to be filled in. Please use either the Moonbeam or Moonriver tag, depending on the network you are integrating with.

In both the Moonbeam XCM Proposals forum post and in Polkassembly, add the following sections and information:

- **Title** — *YOUR_NETWORK_NAME* Proposal to Open Channel & Register *ASSET_NAME*. If you're only registering an asset, you can use: *YOUR_NETWORK_NAME* Proposal to Register *ASSET_NAME*
- **Introduction** — one sentence summarizing the proposal
- **Network Information** — one sentence summarizing your network and relevant links to your website, Twitter, and other social channels
- **Summary** — brief description of the content of the proposal
- **On-Chain Proposal Reference** — include if it is a Moonbeam or Moonriver proposal, the proposal number, and the proposal hash
- **Technical Details** — provide technical information required for the community to understand the use cases and purpose of the proposal
- **Additional Information** — any additional information you would like the community to know

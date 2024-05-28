---
title: Use GPT-4 to Develop Smart Contracts
description: Learn how you can use OpenAI's ChatGPT (GPT-4) generative AI LLM to write, debug, and deploy Solidity smart contracts on the Moonbeam network.
---

# Using GPT-4 to Write and Debug Solidity Smart Contracts

_by Kevin Neilson_

## Introduction {: #introduction }

Today, it's near impossible to walk down the street and not overhear a conversation about the transformative impact of generative AI. Of course, this applies to both the physical and virtual world (e.g., Twitter). You've probably heard by now that artificial intelligence tools like ChatGPT can plan your vacation, draft an essay, and tell you a joke. But did you know that ChatGPT can even write working Solidity code for you? And, it doesn't just return a `.sol` file to you without any context. It can actually explain to you how the code is structured, walk you through deployment steps, and, *drumroll*, even write your test files for you. Yup, that's right. No more excuses for a lack of test coverage when ChatGPT can take care of that for you.

In this tutorial, we'll look at how ChatGPT can help you write, deploy, and debug Solidity smart contracts. But first, let's dive a bit more into what ChatGPT is exactly.

## An Overview of ChatGPT {: #an-overview-of-chatgpt }

### What is ChatGPT? {: #what-is-chatgpt }

[ChatGPT](https://chat.openai.com){target=\_blank} is a text-based Large Language Model (LLM) created by the company OpenAI. According to OpenAI, *"The dialogue format makes it possible for ChatGPT to answer followup questions, admit its mistakes, challenge incorrect premises, and reject inappropriate requests."* ChatGPT can hold a conversation with you and remember your chat history until a new session is started. To learn more about ChatGPT, check out [this introduction to ChatGPT on the OpenAI Blog](https://openai.com/index/chatgpt){target=\_blank}.

### GPT-4 vs. ChatGPT {: #gpt-4-vs-chatgpt }

As of the time of writing, GPT-4 was the latest version offered as part of the ChatGPT Plus subscription service, available at a cost of $20 USD per month. While GPT-4 is a paid service, you can follow this same tutorial using the free tiers of service available in earlier versions. GPT-4 is a significantly more advanced model, so you may notice differences in response quality from earlier versions, particularly in the model's reasoning at the debugging steps.

### Limitations {: #limitations }

- At the time of writing, ChatGPT is in a research preview state
- ChatGPT can sometimes hallucinate, that is, output convincing and plausible-sounding answers that are factually incorrect. In such cases, it typically will not warn you of the inaccuracy
- ChatGPT's knowledge date cutoff is approximately September 2021. It does not have access to current events or other data after this date
- Code produced by ChatGPT is not audited, reviewed, or verified and may contain errors
- Prompting GPT-4 with the exact inputs specified in this tutorial will likely produce different outputs - that is expected due to ChatGPT's architecture as a language model

![Limitations](/images/tutorials/eth-api/chatgpt/chatgpt-1.webp)

**Please note that the contracts we'll be creating today are for educational purposes only and should not be used in a production environment**.

## Checking Prerequisites {: #checking-prerequisites }

For this tutorial, you'll need the following:

- A free [OpenAI account to access ChatGPT](https://chat.openai.com){target=\_blank}
- An account funded with DEV tokens to be used on the Moonbase Alpha TestNet if you'd like to deploy any resulting contracts.
  --8<-- 'text/_common/faucet/faucet-list-item.md'

## Sign up for an OpenAI Account {: #sign-up-for-an-openai-account }

You can sign up for a free account to access ChatGPT by heading to [OpenAI's website.](https://chat.openai.com/auth/login){target=\_blank} You'll need to provide both an email address and a phone number. A subscription to ChatGPT Plus is not required to complete this tutorial.

![Sign up for OpenAI account](/images/tutorials/eth-api/chatgpt/chatgpt-2.webp)

## Create an ERC-20 Token Contract {: #create-an-erc-20-token-contract }

To start interacting with [ChatGPT](https://chat.openai.com/?model=gpt-4){target=\_blank}, take the following steps:

1. Press **New Chat** in the upper left hand corner
2. Select the model you would like to use. Either model is suitable for this tutorial
3. Enter your prompt and at the input box and press enter when ready

![Prompt chatGPT](/images/tutorials/eth-api/chatgpt/chatgpt-3.webp)

For our first prompt, we'll ask ChatGPT to create an ERC-20 token, specifying the name of the token, the token symbol, and an initial supply. Your prompt doesn't need to match the one below - feel free to tailor it to suit your preferences.

```text
I would like to create an ERC-20 token called "KevinToken" 
with the symbol "KEV" and an initial supply of 40000000.
```

![ChatGPT's 1st response](/images/tutorials/eth-api/chatgpt/chatgpt-4.webp)

This is a great start. ChatGPT has produced for us a simple yet functional ERC-20 token that meets all of the parameters that we have specified. It also clarified how it created the ERC-20 token contract using the [OpenZeppelin standard](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol){target=\_blank} and where the initial token supply is directed. Finally, it reminds us that this is just a start, and there may be other considerations we wish to implement, like minting and burning.

!!! note
    If you don't get the output you're expecting, you can always press **Regenerate Response** or re-phrase your request.

ChatGPT is perfectly happy to revise and expand upon the contract that was created. As long as you stay within the same chat window (i.e., don't click new chat), ChatGPT will be aware of its prior output. As an example, let's now ask ChatGPT to revise our token to be both mintable and burnable:

```text
This looks great, but I'd really like my ERC-20 to be both mintable and burnable. 
```

ChatGPT is happy to oblige. Notice how it maintains the parameters we specified originally, namely the token name and symbol.

![ChatGPT's 2nd response](/images/tutorials/eth-api/chatgpt/chatgpt-5.webp)

## Preparing Deployment Instructions {: #preparing-deployment-instructions }

This section is named carefully to avoid implying that ChatGPT will be doing the deployment for us. ChatGPT does not have internet access and cannot interact with blockchain networks directly, but it can give us detailed instructions explaining how we can do so ourselves. Let's ask ChatGPT for instructions on deploying the recently created ERC20 contract. For this example, let's ask ChatGPT for [Hardhat deployment instructions](/builders/build/eth-api/dev-env/hardhat/){target=\_blank}:

```text
I would like to use Hardhat to compile and deploy
 this smart contract to the Moonbase Alpha network.  
```

![ChatGPT's 3rd response](/images/tutorials/eth-api/chatgpt/chatgpt-6.webp)

And to no surprise, ChatGPT provides us with a detailed series of deployment steps, from installation instructions to a full deployment script. Note that it even remembers a detail in our first prompt that wasn't important until now. In our initial prompt, we asked for our token to have an initial supply of `400000000`, and ChatGPT included this parameter in the deployment script it generated.

Another observation is that the RPC URL it generated is outdated, although still functional. This oversight is due to ChatGPT's knowledge cutoff date of September 2021, before the updated RPC URL was published. The current RPC URL for Moonbase Alpha is:

```text
{{ networks.moonbase.rpc_url }}
```

!!! note
    ChatGPT's knowledge date cutoff is approximately September 2021. It does not have access to current events or other data after this date.

Code snippets of ChatGPT's output are intentionally omitted to encourage you to try this on your own! And remember, prompting it with the exact same instructions will yield at least slightly different results - this is [an inherent quality of LLMs](https://blog.dataiku.com/large-language-model-chatgpt){target=\_blank}.

## Writing Test Cases {: #writing-test-cases }

By now, you're nearly a ChatGPT savant. So it should come as no surprise that ChatGPT's capabilities extend to writing test cases for your smart contracts, and all you need to do is ask:

```text
Hey GPT4 can you help me write some tests for the smart contract above?  
```

![ChatGPT's 4th response](/images/tutorials/eth-api/chatgpt/chatgpt-7.webp)

ChatGPT provides us with a slew of test cases, especially surrounding the mint and burn functionality. While it's busy writing test cases, it appears to trail off and stop without its typical summary remarks at the end. This interruption stems from ChatGPT's 500-word limit. Although the 500-word limit is a hard stop, ChatGPT's train of thought continues, so you can simply ask it to continue, and it will happily oblige. Note that for subscriptions with limited messages, this will count as an additional message from your allocation.

!!! note
    ChatGPT has a response limit of approximately 500 words or 4,000 characters. However, you can simply ask it to continue in a follow up message.

![ChatGPT's 5th response](/images/tutorials/eth-api/chatgpt/chatgpt-8.webp)

And Voila! ChatGPT finishes writing its test cases for us and wraps up by telling us how we can run them.

## Debugging {: #debugging }

So far, we've covered that ChatGPT can write smart contracts for you AND help you deploy and test them. What's more, it can also help you debug your smart contracts. You can share your problems with ChatGPT, and it will help you find what's wrong.

If the problem is clear, ChatGPT will typically tell you exactly what's wrong and how to fix it. In other cases, where there could be multiple underlying reasons for the issue you're facing, ChatGPT will suggest a list of potential fixes.

If you try all of the steps it recommends and your issue persists, you can simply let ChatGPT know, and it will continue to help you troubleshoot. As a follow-up, it may ask you to provide code snippets or system configuration information to better help you solve the problem at hand.

[A reentrancy bug](https://web.archive.org/web/20221121064906/https://consensys.github.io/smart-contract-best-practices/attacks/reentrancy/){target=\_blank} was the root of the flaw that brought down the [original DAO on Ethereum in 2016](https://en.wikipedia.org/wiki/The_DAO_(organization)){target=\_blank}. Let's prompt ChatGPT with a buggy function that includes a reentrancy vulnerability and see if ChatGPT is able to spot the problem. We'll go ahead and copy and paste the below insecure code snippet into ChatGPT and ask if there is anything wrong with it.

```solidity
// INSECURE
mapping (address => uint) private userBalances;

function withdrawBalance() public {
    uint amountToWithdraw = userBalances[msg.sender];
    (bool success, ) = msg.sender.call.value(amountToWithdraw)(""); // At this point, the caller's code is executed, and can call withdrawBalance again
    require(success);
    userBalances[msg.sender] = 0;
}
```

![ChatGPT's 6th response](/images/tutorials/eth-api/chatgpt/chatgpt-9.webp)

ChatGPT spots the exact error, explains the source of the problem, and lets us know how to fix it.

## Advanced Prompt Engineering {: #advanced-prompt-engineering }

[Prompt engineering](https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/prompt-engineering){target=\_blank} is both an art and a science, and mastering it can help you get the most out of generative AI tools like ChatGPT. While not an exhaustive list, here are some general concepts that can help you write better prompts:

- Be specific and parameterize your request. The more detail you can provide to ChatGPT, the more closely the actual output will match what you desire
- Don't be afraid of revisions! You don't need to repeat the whole prompt, you can ask for just the change and ChatGPT will revise its prior output accordingly
- Consider repeating or rephrasing critical parts of the prompt. Some research has indicated that LLMs will emphasize components that you repeat. You can always finish a prompt by reiterating the most important concepts you'd like addressed

For more information, be sure to check out this post on [advanced prompt engineering](https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/advanced-prompt-engineering?pivots=programming-language-chat-completions){target=\_blank} from Microsoft.

## Conclusion {: #conclusion }

As you can see, ChatGPT can help you with just about every step of the smart contract development process. It can help you write, deploy, and debug your Solidity smart contracts for Moonbeam. Despite the powerful capabilities of LLMs like ChatGPT, it's clear that this is only the beginning of what the technology has to offer.

It's important to remember that ChatGPT can only act as an aid to a developer and cannot fulfill any sort of audit or review. Developers must be aware that generative AI tools like ChatGPT can produce inaccurate, buggy, or non-working code. Any code produced in this tutorial is for demonstration purposes only and should not be used in a production environment.  

--8<-- 'text/_disclaimers/educational-tutorial.md'

--8<-- 'text/_disclaimers/third-party-content.md'
In this section, you'll get the preimage hash and the encoded proposal data for a proposal. To get the preimage hash, you'll first need to navigate to the **Preimage** page of [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonbeam-alpha.api.onfinality.io%2Fpublic-ws#){target=_blank}:

 1. Navigate to the [**Governance** tab](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonbeam-alpha.api.onfinality.io%2Fpublic-ws#/democracy){target=_blank}
 2. Select **Preimages** from the dropdown
 3. From the **Preimages** page, click on **+ Add preimage**

![Add a new preimage](/images/builders/pallets-precompiles/precompiles/democracy/democracy-4.png)

Then take the following steps:

 1. Select an account (any account is fine because you're not submitting any transaction here)
 2. Choose the pallet you want to interact with and the dispatchable function (or action) to propose. The action you choose will determine the fields that need to fill in the following steps. In this example, it is the **system** pallet and the **remark** function
 3. Enter the text of the remark, ensuring it is unique. Duplicate proposals such as "Hello World!" will not be accepted
 4. Copy the preimage hash, which represents the proposal, and save it as it will be used in the following steps to submit the proposal via the democracy precompile
 5. Click the **Submit preimage** button but don't sign or confirm the transaction on the next page 

![Get the proposal hash](/images/builders/pallets-precompiles/precompiles/democracy/democracy-5.png)

On the next screen, take the following steps:

 1. Press the triangle icon to reveal the encoded proposal in bytes
 2. Copy the encoded proposal - you'll need this when calling the `notePreimage` function in a later step

![Get the encoded proposal](/images/builders/pallets-precompiles/precompiles/democracy/democracy-6.png)

!!! note
     You should NOT sign and submit the transaction here. You will submit this information via the `notePreimage` function in the next step.
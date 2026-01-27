const userOpResponse = await smartWallet.sendTransaction(transaction, {
  paymasterServiceData: { mode: PaymasterMode.SPONSORED },
});

const receipt = await waitForUserOpReceipt(userOpResponse, 60000);

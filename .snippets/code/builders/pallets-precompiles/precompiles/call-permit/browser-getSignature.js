const main = async () => {
  await window.ethereum.enable();
  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts',
  });

  const from = accounts[0];
  const to = 'INSERT-TO-ADDRESS-HERE';
  const value = 0;
  const data =
    '0x4ed3885e0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b68656c6c6f20776f726c64000000000000000000000000000000000000000000';
  const gaslimit = 100000;
  const nonce = 'INSERT-SIGNERS-NONCE-HERE';
  const deadline = 'INSERT-DEADLINE-HERE';

  const createPermitMessageData = function () {
    const message = {
      from: from,
      to: to,
      value: value,
      data: data,
      gaslimit: gaslimit,
      nonce: nonce,
      deadline: deadline,
    };

    const typedData = JSON.stringify({
      types: {
        EIP712Domain: [
          {
            name: 'name',
            type: 'string',
          },
          {
            name: 'version',
            type: 'string',
          },
          {
            name: 'chainId',
            type: 'uint256',
          },
          {
            name: 'verifyingContract',
            type: 'address',
          },
        ],
        CallPermit: [
          {
            name: 'from',
            type: 'address',
          },
          {
            name: 'to',
            type: 'address',
          },
          {
            name: 'value',
            type: 'uint256',
          },
          {
            name: 'data',
            type: 'bytes',
          },
          {
            name: 'gaslimit',
            type: 'uint64',
          },
          {
            name: 'nonce',
            type: 'uint256',
          },
          {
            name: 'deadline',
            type: 'uint256',
          },
        ],
      },
      primaryType: 'CallPermit',
      domain: {
        name: 'Call Permit Precompile',
        version: '1',
        chainId: 1287,
        verifyingContract: '0x000000000000000000000000000000000000080a',
      },
      message: message,
    });

    return {
      typedData,
      message,
    };
  };

  const method = 'eth_signTypedData_v4';
  const messageData = createPermitMessageData();
  const params = [from, messageData.typedData];

  web3.currentProvider.sendAsync(
    {
      method,
      params,
      from,
    },
    function (err, result) {
      if (err) return console.dir(err);
      if (result.error) {
        alert(result.error.message);
        return console.error('ERROR', result);
      }
      console.log('Signature:' + JSON.stringify(result.result));

      const ethersSignature = ethers.Signature.from(result.result);
      const formattedSignature = {
        r: ethersSignature.r,
        s: ethersSignature.s,
        v: ethersSignature.v,
      };
      console.log(formattedSignature);
    }
  );
};

main();

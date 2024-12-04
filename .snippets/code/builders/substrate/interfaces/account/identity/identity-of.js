import { ApiPromise, WsProvider } from '@polkadot/api';

// Helper function to decode hex to string
const hexToString = (hex) => {
  // Remove '0x' prefix if present
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  // Convert hex to string
  const str = Buffer.from(cleanHex, 'hex').toString('utf8');
  return str;
};

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io'),
  });

  try {
    const account = 'INSERT_ACCOUNT';
    const identity = await api.query.identity.identityOf(account);

    console.log('Raw identity response:', identity.toString());

    if (identity) {
      // Parse the raw response
      const rawResponse = JSON.parse(identity.toString());

      if (rawResponse[0]) {
        const formattedIdentity = {
          judgements: rawResponse[0].judgements,
          deposit: rawResponse[0].deposit,
          info: {
            additional: rawResponse[0].info.additional,
            display: rawResponse[0].info.display.raw
              ? hexToString(rawResponse[0].info.display.raw)
              : null,
            legal: rawResponse[0].info.legal,
            web: rawResponse[0].info.web,
            riot: rawResponse[0].info.riot,
            email: rawResponse[0].info.email,
            pgpFingerprint: rawResponse[0].info.pgpFingerprint,
            image: rawResponse[0].info.image,
            twitter: rawResponse[0].info.twitter,
          },
        };

        console.log(
          'Formatted Identity:',
          JSON.stringify(formattedIdentity, null, 2)
        );
      } else {
        console.log('No identity data found in the response');
      }
    } else {
      console.log('No identity found for this account');
    }
  } catch (error) {
    console.error('Error querying identity:', error);
  } finally {
    await api.disconnect();
  }
};

main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});

import { ApiPromise, WsProvider } from '@polkadot/api';
import { u256 } from '@polkadot/types';

enum MRLTypes {
  // Runtime defined MultiLocation. Allows for XCM versions 2 and 3
  XcmVersionedLocation = 'XcmVersionedLocation',
  // MRL payload (V2) that defines the destination MultiLocation and a
  // fee for the relayer
  XcmRoutingUserActionWithFee = 'XcmRoutingUserActionWithFee',
  // Wrapper object for the MRL payload
  VersionedUserAction = 'VersionedUserAction',
}

// Parachain IDs of each parachain
enum Parachain {
  MoonbaseBeta = 888,
  // Insert additional parachain IDs
}

// List of parachains that use ethereum (20) accounts
const ETHEREUM_ACCOUNT_PARACHAINS = [Parachain.MoonbaseBeta];

// A function that creates a SCALE encoded payload to use with
// transferTokensWithPayload
async function createMRLPayload(
  parachainId: Parachain,
  account: string,
  fee: u256
): Promise<Uint8Array> {
  // Create a multilocation object based on the target parachain's account
  // type
  const isEthereumStyle = ETHEREUM_ACCOUNT_PARACHAINS.includes(parachainId);
  const multilocation = {
    V4: {
      parents: 1,
      interior: {
        X2: [
          { Parachain: parachainId },
          isEthereumStyle
            ? { AccountKey20: { key: account } }
            : { AccountId32: { id: account } },
        ],
      },
    },
  };

  // Creates an API for Moonbeam that defines MRL's special types
  const wsProvider = new WsProvider('wss://wss.api.moonbase.moonbeam.network');
  const api = await ApiPromise.create({
    provider: wsProvider,
    types: {
      [MRLTypes.XcmRoutingUserActionWithFee]: {
        destination: MRLTypes.XcmVersionedLocation,
        fee: 'U256',
      },
      [MRLTypes.VersionedUserAction]: {
        _enum: { V2: MRLTypes.XcmRoutingUserActionWithFee },
      },
    },
  });

  // Format multilocation object as a Polkadot.js type
  const versionedLocation = api.createType(
    MRLTypes.XcmVersionedLocation,
    multilocation
  );
  const userAction = api.createType(MRLTypes.XcmRoutingUserActionWithFee, {
    destination: versionedLocation,
    fee,
  });

  // Wrap and format the MultiLocation object into the precompile's input type
  const versionedUserAction = api.createType(MRLTypes.VersionedUserAction, {
    V2: userAction,
  });

    // Disconnect the API
    api.disconnect();

  // SCALE encode resultant precompile formatted objects
  return versionedUserAction.toU8a();
}

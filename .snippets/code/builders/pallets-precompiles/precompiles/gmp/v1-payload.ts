import { ApiPromise, WsProvider } from '@polkadot/api';

enum MRLTypes {
  // Runtime defined MultiLocation. Allows for XCM versions 2 and 3
  XcmVersionedMultiLocation = 'XcmVersionedMultiLocation',
  // MRL payload (V1) that only defines the destination MultiLocation
  XcmRoutingUserAction = 'XcmRoutingUserAction',
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

// A function that creates a SCALE encoded payload to use with transferTokensWithPayload
async function createMRLPayload(
  parachainId: Parachain,
  account: string
): Promise<Uint8Array> {
  // Create a multilocation object based on the target parachain's account type
  const isEthereumStyle = ETHEREUM_ACCOUNT_PARACHAINS.includes(parachainId);
  const multilocation = {
    V3: {
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
      [MRLTypes.XcmRoutingUserAction]: {
        destination: MRLTypes.XcmVersionedMultiLocation,
      },
      [MRLTypes.VersionedUserAction]: {
        _enum: { V1: MRLTypes.XcmRoutingUserAction },
      },
    },
  });

  // Format multilocation object as a Polkadot.js type
  const versionedMultilocation = api.createType(
    MRLTypes.XcmVersionedMultiLocation,
    multilocation
  );
  const userAction = api.createType(MRLTypes.XcmRoutingUserAction, {
    destination: versionedMultilocation,
  });

  // Wrap and format the MultiLocation object into the precompile's input type
  const versionedUserAction = api.createType(MRLTypes.VersionedUserAction, {
    V1: userAction,
  });

  // SCALE encode resultant precompile formatted objects
  return versionedUserAction.toU8a();
}

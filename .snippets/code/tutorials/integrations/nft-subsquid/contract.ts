import { Contract } from './model';

export const pilots =
  '0x515e20e6275CEeFe19221FC53e77E38cc32b80Fb'.toLowerCase();
export const racecrafts =
  '0x104b904e19fBDa76bb864731A2C9E01E6b41f855'.toLowerCase();

export const contractMapping: Map<string, Contract> = new Map();

// Create a Contract entity object for the Exiled Racers Pilot contract
contractMapping.set(
  pilots,
  new Contract({
    id: pilots,
    name: 'Exiled Racers Pilot',
    symbol: 'EXRP',
    totalSupply: 1729n,
    mintedTokens: [],
  })
);

// Create a Contract entity object for the Exiled Racers Racecraft contract
contractMapping.set(
  racecrafts,
  new Contract({
    id: racecrafts,
    name: 'Exiled Racers Racecraft',
    symbol: 'EXRR',
    totalSupply: 1617n,
    mintedTokens: [],
  })
);

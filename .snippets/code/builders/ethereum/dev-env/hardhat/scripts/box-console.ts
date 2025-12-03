// scripts/box-console.ts
import { network } from 'hardhat';

const CONTRACT_ADDRESS = "INSERT_CONTRACT_ADDRESS";
const VALUE_TO_STORE = 5n;

async function main() {
  if (CONTRACT_ADDRESS === "INSERT_CONTRACT_ADDRESS") {
    throw new Error(
      "Update CONTRACT_ADDRESS with the Box deployment address (0x...).",
    );
  }

  if (!CONTRACT_ADDRESS.startsWith("0x")) {
    throw new Error("CONTRACT_ADDRESS must start with 0x.");
  }

  const { ethers } = await network.connect("moonbase");
  const [signer] = await ethers.getSigners();

  console.log(`Using signer ${signer.address}`);
  console.log(`Attaching to Box at ${CONTRACT_ADDRESS}`);

  const Box = await ethers.getContractFactory("Box");
  const box = await Box.attach(CONTRACT_ADDRESS);

  const current = (await box.retrieve()).toString();
  console.log(`Current stored value: ${current}`);

  console.log(`Calling store(${VALUE_TO_STORE})...`);
  const tx = await box.store(VALUE_TO_STORE);
  console.log(`Submitted tx ${tx.hash}, waiting for confirmation...`);
  await tx.wait();

  const updated = (await box.retrieve()).toString();
  console.log(`Updated stored value: ${updated}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

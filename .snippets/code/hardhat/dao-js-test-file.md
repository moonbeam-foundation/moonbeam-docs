```javascript
//Import hardhat and hardhat toolbox
const { ethers } = require("hardhat");
require("@nomicfoundation/hardhat-toolbox");

// Import Chai to use its assertion functions here
const { expect } = require("chai");

// Indicate the collator the DAO wants to delegate to
const targetCollator = "0x4c5A56ed5A4FF7B09aA86560AfD7d383F4831Cce";

// `describe` receives the name of a section of your test suite, and a
// callback. The callback must define the tests of that section. This callback
// can't be an async function
describe("Dao contract", function () {
  async function deployDao() {

    // Get the ContractFactory and Signers here
    const [deployer, member1] = await ethers.getSigners();
    const delegationDao = await ethers.getContractFactory("DelegationDAO");

    // Deploy the staking DAO and wait for the deployment transaction to be confirmed
    const deployedDao = await delegationDao.deploy(targetCollator, deployer.address);
    await deployedDao.deployed();

    //Add a new member to the DAO
    await deployedDao.grant_member(member1.address);

    // Return the deployed DAO to allow the tests to access and interact with it
    return { deployedDao };
  }

  // You can nest calls to create subsections
describe("Deployment", function () {
    // `it` is another Mocha function This is the one you use to define each
    // of your tests. It receives the test name, and a callback function
    //
    // If the callback function is async, Mocha will `await` it
    it("The DAO should store the correct target collator", async function () {

      //Set up our test environment by calling deployDao.
      const { deployedDao } = await deployDao();

      // `expect` receives a value and wraps it in an assertion object.
      // This test will pass if the DAO stored the correct target collator
      expect(await deployedDao.target()).to.equal(targetCollator);
    });

    // The following test cases should be added here.
    it("The DAO should initially have 0 funds in it", async function () {
      const { deployedDao } = await deployDao();

      //This test will pass if the DAO has no funds as expected before any contributions.
      expect(await deployedDao.totalStake()).to.equal(0);
  });

    it("Non-admins should not be able to grant membership", async function () {
      const { deployedDao } = await deployDao();

      // We ask ethers for two accounts back this time.
      const [deployer, member1] = await ethers.getSigners();

      // We use connect to call grant_member from member1's account instead of admin.
      // This test will succeed if the function call reverts and fails if the call succeeds.
      await expect(deployedDao.connect(member1).grant_member("0x0000000000000000000000000000000000000000")).to.be.reverted;
  });

    it("DAO members should be able to access member only functions", async function () {
      const { deployedDao } = await deployDao();

      // We ask ethers for two accounts back this time.
      const [deployer, member1] = await ethers.getSigners();

      // This test will succeed if the DAO member can call the member only function.
      // We use connect here to call the function from the account of the new member.
      expect(await deployedDao.connect(member1).check_free_balance()).to.equal(0);
  });
  });
});
```
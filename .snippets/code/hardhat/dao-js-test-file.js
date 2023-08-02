// Import Ethers
const { ethers } = require('hardhat');
// Import Chai to use its assertion functions here
const { expect } = require('chai');

// Indicate the collator the DAO wants to delegate to
const targetCollator = '0x4c5A56ed5A4FF7B09aA86560AfD7d383F4831Cce';

// The describe function receives the name of a section of your test suite, and a
// callback. The callback must define the tests of that section. This callback
// can't be an async function
describe('Dao contract', function () {
  async function deployDao() {
    // Get the contract factory and signers here
    const [deployer, member1] = await ethers.getSigners();
    const delegationDao = await ethers.getContractFactory('DelegationDAO');

    // Deploy the staking DAO and wait for the deployment transaction to be confirmed
    const deployedDao = await delegationDao.deploy(
      targetCollator,
      deployer.address
    );
    await deployedDao.waitForDeployment();

    // Return the deployed DAO and the first member of the DAO to allow the tests to 
    // access and interact with them
    return { deployedDao, member1 };
  }

  // You can nest calls to create subsections
  describe('Deployment', function () {
    // Mocha's it function is used to define each of your tests.
    // It receives the test name, and a callback function
    //
    // If the callback function is async, Mocha will await it
    it('should store the correct target collator in the DAO', async function () {
      // Set up our test environment by calling deployDao
      const { deployedDao } = await deployDao();

      // The expect function receives a value and wraps it in an assertion object.
      // This test will pass if the DAO stored the correct target collator
      expect(await deployedDao.target()).to.equal(targetCollator);
    });

    // The following test cases should be added here
    it('should initially have 0 funds in the DAO', async function () {
      const { deployedDao } = await deployDao();

      // This test will pass if the DAO has no funds as expected before any contributions
      expect(await deployedDao.totalStake()).to.equal(0);
    });

    it('should not allow non-admins to grant membership', async function () {
      const { deployedDao, member1 } = await deployDao();

      // We use connect to call grant_member from member1's account instead of admin.
      // This test will succeed if the function call reverts and fails if the call succeeds
      await expect(
        deployedDao
          .connect(member1)
          .grant_member('0x0000000000000000000000000000000000000000')
      ).to.be.reverted;
    });

    it('should only allow members to access member-only functions', async function () {
      const { deployedDao, member1 } = await deployDao();

      // Add a new member to the DAO
      const transaction = await deployedDao.grant_member(member1.address);
      await transaction.wait();

      // This test will succeed if the DAO member can call the member-only function.
      // We use connect here to call the function from the account of the new member
      expect(await deployedDao.connect(member1).check_free_balance()).to.equal(
        0
      );
    });
  });
});

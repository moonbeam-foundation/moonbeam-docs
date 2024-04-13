// Import Ethers
const { ethers } = require('hardhat');
// Import Chai to use its assertion functions here
const { expect } = require('chai');

// This is for demonstration purposes only on testnet
// Never store production private keys in a js file
const privateKey1 = 'INSERT_PRIVATE_KEY';
const wallet1 = new ethers.Wallet(privateKey1, ethers.provider);

const privateKey2 = 'INSERT_ANOTHER_PRIVATE_KEY';
const wallet2 = new ethers.Wallet(privateKey2, ethers.provider);

// Indicate the collator the DAO wants to delegate to
// For Moonbase Local Node, use: 0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac
// For Moonbase Alpha, use: 0x12E7BCCA9b1B15f33585b5fc898B967149BDb9a5
const targetCollator = 'INSERT_COLLATOR_ADDRESS';

// The describe function receives the name of a section of your test suite, and a
// callback. The callback must define the tests of that section. This callback
// can't be an async function
describe('Dao contract', function () {
  async function deployDao() {
    const delegationDaoFactory = await ethers.getContractFactory('DelegationDAO', wallet2);
    
     // Deploy the staking DAO and wait for the deployment transaction to be confirmed
    try {
        const deployedDao = await delegationDaoFactory.deploy(targetCollator, wallet2.address);
        await deployedDao.waitForDeployment(); // Correct way to wait for the transaction to be mined
        return { deployedDao };
    } catch (error) {
        console.error("Failed to deploy contract:", error);
        return null; // Return null to indicate failure
    }
  }

  describe('Deployment', function () {
    // Test case to check that the correct target collator is stored
    it('should store the correct target collator in the DAO', async function () {
        const deployment = await deployDao();
        if (!deployment || !deployment.deployedDao) {
            throw new Error("Deployment failed; DAO contract was not deployed.");
        }
        const { deployedDao } = deployment;
        expect(await deployedDao.getTarget()).to.equal('0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac');
    });

    // Test case to check that the DAO has 0 funds at inception
    it('should initially have 0 funds in the DAO', async function () {
        const { deployedDao } = await deployDao();
        expect(await deployedDao.totalStake()).to.equal(0);
    });

    // Test case to check that non-admins cannot grant membership
    it('should not allow non-admins to grant membership', async function () {
        const { deployedDao } = await deployDao();
        // Connect the non-admin wallet to the deployed contract
        const deployedDaoConnected = deployedDao.connect(wallet1);
        const tx = deployedDaoConnected.grant_member('0x0000000000000000000000000000000000000000');

        // Check that the transaction reverts, not specifying any particular reason
        await expect(tx).to.be.reverted;
    });

    // Test case to check that members can access member only functions
    it('should only allow members to access member-only functions', async function () {
        const { deployedDao } = await deployDao();

        // Connect the wallet1 to the deployed contract and grant membership
        const deployedDaoConnected = deployedDao.connect(wallet2);
        const grantTx = await deployedDaoConnected.grant_member(wallet1.address);
        await grantTx.wait();

        // Check the free balance using the member's credentials
        const checkTx = deployedDaoConnected.check_free_balance();

        // Since check_free_balance() does not modify state, we expect it not to be reverted and check the balance
        await expect(checkTx).to.not.be.reverted;
        expect(await checkTx).to.equal(0);
  });
  });
});

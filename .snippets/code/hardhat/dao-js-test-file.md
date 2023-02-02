```javascript
const { ethers } = require("hardhat");
require("@nomicfoundation/hardhat-toolbox");
const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const targetCollator = "0x4c5A56ed5A4FF7B09aA86560AfD7d383F4831Cce";

describe("Dao contract", function () {
  async function deployDaoFixture() {

    const [deployer] = await ethers.getSigners();
    const delegationDao = await ethers.getContractFactory("DelegationDAO");
    
    const deployedDao = await delegationDao.deploy(targetCollator, deployer.address);
    await deployedDao.deployed();
    return { deployedDao };
  }

  async function deployDaoFixtureWithMembers() {
    const [deployer, member1] = await ethers.getSigners();

    const delegationDao = await ethers.getContractFactory("DelegationDAO");
    const deployedDao = await delegationDao.deploy(targetCollator, deployer.address);

    await deployedDao.deployed();
    await deployedDao.grant_member(member1.address);
    return { deployedDao};
  }

describe("Deployment", function () {
    it("Should have correct target collator", async function () {
      const { deployedDao, deployer } = await loadFixture(deployDaoFixture);
      expect(await deployedDao.target()).to.equal(targetCollator);
});

    it("The DAO should initially have 0 funds in it", async function () {
      const { deployedDao, deployer } = await loadFixture(deployDaoFixture);
      expect(await deployedDao.totalStake()).to.equal(0);
});

    it("Non-admins should not be able to grant membership", async function () {
      const { deployedDao, deployer } = await loadFixture(deployDaoFixture);
      const [account1, otherAddress] = await ethers.getSigners();
      await expect(deployedDao.connect(otherAddress).grant_member("0x0000000000000000000000000000000000000000")).to.be.reverted;
});

    it("DAO members should be able to access member only functions", async function () {
      const { deployedDao, deployer } = await loadFixture(deployDaoFixtureWithMembers);
      const [account1, member1] = await ethers.getSigners();
      expect(await deployedDao.connect(member1).check_free_balance()).to.equal(0);
    });
  });
});
```
```javascript
const { ethers } = require("hardhat");
require("@nomicfoundation/hardhat-toolbox");
const { expect } = require("chai");
const targetCollator = "0x4c5A56ed5A4FF7B09aA86560AfD7d383F4831Cce"

describe("Dao contract", function () {
  async function deployDao() {

    const [deployer, member1] = await ethers.getSigners();
    const delegationDao = await ethers.getContractFactory("DelegationDAO");

    const deployedDao = await delegationDao.deploy(targetCollator, deployer.address);
    await deployedDao.deployed();
    await deployedDao.grant_member(member1.address);
    return { deployedDao };
  }

describe("Deployment", function () {
    it("The DAO should store the correct target collator", async function () {
      const { deployedDao } = await deployDao();
      expect(await deployedDao.target()).to.equal(targetCollator);
});

    it("The DAO should initially have 0 funds in it", async function () {
      const { deployedDao } = await deployDao();
      expect(await deployedDao.totalStake()).to.equal(0);
});

    it("Non-admins should not be able to grant membership", async function () {
      const { deployedDao } = await deployDao();
      const [admin, member1] = await ethers.getSigners();
      await expect(deployedDao.connect(member1).grant_member("0x0000000000000000000000000000000000000000")).to.be.reverted;
});

    it("DAO members should be able to access member only functions", async function () {
      const { deployedDao } = await deployDao();
      const [admin, member1] = await ethers.getSigners();
      expect(await deployedDao.connect(member1).check_free_balance()).to.equal(0);
    });
  });
});
```
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DemoNFT deployment", function () {
  let demoNFT;
  let owner;

  this.beforeEach(async function() {
    // Executed before each test
    [owner] = await ethers.getSigners();
    const DemoNFT = await ethers.getContractFactory("DemoNFT");
    demoNFT = await DemoNFT.deploy("https://test.local/");
    await demoNFT.deployed();
  })

  it("Deploy", async function () {
    console.log("NFT Contract address: " + await demoNFT.address);
  });


  it("Mint", async function () {

    expect((await demoNFT.createNFT())).to.eq(1);

  });  
});

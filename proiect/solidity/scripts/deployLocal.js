require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function deploy() {
  const [marketPlaceOwnerSigner, commissionsOwnerSigner, user1, user2] =
    await ethers.getSigners();

  let commissionsFactory = await ethers.getContractFactory("Commissions");
  let commissions = await commissionsFactory
    .connect(commissionsOwnerSigner)
    .deploy();
  await commissions.deployed();
  console.log("commissions address: ", commissions.address);

  let marketPlaceFactory = await ethers.getContractFactory("MarketPlace");
  let marketPlace = await marketPlaceFactory
    .connect(marketPlaceOwnerSigner)
    .deploy(commissions.address);
  await marketPlace.deployed();
  console.log("marketPlace address: ", marketPlace.address);

  console.log("Contracts deployed")
}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

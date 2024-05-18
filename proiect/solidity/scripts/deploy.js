require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function deploy() {
  const marketPlaceOwnerAddress = "0x0aE1B42a97dDf65ab60755C3F0Cf18949dB7D84F";
  const commissionsOwnerAddress = "0x7DE6A3EBDBA87182901f0bB17d9fB584D9FAa2d1";

  const marketPlaceOwnerSigner = ethers.provider.getSigner(
    marketPlaceOwnerAddress
  );
  const commissionsOwnerSigner = ethers.provider.getSigner(
    commissionsOwnerAddress
  );

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

  console.log("Contracts deployed");
}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

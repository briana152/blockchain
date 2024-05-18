require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function interact() {
  const marketPlaceOwnerAddress = "0x1b5b0a22AAc98F35291896815AE0e966bd2415B6";
  const commissionsOwnerAddress = "0x9d5c7802ff8e22E3eF84dFd191f933E1cf5F5B61";
  const user1Address = "0xad64657b2c10352d2430fBF55Dc404Ca9f6Eb730";
  const user2Address = "0x212095520080EB40627E40D35C059c56675CE443";

  const marketPlaceOwnerSigner = ethers.provider.getSigner(
    marketPlaceOwnerAddress
  );
  const commissionsOwnerSigner = ethers.provider.getSigner(
    commissionsOwnerAddress
  );
  const user1 = ethers.provider.getSigner(user1Address);
  const user2 = ethers.provider.getSigner(user2Address);

  let deployedCommissionsAddress = "0xb817b2282AA32600AAB004917Cf9bB2d5AB35a29";
  let commissions = await ethers.getContractAt(
    "Commissions",
    deployedCommissionsAddress
  );

  let deployedMarketPlaceAddress = "0x69fD8449255F046C3e9f1E8b18BeEf2dEf225045";
  let marketPlace = await ethers.getContractAt(
    "MarketPlace",
    deployedMarketPlaceAddress
  );

  let amountProd1 = ethers.utils.parseUnits("1", 10); // 10^10
  let amountProd2 = ethers.utils.parseUnits("3", 11); // 3 * 10^11

  let addProductTx = await marketPlace.addProduct("Product 1", 4, amountProd1);
  await addProductTx.wait();
  console.log("Product added");

  let addProduct2Tx = await marketPlace.addProduct("Product 2", 2, amountProd2);
  await addProduct2Tx.wait();
  console.log("Product 2 added");

  let products = await marketPlace.getProducts();
  console.log("Products: ", products);

  let totalPrice2Product0 = await marketPlace.getTotalPriceForProduct(0, 2);

  let overwrite = {
    value: totalPrice2Product0,
  };

  console.log("User1 balance: ", (await user1.getBalance()).toString());
  console.log(
    "Commission owner balance: ",
    (await commissionsOwnerSigner.getBalance()).toString()
  );
  let buyProductTx = await marketPlace
    .connect(user1)
    .buyProduct(0, 2, overwrite);
  await buyProductTx.wait();
  console.log("Product bought");
  console.log("User1 balance after: ", (await user1.getBalance()).toString());
  console.log(
    "Commission owner balance after: ",
    (await commissionsOwnerSigner.getBalance()).toString()
  );

  let totalCommissions = await commissions
    .connect(commissionsOwnerSigner)
    .getTotalCommissions();
  console.log("Total commissions: ", totalCommissions.toString());
}

interact()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

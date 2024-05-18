require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function interact() {

  const [marketPlaceOwnerSigner, commissionsOwnerSigner, user1, user2] = await ethers.getSigners();

  console.log("MarketPlace owner address: ", marketPlaceOwnerSigner.address);
  console.log("Commissions owner address: ", commissionsOwnerSigner.address);
  console.log("User1 address: ", user1.address);
  console.log("User2 address: ", user2.address);


  let deployedCommissionsAddress = "0x8464135c8F25Da09e49BC8782676a84730C318bC";
  let commissions = await ethers.getContractAt(
    "Commissions",
    deployedCommissionsAddress
  );

  let deployedMarketPlaceAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  let marketPlace = await ethers.getContractAt(
    "MarketPlace",
    deployedMarketPlaceAddress
  );

  let amountProd1 = ethers.utils.parseUnits("1", 10) // 10^10
  let amountProd2 = ethers.utils.parseUnits("3", 11) // 3 * 10^11

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
    value: totalPrice2Product0
  };

  console.log("User1 balance: ", (await user1.getBalance()).toString());
  console.log("Commission owner balance: ", (await commissionsOwnerSigner.getBalance()).toString());
  let buyProductTx = await marketPlace.connect(user1).buyProduct(0, 2, overwrite);
  await buyProductTx.wait();
  console.log("Product bought");
  console.log("User1 balance after: ", (await user1.getBalance()).toString());
  console.log("Commission owner balance after: ", (await commissionsOwnerSigner.getBalance()).toString());


  let totalCommissions = await commissions.connect(commissionsOwnerSigner).getTotalCommissions();
  console.log("Total commissions: ", totalCommissions.toString());

  

}

interact()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

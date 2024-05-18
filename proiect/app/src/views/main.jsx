import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import web3 from "web3";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import { toast } from "react-toastify";

const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

const commissionsContractAddress = "0xC432c59fAd4E43bCa02bEAFA4cEb7FDf6F60aDcC";
const marketPlaceContractAddress = "0x7F65F43358e0732AD81Fe1C3DC31048B9fEfcDA9";

const commissionsContractAbi = [
  "function calculateCommission(uint256 amount) public pure returns (uint256)",
  "function getTotalCommissions() public view returns (uint256)",
];

const commissionsContract = new ethers.Contract(
  commissionsContractAddress,
  commissionsContractAbi,
  provider
);

const marketPlaceContractAbi = [
  "function checkStringEquality(string memory a, string memory b) internal pure returns (bool)",
  "function addStock(uint256 stockId, uint256 amount) public",
  "function removeStock(uint256 stockId, uint256 amount) public",
  "function changePrice(uint256 stockId, uint256 price) public",
  "function buyProduct(uint256 stockId, uint256 amount) public payable",
  "function giveCommission(uint256 price) public",
  "function getBuyers() public view returns (address[] memory)",
  "function getTotalSales() public view returns (uint256)",
  "function getBestBuyer() public view returns (address)",
  "function addProduct(string memory name, uint256 amount, uint256 price) public",
  "function removeProduct(uint256 stockId) public",
  "function getProduct(uint256 stockId) public view returns (string memory, uint256, uint256)",
  "function getStock() public view returns (uint256[] memory)",
  "function getProducts() public view returns (string[] memory)",
  "function getTotalPriceForProduct(uint256 stockId, uint256 amount) public view returns (uint256)",
];

const marketPlaceContract = new ethers.Contract(
  marketPlaceContractAddress,
  marketPlaceContractAbi,
  provider
);

export const MainPage = () => {
  const [calculatedCommission, setCalculatedCommission] = useState(0);
  const [totalCommissions, setTotalCommissions] = useState(0);
  const [commissionInput, setCommissionInput] = useState(0);
  const [stock, setStock] = useState([]);
  const [stockInput, setStockInput] = useState([]);
  const [price, setPrice] = useState(0);
  const [priceInput, setPriceInput] = useState(0);
  const [amount, setAmount] = useState(0);
  const [name, setName] = useState("");
  const [buyer, setBuyer] = useState("");
  const [buyers, setBuyers] = useState([]);
  const [totalSales, setTotalSales] = useState("");
  const [bestBuyer, setBestBuyer] = useState("");
  const [productInput, setProductInput] = useState("");
  const [products, setProducts] = useState([]);
  const [productsDetails, setProductsDetails] = useState([]);
  const [amountInput, setAmountInput] = useState("");

  const handleGetTotalCommissions = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    try {
      const totalCommissions = await commissionsContract
        .connect(signer)
        .getTotalCommissions();
      console.log("Total commissions: ", parseInt(totalCommissions));
      setTotalCommissions(parseInt(totalCommissions));
      toast.success("Commissions value obtained successfully", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Only the owner can initiate this operation!", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const handleCalculateCommission = async (input) => {
    try {
      const commission = await commissionsContract.calculateCommission(input);
      console.log("Commission: ", parseInt(commission));
      setCalculatedCommission(parseInt(commission));
      toast.success("Commission calculated successfully", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.log("Error: ", error);
      if (error.message.includes("out-of-bounds"))
        toast.error("Negative Value", {
          position: "top-center",
          autoClose: 3000,
        });
      else {
        toast.error("Invalid Value", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    }
  };

  const handleAddStock = async (stockId, amount) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    try {
      const addStock = await marketPlaceContract
        .connect(signer)
        .addStock(stockId, amount);
      console.log("Stock added: ", addStock);
      toast.success("Stock added successfully", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.log("Error: ", error);
      if (error.message.includes("Product does not exist")) {
        toast.error("Product does not exist!", {
          position: "top-center",
          autoClose: 3000,
        });
      } else
        toast.error("Only the owner can initiate this operation!", {
          position: "top-center",
          autoClose: 3000,
        });
    }
  };

  const handleRemoveStock = async (stockId, amount) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    try {
      const removeStock = await marketPlaceContract
        .connect(signer)
        .removeStock(stockId, amount);
      console.log("Stock removed: ", removeStock);
      toast.success("Stock removed successfully", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.log("Error: ", error);
      if (error.message.includes("Not enough stock available")) {
        toast.error("Not enough stock available!", {
          position: "top-center",
          autoClose: 3000,
        });
      } else
        toast.error("Only the owner can initiate this operation!", {
          position: "top-center",
          autoClose: 3000,
        });
    }
  };

  const handleChangePrice = async (stockId, price) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    try {
      const changePrice = await marketPlaceContract
        .connect(signer)
        .changePrice(stockId, price);
      console.log("Price changed: ", changePrice);
      toast.success("Price changed successfully", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.log("Error: ", error);
      if (error.message.includes("Price must be greater than 0")) {
        toast.error("Price must be greater than 0!", {
          position: "top-center",
          autoClose: 3000,
        });
      } else
        toast.error("Only the owner can initiate this operation!", {
          position: "top-center",
          autoClose: 3000,
        });
    }
  };

  const handldeAddProduct = async (name, amount, price) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    try {
      const addProduct = await marketPlaceContract
        .connect(signer)
        .addProduct(name, amount, price);
      console.log("Product added: ", addProduct);
      toast.success("Product added successfully", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.log("Error: ", error);
      if (error.message.includes("Product already exists"))
        toast.error("Product already exists!", {
          position: "top-center",
          autoClose: 3000,
        });
      else if (error.message.includes("out-of-bounds")) {
        toast.error("Value must be greater than 0!", {
          position: "top-center",
          autoClose: 3000,
        });
      } else
        toast.error("Only the owner can initiate this operation!", {
          position: "top-center",
          autoClose: 3000,
        });
    }
  };

  const handleBuyProduct = async (stockId, amount) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    try {
      const totalPrice = await marketPlaceContract.getTotalPriceForProduct(
        stockId,
        amount
      );
      await marketPlaceContract
        .connect(signer)
        .buyProduct(stockId, amount, { value: totalPrice });
      console.log("Product bought");
      toast.success("Product bought successfully", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.log("Error: ", error);
      if (error.message.includes("Amount must be greater than 0")) {
        toast.error("Amount must be greater than 0!", {
          position: "top-center",
          autoClose: 3000,
        });
      } else if (error.message.includes("Not enough stock available")) {
        toast.error("Not enough stock available!", {
          position: "top-center",
          autoClose: 3000,
        });
      } else if (error.message.includes("Insufficient balance!")) {
        toast.error("Insufficient balance!", {
          position: "top-center",
          autoClose: 3000,
        });
      } else
        toast.error("Product not bought", {
          position: "top-center",
          autoClose: 3000,
        });
    }
  };

  const handleGetBuyers = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    try {
      const buyers = await marketPlaceContract.connect(signer).getBuyers();
      console.log("Buyers: ", buyers);
      let filteredBuyers = [];
      buyers.map((buyer) => {
        if (!filteredBuyers.includes(buyer)) filteredBuyers.push(buyer);
      });
      setBuyers(filteredBuyers);
      toast.success("Buyers obtained successfully", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Only the owner can initiate this operation!", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const handleGetTotalSales = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    try {
      const totalSales = await marketPlaceContract
        .connect(signer)
        .getTotalSales();
      console.log("Total sales: ", parseInt(totalSales));
      setTotalSales(parseInt(totalSales));
      toast.success("Total sales obtained successfully", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Only the owner can initiate this operation!", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const handleGetBestBuyer = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    try {
      const bestBuyer = await marketPlaceContract
        .connect(signer)
        .getBestBuyer();
      console.log("Best buyer: ", bestBuyer);
      setBestBuyer(bestBuyer);
      toast.success("Best buyer obtained successfully", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Only the owner can initiate this operation!", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const handleGetProducts = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    try {
      const products = await marketPlaceContract.connect(signer).getProducts();
      console.log("Products: ", products);
      setProducts(products);
      toast.success("Products obtained successfully", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Only the owner can initiate this operation!", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const handleGetStock = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    try {
      const stock = await marketPlaceContract.connect(signer).getStock();
      console.log("Stock: ", stock);
      setStock(stock);
      toast.success("Stock obtained successfully", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Only the owner can initiate this operation!", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const handleGetAllProductsDetails = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    try {
      const products = await marketPlaceContract.connect(signer).getProducts();
      console.log("Products: ", products);
      const productsLen = products.length;
      const productsDetails = [];
      for (let i = 0; i < productsLen; i++) {
        const product = await marketPlaceContract.connect(signer).getProduct(i);
        productsDetails.push(product);
      }
      setProductsDetails(productsDetails);
      console.log("Products Details: ", productsDetails);
      toast.success("Products obtained successfully", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Only the owner can initiate this operation!", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <div>
      {/* COMMISSION CONTRACT */}
      <div style={{display: "flex", flexDirection: "column",gap: "10px", padding: "10px", backgroundColor: "#E4DEF7"}}>
      <h2>Commissions Contract</h2>
      <button
        type="button"
        className="btn btn-outline-primary"
        style={{width: "fit-content",height:"fit-content"}}
        onClick={handleGetTotalCommissions}
      >
        Get Commissions
      </button>
      <p>
        Total commissions: <strong>{totalCommissions}</strong>
      </p>
      <div style={{display: "flex", flexDirection: "row", gap: "10px"}}>
        <input
          className="form-control"
          placeholder="Enter commission amount"
          style={{ width: "200px" }}
          onChange={(e) => setCommissionInput(parseInt(e.target.value))}
        />
        <button
          type="button"
          className="btn btn-outline-primary"
          // disabled={commissionInput === 0}
          onClick={() => handleCalculateCommission(commissionInput)}
        >
          Calculate Commissions
        </button>
      </div>
      <p>
        Calculated Commission: <strong>{calculatedCommission}</strong>
      </p>
      </div>
      {/* MARKETPLACE CONTRACT */}
      <div style={{display:"flex", flexDirection:"column", backgroundColor:"#F1F7DE"}}>
        <h2>MarketPlace Contract</h2>


        <div style={{display: "flex", gap: "10px", padding: "10px"}}>
        <input
          className="form-control"
          placeholder="Enter stock id"
          style={{ width: "200px", marginBottom: "10px" }}
          onChange={(e) => setProductInput(parseInt(e.target.value))}
        />
        <input
          className="form-control"
          placeholder="Enter amount"
          style={{ width: "200px", marginBottom: "10px" }}
          onChange={(e) => setAmountInput(parseInt(e.target.value))}
        />
        <button
          type="button"
          className="btn btn-outline-primary"
          style={{width: "fit-content", height:"fit-content"}}
          onClick={() => handleBuyProduct(productInput, amountInput)}
        >
          Buy Product
        </button>
      </div>

        <div style={{display:"flex", gap:"10px", padding:"10px", height:"fit-content"}}>
        <input
          className="form-control"
          placeholder="Enter name"
          style={{ width: "200px", marginBottom: "10px" }}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="form-control"
          placeholder="Enter amount"
          style={{ width: "200px", marginBottom: "10px" }}
          onChange={(e) => setAmount(parseInt(e.target.value))}
        />
        <input
          className="form-control"
          placeholder="Enter price"
          style={{ width: "200px", marginBottom: "10px" }}
          onChange={(e) => setPrice(parseInt(e.target.value))}
        />
        <button
          type="button"
          className="btn btn-outline-primary"
          style={{width: "fit-content", height: "fit-content"}}
          onClick={() => handldeAddProduct(name, amount, price)}
        >
          Add Product
        </button>
      </div>
      
      <div style={{display: "flex", gap: "10px", padding: "10px"}}>
        <button
          type="button"
          className="btn btn-outline-primary"
          style={{width: "fit-content", height:"fit-content"}}
          onClick={handleGetProducts}
        >
          Get Products Names
        </button>
        <p>
          Products: <strong>{products.join(", ")}</strong>
        </p>
      </div>

      <div style={{display: "flex", gap: "10px", padding: "10px"}}>
        <button
          type="button"
          className="btn btn-outline-primary"
          style={{width: "fit-content",height:"fit-content"}}
          onClick={handleGetAllProductsDetails}
        >
          Get Products Details
        </button>

        {productsDetails.length > 0 && (
          <table
            style={{
              width: "40%",
              border: "1px solid black",
              borderCollapse: "collapse",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            <tr
              style={{
                border: "1px solid black",
                borderCollapse: "collapse",
                textAlign: "center",
              }}
            >
              <th
                style={{
                  border: "1px solid black",
                  borderCollapse: "collapse",
                  textAlign: "center",
                }}
              >
                Product
              </th>
              <th
                style={{
                  border: "1px solid black",
                  borderCollapse: "collapse",
                  textAlign: "center",
                }}
              >
                Stock
              </th>
              <th
                style={{
                  border: "1px solid black",
                  borderCollapse: "collapse",
                  textAlign: "center",
                }}
              >
                Price
              </th>
            </tr>
            {productsDetails.map((product) => {
              console.log("Product: ", product);
              return (
                <tr
                  style={{
                    border: "1px solid black",
                    borderCollapse: "collapse",
                    textAlign: "center",
                  }}
                >
                  <td
                    style={{
                      border: "1px solid black",
                      borderCollapse: "collapse",
                      textAlign: "center",
                    }}
                  >
                    {product[0]}
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      borderCollapse: "collapse",
                      textAlign: "center",
                    }}
                  >
                    {product[1].toString()}
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      borderCollapse: "collapse",
                      textAlign: "center",
                    }}
                  >
                    {product[2].toString()}
                  </td>
                </tr>
              );
            })}
          </table>
        )}
      </div>
      
      <div style={{display: "flex", gap: "10px", padding: "10px"}}>
        <input
          className="form-control"
          placeholder="Enter stock id"
          style={{ width: "200px", marginBottom: "10px" }}
          onChange={(e) => setStockInput(parseInt(e.target.value))}
        />
        <input
          className="form-control"
          placeholder="Enter amount"
          style={{ width: "200px", marginBottom: "10px" }}
          onChange={(e) => setAmountInput(parseInt(e.target.value))}
        />
        <button
          type="button"
          className="btn btn-outline-primary"
          style={{width: "fit-content", height: "fit-content"}}
          onClick={() => handleAddStock(stockInput, amountInput)}
        >
          Add Stock
        </button>
      </div>
      
      <div style={{display: "flex", gap: "10px", padding: "10px"}}>
        <button
          type="button"
          className="btn btn-outline-primary"
          style={{width: "fit-content", height:"fit-content"}}
          onClick={handleGetStock}
        >
          Get Stock
        </button>
        <p>
          Stock: <strong>{stock.join(", ")}</strong>
        </p>
      </div>

      <div style={{display: "flex", gap: "10px", padding: "10px"}}>
        <input
          className="form-control"
          placeholder="Enter stock id"
          style={{ width: "200px", marginBottom: "10px" }}
          onChange={(e) => setStockInput(parseInt(e.target.value))}
        />
        <input
          className="form-control"
          placeholder="Enter amount"
          style={{ width: "200px", marginBottom: "10px" }}
          onChange={(e) => setAmountInput(parseInt(e.target.value))}
        />
        <button
          type="button"
          className="btn btn-outline-primary"
          style={{width: "fit-content", height:"fit-content"}}
          onClick={() => handleRemoveStock(stockInput, amountInput)}
        >
          Remove Stock
        </button>
      </div>
      
      <div style={{display: "flex", gap: "10px", padding: "10px"}}>
        <input
          className="form-control"
          placeholder="Enter stock id"
          style={{ width: "200px", marginBottom: "10px" }}
          onChange={(e) => setStockInput(parseInt(e.target.value))}
        />
        <input
          className="form-control"
          placeholder="Enter price"
          style={{ width: "200px", marginBottom: "10px" }}
          onChange={(e) => setPriceInput(parseInt(e.target.value))}
        />
        <button
          type="button"
          className="btn btn-outline-primary"
          style={{width: "fit-content", height:"fit-content"}}
          onClick={() => handleChangePrice(stockInput, priceInput)}
        >
          Change Price
        </button>
      </div>

      <div style={{display: "flex", gap: "10px", padding: "10px"}}>
        <button
          type="button"
          className="btn btn-outline-primary"
          style={{width: "fit-content", height:"fit-content"}}
          onClick={handleGetBuyers}
        >
          Get Buyers
        </button>
        <p>
          Buyers: <strong>{buyers.join(", ")}</strong>
        </p>
      </div>
      
      <div style={{display: "flex", gap: "10px", padding: "10px"}}>
        <button
          type="button"
          className="btn btn-outline-primary"
          style={{width: "fit-content", height:"fit-content"}}
          onClick={handleGetTotalSales}
        >
          Get Total Sales
        </button>
        <p>
          Total Sales: <strong>{totalSales}</strong>
        </p>
      </div>
      <div style={{display: "flex", gap: "10px", padding: "10px"}}>
        <button
          type="button"
          className="btn btn-outline-primary"
          style={{width: "fit-content", height:"fit-content"}}
          onClick={handleGetBestBuyer}
        >
          Get Best Buyer
        </button>
        <p>
          Best Buyer: <strong>{bestBuyer}</strong>
        </p>
      </div>
    </div>

    </div>

  );
};

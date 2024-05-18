// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.18;
import "hardhat/console.sol";
import "./Commissions.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

// n produse; stock[i] = nr. produse i 

contract MarketPlace is Ownable {
    uint256[] public stock;
    Commissions commissions;
    uint256[] public prices;
    uint256 totalSales;
    address[] public buyers;
    string[] public products;
    mapping(address => uint256) public buyerToAmount;

    modifier amountPositive(uint256 amount) {
        console.log(" HEREEEEEEEEE Amount: ", amount);
        require(amount > 0, "Amount must be greater than 0");
        _;
    }

    modifier pricePositive(uint256 price) {
        require(price > 0, "Price must be greater than 0");
        _;
    }

    modifier stockAvailable(uint256 stockId, uint256 amount) {
        require(stock[stockId] >= amount, "Not enough stock available");
        _;
    }

    modifier stockExists(uint256 stockId) {
        require(stock.length > stockId, "Product does not exist");
        _;
    }

    modifier hasSufficientBalance(uint256 stockId, uint256 amount) {
        require(
            msg.sender.balance >= prices[stockId] * amount,
            "Insufficient balance!"
        );
        _;
    }

    modifier productExists(uint256 stockId) {
        require(stock[stockId] > 0, "Product does not exist");
        _;
    }

    function checkStringEquality(
        string memory a,
        string memory b
    ) internal pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }

    modifier productAlreadyExists(string memory name) {
        bool exists = false;
        for (uint256 i = 0; i < products.length; i++) {
            if (checkStringEquality(products[i], name)) {
                exists = true;
                break;
            }
        }
        require(!exists, "Product already exists");
        _;
    }

    event StockAdded(uint256 indexed stockId, uint256 amount);
    event StockRemoved(uint256 indexed stockId, uint256 amount);
    event PriceChanged(uint256 indexed stockId, uint256 price);
    event ProductAdded(uint256 indexed stockId, uint256 amount);
    event ProductBought(address buyer, uint256 indexed stockId, uint256 amount);

    constructor(Commissions _commissions) Ownable(msg.sender) {
        commissions = Commissions(_commissions);
    }

    function addStock(uint256 stockId, uint256 amount) public onlyOwner stockExists(stockId) {
        stock[stockId] += amount;
        emit StockAdded(stock.length - 1, amount);
    }

    function removeStock(uint256 stockId, uint256 amount) public onlyOwner stockAvailable(stockId, amount) {
        stock[stockId] -= amount;
        emit StockRemoved(stockId, amount);
    }

    function changePrice(
        uint256 stockId,
        uint256 price
    ) public onlyOwner pricePositive(price) {
        prices[stockId] = price;
        emit PriceChanged(stockId, price);
    }

    function buyProduct(
        uint256 stockId,
        uint256 amount
    )
        public
        payable
        amountPositive(amount)
        stockAvailable(stockId, amount)
        hasSufficientBalance(stockId, amount)
    {
        console.log("StockId: ", stockId);
        uint256 totalPrice = prices[stockId] * amount;
        stock[stockId] -= amount;
        totalSales += totalPrice;
        console.log("Beforte transfer HEREEEEEEE: ");
        console.log("Total Price: ", msg.value);
        console.log("sender balance: ", msg.sender.balance);
        console.log("owner balance: ", owner().balance);

        payable(address(this)).transfer(msg.value);
        console.log("After transfer HEREEEEEEE: ");
        buyers.push(msg.sender);
        buyerToAmount[msg.sender] += totalPrice;
        giveCommission(totalPrice);
        
        emit ProductBought(msg.sender, stockId, amount);
    }

    function giveCommission(uint256 price) public {
        uint256 calculatedCommission = commissions.calculateCommission(price);
        console.log("Calculated Commission: ", calculatedCommission);
        commissions.commission{value: calculatedCommission}();
    }

    receive() external payable {
        console.log("Received: ", msg.value);
    }

    function getBuyers() public view onlyOwner() returns (address[] memory) {
        return buyers;
    }

    function getTotalSales() public view onlyOwner() returns (uint256) {
        return totalSales;
    }

    function getBestBuyer() public view onlyOwner() returns (address) {
        uint256 max = 0;
        address bestBuyer;
        for (uint256 i = 0; i < buyers.length; i++) {
            if (buyerToAmount[buyers[i]] > max) {
                max = buyerToAmount[buyers[i]];
                bestBuyer = buyers[i];
            }
        }
        return bestBuyer;
    }

    function addProduct(
        string memory name,
        uint256 amount,
        uint256 price
    ) public onlyOwner productAlreadyExists(name) {
        stock.push(amount);
        prices.push(price);
        products.push(name);
        emit ProductAdded(stock.length - 1, amount);
    }

    function removeProduct(uint256 stockId) public onlyOwner {
        stock[stockId] = 0;
        prices[stockId] = 0;
    }

    function getProduct(
        uint256 stockId
    )
        public
        view
        returns (string memory, uint256, uint256)
    {
        return (products[stockId], stock[stockId], prices[stockId]);
    }

    function getStock() public view onlyOwner() returns (uint256[] memory) {
        return stock;
    }

    function getProducts() public view onlyOwner() returns (string[] memory) {
        return products;
    }

    function getTotalPriceForProduct(
        uint256 stockId,
        uint256 amount
    ) public view returns (uint256) {
        return prices[stockId] * amount;
    }
}

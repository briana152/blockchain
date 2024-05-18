// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract Commissions is Ownable {
    uint256 private totalCommissions;

    event CommissionReceived(address indexed donationFound, uint256 amount);

    modifier commissionPositive() {
        console.log("val: ", msg.value);
        require(msg.value > 0, "Commission must be greater than 0");
        _;
    }

    constructor() Ownable(msg.sender) {
        totalCommissions = 0;
    }

    function calculateCommission(uint256 amount) public pure returns (uint256) {
        uint256 calculatedCommission = amount / 20;
        if (calculatedCommission == 0)
                calculatedCommission = 1;
        return calculatedCommission;
    }

    function commission() external payable commissionPositive() {
        console.log("Before Commission transfer: ", msg.value);
        payable(owner()).transfer(msg.value);
        console.log("After Commission transfer: ");
        totalCommissions += msg.value;
        emit CommissionReceived(msg.sender, msg.value);
    }

    function getTotalCommissions() public view onlyOwner() returns (uint256) {
        return totalCommissions;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Mock underlying asset (e.g., DAI)
contract MockAsset is ERC20 {
    constructor() ERC20("Mock DAI", "MDAI") {
        _mint(msg.sender, 1000000 * 10**18); // Mint 1M tokens to deployer
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

// Mock aToken (e.g., aDAI)
contract MockAToken is ERC20 {
    address public underlyingAsset;

    constructor(address _underlyingAsset) ERC20("Mock aDAI", "aMDAI") {
        underlyingAsset = _underlyingAsset;
    }
    
    function mint(address to, uint256 amount) external {
        _mint(to, amount); // Internal ERC20 function to mint tokens
    }

    function mintInterest(address to, uint256 amount) external {
        _mint(to, amount); // Simulate yield
    }

    function burn(address account, uint256 amount) public {
        _burn(account, amount);
    }
}

// Mock Aave LendingPool
contract MockLendingPool {
    MockAsset public asset;
    MockAToken public aToken;

    constructor(address _asset, address _aToken) {
        asset = MockAsset(_asset);
        aToken = MockAToken(_aToken);
    }

    function supply(address assetAddress, uint256 amount, address onBehalfOf, uint16 referralCode) external {
        require(assetAddress == address(asset), "Invalid asset");
        require(referralCode == 0, "Referral not supported");
        require(asset.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        // Mint aTokens to the user
        aToken.mint(onBehalfOf, amount);
        // Mint yield tokens to the pool (10% of the amount)
        asset.mint(address(this), amount / 10);
    }

    function withdraw(address assetAddress, uint256 amount, address to) external returns (uint256) {
        require(assetAddress == address(asset), "Invalid asset");
        aToken.burn(msg.sender, amount);
        // Simulated yield (10% for simplicity)
        uint256 yield = amount / 10;
        uint256 totalAmount = amount + yield;
        require(asset.transfer(to, totalAmount), "Transfer failed");
        return totalAmount;
    }
}
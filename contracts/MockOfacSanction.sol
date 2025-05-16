// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract OfacSanction {
    mapping(address => bool) public isBlacklisted;
    mapping(address => bool) public isWhitelisted;

    function blacklist(address _user) external {
        isWhitelisted[_user] = false;
        isBlacklisted[_user] = true;
    }
}

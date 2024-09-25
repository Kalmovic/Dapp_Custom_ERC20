// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Bitso_Token is ERC20 {
    constructor(uint256 initialSupply) ERC20("Bitso_Token", "BIT") {
        _mint(msg.sender, initialSupply);
    }
}

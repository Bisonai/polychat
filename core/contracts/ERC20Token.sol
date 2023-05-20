//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Token is ERC20 {
    uint256 constant _initial_supply = 10000000 * (10**18);

    constructor() ERC20("BAYRAMCOIN", "BYRM") {
        _mint(msg.sender, _initial_supply);
    }
}

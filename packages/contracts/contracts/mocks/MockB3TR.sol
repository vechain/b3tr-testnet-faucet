// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @dev Minimal ERC20 used only for local solo dev and tests.
/// Anyone can mint to themselves so the faucet is easy to seed.
contract MockB3TR is ERC20 {
    constructor() ERC20("B3TR", "B3TR") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

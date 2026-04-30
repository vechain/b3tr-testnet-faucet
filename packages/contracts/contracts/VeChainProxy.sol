// SPDX-License-Identifier: MIT
// Forked from OpenZeppelin Contracts v5.0.0 (proxy/ERC1967/ERC1967Proxy.sol)
pragma solidity 0.8.20;

import { Proxy } from "@openzeppelin/contracts/proxy/Proxy.sol";
import { ERC1967Utils } from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Utils.sol";

/// @dev UUPS-compatible ERC1967 proxy.
/// Constructor deploys the implementation and optionally calls an initializer via delegatecall.
// solc-ignore-next-line missing-receive
contract VeChainProxy is Proxy {
    constructor(address implementation, bytes memory _data) payable {
        ERC1967Utils.upgradeToAndCall(implementation, _data);
    }

    function _implementation() internal view virtual override returns (address) {
        return ERC1967Utils.getImplementation();
    }
}

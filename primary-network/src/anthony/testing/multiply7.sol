// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;   // pick a version your solc supports

contract Multiply7 {
    event Print(uint);
    function multiply(uint input) public returns (uint) {
        uint result = input * 7;
        emit Print(result);
        return result;
    }
}
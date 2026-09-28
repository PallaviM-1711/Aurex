// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Hello
/// @notice The starter contract for the `blank` create-mst-app template.
contract Hello is Ownable {
    string private message;

    event MessageChanged(string previousMessage, string newMessage, address changedBy);

    constructor(string memory _message) Ownable(msg.sender) {
        message = _message;
    }

    function getMessage() external view returns (string memory) {
        return message;
    }

    function setMessage(string calldata _message) external onlyOwner {
        emit MessageChanged(message, _message, msg.sender);
        message = _message;
    }
}

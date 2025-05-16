// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Verifier.sol";

contract OBEscrow {
    HonkVerifier public verifier = new HonkVerifier();

    address public paymentToken;

    struct EscrowData {
        uint256 amount;
        uint256 commitment;
    }

    mapping(address => EscrowData) public escrowData;

    constructor(address _paymentToken) {
        paymentToken = _paymentToken;
    }

    function deposit(uint256 _amount, uint256 _commitment) external {
        // transfer tokens in
        require(_amount > 0, "Amount must be greater than zero");
        require(
            IERC20(paymentToken).transferFrom(
                msg.sender,
                address(this),
                _amount
            ),
            "Token transfer failed"
        );
        // update escrow data
        EscrowData storage escrow = escrowData[msg.sender];
        if (escrow.commitment == 0) {
            // if initializing for the first time, update
            escrow.commitment = _commitment;
        }
        escrow.amount += _amount;
    }

    function withdraw(
        bytes calldata _proof,
        uint256 _amount,
        uint256 _commitment,
        address _from
    ) external {
        // pack inputs for the proof
        bytes32[] memory publicInputs = new bytes32[](2);
        publicInputs[0] = bytes32(_commitment);
        publicInputs[1] = bytes32(_amount);
        // verify the proof
        require(verifier.verify(_proof, publicInputs), "Invalid proof");
        // adjust amount (payment token is 10^18, proof outputs 10^12)
        _amount = _amount * 10**12;
        // transfer tokens out
        EscrowData storage escrow = escrowData[_from];
        require(escrow.amount >= _amount, "Insufficient balance");
        require(
            escrow.commitment == _commitment,
            "Invalid recipient commitment"
        );
        escrow.amount -= _amount;
        require(
            IERC20(paymentToken).transfer(msg.sender, _amount),
            "Token transfer failed"
        );
    }

    function verifyTest(
        bytes calldata _proof,
        bytes32[] calldata _publicInputs
    )
        public
        view
        returns (
            bool
        )
    {
        // bytes32[] memory publicInputs = new bytes32[](1);
        // publicInputs[0] = bytes32(x);
        // publicInputs[0] = bytes32(_commitment);
        // publicInputs[1] = bytes32(_amount);
        // verify the proof
        return verifier.verify(_proof, _publicInputs);
        // return verifier.verify(_proof, publicInputs);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Verifier.sol";

// Interface for Aave Pool
interface IAavePool {
    function supply(
        address asset,
        uint256 amount,
        address onBehalfOf,
        uint16 referralCode
    ) external;

    function withdraw(
        address asset,
        uint256 amount,
        address to
    ) external returns (uint256);
}

contract OBEscrow {

    address public paymentToken;
    IAavePool public aavePool;
    HonkVerifier public verifier = new HonkVerifier();


    struct EscrowData {
        uint256 amount; // Represents amount of underlying asset supplied to Aave
        uint256 commitment;
    }

    mapping(address => EscrowData) public escrowData;

    constructor(address _paymentToken, address _aavePoolAddress) {
        require(_paymentToken != address(0), "Invalid payment token address");
        require(_aavePoolAddress != address(0), "Invalid Aave Pool address");
        paymentToken = _paymentToken;
        aavePool = IAavePool(_aavePoolAddress);
    }

    function deposit(uint256 _amount, uint256 _commitment) external {
        require(_amount > 0, "Amount must be greater than zero");

        // 1. Transfer tokens from user to this escrow contract
        uint256 initialBalance = IERC20(paymentToken).balanceOf(address(this));
        IERC20(paymentToken).transferFrom(msg.sender, address(this), _amount);
        uint256 transferredAmount = IERC20(paymentToken).balanceOf(address(this)) - initialBalance;
        require(transferredAmount == _amount, "Token transfer failed or partial transfer");

        // 2. Approve Aave Pool to spend the tokens from this contract
        IERC20(paymentToken).approve(address(aavePool), transferredAmount);

        // 3. Supply tokens to Aave Pool
        aavePool.supply(paymentToken, transferredAmount, address(this), 0);

        // 4. Update escrow data for the depositor (msg.sender)
        EscrowData storage escrow = escrowData[msg.sender];
        if (escrow.commitment == 0) { // Or if you allow multiple/updated commitments
            escrow.commitment = _commitment;
        }
        escrow.amount += transferredAmount; // Track total supplied by user
    }

    function withdraw(
        bytes calldata _proof, // Proof verification needs to be integrated
        uint256 _amount,
        uint256 _commitment, // Identifier for the user's specific escrowed funds/commitment
        address _from // Original design had _from; for simplicity, assuming msg.sender withdraws their own
    ) external {
        // 1: verify proof
        bytes32[] memory publicInputs = new bytes32[](2);
        publicInputs[0] = bytes32(_commitment);
        publicInputs[1] = bytes32(_amount);
        require(verifier.verify(_proof, publicInputs), "Invalid proof");
        // 2. adjust amount (payment token is 10^18, proof outputs 10^12)
        _amount = _amount * 10**12;
        // 3. check escrow match
        EscrowData storage escrow = escrowData[_from];
        require(escrow.amount >= _amount, "Insufficient balance");
        require(
            escrow.commitment == _commitment,
            "Invalid recipient commitment"
        );
        // 4. Withdraw from Aave Pool to escrow contract
        aavePool.withdraw(paymentToken, _amount, address(this));
        // 5. Transfer tokens from escrow contract to the user
        require(
            IERC20(paymentToken).transfer(msg.sender, _amount),
            "Token transfer failed"
        );

        // 6. Update escrow data
        escrow.amount -= _amount;
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
        return verifier.verify(_proof, _publicInputs);
    }
}

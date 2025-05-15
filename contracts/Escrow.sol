// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "./Verifier.sol"; // Review how Verifier.sol integrates with Aave deposits/withdrawals

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

    // HonkVerifier public verifier = new HonkVerifier(); // Review integration
    // address public verifier; // Review: This seems to be a duplicate or needs renaming

    address public paymentToken;
    IAavePool public aavePool;

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
        // The escrow contract (this) will receive the aTokens
        aavePool.supply(paymentToken, transferredAmount, address(this), 0);

        // 4. Update escrow data for the depositor (msg.sender)
        EscrowData storage escrow = escrowData[msg.sender];
        if (escrow.commitment == 0) { // Or if you allow multiple/updated commitments
            escrow.commitment = _commitment;
        }
        escrow.amount += transferredAmount; // Track total supplied by user
    }

    function withdraw(
        // bytes calldata _proof, // Proof verification needs to be integrated
        uint256 _amountToWithdraw,
        uint256 _userCommitment // Identifier for the user's specific escrowed funds/commitment
        // address _from // Original design had _from; for simplicity, assuming msg.sender withdraws their own
    ) external {
        // TODO: Integrate ZK proof verification using _proof, _userCommitment, and _amountToWithdraw
        // The verifier would confirm that msg.sender is authorized for this withdrawal against _userCommitment.
        // For example:
        // bytes32[] memory publicInputs = new bytes32[](2);
        // publicInputs[0] = bytes32(_userCommitment);
        // publicInputs[1] = bytes32(_amountToWithdraw);
        // require(verifier.verify(_proof, publicInputs), "Invalid proof");

        EscrowData storage escrow = escrowData[msg.sender]; // Assumes msg.sender is withdrawing their own funds

        require(escrow.amount >= _amountToWithdraw, "Insufficient balance in Aave");
        // Optional: Check commitment if it's used to identify specific deposit tranches
        // require(escrow.commitment == _userCommitment, "Invalid commitment for withdrawal");


        // 1. Withdraw from Aave Pool to this escrow contract
        // Aave's withdraw function might revert if _amountToWithdraw > balance in Aave
        uint256 actualWithdrawnAmount = aavePool.withdraw(paymentToken, _amountToWithdraw, address(this));
        // The actualWithdrawnAmount could be less if Aave has an issue, though typically it's the amount requested or revert.
        // For safety, ensuring it matches or handling discrepancies:
        require(actualWithdrawnAmount == _amountToWithdraw, "Aave withdrawal failed or did not return expected amount");

        // 2. Transfer tokens from this escrow contract to the msg.sender (recipient)
        require(
            IERC20(paymentToken).transfer(msg.sender, actualWithdrawnAmount),
            "Token transfer to recipient failed"
        );

        // 3. Update escrow data
        escrow.amount -= actualWithdrawnAmount;

        // If a commitment is tied to a specific deposit and should be cleared or reduced:
        // if (escrow.amount == 0) {
        //     escrow.commitment = 0; // Or reset as appropriate
        // }
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./RulesEngineIntegration.sol";
import "./RulesEngineIntegration.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@thrackle-io/forte-rules-engine/src/client/RulesEngineClient.sol";
import "./Verifier.sol";
import "./MockOfacSanction.sol";

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


contract OBEscrow is RulesEngineClientCustom {

    address public paymentToken;
    IAavePool public aavePool;
    OfacSanction public ofacSanction;
    HonkVerifier public verifier = new HonkVerifier();
    mapping(address => bool) public isWhitelisted;

    struct EscrowData {
        uint256 amount; // Represents amount of underlying asset supplied to Aave
        uint256 commitment;
    }

    mapping(address => EscrowData) public escrowData;

    modifier onlyWhitelisted() {
        require(isWhitelisted[msg.sender], "Not whitelisted");
        _;
    }

    function register(address _user) external checkRulesBeforeregister(_user) {
        require(_user == msg.sender, "Only the user can register themselves");
        require(!ofacSanction.isBlacklisted(_user), "User is blacklisted");
        isWhitelisted[_user] = true;
    }

    constructor(address _paymentToken, address _aavePoolAddress, address _ofacSanctionAddress) {
        require(_paymentToken != address(0), "Invalid payment token address");
        require(_aavePoolAddress != address(0), "Invalid Aave Pool address");
        require(_ofacSanctionAddress != address(0), "Invalid OFAC Sanction address");
        paymentToken = _paymentToken;
        aavePool = IAavePool(_aavePoolAddress);
        ofacSanction = OfacSanction(_ofacSanctionAddress);
    }

    function deposit(uint256 _amount, uint256 _commitment) external onlyWhitelisted {
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

    /**
     * Withdraws tokens from the escrow after proof verification.
     * @param _proof The zero-knowledge proof for withdrawal verification.
     * @param _amount The amount to withdraw (in proof output units, will be scaled).
     * @param _commitment Identifier for the user's specific escrowed funds/commitment.
     * @param _from The address whose escrowed funds are being withdrawn (typically msg.sender).
     */
    function withdraw(
        bytes calldata _proof, // Proof verification needs to be integrated
        uint256 _amount,
        uint256 _commitment, // Identifier for the user's specific escrowed funds/commitment
        address _from,
        address _to
    ) external onlyWhitelisted {
        // 0: check to is msg sender (used for forte ofac rule)
        require(_to == msg.sender, "Only the sender can withdraw");
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

    /**
     * Verifies a zero-knowledge proof with the provided public inputs.
     * @param _proof The zero-knowledge proof to verify.
     * @param _publicInputs The public inputs for the proof verification.
     * @return bool True if the proof is valid, false otherwise.
     */
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

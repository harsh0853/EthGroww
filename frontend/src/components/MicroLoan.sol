// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MicroloanPlatform {
    struct Loan {
        address borrower;
        address lender;
        uint128 amount;         // Reduced from uint256 to uint128 (saves gas)
        uint128 repaidAmount;   // Reduced size to uint128
        uint64 duration;        // Reduced size to uint64 (seconds-based)
        uint16 interestRate;    // Interest rate in basis points (e.g., 500 for 5.00%)
        uint32 startTime;       // Timestamp when funded
        bool isFunded;
        bool isRepaid;
        bool isDefaulted;
    }

    mapping(uint256 => Loan) public loans;
    mapping(address => uint256) public creditScores;
    uint256 public loanCounter;

    event LoanRequested(uint256 indexed loanId, address indexed borrower, uint128 amount, uint16 interestRate, uint64 duration);
    event LoanFunded(uint256 indexed loanId, address indexed lender);
    event LoanRepaid(uint256 indexed loanId, uint128 amount);
    event LoanDefaulted(uint256 indexed loanId);

    constructor() {
        creditScores[msg.sender] = 700;
    }

    /// @notice Borrower requests a loan (No Collateral Required).
    /// @param _amount Loan amount in wei
    /// @param _interestRate Interest rate in basis points (500 = 5.00%)
    /// @param _duration Loan duration in seconds
    function requestLoan(uint128 _amount, uint16 _interestRate, uint64 _duration) external {
        require(creditScores[msg.sender] >= 600, "Low credit score");

        unchecked { loanCounter++; }

        loans[loanCounter] = Loan({
            borrower: msg.sender,
            lender: address(0),
            amount: _amount,
            interestRate: _interestRate,
            duration: _duration,
            startTime: 0,
            repaidAmount: 0,
            isFunded: false,
            isRepaid: false,
            isDefaulted: false
        });

        emit LoanRequested(loanCounter, msg.sender, _amount, _interestRate, _duration);
    }

    /// @notice Lender funds a borrower's loan request.
    /// @param _loanId The ID of the loan to fund
    function fundLoan(uint256 _loanId) external payable {
        Loan storage loan = loans[_loanId];
        require(!loan.isFunded, "Already funded");
        require(msg.value == loan.amount, "Incorrect amount");

        loan.lender = msg.sender;
        loan.isFunded = true;
        loan.startTime = uint32(block.timestamp);

        (bool success, ) = loan.borrower.call{value: loan.amount}("");
        require(success, "Transfer failed");

        emit LoanFunded(_loanId, msg.sender);
    }

    /// @notice Borrower repays the loan.
    /// @param _loanId The ID of the loan to repay
    function repayLoan(uint256 _loanId) external payable {
        Loan storage loan = loans[_loanId];
        require(msg.sender == loan.borrower, "Only borrower can repay");
        require(loan.isFunded, "Loan not funded");
        require(!loan.isRepaid, "Already repaid");

        uint128 totalPayable = loan.amount + (loan.amount * loan.interestRate / 10000); // 10000 for basis points
        require(msg.value <= totalPayable - loan.repaidAmount, "Excess repayment");

        unchecked { loan.repaidAmount += uint128(msg.value); }

        (bool success, ) = loan.lender.call{value: msg.value}("");
        require(success, "Transfer failed");

        emit LoanRepaid(_loanId, uint128(msg.value));

        if (loan.repaidAmount >= totalPayable) {
            loan.isRepaid = true;
            unchecked { creditScores[loan.borrower] += 10; }
        }
    }

    /// @notice If borrower fails to repay on time, apply a penalty.
    /// @param _loanId The ID of the loan to penalize
    function applyPenalty(uint256 _loanId) external {
        Loan storage loan = loans[_loanId];
        require(loan.isFunded, "Not funded");
        require(block.timestamp > loan.startTime + loan.duration, "Not overdue");
        require(!loan.isRepaid, "Already repaid");

        loan.isDefaulted = true;
        unchecked { creditScores[loan.borrower] -= 50; }

        emit LoanDefaulted(_loanId);
    }

    /// @notice Fetch borrower's credit score.
    function getCreditScore(address _user) external view returns (uint256) {
        return creditScores[_user];
    }
}

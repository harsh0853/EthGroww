// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MicroloanPlatform {
    struct Loan {
        address borrower;
        address lender;
        uint128 amount;
        uint16 interestRate;
        uint64 duration;
        uint64 startTime;
        uint128 repaidAmount;
        bool isFunded;
        bool isRepaid;
        bool isDefaulted;
    }

    mapping(uint => Loan) public loans;
    mapping(address => uint) public creditScores;
    uint public loanCounter;

    event LoanRequested(
        uint loanId,
        address indexed borrower,
        uint128 amount,
        uint16 interestRate,
        uint64 duration
    );
    event LoanFunded(uint loanId, address indexed lender, uint128 amount);
    event LoanRepaid(uint loanId, uint128 amount);
    event LoanDefaulted(uint loanId);
    event Debug(uint loanId);

    constructor() {
        creditScores[msg.sender] = 700; // Default credit score for contract owner
    }

    function requestLoan(uint128 _amount, uint16 _interestRate, uint64 _duration) external {
    require(_amount > 0, "Loan amount must be greater than zero");

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
    emit Debug(loanCounter); // 🛠 Debug event
}


    function fundLoan(uint256 _loanId) external payable {
        Loan storage loan = loans[_loanId];

        emit Debug(_loanId);

        require(!loan.isFunded, "Loan is already funded");
        require(msg.sender != loan.borrower, "You cannot fund your own loan");
        require(msg.value == loan.amount, "Incorrect funding amount");

        loan.isFunded = true;
        loan.lender = msg.sender;
        loan.startTime = uint64(block.timestamp); // Start loan duration timer

        // Transfer funds to borrower
        (bool success, ) = payable(loan.borrower).call{value: msg.value}("");
        require(success, "Transfer to borrower failed");

        emit LoanFunded(_loanId, msg.sender, loan.amount);
    }

    function repayLoan(uint loanId) external payable {
        Loan storage loan = loans[loanId];

        require(msg.sender == loan.borrower, "Only borrower can repay");
        require(loan.isFunded, "Loan is not funded");
        require(!loan.isRepaid, "Loan is already repaid");

        loan.repaidAmount += uint128(msg.value);

        if (loan.repaidAmount >= loan.amount) {
            loan.isRepaid = true;
            
            // Send funds to lender
            (bool success, ) = payable(loan.lender).call{value: loan.repaidAmount}("");
            require(success, "Transfer to lender failed");

            emit LoanRepaid(loanId, loan.repaidAmount);
        }
    }

    function markDefault(uint loanId) external {
        Loan storage loan = loans[loanId];

        require(loan.isFunded, "Loan is not funded");
        require(!loan.isRepaid, "Loan is already repaid");
        require(block.timestamp > loan.startTime + loan.duration, "Loan not overdue");

        loan.isDefaulted = true;
        creditScores[loan.borrower] -= 50; // Reduce credit score on default

        emit LoanDefaulted(loanId);
    }

    function getCreditScore(address _borrower) external view returns (uint) {
        return creditScores[_borrower];
    }

    function getLoan(uint loanId) external view returns (Loan memory) {
        return loans[loanId];
    }

    function getLoanCounter() external view returns (uint) {
        return loanCounter;
    }
}

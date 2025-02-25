# EthGroww - Decentralized Microloan Platform

## Overview

EthGroww is a blockchain-based microloan platform that facilitates decentralized lending and borrowing using smart contracts. The platform leverages Ethereum blockchain technology to provide a trustless, transparent, and secure financial ecosystem where users can access microloans without intermediaries.

## Features

- **Decentralized Lending & Borrowing**: Users can lend and borrow funds securely without relying on traditional financial institutions.
- **Smart Contracts**: Automated and tamper-proof loan agreements ensure transparency and reliability.
- **Secure Transactions**: All transactions are executed on the Ethereum blockchain, ensuring immutability and security.
- **Interest & Repayment System**: Borrowers repay loans with interest, which is automatically distributed to lenders through smart contracts.
- **User-Friendly Interface**: A web-based frontend allows users to interact seamlessly with the blockchain backend.

## Technology Stack

- **Smart Contracts**: Solidity (Ethereum blockchain)
- **Local Blockchain**: Hardhat
- **Frontend**: React.js
- **Backend**: Node.js & Express
- **Database**: MongoDB
- **Wallet Integration**: MetaMask & Web3.js

## Installation

### Prerequisites

Ensure you have the following installed:

- Node.js (v16 or later)
- npm or yarn
- MetaMask extension
- Hardhat (for local blockchain development)
- MongoDB (for data storage)

### Steps

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-repo/ethgroww.git
   cd ethgroww
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Start local blockchain (Hardhat):**
   ```sh
   npx hardhat node
   ```
4. **Deploy Smart Contracts:**
   ```sh
   npx hardhat run scripts/deploy.js --network localhost
   ```
5. **Start MongoDB Server:**
   ```sh
   mongod --dbpath /your/db/path
   ```
6. **Start the frontend:**
   ```sh
   npm start
   ```

## Smart Contract Functions

### Loan Creation

- `requestLoan(amount, duration, interestRate)`: Borrowers request loans specifying the required amount, repayment duration, and interest rate.
- `fundLoan(loanId)`: Lenders fund loans by selecting active loan requests.

### Loan Management

- `repayLoan(loanId)`: Borrowers repay their loans, including interest.
- `withdrawFunds(loanId)`: Lenders withdraw repayments.

### Security & Trust

- **Collateral Mechanism**: Loans may be secured through collateral to reduce lender risk.
- **Reputation System**: Smart contracts track borrower and lender reliability.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch`
3. Commit changes: `git commit -m "Add new feature"`
4. Push the branch: `git push origin feature-branch`
5. Submit a pull request.

import { User } from "../models/user.models.js";
import { Loan } from "../models/loan.models.js";
import { Feed } from "../models/feed.models.js";
import { nanoid } from "nanoid";
import { ethers } from "ethers";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import dotenv from "dotenv";

dotenv.config();

// ✅ Correct way to import JSON in ESM
import contractABI from "./contractABI.json" assert { type: "json" };

// Blockchain Setup
const mnemonicPhrase = process.env.MNEMONIC;
if (!mnemonicPhrase) {
  throw new Error("MNEMONIC is not defined in the .env file");
}

const mnemonic = ethers.Mnemonic.fromPhrase(mnemonicPhrase);
const wallet = ethers.HDNodeWallet.fromMnemonic(mnemonic);
const provider = new ethers.JsonRpcProvider(process.env.INFURA_URL);
const signer = wallet.connect(provider);

const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  contractABI,
  signer
);

console.log("Wallet Address:", signer.address);

// Generate unique Loan ID
const generateNanoId = () => nanoid(12);

// Function to calculate interest dynamically
function calculateInterestRate(principal, durationInYears, creditScore) {
  let baseRate = 5; // Base interest rate

  // Adjust rate based on credit score
  if (creditScore >= 750) {
    baseRate += 2;
  } else if (creditScore >= 650) {
    baseRate += 4;
  } else {
    baseRate += 6;
  }

  // Adjust rate based on duration
  baseRate += Math.floor(durationInYears) * 0.5;

  // Adjust rate based on principal amount
  if (principal > 10000) {
    baseRate += 2;
  } else if (principal > 5000) {
    baseRate += 1;
  }

  return Math.min(baseRate, 15); // Cap at 15%
}

// 1️⃣ CREATE LOAN (Borrower requests a loan)
// 1️⃣ CREATE LOAN
const createLoan = asyncHandler(async (req, res) => {
  try {
    console.log("📝 Creating loan request body:", req.body);
    const { amount, duration, purpose, ethAddress } = req.body;

    // Validate inputs
    if (!amount || !duration || !ethAddress) {
      throw new ApiError(
        400,
        "Amount, duration, and ethereum address are required"
      );
    }

    // Find user and validate
    const user = await User.findOne({ ethAddress });
    if (!user) {
      throw new ApiError(404, "User not found. Please connect wallet first.");
    }

    try {
      // Convert amount to wei
      const amountInWei = ethers.parseEther(amount.toString());
      const durationInSeconds = duration * 30 * 24 * 60 * 60; // months to seconds
      const interestRate = calculateInterestRate(
        Number(amount),
        duration / 12,
        user.creditScore || 600
      );

      console.log("🔗 Blockchain parameters:", {
        amountInWei: amountInWei.toString(),
        durationInSeconds,
        interestRate,
      });

      // Create loan on blockchain
      const tx = await contract.requestLoan(
        amountInWei,
        interestRate,
        durationInSeconds
      );

      console.log("🔄 Transaction sent:", tx.hash);
      const receipt = await tx.wait();
      console.log("✅ Transaction confirmed:", receipt.hash);

      const loanId = await contract.loanCounter();

      // Create loan in database
      const newLoan = await Loan.create({
        uniqueId: generateNanoId(),
        loanId: loanId.toString(),
        borrowerEthAddress: ethAddress,
        loanAmount: amount,
        time: duration,
        purpose,
        isFunded: false,
        isRepaid: false,
        interestRate,
      });

      // Update user's loan counts
      await User.findOneAndUpdate(
        { ethAddress },
        {
          $inc: { totalLoans: 1 },
        }
      );

      return res
        .status(201)
        .json(
          new ApiResponse(201, newLoan, "Loan request created successfully")
        );
    } catch (error) {
      console.error("❌ Blockchain Error:", error);
      if (error.message.includes("insufficient funds")) {
        throw new ApiError(400, "Insufficient funds for gas fees");
      }
      throw new ApiError(500, `Blockchain Error: ${error.message}`);
    }
  } catch (error) {
    console.error("❌ Create Loan Error:", error);
    throw new ApiError(error.statusCode || 500, error.message);
  }
});

// 2️⃣ FUND LOAN
const loanFunded = asyncHandler(async (req, res) => {
  try {
    const { loanId } = req.params;
    const { amount, lenderAddress } = req.body;
    console.log("💰 Funding loan:", { loanId, amount, lenderAddress });

    // Find and validate loan
    const loan = await Loan.findOne({ loanId });
    if (!loan) {
      throw new ApiError(404, "Loan not found");
    }

    // Prevent self-funding
    if (loan.borrowerEthAddress.toLowerCase() === lenderAddress.toLowerCase()) {
      throw new ApiError(400, "You cannot fund your own loan request");
    }

    try {
      // Convert amount to wei
      const amountInWei = ethers.parseEther(amount.toString());

      // Fund loan on blockchain
      const tx = await contract.fundLoan(loanId, {
        value: amountInWei,
      });

      console.log("🔄 Transaction sent:", tx.hash);
      const receipt = await tx.wait();
      console.log("✅ Transaction confirmed:", receipt.hash);

      // Update loan status
      loan.isFunded = true;
      loan.lenderEthAddress = lenderAddress;
      loan.fundedAt = new Date();
      await loan.save();

      // Update borrower's active loans count
      await User.findOneAndUpdate(
        { ethAddress: loan.borrowerEthAddress },
        { $inc: { activeLoans: 1 } }
      );

      return res
        .status(200)
        .json(new ApiResponse(200, loan, "Loan funded successfully"));
    } catch (error) {
      console.error("❌ Blockchain Error:", error);
      if (error.message.includes("insufficient funds")) {
        throw new ApiError(400, "Insufficient funds to fund the loan");
      }
      throw new ApiError(500, `Blockchain Error: ${error.message}`);
    }
  } catch (error) {
    console.error("❌ Fund Loan Error:", error);
    throw new ApiError(error.statusCode || 500, error.message);
  }
});

// 3️⃣ REPAY LOAN
const loanRepaid = asyncHandler(async (req, res) => {
  try {
    const { loanId } = req.params;
    const { amount } = req.body;
    console.log("💸 Repaying loan:", { loanId, amount });

    // Find and validate loan
    const loan = await Loan.findOne({ loanId });
    if (!loan) {
      throw new ApiError(404, "Loan not found");
    }

    if (loan.isRepaid) {
      throw new ApiError(400, "This loan has already been repaid");
    }

    try {
      // Convert amount to wei
      const amountInWei = ethers.parseEther(amount.toString());

      // Repay loan on blockchain
      const tx = await contract.repayLoan(loanId, {
        value: amountInWei,
      });

      console.log("🔄 Transaction sent:", tx.hash);
      const receipt = await tx.wait();
      console.log("✅ Transaction confirmed:", receipt.hash);

      // Update loan status
      loan.isRepaid = true;
      loan.repaidAt = new Date();
      await loan.save();

      // Update user's stats
      const user = await User.findOne({ ethAddress: loan.borrowerEthAddress });
      const totalCompleted = await Loan.countDocuments({
        borrowerEthAddress: loan.borrowerEthAddress,
        isRepaid: true,
      });
      const totalLoans = await Loan.countDocuments({
        borrowerEthAddress: loan.borrowerEthAddress,
      });
      const newSuccessRate = (totalCompleted / totalLoans) * 100;

      await User.findOneAndUpdate(
        { ethAddress: loan.borrowerEthAddress },
        {
          $inc: { activeLoans: -1 },
          $set: { successRate: newSuccessRate },
        }
      );

      return res
        .status(200)
        .json(new ApiResponse(200, loan, "Loan repaid successfully"));
    } catch (error) {
      console.error("❌ Blockchain Error:", error);
      if (error.message.includes("insufficient funds")) {
        throw new ApiError(400, "Insufficient funds to repay the loan");
      }
      throw new ApiError(500, `Blockchain Error: ${error.message}`);
    }
  } catch (error) {
    console.error("❌ Repay Loan Error:", error);
    throw new ApiError(error.statusCode || 500, error.message);
  }
});

// 5️⃣ GET ALL LOANS
const getAllLoans = asyncHandler(async (req, res) => {
  try {
    // First check if there are any loans
    const loans = await Loan.find({}).sort({ createdAt: -1 }); // Added sorting by creation date

    if (!loans || loans.length === 0) {
      return res.status(200).json(
        new ApiResponse(200, [], "No loans found") // Return empty array instead of error
      );
    }

    // Fetch borrower's credit score from User DB
    const formattedLoans = await Promise.all(
      loans.map(async (loan) => {
        const user = await User.findOne(
          { ethAddress: loan.borrowerEthAddress },
          "creditScore"
        );

        return {
          loanId: loan.loanId,
          borrowerEthAddress: loan.borrowerEthAddress,
          loanAmount: loan.loanAmount,
          time: loan.time,
          creditScore: user ? user.creditScore : "Not Available",
          isFunded: loan.isFunded || false,
          isRepaid: loan.isRepaid || false,
          createdAt: loan.createdAt,
        };
      })
    );

    return res
      .status(200)
      .json(
        new ApiResponse(200, formattedLoans, "Loans retrieved successfully")
      );
  } catch (error) {
    console.error("Error in getAllLoans:", error); // Add logging
    throw new ApiError(500, "Failed to fetch loans: " + error.message);
  }
});

export { createLoan, loanFunded, loanRepaid, getAllLoans };

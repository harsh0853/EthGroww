import { Loan } from "../models/loan.models.js";
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { nanoid } from "nanoid";
// Ensure you have ethers installed

// CREATE LOAN
const createLoan = asyncHandler(async (req, res) => {
  try {
    console.log("Creating loan request body:", req.body);
    const { amount, loanPayableAmount, duration, loanId, ethAddress } =
      req.body;

    // Validate inputs
    if (!amount || !duration || !ethAddress || !loanPayableAmount) {
      throw new ApiError(
        400,
        "Amount, duration, and ethereum address are required"
      );
    }

    // Find user in database
    const user = await User.findOne({ ethAddress });
    if (!user) {
      throw new ApiError(404, "User not found. Please connect wallet first.");
    }

    // Create loan entry in database
    const newLoan = await Loan.create({
      uniqueId: nanoid(12),
      loanId: loanId,
      borrowerEthAddress: ethAddress,
      loanAmount: amount,
      loanPayableAmount: loanPayableAmount,
      time: duration,
      isFunded: false,
      isRepaid: false,
    });

    // Update user's loan count
    await User.findOneAndUpdate({ ethAddress }, { $inc: { totalLoans: 1 } });

    console.log("Loan created successfully:", newLoan);

    return res
      .status(201)
      .json(new ApiResponse(201, newLoan, "Loan request created successfully"));
  } catch (error) {
    console.error("Create Loan Error:", error);
    throw new ApiError(error.statusCode || 500, error.message);
  }
});

// FUND LOAN FUNCTION
const fundLoan = asyncHandler(async (req, res) => {
  try {
    const { loanId } = req.params;
    const { amount, lenderAddress } = req.body;
    ////console.log("Funding loan request body:", { amount, lenderAddress });
    ////console.log("Looking for loan with ID:", loanId);

    // Find loan - convert loanId to string to ensure matching
    const loan = await Loan.findOne({ loanId: loanId.toString() });

    if (!loan) {
      ////console.log("No loan found with ID:", loanId);
      throw new ApiError(404, "Loan not found");
    }

    // Prevent self-funding
    if (loan.borrowerEthAddress.toLowerCase() === lenderAddress.toLowerCase()) {
      throw new ApiError(400, "Cannot fund your own loan");
    }

    // Check if loan is already funded
    if (loan.isFunded) {
      throw new ApiError(400, "Loan is already funded");
    }

    // Update loan status
    loan.isFunded = true;
    loan.lenderEthAddress = lenderAddress.toLowerCase();

    await loan.save();
    ////console.log("Loan funded successfully:", loan);

    return res
      .status(200)
      .json(new ApiResponse(200, loan, "Loan funded successfully"));
  } catch (error) {
    console.error("Fund Loan Error:", error);
    throw new ApiError(error.statusCode || 500, error.message);
  }
});

// Helper function to calculate interest rate

const loanRepaid = asyncHandler(async (req, res) => {
  try {
    const { loanId } = req.params;
    const { amount } = req.body;

    // Find and validate loan
    const loan = await Loan.findOne({ loanId });
    if (!loan) throw new ApiError(404, "Loan not found");
    if (loan.isRepaid)
      throw new ApiError(400, "This loan has already been repaid");

    // Validate repayment amount
    if (parseFloat(amount) < parseFloat(loan.loanAmount)) {
      throw new ApiError(400, "Incorrect repayment amount");
    }

    // Check if the loan is defaulted
    // If current date > due date, loan is defaulted

    // Update loan status in database
    loan.isRepaid = true;
    await loan.save();

    // Update borrower's stats
    const borrower = await User.findOne({
      ethAddress: loan.borrowerEthAddress,
    });

    if (borrower) {
      const totalCompleted = await Loan.countDocuments({
        borrowerEthAddress: loan.borrowerEthAddress,
        isRepaid: true,
      });
      const totalLoans = await Loan.countDocuments({
        borrowerEthAddress: loan.borrowerEthAddress,
      });
      const newSuccessRate = (totalCompleted / totalLoans) * 100;

      // Adjust credit score based on default status

      await User.findOneAndUpdate(
        { ethAddress: loan.borrowerEthAddress }, // Filter
        {
          $inc: { activeLoans: -1, creditScore: borrower.creditScore + 10 },
          $set: { successRate: newSuccessRate },
        },
        { new: true } // Return updated document
      );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, loan, "Loan repaid successfully"));
  } catch (error) {
    console.error("Repay Loan Error:", error);
    throw new ApiError(error.statusCode || 500, error.message);
  }
});

const getAllLoans = asyncHandler(async (req, res) => {
  try {
    ////console.log("Fetching all loans...");

    // Find all loans
    const loans = await Loan.find(
      {},
      "loanId loanAmount time borrowerEthAddress isFunded"
    );

    // Fetch credit scores for each borrower
    const loansWithCreditScore = await Promise.all(
      loans.map(async (loan) => {
        const borrower = await User.findOne(
          { ethAddress: loan.borrowerEthAddress },
          "creditScore"
        );

        return {
          loanId: loan.loanId,
          loanAmount: loan.loanAmount,
          duration: loan.time,
          borrowerEthAddress: loan.borrowerEthAddress,
          creditScore: borrower?.creditScore || "Unknown", // Default to "Unknown" if user not found
          isFunded: loan.isFunded,
        };
      })
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          loansWithCreditScore,
          "Loans fetched successfully!"
        )
      );
  } catch (error) {
    console.error("Get Loans Error:", error);
    throw new ApiError(error.statusCode || 500, error.message);
  }
});

const getActiveLoans = asyncHandler(async (req, res) => {
  try {
    console.log("Fetching active loans...");

    // Fetch only active loans (isFunded: true, isRepaid: false)
    const loans = await Loan.find(
      { isFunded: true, isRepaid: false },
      "loanId loanPayableAmount time borrowerEthAddress createdAt lenderEthAddress"
    ).lean();

    if (!loans.length) {
      return res
        .status(200)
        .json(new ApiResponse(200, [], "No active loans found!"));
    }

    // Fetch credit scores and process loans
    const loansWithCreditScore = await Promise.all(
      loans.map(async (loan) => {
        const borrower = await User.findOne(
          { ethAddress: loan.borrowerEthAddress },
          "creditScore"
        ).lean();

        return {
          loanId: loan.loanId,
          loanAmount: loan.loanAmount,
          loanPayableAmount: loan.loanPayableAmount,
          duration: loan.time,
          borrowerEthAddress: loan.borrowerEthAddress,
          lenderEthAddress: loan.lenderEthAddress,
          creditScore: borrower?.creditScore || "Unknown",
        };
      })
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          loansWithCreditScore,
          "Active loans fetched successfully!"
        )
      );
  } catch (error) {
    console.error("Error fetching active loans:", error);
    throw new ApiError(error.statusCode || 500, error.message);
  }
});

export { createLoan, fundLoan, loanRepaid, getAllLoans, getActiveLoans };

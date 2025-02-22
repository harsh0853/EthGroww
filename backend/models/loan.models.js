import mongoose from "mongoose";
import { User } from "./user.models.js";

const loanSchema = new mongoose.Schema(
  {
    uniqueId: {
      type: String,
      required: true,
      unique: true,
    },
    loanId: {
      type: String,
      required: true,
    },
    borrowerEthAddress: {
      type: String,
      required: true,
    },
    lenderEthAddress: {
      type: String,
    },
    loanAmount: {
      type: Number,
      required: true,
    },
    loanPayableAmount: {
      type: Number,
      required: true,
    },
    time: {
      type: Number,
      required: true,
    },
    isFunded: {
      type: Boolean,
      default: false,
    },
    isRepaid: {
      type: Boolean,
      default: false,
    },
    isDefaulted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Loan = mongoose.model("Loan", loanSchema);

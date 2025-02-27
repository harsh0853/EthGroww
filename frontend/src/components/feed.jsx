import React, { useState, useEffect } from "react";
import {
  TextField,
  MenuItem,
  // InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  // Chip,
  Avatar,
  Button,
  styled,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Container,
} from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import TimerIcon from "@mui/icons-material/Timer";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import AddIcon from "@mui/icons-material/Add";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { ethers } from "ethers";
import contractABI from "./contractABI.json";
import { useSmoothScroll } from "../hooks/useSmoothScroll";

const StyledCard = styled(Card)(({ theme }) => ({
  margin: "10px",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
  },
}));
const GlassCard = styled(StyledCard)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  "& .MuiCardContent-root": {
    color: "#E0FAFF",
  },
  "& .MuiTypography-root": {
    color: "#E0FAFF",
  },
  "& .MuiTypography-secondary": {
    color: "#91C3D0",
  },
}));

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const AddLoanButton = styled(Button)(({ theme }) => ({
  borderRadius: "50px",
  padding: "12px 24px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
  },
}));

const Feed = () => {
  useSmoothScroll();

  const [loanRequests, setLoanRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [userData, setUserData] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [newLoan, setNewLoan] = useState({
    amount: "",
    collateral: "",
    duration: "",
    purpose: "",
  });

  // Get user data when component mounts
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  // Fetch all loans when component mounts
  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/v1/feed/loans", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch loans");
      }

      setLoanRequests(data.data || []);
    } catch (error) {
      console.error("Fetch loans error:", error);
      setSnackbar({
        open: true,
        message: error.message,
        severity: "error",
      });
      setLoanRequests([]);
    } finally {
      setLoading(false);
    }
  };

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

  const handleCreateRequest = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      const userData = JSON.parse(localStorage.getItem("userData"));

      if (!userData || !userData.ethAddress) {
        throw new Error("Please connect your wallet first");
      }

      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      //const balance = await provider.getBalance(userAddress);
      // Convert values

      // if (balance < amountInWei * 0.8) {
      //   throw new Error("Insufficient balance");
      // }
      const durationInSeconds = newLoan.duration * 30 * 24 * 60 * 60; // Convert months to seconds
      const interestRate = calculateInterestRate(
        Number(newLoan.amount),
        newLoan.duration / 12,
        userData.creditScore || 600
      );
      const si = newLoan.amount * interestRate * (newLoan.duration / 12) * 0.01;
      const principal = parseFloat(newLoan.amount) || 0;
      const interest = parseFloat(si) || 0;
      const loanPayableAmount = principal + interest;

      const amountInWei = ethers.parseEther(newLoan.amount.toString());
      const collateralInWei = ethers.parseEther(newLoan.collateral.toString());

      console.log("Sending loan request to blockchain and database", {
        amountInWei: amountInWei.toString(),
        durationInSeconds,
        interestRate,
      });
      if (
        parseFloat(newLoan.collateral) <
          (parseFloat(newLoan.amount) + parseFloat(1)) / 2 &&
        parseFloat(newLoan.collateral) >= 0.75 * parseFloat(newLoan.amount)
      ) {
        throw new Error(
          "Collateral must be between 50% and 75% of the loan amount"
        );
      }
      // Send transaction to blockchain
      const tx = await contract.requestLoan(
        collateralInWei,
        interestRate,
        durationInSeconds,
        { value: amountInWei }
      ); // fir heera pheeri

      console.log("Transaction sent:", tx.hash);
      const receipt = await tx.wait();
      console.log("Transaction xed:", receipt.transactionHash);
      console.log("Receipt:", receipt);
      console.log("Receipt:", receipt.logs);

      // Get loan ID from event logs
      const log = receipt.logs.find((l) => l.fragment.name === "LoanRequested");

      const loanId = log.args.loanId.toString();
      console.log("Loan created on blockchain with Loan ID:", loanId);
      //console.log(newLoan.collateral);
      // Send loan request to the database
      const response = await fetch(
        "http://localhost:5000/api/v1/feed/create-loan",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            amount: newLoan.amount.toString(),
            loanPayableAmount: loanPayableAmount.toString(),
            duration: Number(newLoan.duration),
            collateral: newLoan.collateral.toString(),
            loanId: loanId,
            ethAddress: userData.ethAddress,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to create loan in database"
        );
      }

      //console.log("Loan request stored in database");
      setSnackbar({
        open: true,
        message: "Loan request successfully created!",
        severity: "success",
      });
      handleClose();
      fetchLoans(); // Refresh the loan list
    } catch (error) {
      console.error("Create loan error:", error);
      setSnackbar({
        open: true,
        message: error.message,
        severity: "error",
      });
    }
  };
  const handleFundLoan = async (loan) => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData || !userData.ethAddress) {
        throw new Error("Please connect your wallet first");
      }

      // Check if user is trying to fund their own loan
      if (
        loan.borrowerEthAddress.toLowerCase() ===
        userData.ethAddress.toLowerCase()
      ) {
        setSnackbar({
          open: true,
          message: "You cannot fund your own loan request",
          severity: "error",
        });
        handleClose();
        return;
      }

      //console.log("Funding Loan Details:");
      //console.log("Lender Address:", userData.ethAddress);

      //console.log("Loan Amount:", loan.loanAmount);
      //console.log("Borrower Address:", loan.borrowerEthAddress);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress, // Replace with correct contract address
        contractABI,
        signer
      );
      //console.log(loan.loanId);
      // Ensure funding is directed correctly
      //console.log("Borrower Address:", loan.borrowerEthAddress);
      const tx = await contract.fundLoan(loan.loanId, {
        value: ethers.parseEther(loan.loanAmount.toString()), // Send loan amount in ETH
      });

      console.log("Transaction sent:", tx.hash);
      const receipt = await tx.wait();
      //console.log("Transaction confirmed:", receipt.transactionHash);

      // Update database after successful blockchain transaction
      const response = await fetch(
        `http://localhost:5000/api/v1/feed/fund-loan/${loan.loanId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            amount: loan.loanAmount,
            lenderAddress: userData.ethAddress,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update loan in database");
      }

      setSnackbar({
        open: true,
        message: "Loan funded successfully!",
        severity: "success",
      });

      handleClose();
      fetchLoans(); // Refresh the loans list
    } catch (error) {
      console.error("Fund loan error:", error);
      setSnackbar({
        open: true,
        message: error.message,
        severity: "error",
      });
    }
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewLoan((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddLoan = () => {
    setOpenAddDialog(true);
  };

  const handleAddClose = () => {
    setOpenAddDialog(false);
    setNewLoan({
      amount: "",
      duration: "",
      purpose: "",
    });
  };

  const handleFundClick = (loan) => {
    setSelectedLoan(loan);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedLoan(null);
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "47vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // const dummyLoanRequest = {
  //   loanId: "123",
  //   borrowerEthAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  //   loanAmount: 5.5,
  //   creditScore: 750,
  //   duration: 6,
  //   isFunded: false
  // };

  return (
    <Container
      sx={{
        overflowY: "hidden",
        scrollBehavior: "smooth",
        // ...existing styles
      }}
    >
      <Box
        sx={{
          padding: 3,
          backgroundColor: "transparent",
          backdropFilter: "blur(10px)",
          minHeight: "calc(100vh - 80px)", // Full viewport height minus navbar height
          position: "relative",
          zIndex: 1, // Ensure it's under the navbar if needed
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 11,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontFamily: "Yatra One",
              color: "#00ffff", // Changed to cyan
              textShadow: "0 0 10px rgba(0, 255, 255, 0.3)", // Added glow effect
            }}
          >
            Loan Requests
          </Typography>
          <AddLoanButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddLoan}
            sx={{
              backgroundColor: "transparent",
              border: "1px solid cyan",
              "&:hover": {
                backgroundColor: "cyan",
                color: "black",
              },
              color: "white",
            }}
          >
            Add Loan Request
          </AddLoanButton>
        </Box>

        {/* Loan Requests Grid */}
        <Grid
          container
          spacing={3}
          sx={{ maxWidth: "1200px", margin: "0 auto", mb: 4 }}
        >
          {/* <Grid item xs={12} sm={6} md={4}>
            <GlassCard>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 2,
                  }}
                >
                  <Avatar
                    sx={{
                      marginRight: 2,
                      background:
                        "linear-gradient(135deg, #9F2BFF 0%, #0085FF 50%, #64ffda 100%)",
                    }}
                  />
                  <Box>
                    <Typography variant="h6">
                      Loan #{dummyLoanRequest.loanId}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#91C3D0" }}>
                      {dummyLoanRequest.borrowerEthAddress.slice(0, 20)}...
                      {dummyLoanRequest.borrowerEthAddress.slice(-4)}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 1,
                  }}
                >
                  <AccountBalanceIcon
                    sx={{ marginRight: 1, color: "#64ffda" }}
                  />
                  <Typography sx={{ color: "#E0FAFF" }}>
                    ${dummyLoanRequest.loanAmount.toLocaleString()} ETH
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 1,
                  }}
                >
                  <CreditScoreIcon sx={{ marginRight: 1, color: "#28a745" }} />
                  <Typography>
                    Credit Score: {dummyLoanRequest.creditScore}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 2,
                  }}
                >
                  <TimerIcon sx={{ marginRight: 1, color: "#dc3545" }} />
                  <Typography>{dummyLoanRequest.duration} months</Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleFundClick(dummyLoanRequest)}
                  sx={{
                    backgroundColor: "rgba(100, 255, 218, 0.1)",
                    backdropFilter: "blur(5px)",
                    border: "1px solid rgba(100, 255, 218, 0.3)",
                    color: "#64ffda",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      backgroundColor: "rgba(100, 255, 218, 0.2)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 0 20px rgba(100, 255, 218, 0.2)",
                    },
                  }}
                >
                  Fund Now
                </Button>
              </CardContent>
            </GlassCard>
          </Grid> */}
          {loanRequests.length > 0 ? (
            loanRequests.map((request) => (
              <Grid item xs={12} sm={6} md={4} key={request.loanId}>
                <GlassCard>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 2,
                      }}
                    >
                      <Avatar
                        sx={{
                          marginRight: 2,
                          background:
                            "linear-gradient(135deg, #9F2BFF 0%, #0085FF 50%, #64ffda 100%)",
                        }}
                      />
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{ fontFamily: "Yatra One" }}
                        >
                          Loan {request.loanId}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#91C3D0" }}>
                          {request.borrowerEthAddress.slice(0, 20)}...
                          {request.borrowerEthAddress.slice(-4)}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 1,
                      }}
                    >
                      <AccountBalanceIcon
                        sx={{ marginRight: 1, color: "#64ffda" }}
                      />
                      <Typography sx={{ color: "#E0FAFF" }}>
                        ${request.loanAmount.toLocaleString()}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 1,
                      }}
                    >
                      <CreditScoreIcon
                        sx={{ marginRight: 1, color: "#28a745" }}
                      />
                      <Typography>
                        Credit Score: {request.creditScore}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 2,
                      }}
                    >
                      <TimerIcon sx={{ marginRight: 1, color: "#dc3545" }} />
                      <Typography>{request.duration} months</Typography>
                    </Box>

                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleFundClick(request)}
                      disabled={
                        request.isFunded ||
                        (userData &&
                          request.borrowerEthAddress.toLowerCase() ===
                            userData.ethAddress.toLowerCase())
                      }
                      sx={{
                        backgroundColor: request.isFunded
                          ? "#6c757d"
                          : "#007bff",
                        "&:hover": {
                          backgroundColor: request.isFunded
                            ? "#6c757d"
                            : "#0056b3",
                        },
                      }}
                    >
                      {request.isFunded
                        ? "Funded"
                        : userData &&
                          request.borrowerEthAddress.toLowerCase() ===
                            userData.ethAddress.toLowerCase()
                        ? "Your Loan"
                        : "Fund Now"}
                    </Button>
                  </CardContent>
                </GlassCard>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box sx={{ textAlign: "center", py: 4, color: "white" }}>
                <Typography variant="h6" color="text.secondary">
                  No loan requests available
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Be the first to create a loan request!
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>

        {/* Add Loan Dialog */}
        <Dialog
          open={openAddDialog}
          onClose={handleAddClose}
          PaperProps={{
            sx: {
              borderRadius: 2,
              padding: 2,
              maxWidth: "500px",
              width: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.1)", // Transparent background
              backdropFilter: "blur(10px)", // Blurred background
            },
          }}
        >
          <DialogTitle
            sx={{
              fontFamily: "Yatra One",
              color: "#00ffff", // Changed to cyan
              borderBottom: "1px solid rgba(0, 255, 255, 0.2)",
              textShadow: "0 0 10px rgba(0, 255, 255, 0.3)", // Added glow effect
            }}
          >
            Create New Loan Request
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
            >
              <TextField
                name="amount"
                label="Loan Amount (ETH)"
                type="number"
                value={newLoan.amount}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only valid numbers with up to 18 decimal places
                  if (value === "" || /^\d*\.?\d{0,18}$/.test(value)) {
                    setNewLoan((prev) => ({
                      ...prev,
                      amount: value,
                    }));
                  }
                }}
                fullWidth
                InputProps={{
                  inputProps: {
                    step: "0.1",
                    min: "0",
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#00ffff", // Cyan border color
                    },
                    "&:hover fieldset": {
                      borderColor: "#00ffff", // Cyan border color on hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#00ffff", // Cyan border color on focus
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "#fff", // White input text color
                  },
                  "& .MuiInputLabel-root": {
                    color: "#00ffff", // Cyan label color
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#00ffff", // Cyan label color on focus
                  },
                }}
              />
              <TextField
                name="collateral"
                label="Loan Collateral (ETH)"
                type="number"
                value={newLoan.collateral}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only valid numbers with up to 18 decimal places
                  if (value === "" || /^\d*\.?\d{0,18}$/.test(value)) {
                    setNewLoan((prev) => ({
                      ...prev,
                      collateral: value,
                    }));
                  }
                }}
                fullWidth
                InputProps={{
                  inputProps: {
                    step: "0.1",
                    min: "0",
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#00ffff", // Cyan border color
                    },
                    "&:hover fieldset": {
                      borderColor: "#00ffff", // Cyan border color on hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#00ffff", // Cyan border color on focus
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "#fff", // White input text color
                  },
                  "& .MuiInputLabel-root": {
                    color: "#00ffff", // Cyan label color
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#00ffff", // Cyan label color on focus
                  },
                }}
              />
              <TextField
                name="duration"
                label="Loan Duration"
                select
                value={newLoan.duration}
                onChange={handleInputChange}
                fullWidth
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        backgroundColor: "#333", // Gray background color
                        color: "#00ffff", // Cyan text color
                      },
                    },
                  },
                  IconComponent: (props) => (
                    <ArrowDropDownIcon
                      {...props}
                      style={{ color: "#00ffff" }}
                    /> // Cyan dropdown arrow color
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#00ffff", // Cyan border color
                    },
                    "&:hover fieldset": {
                      borderColor: "#00ffff", // Cyan border color on hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#00ffff", // Cyan border color on focus
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "#fff", // White input text color
                  },
                  "& .MuiInputLabel-root": {
                    color: "#00ffff", // Cyan label color
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#00ffff", // Cyan label color on focus
                  },
                }}
              >
                <MenuItem value={1}>1 month</MenuItem>
                <MenuItem value={2}>2 months</MenuItem>
                <MenuItem value={3}>3 months</MenuItem>
                <MenuItem value={4}>4 months</MenuItem>
                <MenuItem value={5}>5 months</MenuItem>
                <MenuItem value={6}>6 months</MenuItem>
                <MenuItem value={7}>7 months</MenuItem>
                <MenuItem value={8}>8 months</MenuItem>
                <MenuItem value={9}>9 months</MenuItem>
                <MenuItem value={10}>10 months</MenuItem>
                <MenuItem value={11}>11 months</MenuItem>
                <MenuItem value={12}>12 months</MenuItem>
              </TextField>

              <TextField
                name="purpose"
                label="Loan Purpose"
                select
                value={newLoan.purpose}
                onChange={handleInputChange}
                fullWidth
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        backgroundColor: "#333", // Gray background color
                        color: "#00ffff", // Cyan text color
                      },
                    },
                  },
                  IconComponent: (props) => (
                    <ArrowDropDownIcon
                      {...props}
                      style={{ color: "#00ffff" }}
                    /> // Cyan dropdown arrow color
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#00ffff", // Cyan border color
                    },
                    "&:hover fieldset": {
                      borderColor: "#00ffff", // Cyan border color on hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#00ffff", // Cyan border color on focus
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "#fff", // White input text color
                  },
                  "& .MuiInputLabel-root": {
                    color: "#00ffff", // Cyan label color
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#00ffff", // Cyan label color on focus
                  },
                }}
              >
                <MenuItem value="Business Expansion">
                  Business Expansion
                </MenuItem>
                <MenuItem value="Equipment Purchase">
                  Equipment Purchase
                </MenuItem>
                <MenuItem value="Working Capital">Working Capital</MenuItem>
                <MenuItem value="Inventory">Inventory</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions sx={{ padding: 2 }}>
            <Button
              onClick={handleAddClose}
              sx={{
                color: "#00ffff", // Cyan color
                "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleCreateRequest}
              sx={{
                backgroundColor: "#333", // Dark gray background
                color: "#00ffff", // Cyan color
                "&:hover": { backgroundColor: "#555" }, // Slightly lighter dark gray on hover
              }}
            >
              Create Request
            </Button>
          </DialogActions>
        </Dialog>

        {/* Fund Confirmation Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleClose}
          PaperProps={{
            sx: {
              borderRadius: 2,
              padding: 2,
              maxWidth: "400px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 8px 32px rgba(100, 255, 218, 0.1)",
            },
          }}
        >
          <DialogTitle
            sx={{
              fontFamily: "Yatra One",
              color: "#00ffff", // Changed to cyan
              borderBottom: "1px solid rgba(0, 255, 255, 0.2)",
              textShadow: "0 0 10px rgba(0, 255, 255, 0.3)", // Added glow effect
            }}
          >
            Confirm Funding
          </DialogTitle>
          <DialogContent>
            {selectedLoan && (
              <Box sx={{ my: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <AccountBalanceIcon sx={{ mr: 1, color: "#64ffda" }} />
                  <Typography sx={{ color: "#E0FAFF" }}>
                    Amount: {selectedLoan.loanAmount} ETH
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <TimerIcon sx={{ mr: 1, color: "#64ffda" }} />
                  <Typography sx={{ color: "#E0FAFF" }}>
                    Duration: {selectedLoan.duration} months
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      mr: 1,
                      background:
                        "linear-gradient(135deg, #9F2BFF 0%, #0085FF 50%, #64ffda 100%)",
                    }}
                  />
                  <Typography sx={{ color: "#91C3D0", fontSize: "0.9rem" }}>
                    {selectedLoan.borrowerEthAddress.slice(0, 20)}...
                    {selectedLoan.borrowerEthAddress.slice(-4)}
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions
            sx={{ padding: 2, borderTop: "1px solid rgba(100, 255, 218, 0.2)" }}
          >
            <Button
              onClick={handleClose}
              sx={{
                color: "#91C3D0",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "rgba(100, 255, 218, 0.1)",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleFundLoan(selectedLoan)}
              variant="contained"
              sx={{
                backgroundColor: "rgba(100, 255, 218, 0.1)",
                backdropFilter: "blur(5px)",
                border: "1px solid rgba(100, 255, 218, 0.3)",
                color: "#64ffda",
                borderRadius: "8px",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  backgroundColor: "rgba(100, 255, 218, 0.2)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 0 20px rgba(100, 255, 218, 0.2)",
                },
              }}
            >
              Confirm Funding
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar Notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default Feed;

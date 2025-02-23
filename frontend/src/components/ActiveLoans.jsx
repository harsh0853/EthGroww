import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
  Chip,
  Button,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ethers } from "ethers";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import contractABI from "./contractABI.json";
const contractAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

const ActiveLoansContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '24px',
  padding: '24px',
  backgroundColor: '#f5f5f5',
  minHeight: 'calc(100vh - 80px)', // Full viewport height minus navbar height
});


const LoanCard = styled(Grid)({
  flex: '1 1 calc(33.333% - 24px)',
  minWidth: '300px',
  maxWidth: 'calc(33.333% - 24px)',
  '@media (max-width: 1200px)': {
    flex: '1 1 calc(50% - 24px)',
    maxWidth: 'calc(50% - 24px)',
  },
  '@media (max-width: 800px)': {
    flex: '1 1 100%',
    maxWidth: '100%',
  },
});

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  transition: "all 0.3s ease",
  border: "1px solid #e0e0e0",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
  },
}));

const LoanInfoItem = styled(Box)({
  display: "flex",
  alignItems: "center",
  marginBottom: "8px",
  gap: "8px",
});

const StatusChip = styled(Chip)(({ status }) => ({
  backgroundColor: status === "active" ? "#4caf50" : "#ff9800",
  color: "white",
  fontWeight: "bold",
}));

const ActiveLoans = () => {
  const [activeLoans, setActiveLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActiveLoans = async () => {
      try {
        setLoading(true);
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (!userData?.ethAddress) {
          throw new Error("No wallet connected");
        }

        const response = await fetch(
          `http://localhost:5000/api/v1/feed/active-loans/${userData.ethAddress}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch active loans");
        }

        const data = await response.json();
        console.log("Active Loans:", data);

        if (data && data.data) {
          setActiveLoans(data.data);
        } else {
          setActiveLoans([]);
        }
      } catch (error) {
        console.error("Error fetching active loans:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveLoans();
  }, []);

  const repayLoan = async (loanId, repaymentAmount) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        contractAddress, // Replace with actual contract address
        contractABI,
        signer
      );

      // Proceed with repayment
      const tx = await contract.repayLoan(loanId, {
        value: ethers.parseEther(repaymentAmount.toString()),
      });

      await tx.wait();
      alert("Loan repaid successfully!");

      // Update database
      const response = await fetch(
        `http://localhost:5000/api/v1/feed/repay-loan/${loanId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ amount: repaymentAmount }),
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      alert("Loan repaid successfully!");
      setActiveLoans((prevLoans) =>
        prevLoans.filter((loan) => loan.loanId !== loanId)
      );
    } catch (error) {
      console.error("Repay loan error:", error);
      alert(error.message || "Error repaying loan");
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!activeLoans.length) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="calc(100vh - 80px)"
      >
        <Typography variant="h6" color="textSecondary">
          No active loans found
        </Typography>
      </Box>
    );
  }

  return (
    <ActiveLoansContainer>
      <Box sx={{ width: '100%', mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{fontFamily: "Yatra One", }}>
          Active Loans ({activeLoans.length})
        </Typography>
      </Box>
      
      {activeLoans.map((loan) => (
        <LoanCard key={loan.loanId}>
          <StyledCard sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h5" component="div">
                  Loan #{loan.loanId}
                </Typography>
                <StatusChip
                  label="ACTIVE"
                  status="active"
                  size="small"
                />
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mb: 3 }}>
                <LoanInfoItem>
                  <AccountBalanceIcon color="primary" />
                  <Typography variant="body1">
                    <strong>Amount Due:</strong> {loan.loanPayableAmount} ETH
                  </Typography>
                </LoanInfoItem>
                
                <LoanInfoItem>
                  <CalendarTodayIcon color="primary" />
                  <Typography variant="body1">
                    <strong>Duration:</strong> {loan.duration} months
                  </Typography>
                </LoanInfoItem>
  
                <LoanInfoItem>
                  <AccessTimeIcon color="primary" />
                  <Typography variant="body1">
                    <strong>Created:</strong> {new Date(loan.createdAt).toLocaleDateString()}
                  </Typography>
                </LoanInfoItem>
              </Box>
              
              <Box sx={{ 
                display: "flex", 
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2 
              }}>
                <Typography variant="body2" color="text.secondary">
                  {localStorage.getItem("walletAddress") === loan.lenderEthAddress ? 
                    "You are the lender" : "You are the borrower"}
                </Typography>
                
                {localStorage.getItem("walletAddress") !== loan.lenderEthAddress && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => repayLoan(loan.loanId, loan.loanPayableAmount)}
                    sx={{
                      borderRadius: "20px",
                      textTransform: "none",
                      px: 3,
                    }}
                  >
                    Repay Loan
                  </Button>
                )}
              </Box>
            </CardContent>
          </StyledCard>
        </LoanCard>
      ))}
    </ActiveLoansContainer>
  );
};


export default ActiveLoans;

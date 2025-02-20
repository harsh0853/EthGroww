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
const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
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
        minHeight="200px"
      >
        <Typography variant="h6" color="textSecondary">
          No active loans found
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Active Loans ({activeLoans.length})
      </Typography>
      <Grid container spacing={3}>
        {activeLoans.map((loan) => (
          <Grid item xs={12} key={loan.loanId}>
            <StyledCard>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Typography variant="h6" gutterBottom>
                      Loan #{loan.loanId}
                    </Typography>
                    <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                      <Chip
                        icon={<AccountBalanceIcon />}
                        label={`${loan.loanPayableAmount} ETH`}
                      />
                      <Chip
                        icon={<CalendarTodayIcon />}
                        label={`${loan.duration} months`}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    {localStorage.getItem("walletAddress") !==
                    loan.lenderEthAddress ? (
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={() =>
                          repayLoan(loan.loanId, loan.loanPayableAmount)
                        }
                      >
                        Repay Loan
                      </Button>
                    ) : (
                      `You will get ${loan.loanPayableAmount}`
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ActiveLoans;

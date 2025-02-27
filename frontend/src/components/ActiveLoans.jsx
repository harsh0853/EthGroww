import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Snackbar,
  CircularProgress,
  Grid,
  Chip,
  Button,
  Divider,
  Avatar,
  Container,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { styled } from "@mui/material/styles";
import { ethers } from "ethers";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import contractABI from "./contractABI.json";
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import { scrollToElement } from '../utils/smoothScroll';
const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const ActiveLoansContainer = styled(Box)({
  display: "flex",
  flexWrap: "wrap",
  gap: "24px",
  padding: "24px",
  backgroundColor: 'transparent',
  backdropFilter: 'blur(10px)',
  minHeight: "calc(100vh - 80px)",
});

const LoanCard = styled(Grid)({
  flex: "1 1 calc(33.333% - 24px)",
  minWidth: "300px",
  maxWidth: "calc(33.333% - 24px)",
  "@media (max-width: 1200px)": {
    flex: "1 1 calc(50% - 24px)",
    maxWidth: "calc(50% - 24px)",
  },
  "@media (max-width: 800px)": {
    flex: "1 1 100%",
    maxWidth: "100%",
  },
});

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  transition: "all 0.3s ease",
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 32px rgba(100, 255, 218, 0.2)',
  },
  '& .MuiTypography-root': {
    color: '#E0FAFF',
  },
  '& .MuiTypography-secondary': {
    color: '#91C3D0',
  }
}));

const GlassCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  transition: "all 0.3s ease",
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 32px rgba(100, 255, 218, 0.2)',
  },
  '& .MuiCardContent-root': {
    color: '#E0FAFF',
  },
  '& .MuiTypography-root': {
    color: '#E0FAFF',
  },
  '& .MuiTypography-secondary': {
    color: '#91C3D0',
  }
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
  useSmoothScroll();
  const [activeLoans, setActiveLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

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
  const claimCollateral = async (loanId) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      const tx = await contract.markDefault(loanId);
      await tx.wait();
      alert("Collateral claimed successfully!");
    } catch (error) {
      //console.error("Error claiming collateral:", error);
      alert("Error claiming collateral");
    }
  };
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

  const handleNavClick = (sectionId) => {
    scrollToElement(sectionId);
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
      <Container>
        <Box
          sx={{
            padding: 3,
            backgroundColor: "transparent",
            backdropFilter: "blur(10px)",
            minHeight: "calc(100vh - 80px)",
            position: "relative",
            zIndex: 1,
            overflowY: 'hidden',
            scrollBehavior: 'smooth',
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 11,
              marginBottom: 4
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontFamily: "Yatra One",
                color: "#00ffff",
                textShadow: '0 0 10px rgba(0, 255, 255, 0.3)',
                '& span': {
                  background: 'linear-gradient(135deg, #9F2BFF 0%, #0085FF 50%, #64ffda 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }
              }}
            >
              Active Loans (<span>{activeLoans.length}</span>)
            </Typography>
          </Box>

          <Grid container spacing={3} sx={{ maxWidth: "1200px", margin: "0 auto" }}>
            {activeLoans.map((loan) => (
              <Grid item xs={12} sm={6} md={4} key={loan.loanId}>
                <GlassCard>
                  <CardContent>
                    <Box sx={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 2,
                    }}>
                      <Avatar sx={{ 
                        marginRight: 2,
                        background: 'linear-gradient(135deg, #9F2BFF 0%, #0085FF 50%, #64ffda 100%)'
                      }} />
                      <Box>
                        <Typography variant="h6" sx={{fontFamily:'Yatra One'}}>
                          Loan #{loan.loanId}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#91C3D0' }}>
                          {loan.borrowerEthAddress.slice(0, 20)}...
                          {loan.borrowerEthAddress.slice(-4)}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 1,
                    }}>
                      <AccountBalanceIcon sx={{ marginRight: 1, color: "#64ffda" }} />
                      <Typography sx={{ color: '#E0FAFF' }}>
                        {loan.loanPayableAmount} ETH
                      </Typography>
                    </Box>

                    <Box sx={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 1,
                    }}>
                      <CalendarTodayIcon sx={{ marginRight: 1, color: "#64ffda" }} />
                      <Typography>{loan.duration} months</Typography>
                    </Box>

                    <Box sx={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 2,
                    }}>
                      <AccessTimeIcon sx={{ marginRight: 1, color: "#64ffda" }} />
                      <Typography>
                        Created: {new Date(loan.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => {}}
                      sx={{
                        backgroundColor: 'rgba(100, 255, 218, 0.1)',
                        backdropFilter: 'blur(5px)',
                        border: '1px solid rgba(100, 255, 218, 0.3)',
                        color: '#64ffda',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          backgroundColor: 'rgba(100, 255, 218, 0.2)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 0 20px rgba(100, 255, 218, 0.2)',
                        },
                      }}
                    >
                      Repay Loan
                    </Button>
                  </CardContent>
                </GlassCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box
        sx={{
          padding: 3,
          backgroundColor: "transparent",
          backdropFilter: "blur(10px)",
          minHeight: "calc(100vh - 80px)",
          position: "relative",
          zIndex: 1,
          overflowY: 'hidden',
          scrollBehavior: 'smooth',
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 11,
            marginBottom: 4
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontFamily: "Yatra One",
              color: "#00ffff",
              textShadow: '0 0 10px rgba(0, 255, 255, 0.3)',
              '& span': {
                background: 'linear-gradient(135deg, #9F2BFF 0%, #0085FF 50%, #64ffda 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }
            }}
          >
            Active Loans (<span>{activeLoans.length}</span>)
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ maxWidth: "1200px", margin: "0 auto" }}>
          {activeLoans.map((loan) => (
            <Grid item xs={12} sm={6} md={4} key={loan.loanId}>
              <GlassCard>
                <CardContent>
                  <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 2,
                  }}>
                    <Avatar sx={{ 
                      marginRight: 2,
                      background: 'linear-gradient(135deg, #9F2BFF 0%, #0085FF 50%, #64ffda 100%)'
                    }} />
                    <Box>
                      <Typography variant="h6" sx={{fontFamily:'Yatra One'}}>
                        Loan #{loan.loanId}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#91C3D0' }}>
                        {loan.borrowerEthAddress.slice(0, 20)}...
                        {loan.borrowerEthAddress.slice(-4)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 1,
                  }}>
                    <AccountBalanceIcon sx={{ marginRight: 1, color: "#64ffda" }} />
                    <Typography sx={{ color: '#E0FAFF' }}>
                      {loan.loanPayableAmount} ETH
                    </Typography>
                  </Box>

                  <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 1,
                  }}>
                    <CalendarTodayIcon sx={{ marginRight: 1, color: "#64ffda" }} />
                    <Typography>{loan.duration} months</Typography>
                  </Box>

                  <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 2,
                  }}>
                    <AccessTimeIcon sx={{ marginRight: 1, color: "#64ffda" }} />
                    <Typography>
                      Created: {new Date(loan.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>

                  {localStorage.getItem("walletAddress") !== loan.lenderEthAddress ? (
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => repayLoan(loan.loanId, loan.loanPayableAmount)}
                      sx={{
                        backgroundColor: 'rgba(100, 255, 218, 0.1)',
                        backdropFilter: 'blur(5px)',
                        border: '1px solid rgba(100, 255, 218, 0.3)',
                        color: '#64ffda',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          backgroundColor: 'rgba(100, 255, 218, 0.2)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 0 20px rgba(100, 255, 218, 0.2)',
                        },
                      }}
                    >
                      Repay Loan
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => claimCollateral(loan.loanId, loan.collateral)}
                      sx={{
                        backgroundColor: 'rgba(100, 255, 218, 0.1)',
                        backdropFilter: 'blur(5px)',
                        border: '1px solid rgba(100, 255, 218, 0.3)',
                        color: '#64ffda',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          backgroundColor: 'rgba(100, 255, 218, 0.2)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 0 20px rgba(100, 255, 218, 0.2)',
                        },
                      }}
                    >
                      Claim Collateral
                    </Button>
                  )}
                </CardContent>
              </GlassCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default ActiveLoans;

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
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { styled } from "@mui/material/styles";
import { ethers } from "ethers";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import contractABI from "./contractABI.json";
import { useSmoothScroll } from "../hooks/useSmoothScroll";
import { scrollToElement } from "../utils/smoothScroll";
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const ActiveLoansContainer = styled(Box)({
  display: "flex",
  flexWrap: "wrap",
  gap: "24px",
  padding: "24px",
  backgroundColor: "transparent",
  backdropFilter: "blur(10px)",
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
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 32px rgba(100, 255, 218, 0.2)",
  },
  "& .MuiTypography-root": {
    color: "#E0FAFF",
  },
  "& .MuiTypography-secondary": {
    color: "#91C3D0",
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

  // const DummyLoansCard = () => {
  //   return (
  //     <ActiveLoansContainer>
  //       <Box sx={{ width: '100%' }}>
  //       <Typography variant="h4" gutterBottom sx={{fontFamily: "Yatra One", }}>
  //           Active Loans (3)
  //         </Typography>
  //       </Box>
  //       {[1, 2, 3].map((item) => (
  //         <LoanCard key={item}>
  //           <StyledCard sx={{ height: '100%' }}>
  //             <CardContent>
  //               <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
  //                 <Typography variant="h5" component="div">
  //                   Loan #{item}23
  //                 </Typography>
  //                 <StatusChip
  //                   label="ACTIVE"
  //                   status="active"
  //                   size="small"
  //                 />
  //               </Box>

  //               <Divider sx={{ my: 2 }} />

  //               <Box sx={{ mb: 3 }}>
  //                 <LoanInfoItem>
  //                   <AccountBalanceIcon color="primary" />
  //                   <Typography variant="body1">
  //                     <strong>Amount Due:</strong> 0.5 ETH
  //                   </Typography>
  //                 </LoanInfoItem>

  //                 <LoanInfoItem>
  //                   <CalendarTodayIcon color="primary" />
  //                   <Typography variant="body1">
  //                     <strong>Duration:</strong> 3 months
  //                   </Typography>
  //                 </LoanInfoItem>

  //                 <LoanInfoItem>
  //                   <AccessTimeIcon color="primary" />
  //                   <Typography variant="body1">
  //                     <strong>Created:</strong> {new Date().toLocaleDateString()}
  //                   </Typography>
  //                 </LoanInfoItem>
  //               </Box>

  //               <Box sx={{
  //                 display: "flex",
  //                 justifyContent: "space-between",
  //                 alignItems: "center",
  //                 mt: 2
  //               }}>
  //                 <Typography variant="body2" color="text.secondary">
  //                   You are the borrower
  //                 </Typography>
  //                 <Button
  //                   variant="contained"
  //                   color="primary"
  //                   sx={{
  //                     borderRadius: "20px",
  //                     textTransform: "none",
  //                     px: 3,
  //                   }}
  //                 >
  //                   Repay Loan
  //                 </Button>
  //               </Box>
  //             </CardContent>
  //           </StyledCard>
  //         </LoanCard>
  //       ))}
  //     </ActiveLoansContainer>
  //   );
  // };

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

    // return <DummyLoansCard />;
  }

  return (
    <Box
      sx={{
        overflowY: "hidden",
        scrollBehavior: "smooth",
      }}
    >
      <ActiveLoansContainer>
        <Box sx={{ width: "100%", mb: 4 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontFamily: "Yatra One",
              color: "#E0FAFF",
              "& span": {
                background:
                  "linear-gradient(135deg, #9F2BFF 0%, #0085FF 50%, #64ffda 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              },
            }}
          >
            Active Loans (<span>{activeLoans.length}</span>)
          </Typography>
        </Box>

        {activeLoans.map((loan) => (
          <LoanCard key={loan.loanId}>
            <StyledCard sx={{ height: "100%" }}>
              <CardContent>
                <Box
                  sx={{
                    mb: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h5" component="div">
                    Loan #{loan.loanId}
                  </Typography>
                  <StatusChip label="ACTIVE" status="active" size="small" />
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
                      <strong>Created:</strong>{" "}
                      {new Date(loan.createdAt).toLocaleDateString()}
                    </Typography>
                  </LoanInfoItem>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 2,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {localStorage.getItem("walletAddress") ===
                    loan.lenderEthAddress
                      ? "You are the lender"
                      : "You are the borrower"}
                  </Typography>

                  {localStorage.getItem("walletAddress") !==
                  loan.lenderEthAddress ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        repayLoan(loan.loanId, loan.loanPayableAmount)
                      }
                      sx={{
                        borderRadius: "20px",
                        textTransform: "none",
                        px: 3,
                      }}
                    >
                      Repay Loan
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        claimCollateral(loan.loanId, loan.collateral)
                      }
                    >
                      Claim Collateral
                    </Button>
                  )}
                </Box>
              </CardContent>
            </StyledCard>
          </LoanCard>
        ))}
      </ActiveLoansContainer>
      <Button onClick={() => handleNavClick("targetSection")}>
        Scroll to Section
      </Button>
    </Box>
  );
};

export default ActiveLoans;

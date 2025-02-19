import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  styled,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { keyframes } from "@mui/system";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import TimelineIcon from "@mui/icons-material/Timeline";
import { CircularProgress, Divider } from "@mui/material";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const glowEffect = keyframes`
  0% { box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); }
  50% { box-shadow: 0 0 20px rgba(0, 123, 255, 0.8); }
  100% { box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); }
`;

const SidebarContainer = styled(Box)(({ theme }) => ({
  position: "fixed",
  right: 0,
  top: 55,
  width: "280px",
  height: "100vh",
  backgroundColor: "#ffffff",
  boxShadow: "-5px 0 15px rgba(0, 0, 0, 0.1)",
  padding: "2rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  zIndex: 1000,
  animation: `${fadeIn} 0.5s ease-out`,
  "&:hover": {
    boxShadow: "-8px 0 20px rgba(0, 0, 0, 0.15)",
  },
  transition: "box-shadow 0.3s ease",
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  top: 0,
  width: "100px",
  height: "100px",
  marginBottom: "1.5rem",
  border: "4px solid #007bff",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.15)",
    animation: `${glowEffect} 2s infinite`,
  },
}));

const InfoContainer = styled(Box)({
  width: "100%",
  marginBottom: "1rem",
  padding: "1rem",
  backgroundColor: "#f8f9fa",
  borderRadius: "10px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
  },
});

const InfoLabel = styled(Typography)({
  color: "#666",
  fontSize: "0.9rem",
  fontWeight: 500,
  textTransform: "uppercase",
  letterSpacing: "1px",
  flex: "0 0 40%", // This ensures the label takes up fixed space
});

const InfoValue = styled(Typography)({
  color: "#333",
  fontWeight: 600,
  fontSize: "1.1rem",
  wordBreak: "break-all",
  lineHeight: 1.4,
  flex: "0 0 60%", // This ensures the value takes up the remaining space
  textAlign: "right",
  "&:hover": {
    color: "#007bff",
  },
  transition: "color 0.3s ease",
});

const EthAddress = styled(Typography)({
  backgroundColor: "#e9ecef",
  padding: "0.5rem",
  borderRadius: "5px",
  fontSize: "0.9rem",
  fontFamily: "monospace",
  cursor: "pointer",
  flex: "0 0 50%",
  textAlign: "right",
  "&:hover": {
    backgroundColor: "#dee2e6",
  },
  "&:active": {
    backgroundColor: "#ced4da",
  },
  transition: "all 0.3s ease",
});

const ScoreContainer = styled(Box)({
  width: "100%",
  padding: ".5rem",
  backgroundColor: "#f8f9fa",
  borderRadius: "10px",
  marginBottom: ".1rem",
  textAlign: "center",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
  },
});

const StatContainer = styled(Box)({
  display: "flex",
  justifyContent: "space-around",
  width: "100%",
  marginTop: ".5rem",
  gap: "1rem",
});

const StatBox = styled(Box)({
  flex: 1,
  padding: "1rem",
  backgroundColor: "#fff",
  borderRadius: "8px",
  textAlign: "center",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-3px)",
  },
});

const API_URL = "http://localhost:5000/api/v1";

const ProfileDashBoard = () => {
  const [userData, setUserData] = useState(null);
  const [activeLoans, setActiveLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openRepayDialog, setOpenRepayDialog] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [repayAmount, setRepayAmount] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [location, setLocation] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // Get stored user data
        const storedUser = JSON.parse(localStorage.getItem("userData"));
        if (!storedUser?.ethAddress) {
          throw new Error("No wallet connected");
        }

        // Get access token and decode for username
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          throw new Error("Not authenticated");
        }

        // Decode JWT token to get user name
        const tokenParts = accessToken.split(".");
        const tokenPayload = JSON.parse(atob(tokenParts[1]));

        // Combine user data with token data
        const combinedUserData = {
          ...storedUser,
          name: tokenPayload.username.toUpperCase() || "Anonymous User",
        };

        // Get user's location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              try {
                const response = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                );
                const data = await response.json();
                const formattedLocation = `${
                  data.address.city ||
                  data.address.town ||
                  data.address.village ||
                  data.address.county ||
                  ""
                }, ${data.address.country || ""}`.replace(/^,\s+/, "");

                setLocation(formattedLocation);
                localStorage.setItem("userLocation", formattedLocation);

                // Update combined user data with location
                combinedUserData.location = formattedLocation;
                setUserData(combinedUserData);
              } catch (error) {
                console.error("Location fetch error:", error);
                const savedLocation = localStorage.getItem("userLocation");
                combinedUserData.location =
                  savedLocation || "Location not available";
                console.log(savedLocation);
                setUserData(combinedUserData);
              }
            },
            (error) => {
              console.error("Geolocation error:", error);
              const savedLocation = localStorage.getItem("userLocation");
              combinedUserData.location = savedLocation || "Location not";
              console.log(savedLocation);
              setUserData(combinedUserData);
            }
          );
        } else {
          const savedLocation = localStorage.getItem("userLocation");
          combinedUserData.location =
            savedLocation || "Geolocation not supported";
          setUserData(combinedUserData);
        }

        // Set initial user data
        setUserData(combinedUserData);

        console.log("Combined User Data:", combinedUserData); // Debug log

        // Fetch active loans
        const loansResponse = await fetch(`${API_URL}/feed/loans`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!loansResponse.ok) {
          const error = await loansResponse.json();
          throw new Error(error.message || "Failed to fetch loans");
        }

        const loansData = await loansResponse.json();

        const userActiveLoans = loansData.data.filter(
          (loan) =>
            loan.borrowerEthAddress.toLowerCase() ===
              storedUser.ethAddress.toLowerCase() &&
            loan.isFunded &&
            !loan.isRepaid
        );
        setActiveLoans(userActiveLoans);
      } catch (error) {
        console.error("Error fetching data:", error);
        setSnackbar({
          open: true,
          message: error.message,
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); // Removed location dependency to prevent infinite loop

  const handleRepayClick = (loan) => {
    setSelectedLoan(loan);
    setRepayAmount(loan.loanAmount);
    setOpenRepayDialog(true);
  };

  const handleRepayLoan = async () => {
    try {
      if (!selectedLoan || !repayAmount) {
        throw new Error("Invalid repayment details");
      }

      const response = await fetch(
        `${API_URL}/feed/repay-loan/${selectedLoan.loanId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            amount: repayAmount,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to repay loan");
      }

      setSnackbar({
        open: true,
        message: "Loan repaid successfully!",
        severity: "success",
      });

      setActiveLoans((prev) =>
        prev.filter((loan) => loan.loanId !== selectedLoan.loanId)
      );
      setOpenRepayDialog(false);
    } catch (error) {
      console.error("Repay loan error:", error);
      setSnackbar({
        open: true,
        message: error.message,
        severity: "error",
      });
    }
  };

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(userData.ethAddress);
      setSnackbar({
        open: true,
        message: "Address copied to clipboard!",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to copy address",
        severity: "error",
      });
      console.error("Failed to copy address:", err);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <SidebarContainer>
      <ProfileAvatar src={userData?.avatarUrl} alt={userData?.name}>
        {userData?.name
          ?.split(" ")
          .map((n) => n[0])
          .join("")}
      </ProfileAvatar>

      <InfoContainer>
        <InfoLabel>Name</InfoLabel>
        <InfoValue>{userData?.name || "Anonymous User"}</InfoValue>
      </InfoContainer>

      <InfoContainer>
        <InfoLabel>Eth. Address</InfoLabel>
        <EthAddress onClick={handleCopyAddress}>
          {userData?.ethAddress
            ? `${userData.ethAddress.slice(0, 6)}...${userData.ethAddress.slice(
                -4
              )}`
            : "Not Connected"}
        </EthAddress>
      </InfoContainer>

      <InfoContainer>
        <InfoLabel>Location</InfoLabel>
        <InfoValue>{userData?.location || "Location not available"}</InfoValue>
      </InfoContainer>

      <Divider sx={{ width: "100%", my: 1 }} />

      <ScoreContainer>
        <CreditScoreIcon sx={{ fontSize: 40, color: "#007bff", mb: 1 }} />
        <Typography variant="h5" gutterBottom>
          Credit Score
        </Typography>
        <Box sx={{ position: "relative", display: "inline-flex" }}>
          <CircularProgress
            variant="determinate"
            value={((userData?.creditScore || 0) / 850) * 100}
            size={80}
            thickness={4}
            sx={{
              color: (userData?.creditScore || 0) > 700 ? "#28a745" : "#dc3545",
              backgroundColor: "#f5f5f5",
              borderRadius: "50%",
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h6"
              component="div"
              color="text.primary"
              sx={{ fontWeight: "bold" }}
            >
              {userData?.creditScore || 0}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {(userData?.creditScore || 0) > 700 ? "Excellent" : "Fair"}
        </Typography>
      </ScoreContainer>

      <Divider sx={{ width: "100%", my: 2 }} />

      {/* Loan Statistics */}
      <StatContainer>
        <StatBox>
          <AccountBalanceIcon sx={{ color: "#007bff", mb: 1 }} />
          <Typography variant="h6">{userData?.totalLoans || 0}</Typography>
          <Typography variant="body2" color="text.secondary">
            Total Loans
          </Typography>
        </StatBox>

        <StatBox>
          <TimelineIcon sx={{ color: "#28a745", mb: 1 }} />
          <Typography variant="h6">{userData?.activeLoans || 0}</Typography>
          <Typography variant="body2" color="text.secondary">
            Active Loans
          </Typography>
        </StatBox>

        <StatBox>
          <CreditScoreIcon sx={{ color: "#dc3545", mb: 1 }} />
          <Typography variant="h6">
            {userData?.successRate?.toFixed(1) || 100}%
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Success Rate
          </Typography>
        </StatBox>
      </StatContainer>

      {/* Active Loans Section */}
      <Typography variant="h6" sx={{ mt: 3, mb: 2, width: "100%" }}>
        Active Loans ({userData?.activeLoans || 0})
      </Typography>

      {activeLoans.length > 0 ? (
        activeLoans.map((loan) => (
          <Box
            key={loan.loanId}
            sx={{
              width: "100%",
              p: 2,
              mb: 2,
              backgroundColor: "#f8f9fa",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Typography variant="subtitle1">
              Loan Amount: {loan.loanAmount} ETH
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Duration: {loan.time} months
            </Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 1 }}
              onClick={() => handleRepayClick(loan)}
            >
              Repay Loan
            </Button>
          </Box>
        ))
      ) : (
        <Typography variant="body1" color="text.secondary">
          No active loans found
        </Typography>
      )}

      {/* Repay Dialog */}
      <Dialog open={openRepayDialog} onClose={() => setOpenRepayDialog(false)}>
        <DialogTitle>Repay Loan</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Repayment Amount (ETH)"
            type="number"
            fullWidth
            value={repayAmount}
            onChange={(e) => setRepayAmount(e.target.value)}
            InputProps={{
              inputProps: { step: "0.000000000000000001" },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRepayDialog(false)}>Cancel</Button>
          <Button onClick={handleRepayLoan} variant="contained" color="primary">
            Confirm Repayment
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SidebarContainer>
  );
};

export default ProfileDashBoard;

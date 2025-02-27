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
import IconButton from "@mui/material/IconButton";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

// Remove the glowEffect keyframes animation
// Delete or comment out this block
/* const glowEffect = keyframes`
  0% { box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); }
  50% { box-shadow: 0 0 20px rgba(0, 123, 255, 0.8); }
  100% { box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); }
`; */

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

// Update SidebarContainer styling
const SidebarContainer = styled(Box)(({ theme, isOpen }) => ({
  position: "fixed",
  right: "0px",
  top: 0, // Change to 0 to touch the top
  width: "380px",
  height: "100vh", // Change to full height
  backgroundColor: "rgba(26, 32, 47, 0.95)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(100, 255, 218, 0.2)",
  padding: "2rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  zIndex: 1400, // Increase z-index to be above navbar
  transform: isOpen ? "translateX(0)" : "translateX(100%)",
  transition: "transform 0.3s ease-out",
  overflowY: "hidden",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
  "@media (max-width: 600px)": {
    width: "100%",
    right: 0,
  },
}));

// Add a backdrop for mobile
const Backdrop = styled(Box)(({ isOpen }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  backdropFilter: "blur(3px)",
  zIndex: 1100,
  opacity: isOpen ? 1 : 0,
  visibility: isOpen ? "visible" : "hidden",
  transition: "opacity 0.3s ease-out, visibility 0.3s ease-out",
  "@media (min-width: 600px)": {
    display: "none",
  },
}));

const UploadButton = styled(IconButton)({
  position: "absolute",
  bottom: -10,
  right: -10,
  backgroundColor: "rgba(0, 255, 255, 0.1)",
  backdropFilter: "blur(5px)",
  border: "1px solid rgba(0, 255, 255, 0.3)",
  color: "#00ffff",
  padding: "8px",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(0, 255, 255, 0.2)",
    transform: "scale(1.1)",
  },
});

const AvatarContainer = styled(Box)({
  position: "relative",
  marginTop: "2rem",
  marginBottom: "2rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const ProfileAvatar = styled(Avatar)({
  width: "120px",
  height: "120px",
  border: "3px solid #00ffff",
  boxShadow: "0 0 20px rgba(0, 255, 255, 0.3)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0 0 30px rgba(0, 255, 255, 0.5)",
  },
});

const InfoContainer = styled(Box)({
  width: "100%",
  marginBottom: "1rem",
  padding: "1rem",
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(5px)",
  borderRadius: "10px",
  border: "1px solid rgba(0, 255, 255, 0.1)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    transform: "translateY(-2px)",
    boxShadow: "0 5px 15px rgba(0, 255, 255, 0.1)",
  },
});

const InfoLabel = styled(Typography)({
  color: "#91C3D0",
  fontSize: "0.9rem",
  fontWeight: 500,
  textTransform: "uppercase",
  letterSpacing: "1px",
});

const InfoValue = styled(Typography)({
  color: "#E0FAFF",
  fontWeight: 500,
  fontSize: "1rem",
  textAlign: "right",
  transition: "color 0.3s ease",
  "&:hover": {
    color: "#00ffff",
  },
});

const EthAddress = styled(Typography)({
  backgroundColor: "#dee1e8",
  color: "#333",
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
  color: "#888",
  textAlign: "center",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
  },
});

const CreditScoreContainer = styled(Box)({
  width: "100%",
  padding: "1rem",
  backgroundColor: "transparent",
  backdropFilter: "blur(5px)",
  borderRadius: "10px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    transform: "translateY(-2px)",
    boxShadow: "0 5px 15px rgba(0, 255, 255, 0.1)",
  },
});

const CloseButton = styled(Button)({
  position: "absolute",
  top: "1rem",
  right: "1rem",
  minWidth: "40px",
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  backgroundColor: "rgba(0, 255, 255, 0.1)",
  color: "#00ffff",
  border: "1px solid rgba(0, 255, 255, 0.3)",
  zIndex: 11, // Ensure it's above other content
  "&:hover": {
    backgroundColor: "rgba(0, 255, 255, 0.2)",
    transform: "rotate(90deg)", // Add rotation effect
    transition: "transform 0.3s ease-in-out",
  },
});

const StyledCircularProgress = styled(CircularProgress)({
  color: "#00ffff",
  // Remove the animation property
});

// Add this styled component after other styled components
const StatsContainer = styled(Box)({
  width: "100%",
  marginTop: "2rem",
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "1rem",
});

const StatBox = styled(Box)({
  padding: "1rem",
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(5px)",
  borderRadius: "10px",
  border: "1px solid rgba(0, 255, 255, 0.1)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    transform: "translateY(-2px)",
    boxShadow: "0 5px 15px rgba(0, 255, 255, 0.1)",
  },
});

const API_URL = "http://localhost:5000/api/v1";

const ProfileDashBoard = ({ isOpen, onClose }) => {
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
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarFile(file);
      const imageUrl = URL.createObjectURL(file);
      setAvatarUrl(imageUrl);

      handleAvatarUpload(file);
    }
  };

  const handleAvatarUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch(`${API_URL}/user/upload-avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload avatar");
      }

      setSnackbar({
        open: true,
        message: "Profile picture updated successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Avatar upload error:", error);
      setSnackbar({
        open: true,
        message: "Failed to update profile picture",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

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
    <>
      <SidebarContainer isOpen={isOpen}>
        <CloseButton onClick={onClose}>×</CloseButton>

        <AvatarContainer>
          <ProfileAvatar
            src={avatarUrl || userData?.avatarUrl}
            alt={userData?.name}
          >
            {!avatarUrl &&
              !userData?.avatarUrl &&
              userData?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")}
          </ProfileAvatar>
          <input
            accept="image/*"
            type="file"
            id="avatar-upload"
            onChange={handleAvatarChange}
            style={{ display: "none" }}
          />
          <label htmlFor="avatar-upload">
            <UploadButton component="span">
              <PhotoCameraIcon />
            </UploadButton>
          </label>
        </AvatarContainer>

        <InfoContainer>
          <InfoLabel>Username</InfoLabel>
          <InfoValue>{userData?.name || "Anonymous User"}</InfoValue>
        </InfoContainer>

        <InfoContainer>
          <InfoLabel>ETH Address</InfoLabel>
          <InfoValue onClick={handleCopyAddress} sx={{ cursor: "pointer" }}>
            {userData?.ethAddress
              ? `${userData.ethAddress.slice(
                  0,
                  6
                )}...${userData.ethAddress.slice(-4)}`
              : "Not Connected"}
          </InfoValue>
        </InfoContainer>

        <InfoContainer>
          <InfoLabel>Location</InfoLabel>
          <InfoValue>{userData?.location || "Not Available"}</InfoValue>
        </InfoContainer>

        <CreditScoreContainer>
          <Typography variant="h6" sx={{ color: "#00ffff", mb: 2 }}>
            Credit Score
          </Typography>
          <Box sx={{ position: "relative", display: "inline-flex" }}>
            <StyledCircularProgress
              variant="determinate"
              value={((userData?.creditScore || 0) / 850) * 100}
              size={100}
              thickness={4}
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
              <Typography variant="h5" sx={{ color: "#E0FAFF" }}>
                {userData?.creditScore || 0}
              </Typography>
            </Box>
          </Box>
        </CreditScoreContainer>

        <StatsContainer>
          <StatBox>
            <Typography variant="h4" sx={{ color: "#00ffff", mb: 1 }}>
              {activeLoans.length}
            </Typography>
            <Typography
              sx={{ color: "#91C3D0", fontSize: "0.9rem", textAlign: "center" }}
            >
              Active Loans
            </Typography>
          </StatBox>
          <StatBox>
            <Typography variant="h4" sx={{ color: "#00ffff", mb: 1 }}>
              {userData?.totalLoans || 0}
            </Typography>
            <Typography sx={{ color: "#91C3D0", fontSize: "0.9rem" }}>
              Total Loans
            </Typography>
          </StatBox>
          <StatBox>
            <Typography variant="h4" sx={{ color: "#00ffff", mb: 1 }}>
              {userData?.successRate || 100}%
            </Typography>
            <Typography sx={{ color: "#91C3D0", fontSize: "0.9rem" }}>
              Success Rate
            </Typography>
          </StatBox>
        </StatsContainer>
      </SidebarContainer>
    </>
  );
};

export default ProfileDashBoard;

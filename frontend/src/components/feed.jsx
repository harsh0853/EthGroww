import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  Button,
  styled,
} from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import TimerIcon from "@mui/icons-material/Timer";
import CreditScoreIcon from "@mui/icons-material/CreditScore";

const StyledCard = styled(Card)(({ theme }) => ({
  margin: "10px",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
  },
}));

const Feed = () => {
  // Sample data for loan requests
  const loanRequests = [
    {
      id: "LOAN-2024-001",
      user: "Alice Smith",
      loanId: "#2024001",
      amount: 5000,
      creditScore: 750,
      duration: 12,
      purpose: "Business Expansion",
      avatar: "/path-to-avatar.jpg",
    },
    {
      id: "LOAN-2024-002",
      user: "Bob Johnson",
      loanId: "#2024002",
      amount: 7500,
      creditScore: 780,
      duration: 18,
      purpose: "Equipment Purchase",
      avatar: "/path-to-avatar.jpg",
    },
    {
      id: "LOAN-2024-003",
      user: "Carol Davis",
      loanId: "#2024003",
      amount: 3000,
      creditScore: 720,
      duration: 6,
      purpose: "Working Capital",
      avatar: "/path-to-avatar.jpg",
    },
  ];

  // Sample data for loan recommendations
  const loanRecommendations = [
    {
      id: "REC-2024-001",
      lender: "EthLend",
      loanId: "#ETH001",
      amount: 5000,
      interestRate: 5.5,
      duration: 12,
      requirements: "Min. credit score 700",
    },
    {
      id: "REC-2024-002",
      lender: "CryptoFin",
      loanId: "#CRY002",
      amount: 10000,
      interestRate: 6.2,
      duration: 24,
      requirements: "Min. credit score 720",
    },
    {
      id: "REC-2024-003",
      lender: "BlockLoan",
      loanId: "#BLK003",
      amount: 3000,
      interestRate: 4.8,
      duration: 6,
      requirements: "Min. credit score 680",
    },
  ];

  return (
    <Box sx={{ padding: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontFamily: "Yatra One",
          color: "#333",
          marginBottom: 4,
        }}
      >
        Loan Requests
      </Typography>

      {/* Loan Requests Grid */}
      <Grid container spacing={3}>
        {loanRequests.map((request) => (
          <Grid item xs={12} sm={6} md={4} key={request.id}>
            <StyledCard>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 2,
                  }}
                >
                  <Avatar src={request.avatar} sx={{ marginRight: 2 }} />
                  <Box>
                    <Typography variant="h6">Loan {request.loanId}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      by {request.user}
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
                    sx={{ marginRight: 1, color: "#007bff" }}
                  />
                  <Typography>${request.amount}</Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 1,
                  }}
                >
                  <CreditScoreIcon sx={{ marginRight: 1, color: "#28a745" }} />
                  <Typography>Credit Score: {request.creditScore}</Typography>
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

                <Chip
                  label={request.purpose}
                  color="primary"
                  variant="outlined"
                  sx={{ marginBottom: 2 }}
                />

                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "#007bff",
                    "&:hover": { backgroundColor: "#0056b3" },
                  }}
                >
                  View Details
                </Button>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontFamily: "Yatra One",
          color: "#333",
          margin: "4rem 0 2rem",
        }}
      >
        Recommended Loans
      </Typography>

      {/* Loan Recommendations Grid */}
      <Grid container spacing={3}>
        {loanRecommendations.map((loan) => (
          <Grid item xs={12} sm={6} md={4} key={loan.id}>
            <StyledCard>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 2,
                  }}
                >
                  <Typography variant="h6">{loan.lender}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ID: {loan.loanId}
                  </Typography>
                </Box>

                <Typography sx={{ marginBottom: 1 }}>
                  Interest Rate: {loan.interestRate}%
                </Typography>

                <Typography sx={{ marginBottom: 1 }}>
                  Duration: {loan.duration} months
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ marginBottom: 2 }}
                >
                  {loan.requirements}
                </Typography>

                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    borderColor: "#007bff",
                    color: "#007bff",
                    "&:hover": {
                      borderColor: "#0056b3",
                      backgroundColor: "rgba(0,123,255,0.1)",
                    },
                  }}
                >
                  Apply Now
                </Button>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Feed;

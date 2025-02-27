import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  styled,
  Typography,
  Grid,
  Stack,
  Alert,
  AlertTitle,
  CircularProgress,
  AppBar,
} from "@mui/material";
import { Link } from "react-router-dom";
import headerImg from "../assets/Main2.png";
import imgDetail from "../assets/Header 2.png";
import imgDetail2 from "../assets/Header 3.png";
import imgDetail3 from "../assets/Header 4.png";
import Title from "./Title";
import Paragraph from "./Paragraph";
import {
  MonetizationOn,
  AccountTree,
  AccountBalance,
  People,
} from "@mui/icons-material";

// Animations
const floatAnimation = `
  @keyframes float {
    0% {
      transform: translateY(0px);
      filter: drop-shadow(0 20px 15px rgba(100, 205, 218, 0.6));
    }
    50% {
      transform: translateY(-30px);
      filter: drop-shadow(0 25px 25px rgba(100, 205, 218, 0.15));
    }
    100% {
      transform: translateY(0px);
      filter: drop-shadow(0 20px 15px rgba(100, 205, 218, 0.6));
    }
  }
`;

// Styled Components
const AnimatedImage = styled("img")(({ theme }) => ({
  width: '80%',
  borderRadius: '10px',
  animation: 'float 3s ease-in-out infinite',
  transition: 'all 0.3s ease-in-out',
  transformStyle: 'preserve-3d',
  '&:hover': {
    transform: 'scale(1.05)',
    filter: 'drop-shadow(0 20px 30px rgba(100, 255, 218, 0.5))',
  },
  [theme.breakpoints.down('md')]: {
    width: '90%',
    marginTop: '2rem',
  }
}));

// Add this gradient text styling component
const GradientText = styled('span')({
  background: 'linear-gradient(135deg, #9F2BFF 0%, #0085FF 50%, #64ffda 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  display: 'inline-block',
  textShadow: '0 0 20px rgba(100, 255, 218, 0.2)',
  fontFamily: 'Yatra One'
});

// Update color constants
const colors = {
  primary: "#64ffda",
  text: {
    primary: "#E0FAFF",
    secondary: "#91C3D0",
    darker: "#6B95A3",
    accent: "#64ffda",
  },
  background: {
    light: "rgba(255, 255, 255, 0.03)",
    lighter: "rgba(255, 255, 255, 0.05)",
  },
};

const CustomBox = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  gap: theme.spacing(2),
  paddingTop: theme.spacing(20),
  position: "relative",
  background: "linear-gradient(135deg, #0a192f 0%, #112240 50%, #020c1b 100%)",
  overflow: "hidden",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
}));

const PageWrapper = styled(Box)({
  background: "linear-gradient(135deg, #0a192f 0%, #112240 50%, #020c1b 100%)",
  position: "relative",
  overflow: "hidden",
});

const GlowingCircle = styled("div")(
  ({ size = "150px", top, left, right, bottom, color }) => ({
    position: "absolute",
    width: size,
    height: size,
    borderRadius: "50%",
    background: color,
    filter: "blur(60px)",
    opacity: 0.3,
    top,
    left,
    right,
    bottom,
    zIndex: 1,
  })
);

const BoxText = styled(Box)(({ theme }) => ({
  flex: "1",
  paddingLeft: theme.spacing(8),
  borderRadius: "16px",
  padding: theme.spacing(4),
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateX(15px)",
  },
  [theme.breakpoints.down("md")]: {
    flex: "2",
    textAlign: "center",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

const CustomGridItem = styled(Grid)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(20px)",
  borderRadius: "16px",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
});

const CustomTypography = styled(Typography)({
  fontSize: "1.3rem",
  textAlign: "start",
  lineHeight: "1.5",
  color: colors.text.darker, // Updated to darker shade
  marginTop: "1.5rem",
  fontFamily: "Almendra",
  fontWeight: 400,
  fontStyle: "normal",
});

const NewsItem = styled("div")({
  gap: "5px",
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    backgroundColor: "rgba(100, 255, 218, 0.1)",
    boxShadow: "0 0 20px rgba(100, 255, 218, 0.3)",
    transform: "translateY(-2px)",
  },
  "& h3": {
    marginTop: 2,
    color: "#fff",
  },
  "& a": {
    color: "#64ffda",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
      color: "#5ccfff",
    },
  },
});

const NewsContainer = styled(Box)({
  width: "95%",
  padding: "2rem",
  margin: "3rem 0",
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  gap: "5px",
});

// Update NewsAlert styling
const NewsAlert = styled(Alert)({
  marginBottom: "2rem",
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(10px)",
  borderRadius: "10px",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  color: "#fff",
  "& .MuiAlert-message": {
    width: "100%",
  },
  "& .MuiAlert-icon": {
    color: "#64ffda",
  },
  "& .MuiAlertTitle-root": {
    color: colors.text.primary,
  },
  "& .MuiTypography-root": {
    color: colors.text.secondary,
  },
  "& a": {
    color: colors.primary,
    "&:hover": {
      color: colors.text.accent,
    },
  },
});

// Update StyledButton component with consistent hover effect
const StyledButton = styled(Button)({
  fontSize: "0.9rem",
  textTransform: "capitalize",
  padding: "8px 32px",
  borderRadius: 0,
  transition: "all 0.3s ease-in-out",
  backgroundColor: "#14192d",
  color: "#fff",
  "&:hover": {
    backgroundColor: "rgba(100, 255, 218, 0.1)",
    boxShadow: "0 0 20px rgba(100, 255, 218, 0.3)",
    transform: "translateY(-2px)",
  },
});

const FeatureBox = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
  padding: "2rem",
  background: "transparent",
  borderRadius: "16px",
  transition: "all 0.3s ease-in-out",
  position: "absolute",
  bottom: 20, // Increase bottom spacing
  left: 0,
  right: 0,
  color: "#FFFFFF",
  [theme.breakpoints.down("md")]: {
    bottom: 10, // Adjust for mobile
  }
}));

const Header = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetchNews();
    checkLoginStatus();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const apiKey = process.env.REACT_APP_NEWS_API_KEY;

      if (!apiKey) {
        throw new Error("News API key is not configured");
      }

      const response = await fetch(
        `https://newsdata.io/api/1/news?apikey=${apiKey}&q=blockchain OR cryptocurrency&language=en&size=3`
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Invalid API key. Please check your configuration.");
        }
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again later.");
        }
        throw new Error("Failed to fetch news");
      }

      const data = await response.json();

      if (data.results && Array.isArray(data.results)) {
        setNews(data.results);
      } else {
        setNews([]);
      }
    } catch (err) {
      setError(err.message);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const checkLoginStatus = () => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  };

  return (
    <PageWrapper>
      {/* Add glowing circles */}
      <GlowingCircle size="300px" top="-50px" left="-50px" color="#64ffda" />
      <GlowingCircle size="250px" bottom="20%" right="10%" color="#5ccfff" />
      <GlowingCircle size="200px" top="40%" left="20%" color="#79fff7" />

      {/* Hero Section */}
      <CustomBox component="header">
        <BoxText component="section" sx={{ height: "50vh" }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              color: colors.text.primary, // Updated to bright blue tint
              fontFamily: "Yatra One",
              fontStyle: "normal",
            }}
          >
            <GradientText>Crypto-Powered</GradientText> Loans for a Better Tomorrow.
          </Typography>

          <Typography
            variant="p"
            component="p"
            sx={{
              py: 3,
              lineHeight: 1.6,
              color: colors.text.secondary, // Updated to lighter shade
              fontFamily: "Almendra",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: 18,
            }}
          >
            Empowering individuals and small businesses, our Ethereum-based
            microloans platform offers fast, secure, and borderless financial
            support. With smart contracts ensuring transparency and eliminating
            middlemen, borrowers can access funds instantly with minimal fees.
          </Typography>

          {!isLoggedIn && (
            <Box>
              <StyledButton
                component={Link}
                to={"/login"}
                variant="contained"
                sx={{
                  mr: 2,
                  px: 4,
                  py: 1,
                  fontSize: "0.9rem",
                  textTransform: "capitalize",
                  borderRadius: 0,
                  borderColor: "#14192d",
                  color: "#fff",
                  backgroundColor: "#14192d",
                  "&&:hover": {
                    backgroundColor: "#343a55",
                  },
                  "&&:focus": {
                    backgroundColor: "#343a55",
                  },
                }}
              >
              Log In
            </StyledButton>
            <StyledButton
              component={Link}
              to={"/about"}
              variant="outlined"
              sx={{
                px: 4,
                py: 1,
                fontSize: "0.9rem",
                textTransform: "capitalize",
                borderRadius: 0,
                color: "#fff",
                backgroundColor: "transparent",
                borderColor: "#fff",
                "&&:hover": {
                  color: "#eee",
                  borderColor: "#343a55",
                },
                "&&:focus": {
                  color: "#343a55",
                  borderColor: "#343a55",
                },
              }}
            >
              Explore
            </StyledButton>
          </Box>)}
        </BoxText>

        <Box
  sx={(theme) => ({
    [theme.breakpoints.down("md")]: {
      flex: "1",
      paddingTop: "20px",
      alignSelf: "center",
      height: "40vh", // Add height constraint for mobile
    },
    [theme.breakpoints.up("md")]: {
      flex: "1",
      paddingLeft: "100px",
      alignSelf: "flex-center",
      height: "50vh", // Add height constraint for desktop
    },
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    alignItems: 'center', // Center the image vertically
    '&::after': {
      content: '""',
      position: 'absolute',
      width: '80%',
      height: '90px',
      bottom: '-20px',
      left: '50%',
      transform: 'translateX(-50%)',
      borderRadius: '50%',
      zIndex: 1,
    }
  })}
>
  <style>
    {floatAnimation}
  </style>
  <AnimatedImage 
    src={headerImg} 
    alt="Ethereum Animation"
    loading="eager"
  />
</Box>

        <FeatureBox>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "nowrap",
              gap: "1rem",
              height: "auto",
              alignSelf: "center",
              px: 2,
              "&::-webkit-scrollbar": {
                height: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: "rgba(255, 255, 255, 0.05)",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#64ffda",
                borderRadius: "4px",
              },
            }}
          >
            {[
              {
                title: "Total Value Locked",
                value: "$13.3M",
                icon: (
                  <AccountBalance
                    sx={{
                      fontSize: "2rem",
                      color: "#64ffda",
                      filter: "drop-shadow(0 0 8px rgba(100, 255, 218, 0.6))",
                    }}
                  />
                ),
              },
              {
                title: "Active Loans",
                value: "10.3K",
                icon: (
                  <MonetizationOn
                    sx={{
                      fontSize: "2rem",
                      color: "#64ffda",
                      filter: "drop-shadow(0 0 8px rgba(100, 255, 218, 0.6))",
                    }}
                  />
                ),
              },
              {
                title: "Network Users",
                value: "631.42K+",
                icon: (
                  <People
                    sx={{
                      fontSize: "2rem",
                      color: "#64ffda",
                      filter: "drop-shadow(0 0 8px rgba(100, 255, 218, 0.6))",
                    }}
                  />
                ),
              },
              {
                title: "Supported Chains",
                value: "10+",
                icon: (
                  <AccountTree
                    sx={{
                      fontSize: "2rem",
                      color: "#64ffda",
                      filter: "drop-shadow(0 0 8px rgba(100, 255, 218, 0.6))",
                    }}
                  />
                ),
              },
            ].map((metric, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  minWidth: "200px",
                  background: "rgba(255, 255, 255, 0.03)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "16px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    backgroundColor: "rgba(100, 255, 218, 0.1)",
                    boxShadow: "0 0 20px rgba(100, 255, 218, 0.3)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Box
                  sx={{
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {metric.icon}
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    color: colors.text.primary,
                    fontFamily: "Yatra One",
                    fontSize: "1.2rem",
                    fontWeight: 600,
                    textAlign: "center",
                    mb: 1,
                  }}
                >
                  {metric.value}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: colors.text.darker,
                    fontFamily: "Almendra",
                    fontSize: "0.875rem",
                    textAlign: "center",
                  }}
                >
                  {metric.title}
                </Typography>
              </Box>
            ))}
          </Box>
        </FeatureBox>
      </CustomBox>

      {/* Feature Section */}
      <Grid container spacing={4} sx={{ mt: 4, bgcolor: "transparent" }}>
        <CustomGridItem item xs={12} sm={8} md={6} component="section">
          <Box
            component="article"
            sx={{
              px: 4,
            }}
          >
            <Title
              text={
                <>
                  <GradientText>Easily access affordable loans</GradientText> for micro-investments
                </>
              }
              textAlign={"start"}
              sx={{
                color: colors.text.primary,
                fontWeight: 600,
              }}
            />
            <CustomTypography>
              Our blockchain-based microloans platform connects
              <br />
              borrowers with lenders in real-time, ensuring
              <br />
              fair and transparent financing options.
            </CustomTypography>
          </Box>
        </CustomGridItem>

      <Grid item xs={12} sm={4} md={6}>
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                transform: "translateY(-2px)",
                "& img": {
                  filter: "drop-shadow(0 0 20px #00ffff)",
                },
              },
            }}
          >
            <img
              src={imgDetail}
              alt="Blockchain lending visualization"
              style={{
                width: "50%",
                height: "100%",
                objectFit: "cover",
                transition: "all 0.3s ease-in-out",
              }}
            />
          </Box>
      </Grid>
      </Grid>
      <Grid container spacing={4} sx={{ mt: 4, bgcolor: "transparent" }}>
        <Grid
          item
          xs={12}
          sm={4}
          md={6}
          sx={{
            order: { xs: 4, sm: 4, md: 3 },
          }}
        >
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                transform: "translateY(-2px)",
                "& img": {
                  filter: "drop-shadow(0 0 20px #00ffff)",
                },
              },
            }}
          >
            <img
              src={imgDetail2}
              alt="Secure blockchain technology"
              style={{
                width: "50%",
                height: "100%",
                objectFit: "cover",
                transition: "all 0.3s ease-in-out",
              }}
            />
          </Box>
        </Grid>

        <CustomGridItem
          item
          xs={12}
          sm={8}
          md={6}
          sx={{
            order: { xs: 3, sm: 3, md: 4 },
          }}
        >
          <Box
            component="article"
            sx={{
              px: 4,
            }}
          >
            <Title
              text={
                <>
                  <GradientText>Trustworthy</GradientText> and secure lending
                </>
              }
              textAlign={"start"}
              sx={{
                color: colors.text.primary,
                fontWeight: 600,
              }}
            />
            <CustomTypography>
              Our blockchain technology ensures transparency and
              <br />
              security in the lending process, reducing fraud and
              <br />
              increasing trust among borrowers and lenders.
            </CustomTypography>
          </Box>
        </CustomGridItem>
      </Grid>
      <Grid container spacing={4} sx={{ mt: 4, bgcolor: "transparent" }}>
        <CustomGridItem item xs={12} sm={8} md={6} component="section">
          <Box
            component="article"
            sx={{
              px: 4,
            }}
          >
            <Title
              text={
                <>
                  <GradientText>Decentralized</GradientText> Financial Security
                </>
              }
              textAlign={"start"}
              sx={{
                color: colors.text.primary,
                fontWeight: 600,
              }}
            />
            <CustomTypography>
              Your transactions are secured by Ethereum blockchain,
              <br />
              with immutable records and automated compliance,
              <br />
              ensuring a trustless and transparent lending ecosystem.
            </CustomTypography>
          </Box>
        </CustomGridItem>

        <Grid item xs={12} sm={4} md={6}>
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                transform: "translateY(-2px)",
                "& img": {
                  filter: "drop-shadow(0 0 20px #00ffff)",
                },
              },
            }}
          >
            <img
              src={imgDetail3}
              alt="Blockchain lending visualization"
              style={{
                width: "30%",
                height: "100%",
                objectFit: "cover",
                transition: "all 0.3s ease-in-out",
              }}
            />
          </Box>
        </Grid>
      </Grid>

      {/* News Section */}
      <Grid item xs={12}>
        <NewsContainer>
          <Title
            text={
              <>
                Latest <GradientText>Blockchain</GradientText> News
              </>
            }
            textAlign={"center"}
            sx={{
              color: colors.text.primary,
              fontWeight: 600,
              gap: 2,
              paddingTop: 10,
            }}
          />
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <NewsAlert severity="error">
              <AlertTitle>Error</AlertTitle>
              {error}
            </NewsAlert>
          ) : news.length > 0 ? (
            <div className="news-container">
              {news.map((item, index) => (
                <NewsItem key={index}>
                  <NewsAlert
                    severity="info"
                    sx={{
                      "& .MuiAlert-message": {
                        width: "90%",
                      },
                    }}
                  >
                    <AlertTitle>{item.title}</AlertTitle>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {item.description?.slice(0, 200)}...
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 1,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        {new Date(item.pubDate).toLocaleDateString()}
                      </Typography>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Read more
                      </a>
                    </Box>
                  </NewsAlert>
                </NewsItem>
              ))}
            </div>
          ) : (
            <p>No news available at the moment.</p>
          )}
        </NewsContainer>
      </Grid>

      {/* Get in touch Section */}
      <Stack
        component="section"
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{
          my: 5,
          mx: 2,
          p: 5,
          fontFamily: "Yatra One",
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          borderRadius: "16px",
          position: "relative",
          zIndex: 2,
          "& h4": {
            color: colors.text.primary,
          },
          "& p": {
            color: colors.text.darker,
          },
        }}
      >
        <Title
          text={
            <>
              <GradientText>Blockchain-based Microloans</GradientText>
            </>
          }
          textAlign={"center"}
          variant="h4"
          sx={{ mt: 6 }}
        />
        <Paragraph
          text={
            "We are proud to offer blockchain-based microloans to help \
            homebuyers overcome financial barriers. Our platform ensures \
            transparency, security, and efficiency in the loan process. \
            Contact us to learn more about our blockchain-based microloans."
          }
          maxWidth={"sm"}
          mx={0}
          textAlign={"center"}
        />
        <StyledButton
          component={Link}
          to={"/contact"}
          variant="contained"
          type="submit"
          size="medium"
          sx={{
            fontSize: "0.9rem",
            textTransform: "capitalize",
            py: 2,
            px: 4,
            mt: 3,
            mb: 2,
            borderRadius: 0,
            backgroundColor: "#14192d",
            "&:hover": {
              backgroundColor: "#1e2a5a",
            },
          }}
        >
          Get in touch
        </StyledButton>
      </Stack>
    </PageWrapper>
  );
};

export default Header;

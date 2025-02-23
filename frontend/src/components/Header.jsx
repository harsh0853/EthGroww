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
  CircularProgress 
} from "@mui/material";
import { Link } from "react-router-dom";
import headerImg from "../assets/eth6.png";
import imgDetail from "../assets/eth5.jpeg";
import imgDetail2 from "../assets/eth4.jpeg";
import Title from "./Title";
import Paragraph from "./Paragraph";

// Animations
const tiltAnimation = `
  @keyframes tilt {
    0% { transform: perspective(1000px) rotateY(0deg); }
    25% { transform: perspective(1000px) rotateY(30deg); }
    50% { transform: perspective(1000px) rotateY(0deg); }
    50% { transform: perspective(1000px) rotateY(-30deg); }
    100% { transform: perspective(1000px) rotateY(0deg); }
  }
`;

// Styled Components
const RotatingImage = styled("img")`
  width: 80%;
  animation: tilt 5s ease-in-out infinite alternate;
  transform-style: preserve-3d;
  ${tiltAnimation}
`;

// Update color constants
const colors = {
  primary: '#64ffda',    
  text: {
    primary: '#E0FAFF',  
    secondary: '#91C3D0', 
    accent: '#64ffda'    
  },
  background: {
    light: 'rgba(255, 255, 255, 0.03)',
    lighter: 'rgba(255, 255, 255, 0.05)'
  }
};

const CustomBox = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(2),
  paddingTop: theme.spacing(20),
  position: 'relative',
  background: 'linear-gradient(135deg, #0a192f 0%, #112240 50%, #020c1b 100%)',
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
}));

const PageWrapper = styled(Box)({
  background: 'linear-gradient(135deg, #0a192f 0%, #112240 50%, #020c1b 100%)',
  position: 'relative',
  overflow: 'hidden',
});

const GlowingCircle = styled('div')(({ size = '150px', top, left, right, bottom, color }) => ({
  position: 'absolute',
  width: size,
  height: size,
  borderRadius: '50%',
  background: color,
  filter: 'blur(60px)',
  opacity: 0.3,
  top,
  left,
  right,
  bottom,
  zIndex: 1,
}));

const BoxText = styled(Box)(({ theme }) => ({
  flex: "1",
  paddingLeft: theme.spacing(8),
  borderRadius: '16px',
  padding: theme.spacing(4),
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateX(15px)',
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
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(20px)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
});

const CustomTypography = styled(Typography)({
  fontSize: "1.3rem",
  textAlign: "start",
  lineHeight: "1.5",
  color: colors.text.secondary, // Updated to lighter shade
  marginTop: "1.5rem",
  fontFamily: "Almendra",
  fontWeight: 400,
  fontStyle: "normal",
});

const NewsItem = styled("div")({
  gap: "5px",
  padding: "15px",
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: '10px',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  '& h3': {
    marginTop: 2,
    color: '#fff',
  },
  '& a': {
    color: '#64ffda',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
      color: '#5ccfff',
    },
  },
});

const NewsContainer = styled(Box)({
  width: "95%",
  padding: "2rem",
  margin: "3rem 0",
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
});

// Update NewsAlert styling
const NewsAlert = styled(Alert)({
  marginBottom: "2rem",
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  borderRadius: '10px',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  color: '#fff',
  "& .MuiAlert-message": {
    width: "100%",
  },
  "& .MuiAlert-icon": {
    color: '#64ffda',
  },
  "& .MuiAlertTitle-root": {
    color: colors.text.primary,
  },
  "& .MuiTypography-root": {
    color: colors.text.secondary,
  },
  "& a": {
    color: colors.primary,
    '&:hover': {
      color: colors.text.accent,
    }
  }
});

// Update buttons
const StyledButton = styled(Button)({
  color: colors.text.primary,
  borderRadius: "2rem",
  '&:hover': {
    backgroundColor: colors.background.lighter,
    color: colors.primary,
  }
});

const Header = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNews();
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

  return (
    <PageWrapper>
      {/* Add glowing circles */}
      <GlowingCircle size="300px" top="-50px" left="-50px" color="#64ffda" />
      <GlowingCircle size="250px" bottom="20%" right="10%" color="#5ccfff" />
      <GlowingCircle size="200px" top="40%" left="20%" color="#79fff7" />

      {/* Keep your existing components structure */}
      <CustomBox component="header">
        <BoxText component="section">
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
            Crypto-Powered Loans for a Better Tomorrow.
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
              Sign Up
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
                  color: "#343a55",
                  borderColor: "#343a55",
                },
                "&&:focus": {
                  color: "#343a55",
                  borderColor: "#343a55",
                },
              }}
            >
              explore
            </StyledButton>
          </Box>
        </BoxText>

        <Box
          sx={(theme) => ({
            [theme.breakpoints.down("md")]: {
              flex: "1",
              paddingTop: "20px",
              alignSelf: "center",
            },
            [theme.breakpoints.up("md")]: {
              flex: "1",
              paddingLeft: "100px",
              alignSelf: "flex-center",
            },
          })}
        >
          <RotatingImage src={headerImg} alt="headerImg" />
        </Box>
      </CustomBox>

      <Grid
        container
        spacing={{ xs: 4, sm: 4, md: 0 }}
        sx={{
          py: 10,
          px: 2,
          background: 'transparent',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <CustomGridItem item xs={12} sm={8} md={6} component="section">
          <Box
            component="article"
            sx={{
              px: 4,
            }}
          >
            <Title
              text={"Easily access affordable loans for micro-investments"}
              textAlign={"start"}
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
          <img
            src={imgDetail}
            alt=""
            style={{
              width: "100%",
            }}
          />
        </Grid>

        <Grid
          item
          xs={12}
          sm={4}
          md={6}
          sx={{
            order: { xs: 4, sm: 4, md: 3 },
          }}
        >
          <img
            src={imgDetail2}
            alt=""
            style={{
              width: "100%",
            }}
          />
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
            <Title text={"Trustworthy and secure lending"} textAlign={"start"} />
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

      <Grid item xs={12}>
        <NewsContainer>
          <Title 
            text={"Latest Blockchain News"} 
            textAlign={"center"}
            sx={{
              color: "#64ffda",
              fontWeight: 600,
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

      <Stack 
        component='section'
        direction="column"
        justifyContent='center'
        alignItems='center'
        sx={{
          my: 5,
          mx: 2,
          p: 5,
          fontFamily: 'Yatra One',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          position: 'relative',
          zIndex: 2,
          '& h4': {
            color: '#64ffda',
          },
          '& p': {
            color: '#a8b2d1',
          },
        }}
      >
        <Title 
          text={'Blockchain-based Microloans'} 
          textAlign={'center'}
          variant='h4'
          sx={{ mt: 6 }}
        />
        <Paragraph 
          text={
            'We are proud to offer blockchain-based microloans to help \
            homebuyers overcome financial barriers. Our platform ensures \
            transparency, security, and efficiency in the loan process. \
            Contact us to learn more about our blockchain-based microloans.'
          }
          maxWidth={'sm'}
          mx={0}
          textAlign={'center'}
        />
        <StyledButton 
          component={Link} 
          to={'/contact'}
          variant="contained" 
          type="submit"
          size="medium"
          sx={{ 
            fontSize: '0.9rem',
            textTransform: 'capitalize', 
            py: 2,
            px: 4,
            mt: 3, 
            mb: 2,
            borderRadius: 0,
            backgroundColor: '#14192d',
            "&:hover": {
              backgroundColor: '#1e2a5a',
            }
          }}
        >
          Get in touch
        </StyledButton>
      </Stack>
    </PageWrapper>
  );
};

export default Header;
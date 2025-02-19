import React from "react";
import { Alert, AlertTitle, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { Box, Grid, styled, Typography } from "@mui/material";
import Title from "./Title";
import imgDetail from "../assets/eth5.jpeg";
import imgDetail2 from "../assets/eth4.jpeg";

const NewsContainer = styled(Box)({
  width: "95%",
  padding: "2rem",
  marginTop: "2rem",
});
const NewsAlert = styled(Alert)({
  marginBottom: "2rem",
  "& .MuiAlert-message": {
    width: "100%",
  },
  backgroundColor: "#f3f3f3", // Added light gray background
  borderRadius: "10px", // Added border radius for better aesthetics
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
});

const GetStarted = () => {
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

  const CustomGridItem = styled(Grid)({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
  });

  const CustomTypography = styled(Typography)({
    fontSize: "1.3rem",
    textAlign: "start",
    lineHeight: "1.5",
    color: "#515151",
    marginTop: "1.5rem",
    fontFamily: "Almendra",
    fontWeight: 400,
    fontStyle: "normal",
  });

  return (
    <Grid
      container
      spacing={{ xs: 4, sm: 4, md: 0 }}
      sx={{
        py: 10,
        px: 2,
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
      <Grid item xs={12}>
        <NewsContainer>
          <Title text={"Latest Blockchain News"} textAlign={"center"} />

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
                <NewsAlert
                  key={index}
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
                      style={{
                        color: "#007bff",
                        textDecoration: "none",
                      }}
                    >
                      Read more
                    </a>
                  </Box>
                </NewsAlert>
              ))}
            </div>
          ) : (
            <p>No news available at the moment.</p>
          )}
        </NewsContainer>
      </Grid>
    </Grid>
  );
};
export default GetStarted;

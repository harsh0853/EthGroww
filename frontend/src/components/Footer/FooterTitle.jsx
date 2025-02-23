import { Typography, styled } from "@mui/material";
import React from 'react'

const StyledTypography = styled(Typography)({
  color: "#64ffda",
  fontWeight: 600,
  fontSize: "1.2rem",
  marginBottom: "1rem",
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: -5,
    left: "50%",
    width: "60%",
    height: "2px",
    background: "rgba(100, 255, 218, 0.3)",
    transform: "translateX(-50%)",
    transition: "width 0.3s ease",
  },
  "&:hover::after": {
    width: "80%",
  },
});

const FooterTitle = ({ text }) => {
  return <StyledTypography>{text}</StyledTypography>;
};

export default FooterTitle
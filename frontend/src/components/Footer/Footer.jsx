import React from "react";
import { Box, Stack, styled, Typography } from "@mui/material";
import { keyframes } from "@mui/system";
import Link from "@mui/material/Link";
import FooterTitle from "./FooterTitle";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";

// Add keyframes for subtle animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StyledLink = styled(Link)({
  fontSize: "1rem",
  color: "#ccd6f6",
  textDecoration: "none",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    color: "#64ffda",
    textShadow: "0 0 8px rgba(100, 255, 218, 0.5)", // Enhanced color effect
  },
  fontWeight: 400,
  cursor: "pointer",
});

const StackColumn = styled(Stack)(() => ({
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
  flex: 1,
  gap: 12,
  textAlign: "center",
  animation: `${fadeIn} 0.5s ease-out forwards`,
}));

const BoxRow = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  background: 'rgba(10, 25, 47, 0.25)',
  backdropFilter: 'blur(10px)',
  position: 'relative',
  overflow: 'hidden',
  flex: 1,
  borderTop: '1px solid rgba(100, 255, 218, 0.1)',
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    gap: 30,
  },
}));

// Add social media link styling
const SocialLink = styled(Link)({
  color: "#ccd6f6",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    color: "#64ffda",
    transform: "translateY(-2px)",
    textShadow: "0 0 8px rgba(100, 255, 218, 0.5)", // Enhanced color effect
  },
  "& svg": {
    fontSize: "1.5rem",
  },
});

const Footer = () => {
  const FooterLink = ({ text }) => {
    return <StyledLink variant="body2">{text}</StyledLink>;
  };

  return (
    <BoxRow
      component="footer"
      sx={{
        py: 4,
        px: 2,
      }}
    >

      <StackColumn>
        <FooterTitle text={"Contact Us"} />
        <FooterLink text={"ITER Bhubaneswar"} />
        <FooterLink text={"+91 9337939133"} />
        <FooterLink text={"info@microloans.com"} />
      </StackColumn>

      <StackColumn>
        <FooterTitle text={"Our Services"} />
        <FooterLink text={"Personal Loans"} />
        <FooterLink text={"Business Loans"} />
        <FooterLink text={"Mortgage Refinancing"} />
        <FooterLink text={"Debt Consolidation"} />
      </StackColumn>

      <StackColumn>
        <FooterTitle text={"Eth-MicroLoans"} />
        <Stack
          direction="row"
          width="70px"
          maxWidth="100%"
          justifyContent="space-between"
        >
          <SocialLink href="#" aria-label="Instagram">
            <InstagramIcon />
          </SocialLink>
          <SocialLink href="#" aria-label="Facebook">
            <FacebookIcon />
          </SocialLink>
        </Stack>
        <Typography 
          variant="caption" 
          component="p" 
          sx={{ 
            color: '#ccd6f6',
            opacity: 0.7 
          }}
        >
          &copy; 2025 MicroLoans Inc.
        </Typography>
      </StackColumn>


    </BoxRow>
  );
};

export default Footer;

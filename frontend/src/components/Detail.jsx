import React from "react";
import { Box, Button, Stack, TextField, styled } from "@mui/material";
import { Link } from "react-router-dom";
import Title from "./Title";
import Paragraph from "./Paragraph";

// Add styled components for glass effect
const GlassStack = styled(Stack)(({ theme }) => ({
  position: 'relative',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(100,255,218,0.1) 0%, rgba(100,255,218,0) 70%)',
    animation: 'float 8s infinite ease-in-out',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-30%',
    right: '-30%',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(100,255,218,0.1) 0%, rgba(100,255,218,0) 70%)',
    animation: 'float 10s infinite ease-in-out reverse',
  },
}));

// Add custom styled TextField
const GlassTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(5px)',
    borderRadius: '8px',
    color: '#E0FAFF',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'rgba(100, 255, 218, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(100, 255, 218, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#64ffda',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#91C3D0',
    '&.Mui-focused': {
      color: '#64ffda',
    },
  },
});

const Details = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      phone: data.get("phone"),
    });
  };

  return (
    <>
      <GlassStack
        component="section"
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{
          py: 10,
          px: 2,
          mt: { xs: 8, sm: 10 }, // Add margin-top to account for navbar
          mx: 4,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Title
          text={"Apply for an Ethereum-based Microloan"}
          textAlign={"center"}
        />
        <Paragraph
          text={
            "Get instant access to affordable Ethereum-based microloans. \
            Apply now and start reaping the benefits of decentralized finance."
          }
          maxWidth={"sm"}
          mx={0}
          textAlign={"center"}
        />

        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{
            mt: 1,
            py: 2,
            width: '100%',
            maxWidth: 'sm',
          }}
        >
          <GlassTextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <GlassTextField
            margin="normal"
            required
            fullWidth
            name="phone"
            label="Phone Number"
            type="phone"
            id="phone"
            autoComplete="current-phone"
          />
          <Button
            variant="contained"
            fullWidth
            type="submit"
            size="medium"
            to='/feed'
            component={Link}
            sx={{
              fontSize: '0.9rem',
              textTransform: 'capitalize',
              py: 2,
              mt: 3,
              mb: 2,
              borderRadius: '8px',
              backgroundColor: 'rgba(100, 255, 218, 0.1)',
              backdropFilter: 'blur(5px)',
              border: '1px solid rgba(100, 255, 218, 0.3)',
              color: '#64ffda',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                backgroundColor: 'rgba(100, 255, 218, 0.2)',
                boxShadow: '0 0 20px rgba(100, 255, 218, 0.2)',
                transform: 'translateY(-2px)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
            }}
          >
            Apply Now
          </Button>
        </Box>
      </GlassStack>

      <style>
        {`
          @keyframes float {
            0% { transform: translate(0, 0); }
            50% { transform: translate(20px, 20px); }
            100% { transform: translate(0, 0); }
          }
        `}
      </style>
    </>
  );
};

export default Details;

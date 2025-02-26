import React, { useState } from 'react';
import {
  Box,
  Typography,
  Rating,
  TextField,
  Button,
  Stack,
  styled,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { keyframes } from '@mui/system';

// Animation keyframes
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const glowingStar = keyframes`
  0% { filter: drop-shadow(0 0 2px #64ffda); }
  50% { filter: drop-shadow(0 0 10px #64ffda); }
  100% { filter: drop-shadow(0 0 2px #64ffda); }
`;

// Styled components
const GlassBox = styled(Box)(({ theme }) => ({
  background: 'transparent',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  padding: theme.spacing(4),
  maxWidth: '800px',
  width: '100%',
  margin: '40px auto',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(100,205,218,0.1) 0%, rgba(0,0,0,0) 70%)',
    animation: `${float} 15s infinite linear`,
  },
}));

const StyledRating = styled(Rating)(({ theme }) => ({
  '& .MuiRating-iconFilled': {
    color: '#64ffda',
    animation: `${glowingStar} 2s infinite ease-in-out`,
  },
  '& .MuiRating-iconHover': {
    color: '#64ffda',
  },
}));

const GlassTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(5px)',
    borderRadius: '8px',
    color: '#E0FAFF',
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

const GradientText = styled('span')({
  background: 'linear-gradient(135deg, #9F2BFF 0%, #0085FF 50%, #64ffda 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  display: 'inline-block',
  textShadow: '0 0 20px rgba(100, 255, 218, 0.2)',
  fontFamily: 'Yatra One',
});

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(-1);
  const [feedback, setFeedback] = useState('');

  const labels = {
    1: 'Unsatisfactory',
    2: 'Poor',
    3: 'Okay',
    4: 'Good',
    5: 'Excellent',
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle feedback submission
    console.log({ rating, feedback });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pt: 12,
        px: 3,
        background: 'linear-gradient(135deg, #1a1a1a 0%, #0a192f 100%)',
      }}
    >
      <GlassBox>
        <Stack spacing={4}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              textAlign: 'center',
              fontFamily: 'Yatra One',
              mb: 2,
              color: '#E0FAFF',
            }}
          >
            Your <GradientText>Feedback</GradientText> Matters
          </Typography>

          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              color: '#91C3D0',
              fontFamily: 'Almendra',
              fontSize: '1.1rem',
              mb: 4,
            }}
          >
            Help us improve our services by sharing your experience. Your insights drive our innovation.
          </Typography>

          <Box sx={{ textAlign: 'center' }}>
            <StyledRating
              name="rating"
              value={rating}
              precision={1}
              size="large"
              onChange={(event, newValue) => setRating(newValue)}
              onChangeActive={(event, newHover) => setHover(newHover)}
              emptyIcon={<StarIcon style={{ opacity: 0.55, color: '#91C3D0' }} fontSize="inherit" />}
            />
            {rating !== null && (
              <Typography
                sx={{
                  mt: 2,
                  color: '#64ffda',
                  fontFamily: 'Almendra',
                  minHeight: '2em',
                }}
              >
                {labels[hover !== -1 ? hover : rating]}
              </Typography>
            )}
          </Box>

          <GlassTextField
            multiline
            rows={4}
            label="Share your thoughts"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Tell us what you think about our service..."
          />

          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              mt: 2,
              py: 1.5,
              backgroundColor: 'rgba(100, 255, 218, 0.1)',
              color: '#64ffda',
              borderRadius: '8px',
              border: '1px solid rgba(100, 255, 218, 0.3)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                backgroundColor: 'rgba(100, 255, 218, 0.2)',
                transform: 'translateY(-2px)',
                boxShadow: '0 0 20px rgba(100, 255, 218, 0.2)',
              },
            }}
          >
            Submit Feedback
          </Button>
        </Stack>
      </GlassBox>
    </Box>
  );
};

export default Feedback;
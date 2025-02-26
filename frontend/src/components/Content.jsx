import React, { useState } from 'react'
import {  
    Grid, 
    Typography,
    IconButton,
    Card,
    CardContent,
    styled,
    Box,
    Stack,
} from "@mui/material";
// icons
import SportsGymnasticsIcon from '@mui/icons-material/MonetizationOnTwoTone';
import LocalParkingIcon from '@mui/icons-material/PriceCheckTwoTone';
import FastfoodOutlinedIcon from '@mui/icons-material/CurrencyBitcoin';
import PoolOutlinedIcon from '@mui/icons-material/PriceChange';
import WifiPasswordIcon from '@mui/icons-material/Savings';
import {
  Group as CommunityIcon,
  YouTube as YouTubeIcon,
  MenuBook as DocsIcon,
  Forum as FeedbackIcon
} from '@mui/icons-material';
// carousel
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
// components
import Title from './Title'
import Paragraph from './Paragraph'
import { Link } from 'react-router-dom';
import { useSmoothScroll } from '../hooks/useSmoothScroll';

const TumblingGridItem = styled(Grid)(({ theme }) => ({
    '&:hover': {
        animation: 'tumbling .50s ease-in-out',
        '& .MuiCard-root': {
            backgroundColor: 'rgba(100, 255, 218, 0.1)',
            boxShadow: '0 0 20px rgba(100, 255, 218, 0.3)',
        },
        '& .MuiIconButton-root': {
            color: '#64ffda',
        },
        '& .MuiTypography-root': {
            color: '#64ffda',
        }
    },
}));

const tumblingKeyframes = `
    @keyframes tumbling {
        0% { transform: rotate(0deg); }
        10% { transform: rotate(2deg); }
        40% { transform: rotate(-2deg); }
        70% { transform: rotate(2deg); }
        100% { transform: rotate(0deg); }
    }
`;

// Add this styled component after your existing styled components
const PlanContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '2rem',
  marginBottom: '2rem',
  '@media (max-width: 600px)': {
    flexDirection: 'column',
    textAlign: 'center',
  }
});

const Content = () => {
    useSmoothScroll();
    const [currentIndex, setCurrentIndex] = useState();

    const imageData = [
        {
            alt: 'image1',
            url: 'https://images.pexels.com/photos/8369770/pexels-photo-8369770.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
            alt: 'image2',
            url: 'https://media.istockphoto.com/id/887389924/photo/bitcoin-and-ethereum-exchange-on-blackboard.jpg?b=1&s=612x612&w=0&k=20&c=4-uzjb1SikoW5QDOVnM71PUwhFL-LHZLqr00hdLU3gs='
        },
        {
            alt: "image3",
            url: 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        {
            alt: "image4",
            url: 'https://images.pexels.com/photos/7788009/pexels-photo-7788009.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        {
            alt: "image5",
            url: 'https://images.pexels.com/photos/6771607/pexels-photo-6771607.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        {
            alt: "image6",
            url: 'https://images.pexels.com/photos/1263324/pexels-photo-1263324.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        {
            alt: "image7",
            url: 'https://images.pexels.com/photos/6764526/pexels-photo-6764526.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        {
            alt: "image8",
            url: 'https://images.pexels.com/photos/7567236/pexels-photo-7567236.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
    ];

    const renderSlides = imageData.map((image) => (
        <div key={image.alt}>
            <img src={image.url} alt={image.alt} />
        </div>
    ));

    const handleChange = (index) => {
        setCurrentIndex(index);
    }

    return (
        <Box sx={{ 
            scrollBehavior: 'smooth',
            overflowY: 'hidden'
          }}>
            {/* Existing Content section */}
            <Grid container spacing={2}   
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    py: 16,
                    px: 2,
                }}
            >
                <style>{tumblingKeyframes}</style>

                <Grid item xs={12} sm={12} md={5}
                component = 'section'
                >
                    
                    <Title
                    text={
                        <>
                          What we are offering?
                        </>
                      }
                    textAlign={'start'}
                    /> 

                    <Paragraph 
                        text={
                            'We offer flexible, affordable, and convenient microloans\
                            to help you meet your short-term financial needs.\
                            Our mission is to create a supportive environment\
                            where individuals can grow and thrive.'
                        }
                        maxWidth={'75%'}
                        mx={0}
                        textAlign={'start'}
                    />
                </Grid>
                
                <TumblingGridItem item xs={12} sm={6} md={3}>
    <Card 
    square={ true }
    sx={{
        minHeight: 200,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: '#1a1a1a',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
            backgroundColor: 'rgba(100, 255, 218, 0.1)',
            boxShadow: '0 0 20px rgba(100, 255, 218, 0.3)',
        }
    }}
    >
        <CardContent>
            <IconButton sx={{ 
                color: '#4ac3b6',
                transition: 'color 0.3s ease-in-out'
            }}>
                <SportsGymnasticsIcon 
                    fontSize="large"
                />
            </IconButton>
            <Typography 
                variant="h5" 
                component="p"
                sx={{
                    fontWeight: 700,
                    textTransform: 'capitalize',
                    color: '#4ac3b6',
                    transition: 'color 0.3s ease-in-out'
                }}
            >
                Currency
            </Typography>
        </CardContent>
    </Card>
</TumblingGridItem>

<TumblingGridItem item xs={12} sm={6} md={3}>
    <Card 
    square={ true }
    sx={{
        minHeight: 200,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: '#1a1a1a',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
            backgroundColor: 'rgba(100, 255, 218, 0.1)',
            boxShadow: '0 0 20px rgba(100, 255, 218, 0.3)',
        }
    }}>
        <CardContent>
            <IconButton sx={{ 
                color: '#4ac3b6',
                transition: 'color 0.3s ease-in-out'
            }}>
                <LocalParkingIcon 
                fontSize="large"
                />
            </IconButton>
            <Typography 
            variant="h5" 
            component="p"
            sx={{
                fontWeight: 700,
                textTransform: 'capitalize',
                color: '#4ac3b6',
                transition: 'color 0.3s ease-in-out'
            }}
            >
            Price Checkout
            </Typography>
        </CardContent>
    </Card>
</TumblingGridItem>

<TumblingGridItem item xs={12} sm={6} md={3}>    
    <Card 
    square={ true }
    sx={{
        minHeight: 200,
        display: 'flex',
        flexDirection:'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: '#1a1a1a',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
            backgroundColor: 'rgba(100, 255, 218, 0.1)',
            boxShadow: '0 0 20px rgba(100, 255, 218, 0.3)',
        }
    }}>
        <CardContent>
            <IconButton sx={{ 
                color: '#4ac3b6',
                transition: 'color 0.3s ease-in-out'
            }}>
                <FastfoodOutlinedIcon
                fontSize="large"
                />
            </IconButton>
            <Typography 
            variant="h5" 
            component="p"
            sx={{
                fontWeight: 700,
                textTransform: 'capitalize',
                color: '#4ac3b6',
                transition: 'color 0.3s ease-in-out'
            }}
            >
            CryptoCurrency
            </Typography>
        </CardContent>
    </Card>
</TumblingGridItem>

<TumblingGridItem item xs={12} sm={6} md={3}>
    <Card 
    square={ true }
    sx={{
        minHeight: 200,
        display: 'flex',
        flexDirection:'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: '#1a1a1a',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
            backgroundColor: 'rgba(100, 255, 218, 0.1)',
            boxShadow: '0 0 20px rgba(100, 255, 218, 0.3)',
        }
    }}>
        <CardContent>
            <IconButton sx={{ 
                color: '#4ac3b6',
                transition: 'color 0.3s ease-in-out'
            }}>
                <PoolOutlinedIcon 
                fontSize="large"
                />
            </IconButton>
            <Typography 
            variant="h5" 
            component="p"
            sx={{
                fontWeight: 700,
                textTransform: 'capitalize',
                color: '#4ac3b6',
                transition: 'color 0.3s ease-in-out'
            }}
            >
            Price Change
            </Typography>
        </CardContent>
    </Card>
</TumblingGridItem>

<TumblingGridItem item xs={12} sm={6} md={3}>
    <Card 
    square={ true }
    sx={{
        minHeight: 200,
        display: 'flex',
        flexDirection:'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: '#1a1a1a',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
            backgroundColor: 'rgba(100, 255, 218, 0.1)',
            boxShadow: '0 0 20px rgba(100, 255, 218, 0.3)',
        }
    }}>
        <CardContent>
            <IconButton sx={{ 
                color: '#4ac3b6',
                transition: 'color 0.3s ease-in-out'
            }}>
                <WifiPasswordIcon
                fontSize="large"
                />
            </IconButton>
            <Typography 
            variant="h5" 
            component="p"
            sx={{
                fontWeight: 700,
                textTransform: 'capitalize',
                color: '#4ac3b6',
                transition: 'color 0.3s ease-in-out'
            }}
            >
            Savings
            </Typography>
        </CardContent>
    </Card>
</TumblingGridItem> 
            </Grid>

            {/* Gallery section */}
            <Stack
                direction='column'
                justifyContent= 'center'
                alignItems= 'center'
                sx={{
                    py: 2,
                    px: 2,
                    display: { xs: 'flex'},
                }}
            >
                <Box
                    component='section'
                    sx={{
                        paddingBottom: 3,
                    }}
                >
                    <Title 
                        text={
                            <>
                             Future Plans and Aim
                            </>
                          }
                        textAlign={'center'}
                    />
                    <Paragraph 
                        text={
                            'Our mission is to provide affordable loans\
                            to small businesses and individuals on the Ethereum blockchain.\
                            We aim to create a fair and transparent lending platform\
                            that benefits both borrowers and lenders.'
                        } 
                        maxWidth={'sm'}
                        mx={'auto'}
                        textAlign={'center'}
                    />
                </Box>
            
            </Stack>

            <Stack
  direction='column'
  justifyContent='center'
  alignItems='center'
  sx={{
    px: 2,
    display: { xs: 'flex' },
    overflowY: 'hidden',
    scrollBehavior: 'smooth',
  }}
>
  <Box
    component='section'
    sx={{
      paddingBottom: 3,
      width: '100%',
      maxWidth: '1200px',
    }}
  >

    {[
      {
        title: "Cross-Chain Integration",
        description: "• Expand to multiple blockchain networks\n• Implement cross-chain lending capabilities\n• Reduce transaction costs through Layer 2 solutions",
        image: "https://images.pexels.com/photos/8369770/pexels-photo-8369770.jpeg"
      },
      {
        title: "Advanced Risk Assessment",
        description: "• Implement AI-powered credit scoring\n• Develop real-time risk monitoring\n• Introduce dynamic interest rates",
        image: "https://images.pexels.com/photos/7567236/pexels-photo-7567236.jpeg",
        reverse: true
      },
      {
        title: "Community Governance",
        description: "• Launch governance token\n• Enable community voting on protocol changes\n• Implement decentralized dispute resolution",
        image: "https://images.pexels.com/photos/6771607/pexels-photo-6771607.jpeg"
      }
    ].map((plan, index) => (
      <PlanContainer key={index} sx={{ flexDirection: plan.reverse ? 'row-reverse' : 'row' }}>
        <Box
          sx={{
            flex: 1,
            p: 3,
            backgroundColor: 'rgba(26, 32, 47, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(100, 255, 218, 0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 8px 32px rgba(100, 255, 218, 0.1)',
            }
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: '#00ffff',
              fontFamily: 'Yatra One',
              mb: 2,
              textAlign: { xs: 'center', md: 'left' }
            }}
          >
            {plan.title}
          </Typography>
          {plan.description.split('\n').map((bullet, i) => (
            <Typography
              key={i}
              sx={{
                color: '#91C3D0',
                mb: 1,
                fontFamily: 'Almendra',
                textAlign: { xs: 'center', md: 'left' }
              }}
            >
              {bullet}
            </Typography>
          ))}
        </Box>
        <Box
          sx={{
            flex: 1,
            height: '300px',
            overflow: 'hidden',
            borderRadius: '16px',
            border: '1px solid rgba(100, 255, 218, 0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 8px 32px rgba(100, 255, 218, 0.1)',
            }
          }}
        >
          <img
            src={plan.image}
            alt={plan.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </Box>
      </PlanContainer>
    ))}
  </Box>
</Stack>

            <Stack
  direction="column"
  justifyContent="center"
  alignItems="center"
  sx={{
    py: 8,
    px: 2,
    display: { xs: 'flex' },
  }}
>
  <Box
    component="section"
    sx={{
      paddingBottom: 3,
    }}
  >
    <Title 
      text={'Join our Community'}
      textAlign={'center'}
    />
    <Paragraph 
      text={
        'Connect with our growing community of developers and users.\
        Get support, share ideas, and stay updated with the latest developments.'
      } 
      maxWidth={'sm'}
      mx={'auto'}
      textAlign={'center'}
    />
  </Box>

  <Grid 
    container 
    spacing={3} 
    sx={{ 
      maxWidth: 1200,
      justifyContent: 'center',
      mt: 2
    }}
  >
    {[
      {
        icon: <CommunityIcon fontSize="large" />,
        title: 'Community',
        description: 'Join our Discord community with 30,000+ members',
        buttonText: 'Join Discord',
        link: 'https://discord.gg/your-invite'
      },
      {
        icon: <YouTubeIcon fontSize="large" />,
        title: 'YouTube',
        description: 'Stay updated with product releases and tutorials',
        buttonText: 'Watch Now',
        link: 'https://youtube.com/your-channel'
      },
      {
        icon: <DocsIcon fontSize="large" />,
        title: 'Documentation',
        description: 'Read our comprehensive guides and API docs',
        buttonText: 'Read Docs',
        link: '/documentation'
      },
      {
        icon: <FeedbackIcon fontSize="large" />,
        title: 'Feedback',
        description: 'Help us improve by sharing your feedback',
        buttonText: 'Give Feedback',
        link: '/feedback' // This link will work with react-router
      }
    ].map((item, index) => (
      <TumblingGridItem item xs={12} sm={6} md={3} key={index}>
        <Card
          sx={{
            minHeight: 280,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            textAlign: 'center',
            backgroundColor: '#1a1a1a',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              backgroundColor: 'rgba(100, 255, 218, 0.1)',
              boxShadow: '0 0 20px rgba(100, 255, 218, 0.3)',
              transform: 'translateY(-5px)'
            }
          }}
        >
          <CardContent>
            <IconButton
              sx={{
                color: '#4ac3b6',
                transition: 'color 0.3s ease-in-out',
                mb: 2,
                '&:hover': {
                  color: '#64ffda'
                }
              }}
            >
              {item.icon}
            </IconButton>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: '#4ac3b6',
                fontFamily: 'Yatra One',
                mb: 2
              }}
            >
              {item.title}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#91C3D0',
                fontFamily: 'Almendra',
                mb: 3
              }}
            >
              {item.description}
            </Typography>
            <IconButton
              component={Link} // Change this to Link component
              to={item.link} // Use 'to' instead of 'href'
              sx={{
                color: '#4ac3b6',
                border: '1px solid #4ac3b6',
                borderRadius: 1,
                px: 3,
                '&:hover': {
                  borderColor: '#64ffda',
                  color: '#64ffda',
                  backgroundColor: 'rgba(100, 255, 218, 0.1)'
                }
              }}
            >
              {item.buttonText}
            </IconButton>
          </CardContent>
        </Card>
      </TumblingGridItem>
    ))}
  </Grid>
</Stack>

        </Box>
    );
}

export default Content;

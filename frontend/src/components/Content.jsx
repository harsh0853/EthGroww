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
// carousel
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
// components
import Title from './Title'
import Paragraph from './Paragraph'

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

const Content = () => {
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
        <>
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
                        'What we are offering?'
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
                    py: 8,
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
                        text={'Future Plans and Aim'}
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
                
                <Box sx={{ 
                    maxWidth: 700,
                    width: '100%',
                }}>
                    <Carousel
                        centerSlidePercentage={10}
                        thumbWidth={200}
                        dynamicHeight={false}
                        centerMode={false}
                        showArrows={true}
                        autoPlay={true}
                        infiniteLoop={true}
                        selectedItem={imageData[currentIndex]}
                        onChange={handleChange}
                        className="carousel-container"
                    >
                        {renderSlides}
                    </Carousel>
                </Box>
            </Stack>
        </>
    );
}

export default Content;

import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  List,
  ListItem,
  Typography,
  styled,
  ListItemButton,
  Button,
  ListItemText,
  IconButton,
  Drawer,
} from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { keyframes } from "@mui/material/styles";
import ProfileDashBoard from "./ProfileDashBoard";
import { Menu as MenuIcon } from '@mui/icons-material';
import { useScrollTrigger } from '@mui/material';

const shake = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
`;

// Update the animations with smoother transitions
const expandCollapse = keyframes`
  0% {
    width: 100%;
    border-radius: 0;
    transform: translateX(0);
  }
  50% {
    width: 80px;
    height: 60px;
    border-radius: 30px;
    transform: translateX(20px);
  }
  100% {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    transform: translateX(20px);
  }
`;

const reverseExpandCollapse = keyframes`
  0% {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    transform: translateX(20px);
  }
  50% {
    width: 120px;
    height: 60px;
    border-radius: 30px;
    transform: translateX(20px);
  }
  100% {
    width: 100%;
    border-radius: 0;
    transform: translateX(0);
  }
`;

const NavbarContainer = styled(AppBar)(({ theme, collapsed }) => ({
  background: 'rgba(10, 25, 47, 0.25)',
  backdropFilter: 'blur(10px)',
  position: 'fixed',
  top: collapsed ? '20px' : 0,
  left: 0,
  right: 0,
  overflow: 'hidden',
  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  animation: collapsed 
    ? `${expandCollapse} 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards`
    : `${reverseExpandCollapse} 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
  border: '1px solid rgba(100, 255, 218, 0.1)',
  ...(collapsed && {
    right: 'auto',
    width: '60px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  }),
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '150px',
    height: '150px',
    background: 'linear-gradient(45deg, #64ffda, #5ccfff)',
    borderRadius: '50%',
    filter: 'blur(50px)',
    opacity: 0.2,
    animation: `${moveGlow} 15s infinite`,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'rgba(10, 25, 47, 0.15)',
    backdropFilter: 'blur(10px)',
    zIndex: 0,
  },
}));

const moveGlow = keyframes`
  0% {
    transform: translateX(100%) translateY(0%);
  }
  50% {
    transform: translateX(300%) translateY(-50%);
  }
  100% {
    transform: translateX(100%) translateY(0%);
  }
`;

const StyledLoginButton = styled(Button)(({ theme, isloggedin }) => ({
  marginLeft: theme.spacing(3),
  borderRadius: "15px",
  padding: "10px 24px",
  transition: "all 0.3s ease-in-out",
  color: isloggedin === "true" ? "#dc3545" : "#64ffda",
  border: `1px solid ${isloggedin === "true" ? "#dc3545" : "#64ffda"}`,
  backgroundColor: 'rgba(10, 25, 47, 0.5)',
  backdropFilter: 'blur(5px)',
  "&:hover": {
    animation: `${shake} 0.5s ease-in-out`,
    backgroundColor: isloggedin === "true" ? "rgba(220, 53, 69, 0.1)" : "rgba(100, 255, 218, 0.1)",
    transform: "translateY(-2px)",
    boxShadow: '0 4px 12px rgba(100, 255, 218, 0.2)',
  },
}));

// Update StyledToolbar for smoother content transitions
const StyledToolbar = styled(Toolbar)(({ theme, collapsed }) => ({
  display: "flex",
  justifyContent: collapsed ? 'center' : 'space-between',
  position: 'relative',
  zIndex: 1,
  backgroundColor: 'transparent',
  padding: collapsed ? 0 : '0.5rem 1rem',
  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  opacity: 1,
  transform: 'translateY(0)',
  '& .MuiTypography-root': {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: collapsed ? 0 : 1,
    transform: collapsed ? 'translateY(10px)' : 'translateY(0)',
  },
  '& .MuiList-root': {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: collapsed ? 0 : 1,
    transform: collapsed ? 'translateY(10px)' : 'translateY(0)',
  },
}));

const ListMenu = styled(List)(({ theme }) => ({
  display: "none",
  [theme.breakpoints.up("md")]: {
    display: "flex",
    width: "",
  },
}));

// Update MenuButton with fade-in effect
const MenuButton = styled(IconButton)(({ theme }) => ({
  color: '#64ffda',
  padding: '12px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  opacity: 0,
  animation: 'fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
      transform: 'translate(-50%, -50%) scale(0.8)',
    },
    '100%': {
      opacity: 1,
      transform: 'translate(-50%, -50%) scale(1)',
    },
  },
  '&:hover': {
    transform: 'translate(-50%, -50%) rotate(180deg)',
    color: '#5ccfff',
  },
}));

const itemList = [
  { text: "Home", to: "/" },
  { text: "About", to: "/about" },
];

const commonListItemButtonStyle = {
  color: "#ccd6f6",
  width: "auto",
  padding: "8px 16px",
  borderRadius: "8px",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    backgroundColor: "rgba(100, 255, 218, 0.1)",
    color: "#64ffda",
    transform: "translateY(-2px)",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: "50%",
    width: 0,
    height: "2px",
    backgroundColor: "#64ffda",
    transition: "all 0.3s ease-in-out",
    transform: "translateX(-50%)",
  },
  "&:hover::after": {
    width: "80%",
  },
};

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleProfileClick = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsProfileOpen(true);
  };
  const handleCloseProfile = () => {
    setIsProfileOpen(false);
  };

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("accessToken");
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();

    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("walletAddress");
    localStorage.removeItem("userData");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
    navigate("/");
  };

  // const customEvent = new Event("loginStateChanged");

  const handleLoginStateChange = () => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    window.addEventListener("loginStateChanged", handleLoginStateChange);
    return () => {
      window.removeEventListener("loginStateChanged", handleLoginStateChange);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <NavbarContainer 
        component="nav"
        elevation={0}
        collapsed={trigger}
      >
        <StyledToolbar sx={{ 
          justifyContent: trigger ? 'center' : 'space-between',
          minHeight: trigger ? '60px' : '64px',
          padding: trigger ? 0 : '0.5rem 1rem',
          transition: 'all 0.3s ease',
          position: 'relative',
        }}>
          {!trigger && (
            <>
              <Typography
                variant="h4"
                component={Link}
                to="/"
                sx={{
                  fontFamily: "Yatra One",
                  fontWeight: 400,
                  fontStyle: "normal",
                  cursor: "pointer",
                  textDecoration: "none",
                  color: "white",
                }}
              >
                EthGroww
              </Typography>

              <ListMenu>
                {itemList.map((item) => (
                  <ListItem key={item.text}>
                    <ListItemButton
                      component={Link}
                      to={item.to}
                      sx={commonListItemButtonStyle}
                    >
                      <ListItemText primary={item.text} />
                    </ListItemButton>
                  </ListItem>
                ))}

                {isLoggedIn && (
                  <>
                    <ListItem>
                      <ListItemButton
                        component={Link}
                        to="/active-loans"
                        sx={{
                          ...commonListItemButtonStyle,
                          width: "auto",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <ListItemText primary="Active Loans" />
                      </ListItemButton>
                    </ListItem>
                    <ListItem>
                      <ListItemButton
                        component={Link}
                        to="/feed"
                        sx={commonListItemButtonStyle}
                      >
                        <ListItemText primary="Feed" />
                      </ListItemButton>
                    </ListItem>
                    <ListItem>
                      <ListItemButton
                        onClick={handleProfileClick}
                        sx={commonListItemButtonStyle}
                      >
                        <ListItemText primary="Profile" />
                      </ListItemButton>
                    </ListItem>
                  </>
                )}
                
                {/* Login/Logout button as the last item */}
                {isLoggedIn ? (
                  <StyledLoginButton onClick={handleLogout} isloggedin="true">
                    Logout
                  </StyledLoginButton>
                ) : (
                  <StyledLoginButton
                    component={Link}
                    to="/login"
                    isloggedin="false"
                  >
                    Login
                  </StyledLoginButton>
                )}
              </ListMenu>
            </>
          )}
          
          {trigger && (
            <MenuButton
              onClick={toggleMenu}
              size="large"
              edge="end"
            >
              <MenuIcon />
            </MenuButton>
          )}
        </StyledToolbar>
      </NavbarContainer>

      <Drawer
        anchor="left"
        open={isMenuOpen && trigger}
        onClose={() => setIsMenuOpen(false)}
        PaperProps={{
          sx: {
            background: 'rgba(10, 25, 47, 0.95)',
            backdropFilter: 'blur(10px)',
            width: 250,
            padding: '20px',
            borderRight: '1px solid rgba(100, 255, 218, 0.1)',
            '& .MuiListItemButton-root': {
              marginBottom: '8px',
            },
            // Add these styles to remove scrollbar
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            scrollbarWidth: 'none',  // Firefox
            msOverflowStyle: 'none',  // IE and Edge
            overflow: 'hidden',
          }
        }}
        SlideProps={{
          timeout: {
            enter: 400,
            exit: 300,
          }
        }}
      >
        <List>
          {itemList.map((item) => (
            <ListItem key={item.text}>
              <ListItemButton
                component={Link}
                to={item.to}
                onClick={() => setIsMenuOpen(false)}
                sx={commonListItemButtonStyle}
              >
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
          {isLoggedIn && (
            <>
              <ListItem>
                <ListItemButton
                  component={Link}
                  to="/active-loans"
                  sx={{
                    ...commonListItemButtonStyle,
                    width: "auto",
                    whiteSpace: "nowrap",
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ListItemText primary="Active Loans" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton
                  component={Link}
                  to="/feed"
                  sx={commonListItemButtonStyle}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ListItemText primary="Feed" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton
                  onClick={() => {
                    handleProfileClick();
                    setIsMenuOpen(false);
                  }}
                  sx={commonListItemButtonStyle}
                >
                  <ListItemText primary="Profile" />
                </ListItemButton>
              </ListItem>
              <ProfileDashBoard
                isOpen={isProfileOpen}
                onClose={handleCloseProfile}
              />
            </>
          )}
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;

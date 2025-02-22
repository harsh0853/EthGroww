import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  List,
  ListItem,
  Typography,
  styled,
  ListItemButton,
  Button,
  ListItemText,
} from "@mui/material";
import DrawerItem from "./DrawerItem";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { keyframes } from "@mui/material/styles";
import ProfileDashBoard from "./ProfileDashBoard";

const shake = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
`;

const StyledLoginButton = styled(Button)(({ theme, isloggedin }) => ({
  marginLeft: theme.spacing(3),
  borderRadius: "15px",
  padding: "12px 0",
  transition: "all 0.3s ease-in-out",
  color: isloggedin === "true" ? "#dc3545" : "#28a745",
  "&:hover": {
    animation: `${shake} 0.5s ease-in-out`,
    color: isloggedin === "true" ? "#c82333" : "#218838",
  },
}));

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
  borderBottom: "1px solid transparent",
  boxShadow: "0 0 15px #333",
});

const ListMenu = styled(List)(({ theme }) => ({
  display: "none",
  [theme.breakpoints.up("md")]: {
    display: "flex",
    width: "",
  },
}));

const itemList = [
  { text: "Home", to: "/" },
  { text: "About", to: "/about" },
];

const commonListItemButtonStyle = {
  color: "#fff",
  width: "auto",
  "&:hover": {
    backgroundColor: "transparent",
    color: "#343a55",
    position: "relative",
  },
  "&:hover::after": {
    content: '""',
    position: "absolute",
    bottom: 5,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#343a55",
  },
};

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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

  return (
    <>
      <AppBar
        component="nav"
        position="sticky"
        sx={{ backgroundColor: "orange" }}
        elevation={0}
      >
        <StyledToolbar>
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

          <Box sx={{ display: { xs: "block", sm: "none" } }}>
            <DrawerItem />
          </Box>

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
                <ProfileDashBoard
                  isOpen={isProfileOpen}
                  onClose={handleCloseProfile}
                />
              </>
            )}
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
        </StyledToolbar>
      </AppBar>
    </>
  );
};

export default Navbar;

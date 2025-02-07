import React, { useState } from "react";
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
import { Link } from "react-router-dom";
import { keyframes } from "@mui/material/styles";

const shake = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
`;

const StyledLoginButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(3),
  color: "#fff",
  border: "1px solid #fff",
  borderRadius: "15px",
  padding: "12px",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    animation: `${shake} 0.3s ease-in-out`,
    boxShadow: "0 0 15px rgba(255, 255, 255, 0.5)",
    backgroundColor: "transparent",
    border: "2px solid #fff",
  },
}));

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
});

const ListMenu = styled(List)(({ theme }) => ({
  display: "none",
  [theme.breakpoints.up("sm")]: {
    display: "flex",
  },
}));

//rotas
const itemList = [
  {
    text: "Home",
    to: "/",
  },
  {
    text: "About",
    to: "/about",
  },
  {
    text: "Feed",
    to: "/feed",
  },
  {
    text: "Contact",
    to: "/contact",
  },
];

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleProfileClick = (e) => {
    e.preventDefault();
    setIsProfileOpen(!isProfileOpen);
  };
  return (
    <AppBar
      component="nav"
      position="sticky"
      sx={{
        backgroundColor: "orange",
      }}
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
          {itemList.map((item) => {
            const { text } = item;
            return (
              <ListItem key={text}>
                <ListItemButton
                  component={Link}
                  to={item.to}
                  sx={{
                    color: "#fff",
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
                  }}
                >
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            );
          })}
          <StyledLoginButton component={Link} to="/Login" variant="outlined">
            Login
          </StyledLoginButton>{" "}
          <StyledLoginButton
            component={Link}
            to="/profile"
            variant="outlined"
          >
            Profile
          </StyledLoginButton>
        </ListMenu>
      </StyledToolbar>
    </AppBar>
  );
};

export default Navbar;

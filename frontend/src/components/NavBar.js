import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CreateIcon from "@mui/icons-material/Create";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import StoreIcon from "@mui/icons-material/Store";
import AssessmentIcon from "@mui/icons-material/Assessment";

import {
  AppBar,
  Badge,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link, useHistory } from "react-router-dom";
import { ReactComponent as Logo } from "../img/logo.svg";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { useStateValue } from "../StateProvider";
import { initialState } from "../reducer";
import { LibraryBooks as OrdersIcon } from "@mui/icons-material";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

const NavBar = () => {
  const [
    {
      token,
      user: { role },
      cart,
    },
    dispatch,
  ] = useStateValue();
  const history = useHistory();
  const [open, setOpen] = useState(false);

  const menuItems = [
    { listIcon: <HomeIcon />, listText: "Home", to: "/", display: true },
    {
      listIcon: <AccountCircleIcon />,
      listText: "Account",
      to: "/account",
      display: token,
    },
    {
      listIcon: <CollectionsBookmarkIcon />,
      listText: "Catalog",
      to: "/catalog",
      display: token && role !== "user",
    },
    {
      listIcon: <OrdersIcon />,
      listText: "Manage Orders",
      to: "/manage/orders",
      display: token && role !== "user" && role !== "admin",
    },
    {
      listIcon: <CreateIcon />,
      listText: "Register",
      to: "/signup",
      display: !token,
    },
    {
      listIcon: <VpnKeyIcon />,
      listText: "Log In",
      to: "/login",
      display: !token,
    },
    {
      listIcon: <ManageAccountsIcon />,
      listText: "Manage Users",
      to: "/manage/users",
      display: token && role !== "user",
    },
    {
      listIcon: <StoreIcon />,
      listText: "Manage Medicines",
      to: "/manage/medicines",
      display: token && role !== "user" && role !== "admin",
    },
    {
      listIcon: <AssessmentIcon />,
      listText: "Reports",
      to: "/reports",
      display: token && role !== "user" && role !== "staff",
    },
  ];

  return (
    <AppBar position="sticky">
      <Toolbar>
        <IconButton
          style={{ marginRight: 2 }}
          onClick={() => {
            history.push("/");
          }}
        >
          <Logo style={{ width: 50 }} />
        </IconButton>
        <Typography style={{ flexGrow: 1 }} variant="h5">
          <Link
            to="/"
            onClick={() => window.scrollTo(0, 0)}
            style={{ textDecoration: "none", color: "white" }}
          >
            E-Med Stores
          </Link>
        </Typography>
        <IconButton
          onClick={() => {
            window.scrollTo(0, 0);
            history.push("/cart");
          }}
        >
          {/* <Badge badgeContent={cart ? Object.keys(cart).length : 0}> */}
          <StyledBadge
            color="error"
            badgeContent={cart ? Object.keys(cart).length : 0}
          >
            <ShoppingCartIcon style={{ color: "white " }} />
          </StyledBadge>
        </IconButton>
        <IconButton onClick={() => setOpen(true)}>
          <MenuIcon fontSize="large" style={{ color: "white" }} />
        </IconButton>
        <SwipeableDrawer
          anchor="right"
          open={open}
          onOpen={() => setOpen(true)}
          disableBackdropTransition
          onClose={() => setOpen(false)}
        >
          <div
            style={{ width: 250, backgroundColor: "#ddeeff", height: "100vh" }}
          >
            {menuItems.map(
              (listItem, key) =>
                listItem.display && (
                  <ListItem
                    button
                    key={key}
                    onClick={() => {
                      setOpen(false);
                      history.push(listItem.to);
                      window.scrollTo(0, 0);
                    }}
                  >
                    <ListItemIcon>{listItem.listIcon}</ListItemIcon>
                    <ListItemText>
                      <b>{listItem.listText}</b>
                    </ListItemText>
                  </ListItem>
                )
            )}
            {token && (
              <ListItem
                button
                onClick={() => {
                  setOpen(false);
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  dispatch({ type: "SET_TOKEN", token: null });
                  dispatch({ type: "SET_CART", cart: {} });
                  dispatch({ type: "SET_USER", user: initialState.user });
                  history.push("/");
                }}
              >
                <ListItemIcon>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText>
                  <b>Log out</b>
                </ListItemText>
              </ListItem>
            )}
          </div>
        </SwipeableDrawer>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;

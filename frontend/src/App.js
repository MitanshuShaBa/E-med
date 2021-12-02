import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Login, SignUp } from "./components/auth";
import NavBar from "./components/NavBar";
import { useEffect } from "react";
import { useStateValue } from "./StateProvider";
import ManageUsers from "./components/manage/ManageUsers";
import NotFound from "./components/NotFound";
import { initialState } from "./reducer";
import Home from "./components/Home";
import Product from "./components/Product";
import Cart from "./components/cart/Cart";
import ManageMedicines from "./components/manage/ManageMedicines";
import AddMedicine from "./components/manage/AddMedicine";
import Account from "./components/account/Account";
import ManageOrders from "./components/manage/ManageOrders";
import ForgotPassword from "./components/auth/ForgotPassword";
import ChangePassword from "./components/auth/ChangePassword";
import ManageOrder from "./components/manage/ManageOrder";
import Reports from "./components/Reports";

function App() {
  const [
    {
      token,
      user: { role },
    },
    dispatch,
  ] = useStateValue();

  useEffect(() => {
    const authStateChange = setInterval(() => {
      const sessionToken = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      if (sessionToken !== null) {
        dispatch({ type: "SET_TOKEN", token: sessionToken });
        dispatch({ type: "SET_USER", user });
      } else {
        dispatch({ type: "SET_TOKEN", token: null });
        dispatch({ type: "SET_USER", user: initialState.user });
      }
    }, 5000);
    return () => {
      clearInterval(authStateChange);
      dispatch({ type: "SET_TOKEN", token: null });
      dispatch({ type: "SET_USER", user: initialState.user });
    };
    // eslint-disable-next-line
  }, []);
  return (
    <Router>
      <NavBar />
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/product/:id">
          <Product />
        </Route>
        <Route path="/cart">
          <Cart />
        </Route>
        {role !== null && (
          <Route path="/account">
            <Account />
          </Route>
        )}
        {role !== "user" && role !== "admin" && role !== null && (
          <Route path="/manage/orders" exact>
            <ManageOrders />
          </Route>
        )}
        {role !== "user" && role !== "admin" && role !== null && (
          <Route path="/manage/order/:orderID" exact>
            <ManageOrder />
          </Route>
        )}
        {role !== "user" && role !== "staff" && role !== null && (
          <Route path="/reports" exact>
            <Reports />
          </Route>
        )}
        {role !== "user" && role !== null && (
          <Route path="/manage/users" exact>
            <ManageUsers />
          </Route>
        )}
        {role !== "user" && role !== "admin" && role !== null && (
          <Route path="/manage/medicines" exact>
            <ManageMedicines />
          </Route>
        )}
        {role !== "user" && role !== null && (
          <Route path="/catalog" exact>
            <Home isMR />
          </Route>
        )}
        {role !== "user" && role !== null && (
          <Route path="/stock/:id">
            <Product isMR />
          </Route>
        )}
        {role !== "user" && role !== null && (
          <Route path="/medicine/add">
            <AddMedicine />
          </Route>
        )}
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/signup">
          <SignUp />
        </Route>
        <Route path="/forgot-password">
          <ForgotPassword />
        </Route>
        <Route path="/reset-password/:token">
          <ChangePassword />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;

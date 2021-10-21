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
      const token = sessionStorage.getItem("token");
      const user = JSON.parse(sessionStorage.getItem("user"));
      if (token !== null) {
        dispatch({ type: "SET_TOKEN", token });
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
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/signup">
          <SignUp />
        </Route>
        {role !== "user" && role !== null && (
          <Route path="/manage/users" exact>
            <ManageUsers />
          </Route>
        )}
        {role !== "user" && role !== null && (
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
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;

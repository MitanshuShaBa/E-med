import {
  Backdrop,
  Button,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useStateValue } from "../../StateProvider";
import { server } from "../../utils";
import CartItem from "./CartItem";

const Cart = () => {
  const [medicines, setMedicines] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [reRender, setReRender] = useState(0);
  const [loading, setLoading] = useState(false);
  const [{ cart, user }, dispatch] = useStateValue();

  useEffect(() => {
    Promise.all(
      Object.keys(cart).map((stockID) => {
        return server.get(
          `/stock/${
            user.role === "pharmacist" ? "mr" : "pharmacy"
          }/item/${stockID}`
        );
      })
    )
      .then((cartData) => {
        const tmpMedicines = cartData.map(({ data }) => {
          return { ...data, cartQuantity: cart[data._id] };
        });
        setMedicines(tmpMedicines);

        const tmpTotal = tmpMedicines.reduce(
          (totalPrice, { cartQuantity, price }) => {
            return totalPrice + cartQuantity * price;
          },
          0
        );
        setTotalPrice(tmpTotal);
      })
      .catch((err) => console.log(err));
  }, [reRender]);

  useEffect(() => {
    const tmpTotal = medicines.reduce((totalPrice, { _id, price }) => {
      return totalPrice + cart[_id] * price;
    }, 0);
    setTotalPrice(tmpTotal);
  }, [cart]);

  const handleBuyCart = () => {
    setLoading(true);
    let sellers = [];
    const tmpItems = medicines.map(
      ({ _id, name, price, cost, cartQuantity, managedBy }) => {
        sellers.push(managedBy._id);
        return {
          name,
          price,
          cost,
          quantity: cartQuantity,
          productID: _id,
        };
      }
    );
    const order = {
      items: tmpItems,
      address: user.address,
      patient: user.role === "user" && user.name,
      phoneNum: user.phoneNum,
      buyer: user._id,
      seller: sellers,
      total: totalPrice,
    };
    console.log(order);

    server
      .post(
        `/order/${user.role === "pharmacist" ? "mr" : "pharmacy"}/create`,
        order
      )
      .then(() => {
        dispatch({ type: "SET_CART", cart: {} });
        setReRender(reRender + 1);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <Container style={{ marginTop: "2vh" }}>
      {medicines.map((medicine, index) => (
        <CartItem {...medicine} causeReRender={setReRender} key={index} />
      ))}
      {medicines.length > 0 ? (
        <>
          <br />
          <Typography variant="h5">
            Total: ₹{Math.round((totalPrice + Number.EPSILON) * 100) / 100}
          </Typography>
          <br />
          <Button onClick={handleBuyCart} size="large" variant="contained">
            Buy
          </Button>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </>
      ) : (
        <Typography variant="h5">Cart is Empty</Typography>
      )}
    </Container>
  );
};

export default Cart;

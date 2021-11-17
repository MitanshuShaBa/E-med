import { Card, CardContent, IconButton, Typography } from "@mui/material";
import { useStateValue } from "../../StateProvider";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Link, Redirect } from "react-router-dom";

const CartItem = ({
  medicine: { name, imgCaption },
  price,
  _id,
  quantity,
  causeReRender,
}) => {
  const [{ cart, user }, dispatch] = useStateValue();
  const handleChangeCart = (change) => {
    let tmpCart = { ...cart };
    tmpCart[_id] = cart[_id] + change;
    if (tmpCart[_id] <= 0) {
      delete tmpCart[_id];
      causeReRender((prev) => prev + 1);
    }
    dispatch({ type: "SET_CART", cart: tmpCart });
  };
  return (
    <Card style={{ marginBottom: "2vh" }}>
      {(user.role === "mr" || user.role === "admin") && <Redirect to="/" />}
      <div style={{ display: "flex" }}>
        <div
          style={{
            display: "flex",
            flex: "0.3",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            style={{
              maxHeight: "90%",
              maxWidth: "90%",
              paddingLeft: "2vw",
              width: "90%",
            }}
            src={imgCaption}
            alt={name}
          />
        </div>
        <div style={{ flex: "0.7" }}>
          <CardContent>
            <Typography>{name}</Typography>
            <Typography>₹{price}</Typography>
            <div style={{ display: "flex", alignItems: "center" }}>
              <IconButton
                onClick={() => handleChangeCart(1)}
                disabled={cart[_id] >= quantity}
              >
                <AddIcon />
              </IconButton>
              <Typography style={{ margin: "0 2vw" }}>{cart[_id]}</Typography>
              <IconButton onClick={() => handleChangeCart(-1)}>
                <RemoveIcon />
              </IconButton>
            </div>
            <Typography>
              Total: ₹
              {Math.round((price * cart[_id] + Number.EPSILON) * 100) / 100}
            </Typography>
            <Typography
              component={Link}
              to={
                user.role === "pharmacist" ? "/stock/" + _id : "/product/" + _id
              }
            >
              Product Link
            </Typography>
          </CardContent>
        </div>
      </div>
    </Card>
  );
};

export default CartItem;

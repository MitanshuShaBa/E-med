import { Button, Container, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useStateValue } from "../StateProvider";
import { server } from "../utils";
// import ImageGallery from "react-image-gallery";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const Product = ({ isMR }) => {
  const { id } = useParams();
  const [{ cart, user }, dispatch] = useStateValue();
  const [
    { name, description, type, company, price, quantity = 0 },
    setProduct,
  ] = useState({
    name: null,
    description: null,
    type: null,
    company: null,
    price: null,
  });
  useEffect(() => {
    server
      .get(isMR ? `/stock/mr/item/${id}` : `/stock/pharmacy/item/${id}`)
      .then(({ data }) => {
        setProduct(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const addToCart = () => {
    let tmpCart = { ...cart };
    tmpCart[id] = 1;
    dispatch({ type: "SET_CART", cart: tmpCart });
  };

  const handleChangeCart = (change) => {
    let tmpCart = { ...cart };
    tmpCart[id] = cart[id] + change;
    if (tmpCart[id] <= 0) {
      delete tmpCart[id];
    }
    dispatch({ type: "SET_CART", cart: tmpCart });
  };
  return (
    <Container style={{ marginTop: "2vh" }}>
      <Typography variant="h4">{name}</Typography>
      {/* <ImageGallery
        autoPlay
        showPlayButton={false}
        className="image"
        items={images}
      /> */}
      <br />
      <Typography variant="h5">Price: ₹{price} </Typography>
      {isMR && (
        <Typography variant="h5">Quantity Available: {quantity} </Typography>
      )}
      {cart[id] === undefined ? (
        <Button
          variant="contained"
          style={{ marginBottom: "2vh", marginTop: "2vh" }}
          onClick={addToCart}
          disabled={isMR ? user.role !== "pharmacist" : user.role !== "user"}
        >
          Add to cart
        </Button>
      ) : (
        <div style={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={() => handleChangeCart(1)}>
            <AddIcon />
          </IconButton>
          <Typography style={{ margin: "0 2vw" }}>{cart[id]}</Typography>
          <IconButton onClick={() => handleChangeCart(-1)}>
            <RemoveIcon />
          </IconButton>
          {/* TODO add remove from cart dustbin icon */}
        </div>
      )}
      <Typography variant="h5">Property Desciption</Typography>
      <Typography>{description}</Typography>
      <br />
      <Typography variant="h5">Type: {type} </Typography>
      <br />
      <Typography variant="h5">Company: {company}</Typography>
    </Container>
  );
};

export default Product;

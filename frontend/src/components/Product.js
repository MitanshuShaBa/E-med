import { Button, Container, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useStateValue } from "../StateProvider";
import { server } from "../utils";
import ImageGallery from "react-image-gallery";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const Product = ({ isMR }) => {
  const { id } = useParams();
  const [{ cart, user }, dispatch] = useStateValue();
  const [
    {
      medicine: {
        name = null,
        description = null,
        type = null,
        company = null,
      } = {},
      price = 0,
      quantity = 0,
    },
    setProduct,
  ] = useState({});
  const [images, setImages] = useState(null);
  useEffect(() => {
    server
      .get(isMR ? `/stock/mr/item/${id}` : `/stock/pharmacy/item/${id}`)
      .then(({ data }) => {
        setProduct(data);
        const tmpImages = data.medicine.imgURLs.map((imgURL) => {
          return {
            original: imgURL,
            thumbnail: imgURL,
            originalHeight: "400rem",
          };
        });
        setImages(tmpImages);
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
      {images && (
        <ImageGallery
          // originalHeight={"40vh"}
          // thumbnailHeight={10}
          style={{ height: "10vh" }}
          autoPlay
          showPlayButton={false}
          items={images}
        />
      )}
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
          <IconButton
            disabled={cart[id] >= quantity}
            onClick={() => handleChangeCart(1)}
          >
            <AddIcon />
          </IconButton>
          <Typography style={{ margin: "0 2vw" }}>{cart[id]}</Typography>
          <IconButton onClick={() => handleChangeCart(-1)}>
            <RemoveIcon />
          </IconButton>
        </div>
      )}
      <Typography variant="h5">Property Description</Typography>
      <Typography>{description}</Typography>
      <br />
      <Typography variant="h5">Type: {type} </Typography>
      <br />
      <Typography variant="h5">Company: {company}</Typography>
    </Container>
  );
};

export default Product;

import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import {
  Backdrop,
  Button,
  Chip,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import { useRef } from "react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { storage } from "../../firebase";
import { useStateValue } from "../../StateProvider";
import { server } from "../../utils";
import CartItem from "./CartItem";

const Cart = () => {
  const [medicines, setMedicines] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [reRender, setReRender] = useState(0);
  const [loading, setLoading] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [{ cart, user }, dispatch] = useStateValue();
  const [orderDetail, setOrderDetail] = useState({});
  const inputRef = useRef(null);
  const history = useHistory();

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

  useEffect(() => {
    if (Object.keys(orderDetail).length > 0) {
      const options = {
        key: "rzp_test_XKfrkpagvMEnZc",
        name: "E-Med Stores",
        order_id: orderDetail.id,
        prefill: {
          email: user.email,
          // contact: user.phoneNumber ? user.phoneNumber : "9999999999",
        },
        handler: ({
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
        }) => {
          server
            .post("/payment/validate", {
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature,
            })
            .then((data) => {
              if (data) {
                server.patch(`/order/${orderDetail.receipt}`, {
                  paid: true,
                  status: "verifying",
                  razorpay_payment_id,
                  _id: orderDetail.receipt,
                });
                server
                  .post("/notification/message", {
                    phoneNumber: "+919920892410", // Change to user number
                    message: `Order #${orderDetail.receipt} Paid and is now verifying`,
                  })
                  .catch((err) => console.log(err));
                server
                  .post("/notification/email", {
                    email: user.email,
                    message: `Order #${orderDetail.receipt} Paid and is now verifying`,
                  })
                  .catch((err) => console.log(err));
                history.push("/account");
              }
            })
            .catch((err) => console.log(err));
        },
        theme: {
          color: "#686CFD",
        },
      };
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    }
    // eslint-disable-next-line
  }, [orderDetail]);

  const handleBuyCart = (imgURLs) => {
    let sellers = [];
    // console.log(medicines);
    const tmpItems = medicines.map((item) => {
      const {
        medicine: { _id: medID, name },
        price,
        cost,
        cartQuantity,
        managedBy,
        expiry,
        _id,
      } = item;
      sellers.push(managedBy._id);
      return {
        name,
        price,
        cost,
        expiry,
        duration: item.duration,
        quantity: cartQuantity,
        medicineID: medID,
        productID: _id,
      };
    });
    const order = {
      items: tmpItems,
      prescriptions: imgURLs,
      address: user.address,
      patient: user.role === "user" && user.name,
      phoneNum: user.phoneNum,
      buyer: user._id,
      seller: sellers,
      total: totalPrice,
      paid: false,
      status: "paymentPending",
    };

    server
      .post(
        `/order/${user.role === "pharmacist" ? "mr" : "pharmacy"}/create`,
        order
      )
      .then(({ data: order }) => {
        handlePaymentGateway(order.total, order._id);
        server
          .post("/notification/message", {
            phoneNumber: "+919920892410", // Change to user number
            message: `Order #${order._id} Created`,
          })
          .catch((err) => console.log(err));
        server
          .post("/notification/email", {
            email: user.email,
            message: `Order #${order._id} Created`,
          })
          .catch((err) => console.log(err));
        dispatch({ type: "SET_CART", cart: {} });
        setReRender(reRender + 1);
      })
      .catch((err) => {
        console.log(err);
        alert("Could not process order");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePaymentGateway = (amount, orderID) => {
    server
      .post("/payment/order", { amount, orderID })
      .then(({ data }) => {
        server
          .patch(`/order/${orderID}`, {
            razorpay_order_id: data.id,
            _id: orderID,
          })
          .catch((err) => console.log(err));
        setOrderDetail(data);
      })
      .catch((err) => console.log(err.response.data.error));
  };

  const startBuy = () => {
    setLoading(true);
    Promise.all(
      [...prescriptions].map((prescription) =>
        uploadBytes(
          ref(storage, `${user.email}/${Date.now()}-${prescription.name}`),
          prescription
        )
      )
    )
      .then((snapshots) => {
        Promise.all(
          snapshots.map((snapshot) => getDownloadURL(snapshot.ref))
        ).then((imgURLs) => {
          handleBuyCart(imgURLs);
        });
      })
      .catch((err) => {
        console.log(err);
        alert("Could not process order");
        setLoading(false);
      });
  };

  const appendFiles = (e) => {
    setPrescriptions((prev) => [...prev, ...e.target.files]);
  };

  function removeItem(arr, index) {
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

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
          <Typography variant="body1">
            *Upload Prescription for necessary medicines
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => inputRef.current.click()}
          >
            Upload Prescriptions
          </Button>
          <div style={{ margin: "1vh 0" }}>
            <input
              type="file"
              ref={inputRef}
              onChange={appendFiles}
              multiple
              accept="image/png,image/jpeg"
              style={{ display: "none" }}
            />
            {prescriptions.map((prescription, key) => (
              <Chip
                key={key}
                label={prescription.name}
                onDelete={() => {
                  setPrescriptions((prev) => {
                    return removeItem(prev, key);
                  });
                }}
              />
            ))}
          </div>
          <br />
          <Button onClick={startBuy} size="large" variant="contained">
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

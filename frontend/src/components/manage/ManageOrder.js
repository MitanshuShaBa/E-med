import {
  Breadcrumbs,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { useStateValue } from "../../StateProvider";
import { server } from "../../utils";
import ImageGallery from "react-image-gallery";

const ManageOrder = ({ isBuyer }) => {
  const { orderID } = useParams();
  const history = useHistory();
  const [order, setOrder] = useState(undefined);
  const [prescriptions, setPrescriptions] = useState([]);
  const [{ user }] = useStateValue();
  const stages = {
    prescriptionRequired: { next: "verifying" },
    paymentPending: { next: "verifying" },
    verifying: { next: "processing" },
    processing: { next: "delivering" },
    delivering: { next: "completed" },
  };

  useEffect(() => {
    const role = user.role === "mr" ? "mr" : "pharmacy";
    server
      .get(`/order/${role}/order/${orderID}`)
      .then(({ data }) => {
        setOrder(data);
        console.log(data);
        const tmpImages = data?.prescriptions?.map((imgURL) => {
          return {
            original: imgURL,
            thumbnail: imgURL,
            originalHeight: "400rem",
          };
        });
        setPrescriptions(tmpImages);
      })
      .catch((e) => console.log(e));
  }, []);

  const goToOrders = () => {
    history.push("/manage/orders");
  };

  const handleStatus = (status) => {
    const role = user.role === "mr" ? "mr" : "pharmacy";

    if (status === "cancelled") {
      server
        .patch(`/order/${role}`, { _id: orderID, status })
        .then(() => {
          goToOrders();
        })
        .catch((e) => console.log(e));
      server
        .post("/notification/message", {
          phoneNumber: "+919920892410", // Change to user number
          message: `Order #${orderID} Cancelled`,
        })
        .catch((err) => console.log(err));
      server
        .post("/notification/email", {
          email: order.buyer.email,
          message: `Order #${orderID} Cancelled`,
        })
        .catch((err) => console.log(err));
    } else if (status === "prescriptionReUpload") {
      server
        .patch(`/order/${role}`, {
          _id: orderID,
          status: "prescriptionRequired",
        })
        .then(() => {
          goToOrders();
        })
        .catch((e) => console.log(e));
      server
        .post("/notification/message", {
          phoneNumber: "+919920892410", // Change to user number
          message: `Order #${orderID} requires prescription`,
        })
        .catch((err) => console.log(err));
      server
        .post("/notification/email", {
          email: order.buyer.email,
          message: `Order #${orderID} requires prescription`,
        })
        .catch((err) => console.log(err));
    } else {
      server
        .patch(`/order/${role}`, {
          _id: orderID,
          status: stages[status].next,
        })
        .then(() => {
          goToOrders();
        })
        .catch((e) => console.log(e));
      server
        .post("/notification/message", {
          phoneNumber: "+919920892410", // Change to user number
          message: `Order #${orderID} is now ${stages[status].next}`,
        })
        .catch((err) => console.log(err));
      server
        .post("/notification/email", {
          email: order.buyer.email,
          message: `Order #${orderID} is now ${stages[status].next}`,
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <Container style={{ marginTop: "2vh" }}>
      {!isBuyer && (
        <div>
          <Breadcrumbs>
            <Link underline="hover" to="/manage/orders">
              All Orders
            </Link>
            <Typography color="text.primary">{orderID}</Typography>
          </Breadcrumbs>
          <br />
          <div>
            {order?.status !== "cancelled" &&
              order?.status !== "completed" &&
              order?.status !== "returned" && (
                <>
                  <Button
                    variant="contained"
                    color="error"
                    style={{ margin: "1vh 1vw 1vh 0vw" }}
                    onClick={() => handleStatus("cancelled")}
                  >
                    Cancel Order
                  </Button>
                  {order?.status === "verifying" && (
                    <Button
                      variant="contained"
                      color="warning"
                      style={{ margin: "1vh 1vw" }}
                      onClick={() => handleStatus("prescriptionReUpload")}
                    >
                      Re-upload of Prescription required
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="success"
                    style={{ margin: "1vh 1vw" }}
                    onClick={() => handleStatus(order?.status)}
                  >
                    Next Stage
                  </Button>
                </>
              )}
          </div>
        </div>
      )}
      <Typography variant="h4">Status: {order?.status}</Typography>
      <Typography variant="h4">Items:</Typography>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {order?.items?.map((item, key) => (
            <TableRow
              key={key}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {item.name}
              </TableCell>
              <TableCell align="right">₹{item.price}</TableCell>
              <TableCell align="right">{item.quantity}</TableCell>
              <TableCell align="right">₹{item.price * item.quantity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Typography variant="h4">Total: ₹{order?.total}</Typography>
      <Typography variant="h4">
        Payment: {order?.paid ? "Paid" : "Not Paid"}
      </Typography>
      {prescriptions?.length > 0 && (
        <>
          <Typography variant="h4">Prescriptions:</Typography>
          <ImageGallery showPlayButton={false} items={prescriptions} />
        </>
      )}
    </Container>
  );
};

export default ManageOrder;

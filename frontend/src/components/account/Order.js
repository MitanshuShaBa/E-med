import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import {
  Close as PendingIcon,
  Done as PaidIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Upload as UploadIcon,
} from "@mui/icons-material";
import MoneyIcon from "@mui/icons-material/LocalAtm";
import {
  Card,
  CardContent,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useState, useRef, useEffect } from "react";
import { storage } from "../../firebase";
import { useStateValue } from "../../StateProvider";
import { server } from "../../utils";
import OrderItem from "./OrderItem";

const Order = ({ order }) => {
  const [expanded, setExpanded] = useState(false);
  const [{ user }] = useStateValue();
  const orderRef = useRef(null);
  const inputRef = useRef(null);
  useEffect(() => {
    if (expanded) {
      orderRef.current.scrollIntoView();
    }
  }, [expanded]);

  const handlePrescriptionUpload = (e) => {
    e.preventDefault();

    Promise.all(
      [...e.target.files].map((prescription) =>
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
          server.patch("/order/" + order._id, {
            _id: order._id,
            prescriptions: [...order.prescriptions, ...imgURLs],
            status: "verifying",
          });
        });
      })
      .catch((err) => {
        console.log(err);
        alert("Could not process order");
      });
  };

  const options = {
    key: "rzp_test_XKfrkpagvMEnZc",
    name: "E-Med Stores",
    order_id: order.razorpay_order_id,
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
            server.patch(`/order/${order._id}`, {
              paid: true,
              status: "verifying",
              razorpay_payment_id,
              _id: order._id,
            });
          }
        })
        .catch((err) => console.log(err));
    },
    theme: {
      color: "#686CFD",
    },
  };
  return (
    <>
      <TableRow ref={orderRef} style={{ marginTop: "2vh" }}>
        <TableCell>
          <input
            type="file"
            multiple
            ref={inputRef}
            accept="image/png,image/jpeg"
            style={{ display: "none" }}
            onChange={handlePrescriptionUpload}
          />
          <IconButton size="small" onClick={() => setExpanded(!expanded)}>
            {expanded ? (
              <ExpandLessIcon color="primary" />
            ) : (
              <ExpandMoreIcon color="primary" />
            )}
          </IconButton>
          {order.status === "prescriptionRequired" && (
            <Tooltip title="Upload Prescriptions">
              <IconButton
                size="small"
                onClick={() => {
                  inputRef.current.click();
                }}
              >
                <UploadIcon />
              </IconButton>
            </Tooltip>
          )}
          {order.status === "paymentPending" && (
            <Tooltip title="Pay">
              <IconButton
                size="small"
                onClick={() => {
                  const rzp1 = new window.Razorpay(options);
                  rzp1.open();
                }}
              >
                <MoneyIcon color="success" />
              </IconButton>
            </Tooltip>
          )}
        </TableCell>
        <TableCell>{order._id}</TableCell>
        <TableCell style={{ textTransform: "capitalize" }}>
          {order.status === "prescriptionRequired"
            ? "Prescription Required"
            : order.status}
        </TableCell>
        <TableCell>
          {order.paid ? (
            <PaidIcon color="success" />
          ) : (
            <PendingIcon color="error" />
          )}
        </TableCell>
        <TableCell>
          {moment(new Date(order?.createdAt)).format("D/M/YY hh:mm A")}
        </TableCell>
        <TableCell align="right">₹{order.total}</TableCell>
        <TableCell></TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <OrderItem order={order} expanded={expanded} />
        </TableCell>
      </TableRow>
    </>
  );
};

export default Order;

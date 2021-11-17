import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { server } from "../../utils";

const OrderItem = ({ expanded, order }) => {
  const cancelOrder = () => {
    server
      .patch("/order/" + order._id, { _id: order._id, status: "cancelled" })
      .then(({ data }) => {
        if (order.paid) {
          server
            .post(`/payment/refund/${order.razorpay_payment_id}`)
            .catch((err) => console.log(err.response.data.error));
        }
      })
      .catch((err) => console.log(err));
  };

  const returnOrder = () => {
    server
      .patch("/order/" + order._id, { _id: order._id, status: "returned" })
      .then(({ data }) => {
        // refund logic
      })
      .catch((err) => console.log(err));
  };
  return (
    <Collapse in={expanded} timeout="auto" unmountOnExit>
      <CardContent style={{ overflow: "auto" }}>
        <Table aria-label="order table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order?.items?.map((item) => (
              <TableRow key={item}>
                <TableCell
                  style={{ textTransform: "capitalize" }}
                  component="th"
                  scope="row"
                >
                  {item.name}
                </TableCell>
                <TableCell align="right">₹{item.price}</TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell align="right">
                  ₹{item.price * item.quantity}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              {/* <TableCell rowSpan={3} /> */}
              <TableCell colSpan={2} />
              <TableCell
                align="right"
                style={{ fontWeight: "bold" }}
                // colSpan={2}
              >
                Total
              </TableCell>
              <TableCell align="right">₹{order.total}</TableCell>
            </TableRow>
            <TableRow>
              {/* <TableCell rowSpan={3} /> */}
              <TableCell colSpan={2} />
              <TableCell
                align="right"
                style={{ fontWeight: "bold" }}
                // colSpan={2}
              >
                Paid
              </TableCell>
              <TableCell align="right">{order.paid ? "Yes" : "No"}</TableCell>
            </TableRow>
            <TableRow>
              {/* <TableCell rowSpan={3} /> */}
              <TableCell colSpan={2} />
              <TableCell
                align="right"
                style={{ fontWeight: "bold" }}
                // colSpan={2}
              >
                Status
              </TableCell>
              <TableCell style={{ textTransform: "capitalize" }} align="right">
                {order.status}
              </TableCell>
            </TableRow>
            {order.status !== "cancelled" && order.status !== "returned" && (
              <TableRow>
                <TableCell colSpan={7} align="right">
                  {order.status === "completed" ? (
                    <Button variant="contained" onClick={returnOrder}>
                      Return
                    </Button>
                  ) : (
                    <Button variant="contained" onClick={cancelOrder}>
                      Cancel
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Collapse>
  );
};

export default OrderItem;

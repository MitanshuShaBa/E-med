import {
  Container,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import { useStateValue } from "../../StateProvider";
import { server } from "../../utils";
import AccountHeader from "./Header";
import Order from "./Order";

const Account = () => {
  const [rerender, setRerender] = useState(0);
  const [currentOrders, setCurrentOrders] = useState([]);
  const [pastOrders, setPastOrders] = useState([]);
  const [{ user }] = useStateValue();

  useEffect(() => {
    server
      .get(`/order/user/${user._id}`)
      .then(({ data }) => {
        const current = data.filter(
          (order) =>
            order.status !== "completed" &&
            order.status !== "cancelled" &&
            order.status !== "returned"
        );
        setCurrentOrders(current);
        const past = data.filter(
          (order) =>
            order.status === "completed" ||
            order.status === "cancelled" ||
            order.status === "returned"
        );
        setPastOrders(past);
      })
      .catch((err) => console.log(err));
  }, [rerender, user]);
  return (
    <Container>
      <AccountHeader />
      <Typography variant="h4" style={{ marginTop: "4vh" }}>
        Current Orders
      </Typography>
      <Divider style={{ marginTop: "1vh", marginBottom: "2vh" }} />

      <TableContainer
        component={Paper}
        sx={(theme) => ({ marginBottom: theme.spacing(3) })}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Order #</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Time</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {currentOrders.map((order) => (
              <Order key={order._id} order={order} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h4" style={{ marginTop: "4vh" }}>
        Past Orders
      </Typography>
      <Divider style={{ marginTop: "1vh", marginBottom: "2vh" }} />

      <TableContainer
        component={Paper}
        sx={(theme) => ({ marginBottom: theme.spacing(3) })}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Order #</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Time</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {pastOrders.map((order) => (
              <Order key={order._id} order={order} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Account;

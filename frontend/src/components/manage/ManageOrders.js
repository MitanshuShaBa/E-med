import { Container, Grid, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useStateValue } from "../../StateProvider";
import { server } from "../../utils";
import OrderCard from "./OrderCard";

const ManageOrders = () => {
  const [{ user }] = useStateValue();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const sellerID = user?.role === "staff" ? user?.managedBy?.[0] : user?._id;
    const sellerEndpoint = user.role === "mr" ? "mr" : "pharmacy";

    server
      .get(`/order/${sellerEndpoint}/${sellerID}`)
      .then(({ data }) => {
        setOrders(data);
      })
      .catch((err) => console.log(err));
  }, [user]);

  return (
    <Container style={{ marginTop: "2vh" }}>
      <Grid container spacing={2}>
        {orders.map((order) => (
          <Grid item md={4} sm={6} xs={12}>
            <OrderCard key={order._id} order={order} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ManageOrders;

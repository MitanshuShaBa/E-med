import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  Container,
  Grid,
  List,
  ListItem,
  Toolbar,
  Typography,
} from "@mui/material";
import SalesIcon from "@mui/icons-material/ShoppingCart";
import RevenueIcon from "@mui/icons-material/LocalAtm";
import OrdersIcon from "@mui/icons-material/CardGiftcard";
import CancelledIcon from "@mui/icons-material/Block";
import ExpandIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import { server } from "../utils";
import { useStateValue } from "../StateProvider";

const Reports = () => {
  const [totalReport, setTotalReport] = useState({});
  const [dailyReport, setDailyReport] = useState({});
  const [weeklyReport, setWeeklyReport] = useState({});
  const [monthlyReport, setMonthlyReport] = useState({});
  const [{ user }] = useStateValue();

  useEffect(() => {
    server
      .get(`/report/${user.role === "admin" ? "" : user.role + "/" + user._id}`)
      .then((response) => {
        const data = response.data;
        setTotalReport({ ...data.total });
        setDailyReport({ ...data.day });
        setWeeklyReport({ ...data.week });
        setMonthlyReport({ ...data.month });
      })
      .catch((error) => console.log(error));
  }, [user]);
  return (
    <Container>
      <Toolbar>
        <Typography variant="h4" color="textSecondary">
          Reports
        </Typography>
      </Toolbar>

      <Grid container rowSpacing={3}>
        <Grid container item justify="center" spacing={3}>
          <Grid item xs={6} md={3}>
            <Card raised>
              <CardContent>
                <Typography
                  variant="h6"
                  color="textSecondary"
                  style={{ display: "flex", justifyContent: "space-between" }}
                  gutterBottom
                >
                  Total Revenue <RevenueIcon color="primary" />
                </Typography>
                <hr />
                <Typography variant="h6" align="right">
                  &#x20B9; {totalReport.total_revenue}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card raised>
              <CardContent>
                <Typography
                  variant="h6"
                  color="textSecondary"
                  style={{ display: "flex", justifyContent: "space-between" }}
                  gutterBottom
                >
                  Total Sales <SalesIcon color="primary" />
                </Typography>
                <hr />
                <Typography variant="h6" align="right">
                  {totalReport.total_sales}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card raised>
              <CardContent>
                <Typography
                  variant="h6"
                  color="textSecondary"
                  style={{ display: "flex", justifyContent: "space-between" }}
                  gutterBottom
                >
                  Total Orders <OrdersIcon color="primary" />
                </Typography>
                <hr />
                <Typography variant="h6" align="right">
                  {totalReport.total_orders}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card raised>
              <CardContent>
                <Typography
                  variant="h6"
                  color="textSecondary"
                  style={{ display: "flex", justifyContent: "space-between" }}
                  gutterBottom
                >
                  Cancelled Orders <CancelledIcon color="primary" />
                </Typography>
                <hr />
                <Typography variant="h6" align="right">
                  {totalReport.total_orders_cancelled}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container item style={{ justifyContent: "center" }} spacing={3}>
          <Grid item xs={3}>
            <Card raised>
              <CardContent>
                <Typography variant="h5" color="textSecondary" gutterBottom>
                  Day
                </Typography>
                <hr />
                <Typography
                  variant="h6"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <RevenueIcon color="primary" /> &#x20B9;{" "}
                  {dailyReport.total_revenue}
                </Typography>
                <Typography
                  variant="h6"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <SalesIcon color="primary" /> {dailyReport.total_sales}
                </Typography>
                <Typography
                  variant="h6"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <OrdersIcon color="primary" /> {dailyReport.total_orders}
                </Typography>
                <Typography
                  variant="h6"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <CancelledIcon color="primary" />{" "}
                  {dailyReport.total_orders_cancelled}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card raised>
              <CardContent>
                <Typography variant="h5" color="textSecondary" gutterBottom>
                  Week
                </Typography>
                <hr />
                <Typography
                  variant="h6"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <RevenueIcon color="primary" />
                  &#x20B9; {weeklyReport.total_revenue}
                </Typography>
                <Typography
                  variant="h6"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <SalesIcon color="primary" /> {weeklyReport.total_sales}
                </Typography>
                <Typography
                  variant="h6"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <OrdersIcon color="primary" /> {weeklyReport.total_orders}
                </Typography>
                <Typography
                  variant="h6"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <CancelledIcon color="primary" />{" "}
                  {weeklyReport.total_orders_cancelled}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card raised>
              <CardContent>
                <Typography variant="h5" color="textSecondary" gutterBottom>
                  Month
                </Typography>
                <hr />
                <Typography
                  variant="h6"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <RevenueIcon color="primary" /> &#x20B9;{" "}
                  {monthlyReport.total_revenue}
                </Typography>
                <Typography
                  variant="h6"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <SalesIcon color="primary" /> {monthlyReport.total_sales}
                </Typography>
                <Typography
                  variant="h6"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <OrdersIcon color="primary" /> {monthlyReport.total_orders}
                </Typography>
                <Typography
                  variant="h6"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <CancelledIcon color="primary" />{" "}
                  {monthlyReport.total_orders_cancelled}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container item style={{ justifyContent: "center" }} spacing={3}>
          <Grid item md={6}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandIcon color="primary" />}>
                <Typography variant="h6" color="textSecondary">
                  Most Sold Items
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {totalReport.most_sold_item ? (
                    totalReport.most_sold_item.map((item, index) => (
                      <ListItem
                        key={index}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography>{item.name}</Typography>
                      </ListItem>
                    ))
                  ) : (
                    <Typography>No Data Available</Typography>
                  )}
                </List>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item md={6}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandIcon color="primary" />}>
                <Typography variant="h6" color="textSecondary">
                  Most Revenue Items
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {totalReport.most_revenue_item ? (
                    totalReport.most_revenue_item.map((item, index) => (
                      <ListItem
                        key={index}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography>{item.name}</Typography>
                      </ListItem>
                    ))
                  ) : (
                    <Typography>No Data Available</Typography>
                  )}
                </List>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Reports;

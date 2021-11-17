import {
  Avatar,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Chip,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useHistory } from "react-router-dom";

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function statusToColor(color) {
  const colorMap = {
    prescriptionRequired: "warning",
    verifying: "#F4BE2C",
    processing: "#E07C24",
    delivering: "#12B0E8",
    completed: "success",
  };
  return colorMap[color];
}

const colorMap = {
  prescriptionRequired: "error",
  verifying: "warning",
  processing: "default",
  delivering: "primary",
  completed: "success",
};

const OrderCard = ({ order }) => {
  const history = useHistory();
  return (
    <Card style={{ maxWidth: 350, minWidth: 150 }}>
      <CardActionArea
        onClick={() => history.push("/manage/order/" + order._id)}
      >
        <CardHeader
          title={`#${order._id}`}
          subheader={moment(new Date(order?.createdAt)).format(
            "D/M/YY hh:mm A"
          )}
          avatar={
            <Avatar sx={{ bgcolor: stringToColor(order.buyer.name) }}>
              {order.buyer.name[0]}
            </Avatar>
          }
        />
        <CardContent>
          <Chip label={order.status} color={colorMap[order.status]} />
          {order.items.slice(0, 2).map((item, key) => {
            return (
              <div key={key}>
                <Typography>{item.name}</Typography>
              </div>
            );
          })}
          {/* <Typography>{JSON.stringify(order)}</Typography> */}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default OrderCard;

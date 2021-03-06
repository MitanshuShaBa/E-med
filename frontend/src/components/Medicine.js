import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Medicine = ({
  _id,
  medicine: { name, type, imgCaption },
  price,
  isMR,
}) => {
  return (
    <Card style={{ marginBottom: "2vh", width: 345 }}>
      <CardActionArea
        component={Link}
        to={isMR ? `/stock/${_id}` : `/product/${_id}`}
      >
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              flex: "0.3",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              style={{
                maxHeight: "90%",
                maxWidth: "90%",
                paddingLeft: "2vw",
                width: "90%",
              }}
              src={imgCaption}
              alt={name}
            />
          </div>
          <div style={{ flex: "0.7" }}>
            <CardContent>
              <Typography>{name}</Typography>
              <Typography>₹{price}</Typography>
              <Typography>{type}</Typography>
            </CardContent>
          </div>
        </div>
      </CardActionArea>
    </Card>
  );
};

export default Medicine;

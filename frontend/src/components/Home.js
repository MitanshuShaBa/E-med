import { Container, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { server } from "../utils";
import Medicine from "./Medicine";

const Home = ({ isMR }) => {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    server
      .get(isMR ? "/stock/mr/all" : "/stock/pharmacy/all")
      .then(({ data }) => {
        setMedicines(data);
      })
      .catch((err) => console.log(err));
  }, [isMR]);
  return (
    <Container style={{ marginTop: "4vh" }}>
      <Grid container spacing={2}>
        {medicines.map((medicine, index) => {
          return (
            <Grid
              key={index}
              item
              lg={4}
              md={6}
              sm={6}
              xs={12}
              display="flex"
              justifyContent="center"
            >
              <Medicine {...medicine} isMR={isMR} />
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default Home;

import { Grid, Typography } from "@mui/material";
import AccountPhoto from "../../img/account_photo.png";
import { useStateValue } from "../../StateProvider";

const AccountHeader = () => {
  const [{ user }] = useStateValue();

  return (
    <div>
      <Grid container>
        <Grid container spacing={4}>
          <Grid container item md={2} sm={12} justify="center">
            <img
              src={user.photoURL || AccountPhoto}
              alt="profilePhoto"
              height="100vh"
              style={{ borderRadius: "50%" }}
            />
          </Grid>
          <Grid
            container
            item
            md={10}
            // justify={smUP ? "flex-start" : "center"}
            alignContent="center"
          >
            <Grid item xs={12}>
              <Typography
                //   align={mdUP ? "left" : "center"}
                variant="h4"
              >
                {user.name}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                style={{ textTransform: "none" }}
                // align={mdUP ? "left" : "center"}
              >
                {user.email}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default AccountHeader;

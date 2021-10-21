import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Box
      sx={{
        width: { xs: 300, md: 500 },
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Typography variant="h4">404 - Not Found!</Typography>
      <Typography>
        <Link to="/">Go Home</Link>
      </Typography>
    </Box>
  );
};

export default NotFound;

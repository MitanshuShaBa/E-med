import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  Breadcrumbs,
  Container,
  TextField,
  Typography,
  Link,
  Button,
} from "@mui/material";
import { useState } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { useStateValue } from "../../StateProvider";
import { server } from "../../utils";

const AddMedicine = () => {
  const [{ user }] = useStateValue();
  const history = useHistory();
  const [item, setItem] = useState(null);
  const isMR = user.role === "mr";

  const handleSubmit = (e) => {
    e.preventDefault();
    server
      .post(`/stock/${isMR ? "mr" : "pharmacy"}/add`, {
        ...item,
        isAvailable: true,
        isMR,
        managedBy: user._id,
      })
      .then(({ data }) => {
        console.log(data);
        history.push("/manage/medicines");
      });
  };

  const handleChange = (e) => {
    setItem((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeNumber = (e) => {
    setItem((prevState) => {
      const value = Number(e.target.value) < 0 ? 0 : e.target.value;
      return {
        ...prevState,
        [e.target.name]: Number(value),
      };
    });
  };

  return (
    <Container style={{ marginTop: "2vh" }}>
      <Breadcrumbs
        style={{ marginBottom: "2vh" }}
        separator={<NavigateNextIcon fontSize="small" />}
      >
        <Link component={RouterLink} to="/manage/medicines">
          Medicines
        </Link>
        <Typography color="primary">Add</Typography>
      </Breadcrumbs>
      <form onSubmit={handleSubmit}>
        <TextField
          //   error={isError && errors.name}
          fullWidth
          style={{ marginBottom: "2vh" }}
          label="Name"
          name="name"
          onChange={handleChange}
          value={item?.name}
          required
        />
        <TextField
          //   error={isError && errors.name}
          fullWidth
          style={{ marginBottom: "2vh" }}
          label="Description"
          name="description"
          multiline
          maxRows={4}
          onChange={handleChange}
          value={item?.description}
          required
        />
        <TextField
          //   error={isError && errors.name}
          fullWidth
          style={{ marginBottom: "2vh" }}
          label="Type"
          name="type"
          onChange={handleChange}
          value={item?.type}
          required
        />
        <TextField
          //   error={isError && errors.name}
          fullWidth
          style={{ marginBottom: "2vh" }}
          label="Company"
          name="company"
          onChange={handleChange}
          value={item?.company}
          required
        />
        <TextField
          //   error={isError && errors.name}
          fullWidth
          style={{ marginBottom: "2vh" }}
          label="Price"
          name="price"
          onChange={handleChangeNumber}
          value={item?.price}
          type="number"
          required
        />
        <TextField
          //   error={isError && errors.name}
          fullWidth
          style={{ marginBottom: "2vh" }}
          label="Cost"
          name="cost"
          onChange={handleChangeNumber}
          value={item?.cost}
          type="number"
          required
        />
        <TextField
          //   error={isError && errors.name}
          fullWidth
          style={{ marginBottom: "2vh" }}
          label="Quantity"
          name="quantity"
          onChange={handleChangeNumber}
          value={item?.quantity}
          type="number"
          required
        />
        <Button variant="contained" type="submit">
          Submit
        </Button>
      </form>
    </Container>
  );
};

export default AddMedicine;

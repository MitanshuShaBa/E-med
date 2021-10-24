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
import { storage } from "../../firebase";
import { useStateValue } from "../../StateProvider";
import { server } from "../../utils";
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";

const AddMedicine = () => {
  const [{ user }] = useStateValue();
  const history = useHistory();
  const [item, setItem] = useState(null);
  const [images, setImages] = useState(null);
  const isMR = user.role === "mr";

  const handleSubmit = (e) => {
    e.preventDefault();
    const _id = "6164456a5aa2b1b31f197a92";
    console.log(item);
    console.log(images);

    Promise.all(
      [...images].map((image) =>
        uploadBytes(
          ref(storage, `${Date.now()}.${image?.type?.split("/")[1]}`),
          image
        )
      )
    )
      .then((snapshots) => {
        Promise.all(
          snapshots.map((snapshot) => getDownloadURL(snapshot.ref))
        ).then((imgURLs) => {
          const imgCaption = imgURLs[0];
          server
            .post(`/stock/${isMR ? "mr" : "pharmacy"}/add`, {
              ...item,
              isAvailable: true,
              isMR,
              managedBy: user._id,
              imgURLs,
              imgCaption,
            })
            .then(({ data }) => {
              console.log(data);
              history.push("/manage/medicines");
            });
        });
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (e) => {
    setItem((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeFiles = (e) => {
    setImages(e.target.files);
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
        <TextField
          fullWidth
          required
          style={{ marginBottom: "2vh" }}
          name="images"
          type="file"
          inputProps={{ accept: "image/png,image/jpeg", multiple: true }}
          onChange={handleChangeFiles}
          variant="outlined"
          defaultValue=""
        />
        <br />
        <Button variant="contained" type="submit">
          Submit
        </Button>
      </form>
    </Container>
  );
};

export default AddMedicine;

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  Breadcrumbs,
  Container,
  TextField,
  Typography,
  Link,
  Button,
  Tabs,
  Tab,
  Autocomplete,
} from "@mui/material";
import { useEffect, useState } from "react";
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
  const [tabValue, setTabValue] = useState(0);
  const isMR = user.role === "mr";
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    server.get("/stock/all").then(({ data }) => {
      const tmp = data.map((item) => ({
        ...item,
        label: item.name,
        id: item._id,
      }));
      setMedicines(tmp);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    Promise.all(
      [...images].map((image) =>
        uploadBytes(ref(storage, `${Date.now()}-${image.name}`), image)
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
              isNew: true,
            })
            .then(({ data }) => {
              console.log(data);
              history.push("/manage/medicines");
            })
            .catch((err) => {
              console.log(err);
              alert("Unable to add medicine");
            });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addStock = (e) => {
    e.preventDefault();

    // console.log(item);
    server
      .post("/stock/mr/add", {
        ...item,
        medicine: item.medicine._id,
        isAvailable: true,
        isMR,
        managedBy: user._id,
      })
      .then(({ data }) => {
        console.log(data);
        history.push("/manage/medicines");
      })
      .catch((err) => {
        console.log(err);
        alert("Unable to add medicine");
      });
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

  const handleChangeTabValue = (_e, newValue) => {
    setTabValue(newValue);
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
      <Tabs
        style={{ marginBottom: "2vh" }}
        value={tabValue}
        onChange={handleChangeTabValue}
      >
        <Tab label={"Add Stock"} id={`simple-tab-0`} />
        <Tab label={"Add Medicine"} id={`simple-tab-1`} />
      </Tabs>
      {tabValue === 0 && (
        <form onSubmit={addStock}>
          <Autocomplete
            disablePortal
            id="medicine"
            options={medicines}
            fullWidth
            renderInput={(params) => (
              <TextField
                {...params}
                style={{ marginBottom: "2vh" }}
                label="Medicine"
                name="medicine"
                // onChange={handleChange}
                value={item?.medicine?.name}
                required
              />
            )}
            onChange={(e) => {
              const idx = e.target.id.split("-").slice(-1)[0];
              setItem((prevState) => ({
                ...prevState,
                medicine: medicines[idx],
              }));
            }}
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
          <br />
          <Button variant="contained" type="submit">
            Submit
          </Button>
        </form>
      )}
      {tabValue === 1 && (
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
      )}
    </Container>
  );
};

export default AddMedicine;

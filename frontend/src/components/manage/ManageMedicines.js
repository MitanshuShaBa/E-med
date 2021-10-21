import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Close";
import {
  Container,
  Fab,
  IconButton,
  InputAdornment,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { useStateValue } from "../../StateProvider";
import { server } from "../../utils";

const ManageMedicines = () => {
  const [{ user }] = useStateValue();
  const [editing, setEditing] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rerender, setRerender] = useState(0);

  useEffect(() => {
    server
      .get(`/stock/${user.role === "mr" ? "mr" : "pharmacy"}/${user._id}`)
      .then(({ data }) => {
        setMedicines(data);
      })
      .catch((err) => console.log(err));
  }, [rerender]);

  useEffect(() => {
    const searchResults = medicines.filter((medicine) =>
      medicine.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(searchResults);
  }, [query, medicines]);

  const editMenuItem = (item) => {
    setEditing(true);
    setCurrentItem(item);
  };

  const handleChange = (e) => {
    setCurrentItem((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeNumber = (e) => {
    setCurrentItem((prevState) => {
      const value = e.target.value < 0 ? 0 : e.target.value;
      return {
        ...prevState,
        [e.target.name]: Number(value),
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    server
      .patch("/stock/pharmacy/item", { ...currentItem })
      .then(() => setRerender(rerender + 1))
      .catch((err) => console.log(err.response.data.error));

    setEditing(false);
  };

  const toggleAvailability = (_id, availability) => {
    server
      .patch("/stock/pharmacy/item", { _id, isAvailable: !availability })
      .then(() => setRerender(rerender + 1))
      .catch((err) => console.log(err.response.data.error));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container style={{ marginTop: "2vh" }}>
      {user._id === undefined && <Redirect to="/" />}
      <Toolbar style={{ justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h4" color="textSecondary">
            Medicines
          </Typography>

          <Tooltip title="Add">
            <Fab
              sx={{ margin: (theme) => theme.spacing(1) }}
              component={Link}
              size="small"
              color="primary"
              to="/medicine/add"
            >
              <AddIcon style={{ color: "white" }} />
            </Fab>
          </Tooltip>
        </div>

        <TextField
          size="small"
          variant="outlined"
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }}
        />
      </Toolbar>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Cost</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Availabilty</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {searchResults
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(
                ({
                  name,
                  _id,
                  description,
                  type,
                  company,
                  price,
                  cost,
                  quantity,
                  isAvailable,
                }) => (
                  <TableRow key={_id}>
                    <TableCell>
                      {editing && _id === currentItem._id ? (
                        <form onSubmit={handleSubmit}>
                          <TextField
                            name="name"
                            onChange={handleChange}
                            value={currentItem.name}
                            variant="outlined"
                            required
                          />
                        </form>
                      ) : (
                        <span>{name}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editing && _id === currentItem._id ? (
                        <form onSubmit={handleSubmit}>
                          <TextField
                            name="description"
                            multiline
                            maxRows={4}
                            onChange={handleChange}
                            value={currentItem.description}
                            variant="outlined"
                            required
                          />
                        </form>
                      ) : (
                        <span>{description.slice(0, 10)}...</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editing && _id === currentItem._id ? (
                        <form onSubmit={handleSubmit}>
                          <TextField
                            name="type"
                            onChange={handleChange}
                            value={currentItem.type}
                            variant="outlined"
                            required
                          />
                        </form>
                      ) : (
                        <span>{type}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editing && _id === currentItem._id ? (
                        <form onSubmit={handleSubmit}>
                          <TextField
                            name="company"
                            onChange={handleChange}
                            value={currentItem.company}
                            variant="outlined"
                            required
                          />
                        </form>
                      ) : (
                        <span>{company}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editing && _id === currentItem._id ? (
                        <form onSubmit={handleSubmit}>
                          <TextField
                            name="price"
                            type="number"
                            onChange={handleChangeNumber}
                            value={currentItem.price}
                            variant="outlined"
                            required
                          />
                        </form>
                      ) : (
                        <span>₹ {price}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editing && _id === currentItem._id ? (
                        <form onSubmit={handleSubmit}>
                          <TextField
                            name="cost"
                            type="number"
                            onChange={handleChangeNumber}
                            value={currentItem.cost}
                            variant="outlined"
                            required
                          />
                        </form>
                      ) : (
                        <span>₹ {cost}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editing && _id === currentItem._id ? (
                        <form onSubmit={handleSubmit}>
                          <TextField
                            name="quantity"
                            type="number"
                            onChange={handleChangeNumber}
                            value={currentItem.quantity}
                            variant="outlined"
                            required
                          />
                        </form>
                      ) : (
                        <span>{quantity}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Change Availability">
                        <Switch
                          color="primary"
                          checked={isAvailable}
                          onChange={() => toggleAvailability(_id, isAvailable)}
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      {editing ? (
                        <Tooltip title="Cancel">
                          <IconButton onClick={() => setEditing(false)}>
                            <CancelIcon color="error" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() =>
                              editMenuItem({
                                _id,
                                name,
                                description,
                                type,
                                company,
                                price,
                                cost,
                                quantity,
                              })
                            }
                          >
                            <EditIcon color="primary" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Delete">
                        <IconButton
                        // onClick={() => openDialog(menuItem)}
                        >
                          <DeleteIcon color="error" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                )
              )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        component="div"
        count={searchResults.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Container>
  );
};

export default ManageMedicines;

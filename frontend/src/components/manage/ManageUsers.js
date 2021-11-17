import {
  Container,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { server } from "../../utils";
import { useStateValue } from "../../StateProvider";
import { Add as AddIcon, SettingsInputComponent } from "@mui/icons-material";

const ManageUsers = () => {
  const [
    {
      user: { role, _id: id, managedBy: pharmacyID },
    },
  ] = useStateValue();
  const [tabValue, setTabValue] = useState(0);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [dialogState, setDialogState] = useState({ name: "", email: "" });
  const [rerender, setRerender] = useState(0);

  const tabData = {
    admin: {
      tabs: [
        { name: "Users", url: "/manage/users", role: "user", add: false },
        { name: "Admins", url: "/manage/admins", role: "admin", add: true },
        { name: "MRs", url: "/manage/mrs", role: "mr", add: true },
        {
          name: "Pharmacists",
          url: "/manage/pharmacists",
          role: "pharmacist",
          add: false,
        },
        {
          name: "Staff",
          url: "/manage/staffs",
          role: "staff",
          add: false,
        },
      ],
    },
    mr: {
      tabs: [
        {
          name: "Pharmacists",
          url: `/manage/pharmacists/${id}`,
          role: "pharmacist",
          add: true,
        },
      ],
    },
    pharmacist: {
      tabs: [
        { name: "Users", url: `/manage/users/${id}`, role: "user", add: false },
        {
          name: "Staff",
          url: `/manage/staffs/${id}`,
          role: "staff",
          add: true,
        },
      ],
    },
    staff: {
      tabs: [
        {
          name: "Users",
          url: `/manage/users/${pharmacyID}`,
          role: "user",
          add: false,
        },
      ],
    },
  };

  const handleChangeTabValue = (_e, newValue) => {
    setTabValue(newValue);
  };

  const handleSignUpUser = (role) => {
    const user = {
      name: dialogState.name,
      email: dialogState.email,
      role,
      ...(role !== "admin" && { managedBy: [id] }),
      password: "123456", // TODO make a random string
    };
    if (user.name === "" || user.email === "") {
      alert("Please enter the fields");
    } else {
      server
        .post("/auth/signup", user)
        .then(({ data }) => {
          console.log(data);
          setDialogState({ name: "", email: "" });
          setRerender(rerender + 1);
        })
        .catch((err) => console.log(err.response.data.error))
        .finally(() => setOpen(false));
    }
  };

  const handleChangeDialog = (e) => {
    setDialogState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Container>
      <Toolbar style={{ justifyContent: "space-between" }}>
        <Typography variant="h4" color="textSecondary">
          Manage {role}
        </Typography>
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
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Tabs value={tabValue} onChange={handleChangeTabValue}>
          {tabData[role]?.tabs?.map(({ name }, index) => (
            <Tab key={index} label={name} id={`simple-tab-${index}`} />
          ))}
        </Tabs>
        {tabData[role]?.tabs[tabValue]?.add && (
          <Button onClick={() => setOpen(true)} size="small">
            Add {tabData[role]?.tabs[tabValue]?.role}
          </Button>
        )}
      </div>

      <Dialog fullWidth open={open} onClose={() => setOpen(false)}>
        <DialogTitle style={{ textTransform: "capitalize" }}>
          {tabData[role]?.tabs[tabValue]?.role}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add details of {tabData[role]?.tabs[tabValue]?.role}
          </DialogContentText>
          <form
            onSubmit={() =>
              handleSignUpUser(tabData[role]?.tabs[tabValue]?.role)
            }
          >
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              name="name"
              type="text"
              fullWidth
              variant="standard"
              value={dialogState.name}
              onChange={handleChangeDialog}
            />
            <TextField
              margin="dense"
              id="email"
              label="Email Address"
              name="email"
              type="email"
              fullWidth
              variant="standard"
              value={dialogState.email}
              onChange={handleChangeDialog}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              setDialogState({ name: "", email: "" });
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() =>
              handleSignUpUser(tabData[role]?.tabs[tabValue]?.role)
            }
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <CustomTable
        {...{ query, url: tabData[role]?.tabs[tabValue]?.url, rerender }}
      />
    </Container>
  );
};

const CustomTable = ({ query, url, rerender }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchResults, setSearchResults] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    server
      .get(url)
      .then(({ data }) => setUsers(data))
      .catch((err) => console.log(err.response.data.error));
  }, [url, rerender]);

  useEffect(() => {
    const tmpSearchResults = users.filter((user) =>
      user.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(tmpSearchResults);
  }, [query, users]);

  const handleChangePage = (_e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value));
    setPage(0);
  };
  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              {/* <TableCell>Phone</TableCell> */}
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {searchResults
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(({ _id, name, email, role }) => (
                <TableRow key={_id}>
                  <TableCell>{name}</TableCell>
                  <TableCell>{email}</TableCell>
                  <TableCell style={{ textTransform: "capitalize" }}>
                    {role === "mr" ? "Medical Representative" : role}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        component="div"
        count={searchResults.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default ManageUsers;

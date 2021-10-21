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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { server } from "../../utils";
import { useStateValue } from "../../StateProvider";

const ManageUsers = () => {
  const [
    {
      user: { role, _id: id, managedBy: pharmacyID },
    },
  ] = useStateValue();
  const [tabValue, setTabValue] = useState(0);
  const [query, setQuery] = useState("");

  const tabData = {
    admin: {
      tabs: [
        { name: "Users", url: "/manage/users" },
        { name: "Admins", url: "/manage/admins" },
        { name: "MRs", url: "/manage/mrs" },
        {
          name: "Pharmacists",
          url: "/manage/pharmacists",
        },
        {
          name: "Staff",
          url: "/manage/staffs",
        },
      ],
    },
    mr: {
      tabs: [
        {
          name: "Pharmacists",
          url: `/manage/pharmacists/${id}`,
        },
      ],
    },
    pharmacist: {
      tabs: [
        { name: "Users", url: `/manage/users/${id}` },
        {
          name: "Staff",
          url: `/manage/staffs/${id}`,
        },
      ],
    },
    staff: {
      tabs: [{ name: "Users", url: `/manage/users/${pharmacyID}` }],
    },
  };

  const handleChangeTabValue = (_e, newValue) => {
    setTabValue(newValue);
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
      <Tabs value={tabValue} onChange={handleChangeTabValue}>
        {tabData[role].tabs.map(({ name }, index) => (
          <Tab key={index} label={name} id={`simple-tab-${index}`} />
        ))}
      </Tabs>
      <CustomTable {...{ query, url: tabData[role].tabs[tabValue].url }} />
    </Container>
  );
};

const CustomTable = ({ query, url }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchResults, setSearchResults] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    server
      .get(url)
      .then(({ data }) => setUsers(data))
      .catch((err) => console.log(err.response.data.error));
  }, [url]);

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
                  <TableCell>{role}</TableCell>
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

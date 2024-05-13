import React, { useState } from "react";
import useSWR from "swr";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";

import AddIcon from "@mui/icons-material/Add";

import {
  addCitiesAPI,
  getCitiesAPI,
  getStatesAPI,
} from "../../apis/location.apis";

const City = () => {
  const [isFormOpen, setisFormOpen] = useState(false);
  const citiesDataResp = useSWR("/location/cities", getCitiesAPI);

  const handleFormClose = () => {
    setisFormOpen(false);
  };

  const openForm = () => {
    setisFormOpen(true);
  };

  return (
    <Box>
      <Button
        sx={{ mb: 2 }}
        onClick={openForm}
        variant="contained"
        startIcon={<AddIcon />}
      >
        Add City
      </Button>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>City</TableCell>
              <TableCell align="right">State</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {citiesDataResp.data?.map((row) => (
              <TableRow
                key={row.city_id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell
                  sx={{
                    textTransform: "capitalize",
                  }}
                >
                  {row.city_name}
                </TableCell>
                <TableCell
                  sx={{
                    textTransform: "capitalize",
                  }}
                  align="right"
                  component="th"
                  scope="row"
                >
                  {row.state_name}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <AddCityForm open={isFormOpen} onClose={handleFormClose} />
    </Box>
  );
};

export default City;

function AddCityForm({ onClose, open }) {
  const statesDataResp = useSWR("/location/states", getStatesAPI);
  const [isLoaing, setisLoaing] = useState(false);

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    setisLoaing(true);
    addCitiesAPI(data.get("city_name"), data.get("state_id"))
      .then((res) => {
        alert("City Added!");
        handleClose();
      })
      .catch((e) => {
        if (e.respponse && e.respponse?.data?.message) {
          alert(e.respponse?.data?.message);
        } else {
          alert("something went wrong!");
        }
      })
      .finally((v) => {
        setisLoaing(false);
      });
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="add-city-title"
        aria-describedby="add-city-description"
      >
        <form onSubmit={handleSubmit} method="post">
          <DialogTitle id="add-city-title">{"Add A City"}</DialogTitle>
          <DialogContent>
            <DialogContentText mb={2} id="add-city-description">
              Fill the form to add a city.
            </DialogContentText>

            <FormControl sx={{ mb: 2 }} size="small" fullWidth required>
              <InputLabel id="zone-select-label">Select State</InputLabel>
              <Select
                name="state_id"
                labelId="zone-select-label"
                id="zone-select"
              >
                {statesDataResp?.data
                  ? statesDataResp.data.map((v) => (
                      <MenuItem value={v.state_id}>{v.state_name}</MenuItem>
                    ))
                  : null}
              </Select>
            </FormControl>

            <TextField
              size="small"
              label="Enter City Name"
              variant="outlined"
              name="city_name"
              required
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button disabled={isLoaing} variant="contained" type="submit">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}

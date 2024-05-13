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
  getZonesAPI,
  addStatesAPI,
  getStatesAPI,
} from "../../apis/location.apis";

const States = () => {
  const [isFormOpen, setisFormOpen] = useState(false);
  const statesDataResp = useSWR("/location/states", getStatesAPI);

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
        Add State
      </Button>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>States</TableCell>
              <TableCell align="right">Zones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {statesDataResp.data?.map((row) => (
              <TableRow
                key={row.state_id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell
                  sx={{
                    textTransform: "capitalize",
                  }}
                  component="th"
                  scope="row"
                >
                  {row.state_name}
                </TableCell>
                <TableCell
                  sx={{
                    textTransform: "capitalize",
                  }}
                  align="right"
                >
                  {row.zone_name}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <AddStateForm open={isFormOpen} onClose={handleFormClose} />
    </Box>
  );
};

export default States;

function AddStateForm({ onClose, open }) {
  const zoneDataResp = useSWR("/location/zones", getZonesAPI);
  const [isLoaing, setisLoaing] = useState(false);

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    setisLoaing(true);
    addStatesAPI(data.get("state_name"), data.get("zone_id"))
      .then((res) => {
        alert("State Added!");
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
        aria-labelledby="add-state-title"
        aria-describedby="add-state-description"
      >
        <form onSubmit={handleSubmit} method="post">
          <DialogTitle id="add-state-title">{"Add A State"}</DialogTitle>
          <DialogContent>
            <DialogContentText mb={2} id="add-state-description">
              Fill the form to add a state.
            </DialogContentText>

            <FormControl sx={{ mb: 2 }} size="small" fullWidth required>
              <InputLabel id="zone-select-label">Select Zone</InputLabel>
              <Select
                name="zone_id"
                labelId="zone-select-label"
                id="zone-select"
              >
                {zoneDataResp?.data
                  ? zoneDataResp.data.map((v) => (
                      <MenuItem value={v.zone_id}>{v.zone_name}</MenuItem>
                    ))
                  : null}
              </Select>
            </FormControl>

            <TextField
              size="small"
              name="state_name"
              label="Enter State Name"
              variant="outlined"
              fullWidth
              required
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

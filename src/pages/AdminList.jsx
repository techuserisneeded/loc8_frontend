import React, { useState } from "react";
import useSWR from "swr";

import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Button, Stack, CircularProgress } from "@mui/material";

import SuperAdminLayout from "../layouts/SuperAdminLayout";

import {
	addUserAPI,
	getAdminsAPI,
	deleteUserAPI,
	editUserAPI,
} from "../apis/admins.apis";
import { getZonesAPI } from "../apis/location.apis";

import { cleanString } from "../utils/helper.utils";
import { toast } from "react-toastify";

const AdminList = () => {
	const [isFormOpen, setisFormOpen] = useState(false);
	const [isLoading, setisLoading] = useState(false);
	const [deleteLoadingState, setdeleteLoadingState] = useState({
		isLoading: false,
		user_id: null,
	});
	const [formState, setformState] = useState({
		first_name: "",
		last_name: "",
		email: "",
		emp_id: "",
		password: "",
		zone_id: null,
		id: null,
	});
	const [isEditing, setisEditing] = useState(false);

	const {
		data,
		error,
		isLoading: fetchingAdmin,
	} = useSWR("/admins", getAdminsAPI);
	const zoneDataResp = useSWR("/location/zones", getZonesAPI);

	const handleClose = () => {
		setisFormOpen(false);
		setformState({});
	};

	const openForm = () => {
		setisFormOpen(true);
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		setisLoading(true);
		const data = new FormData(e.currentTarget);

		const saveAPI = !isEditing
			? addUserAPI
			: editUserAPI.bind(this, formState.id);

		const d = {
			first_name: cleanString(formState.first_name),
			last_name: cleanString(formState.last_name),
			emp_id: cleanString(formState.emp_id),
			email: cleanString(formState.email),
			password: cleanString(formState.password || ""),
			zone_id: formState.zone_id,
			role_id: 2,
		};

		saveAPI(d)
			.then((res) => {
				toast.success("Saved Successfully!");
				handleClose();
			})
			.catch((e) => {
				if (e.response && e.response?.data?.message) {
					toast.error(e.response?.data?.message);
				} else {
					toast.error("something went wrong!");
				}
			})
			.finally((v) => {
				setisLoading(false);
			});
	};

	const handleDelete = (user_id) => {
		if (!window.confirm("Are you sure you want to delete the user?")) {
			return;
		}

		setdeleteLoadingState({
			isLoading: true,
			user_id,
		});

		deleteUserAPI(user_id)
			.then(() => {
				alert("User Deleted Successfully!");
			})
			.catch((e) => {
				console.log(e);
				alert("something went wrong while deleting.");
			})
			.finally(() => {
				setdeleteLoadingState({
					isLoading: false,
					user_id: null,
				});
			});
	};

	const handleInputChange = (e) => {
		const name = e.target.name;
		setformState((prev) => {
			return {
				...prev,
				[name]: e.target.value,
			};
		});
	};

	const handleEdit = (user) => {
		setisEditing(true);
		setisFormOpen(true);
		setformState({
			first_name: user.first_name,
			last_name: user.last_name,
			email: user.email,
			emp_id: user.employee_id,
			zone_id: user.zone_id,
			id: user.id,
		});
	};

	return (
		<SuperAdminLayout activeLink="/admins">
			{fetchingAdmin || zoneDataResp.isLoading ? (
				<center>
					<Stack direction={"row"} alignItems={"center"} gap={1}>
						<CircularProgress size={18} />
						Loading...
					</Stack>
				</center>
			) : null}
			<Stack
				direction={"row"}
				alignItems={"center"}
				justifyContent={"space-between"}
				mb={2}>
				<Typography variant="h4">Admins</Typography>
				<Button variant="contained" onClick={openForm}>
					Add Admin
				</Button>
			</Stack>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 650 }} aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell>First Name</TableCell>
							<TableCell>Last Name</TableCell>
							<TableCell>Email</TableCell>
							<TableCell>Zone</TableCell>
							<TableCell>Created At</TableCell>
							<TableCell>Edit</TableCell>
							<TableCell>Delete</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data
							? data.map((row) => (
									<TableRow
										key={row.id}
										sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
										<TableCell component="th" scope="row">
											{row.first_name}
										</TableCell>
										<TableCell>{row.last_name}</TableCell>
										<TableCell>{row.email}</TableCell>
										<TableCell>{row.zone_name}</TableCell>
										<TableCell>{row.created_at}</TableCell>
										<TableCell>
											<Button
												variant="contained"
												color="success"
												disableElevation
												onClick={handleEdit.bind(this, row)}
												disabled={
													deleteLoadingState.isLoading &&
													deleteLoadingState.user_id === row.id
												}>
												Edit
											</Button>
										</TableCell>
										<TableCell>
											<Button
												variant="contained"
												color="error"
												disableElevation
												onClick={handleDelete.bind(this, row.id)}
												disabled={
													deleteLoadingState.isLoading &&
													deleteLoadingState.user_id === row.id
												}>
												Delete
											</Button>
										</TableCell>
									</TableRow>
							  ))
							: null}
					</TableBody>
				</Table>
			</TableContainer>
			<Dialog
				open={isFormOpen}
				onClose={handleClose}
				aria-labelledby="add-admin-title"
				aria-describedby="add-admin-description">
				<form onSubmit={handleSubmit}>
					<DialogTitle id="add-admin-title">{"Add An Admin"}</DialogTitle>
					<DialogContent component="form">
						<DialogContentText mb={2} id="add-admin-description">
							Fill the form to add an admin.
						</DialogContentText>

						<Box noValidate sx={{ mt: 3 }}>
							<Grid container spacing={2}>
								<Grid item xs={12} sm={6}>
									<TextField
										autoComplete="given-name"
										name="first_name"
										required
										fullWidth
										id="first_name"
										label="Employee First Name"
										value={formState.first_name}
										onChange={handleInputChange}
										autoFocus
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<TextField
										autoComplete="family-name"
										name="last_name"
										required
										fullWidth
										id="last_name"
										value={formState.last_name}
										onChange={handleInputChange}
										label="Employee Last Name"
										autoFocus
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										required
										fullWidth
										id="emp_id"
										label="Employee ID"
										name="emp_id"
										value={formState.emp_id}
										onChange={handleInputChange}
										autoComplete="family-name"
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										required
										fullWidth
										id="email"
										label="Email Address"
										name="email"
										value={formState.email}
										onChange={handleInputChange}
										autoComplete="email"
									/>
								</Grid>
								<Grid item xs={12}>
									<FormControl fullWidth required>
										<InputLabel id="zone-select-label">Select Zone</InputLabel>
										<Select
											name="zone_id"
											labelId="zone-select-label"
											id="zone_id"
											value={formState.zone_id}
											onChange={handleInputChange}
											required>
											{zoneDataResp?.data
												? zoneDataResp.data.map((v) => (
														<MenuItem value={v.zone_id}>{v.zone_name}</MenuItem>
												  ))
												: null}
										</Select>
									</FormControl>
								</Grid>
								<Grid item xs={12}>
									<TextField
										required={!isEditing}
										fullWidth
										value={formState.password}
										onChange={handleInputChange}
										name="password"
										label="Password"
										type="password"
										id="password"
										autoComplete="new-password"
									/>
								</Grid>
							</Grid>
						</Box>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose}>Cancel</Button>
						<Button
							variant="contained"
							disabled={isLoading}
							type="submit"
							autoFocus>
							Add
						</Button>
					</DialogActions>
				</form>
			</Dialog>
		</SuperAdminLayout>
	);
};

export default AdminList;

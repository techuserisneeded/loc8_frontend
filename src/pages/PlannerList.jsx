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
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Button, Stack, CircularProgress, IconButton } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import SuperAdminLayout from "../layouts/SuperAdminLayout";
import CustomButton from "../components/CustomButton";

import useAuth from "../hooks/useAuth";
import roles from "../constants/roles";

import { deleteUserAPI } from "../apis/admins.apis";

import {
	addPlannerAPI,
	assignUserAreasAPI,
	getPlannersAPI,
	editPlannerAPI,
} from "../apis/planners.apis";

import { cleanString } from "../utils/helper.utils";
import { toast } from "react-toastify";
import AreaSelector from "../components/AreaSelector";

const PlannerList = () => {
	const [isFormOpen, setisFormOpen] = useState(false);
	const [isLoading, setisLoading] = useState(false);
	const [deleteLoadingState, setdeleteLoadingState] = useState({
		isLoading: false,
		user_id: null,
	});
	const [areaState, setAreaState] = useState({
		isOpen: false,
		area: [{}],
	});
	const [isEditing, setisEditing] = useState(false);

	const [formState, setformState] = useState({
		first_name: "",
		last_name: "",
		emp_id: "",
		email: "",
		zone_id: 0,
		state_id: 0,
		city_id: 0,
		password: "",
	});

	const {
		data,
		error,
		isLoading: fetchingPlanners,
	} = useSWR("/planners/planners", getPlannersAPI);

	const user = useAuth();

	const isSuperAdmin = user.role_id === roles.SUPERADMIN;

	const handleAddArea = () => {
		setAreaState((prev) => {
			const newArea = [...prev.area];

			newArea.push({});

			return {
				...prev,
				isOpen: prev.isOpen,
				area: newArea,
			};
		});
	};

	const removeArea = (index) => {
		setAreaState((prev) => {
			const newArea = [...prev.area];

			return {
				...prev,
				isOpen: prev.isOpen,
				area: newArea.filter((v, i) => i !== index),
			};
		});
	};

	const handleClose = () => {
		setisFormOpen(false);
	};

	const handleCloseAssign = () => {
		setAreaState({
			isOpen: false,
			area: [],
			user_id: null,
		});
	};

	const openForm = () => {
		setisFormOpen(true);
	};

	const openAssignModal = (row) => {
		console.log(row);
		setAreaState({
			isOpen: true,
			area: row.user_areas.map((v) => {
				return {
					zone: {
						id: v.zone_id,
						zone_id: v.zone_id,
						zone_name: v.zone_name,
						label: v.zone_name,
					},
					state: {
						id: v.state_id,
						state_id: v.state_id,
						state_name: v.state_name,
						label: v.state_name,
					},
					city: {
						id: v.city_id,
						city_id: v.city_id,
						city_name: v.city_name,
						label: v.city_name,
					},
				};
			}),
			user_id: row.id,
		});
	};

	const handleAreaChange = (index, obj, e) => {
		const elementIndex = areaState.area.findIndex(
			(c) =>
				c?.zone?.zone_id === obj.zone.zone_id &&
				c?.state?.state_id === obj.state.state_id &&
				c?.city?.city_id === obj.city.city_id
		);

		if (elementIndex > -1) {
			alert("selected zone-state-city is already assigned");
			return;
		}

		setAreaState((prev) => {
			const newArea = [...prev.area];

			newArea[index] = obj;

			return {
				...prev,
				isOpen: prev.isOpen,
				area: newArea,
			};
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

	const handleSubmit = (e) => {
		e.preventDefault();

		setisLoading(true);

		const d = {
			first_name: cleanString(formState.first_name),
			last_name: cleanString(formState.last_name),
			emp_id: cleanString(formState.emp_id),
			email: cleanString(formState.email),
			password: cleanString(formState.password),
			role_id: 1,
		};

		const saveAPI = isEditing
			? editPlannerAPI.bind(this, formState.id)
			: addPlannerAPI;

		saveAPI(d)
			.then((res) => {
				toast.success("changes saved successfully!!");
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

	const handleAreaAssign = (e) => {
		e.preventDefault();
		const isEmpty = areaState.area.some(
			(v) => !v?.zone?.id || !v?.state?.id || !v?.city?.id
		);

		if (isEmpty) {
			alert(
				"Please fill all the rows avoid same combinations of zone-sate-city"
			);
			return;
		}

		setisLoading(true);

		assignUserAreasAPI(
			areaState.user_id,
			areaState.area.map((v) => ({
				zone_id: v.zone.zone_id,
				state_id: v.state.state_id,
				city_id: v.city.city_id,
			}))
		)
			.then((v) => {
				toast.success("Area assigned!");
				handleCloseAssign();
			})
			.catch((e) => {
				const msg = e.response?.data?.message || "Something went wrong!";
				toast.error(msg);
			})
			.finally((e) => {
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
				toast.success("User Deleted Successfully!");
			})
			.catch((e) => {
				if (e.response && e.response?.data?.message) {
					toast.error(e.response?.data?.message);
				} else {
					toast.error("something went wrong!");
				}
			})
			.finally(() => {
				setdeleteLoadingState({
					isLoading: false,
					user_id: null,
				});
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
			id: user.id,
		});
	};

	return (
		<SuperAdminLayout activeLink="/planners">
			{fetchingPlanners ? (
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
				<Typography variant="h4">Planners</Typography>
				<Button variant="contained" onClick={openForm}>
					Add Planner
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
							<TableCell>State</TableCell>
							<TableCell>City</TableCell>
							<TableCell>Created At</TableCell>
							{isSuperAdmin ? <TableCell>Created By</TableCell> : null}
							<TableCell width={150}>Assign Area</TableCell>
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
										<TableCell>
											{row.user_areas.map((v) => v.zone_name)}
										</TableCell>
										<TableCell>
											{row.user_areas.map((v) => v.state_name)}
										</TableCell>
										<TableCell>
											{row.user_areas.map((v) => v.city_name)}
										</TableCell>
										<TableCell>
											{new Date(row.created_at).toISOString().split("T")[0]}
										</TableCell>
										{isSuperAdmin ? (
											<TableCell>{row.created_by_user_email}</TableCell>
										) : null}
										<TableCell>
											<Button
												size="small"
												variant="contained"
												color="success"
												disableElevation
												onClick={openAssignModal.bind(this, row)}
												disabled={
													deleteLoadingState.isLoading &&
													deleteLoadingState.user_id === row.id
												}>
												Assign Areas
											</Button>
										</TableCell>
										<TableCell>
											<Button
												size="small"
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
												size="small"
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
				aria-labelledby="add-planner-title"
				aria-describedby="add-planner-description">
				<form onSubmit={handleSubmit}>
					<DialogTitle id="add-planner-title">{"Add A Planner"}</DialogTitle>
					<DialogContent component="form">
						<DialogContentText mb={2} id="add-Planner-description">
							Fill the form to add a Planner.
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
										label="Employee Last Name"
										value={formState.last_name}
										onChange={handleInputChange}
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
										type="email"
										autoComplete="email"
										value={formState.email}
										onChange={handleInputChange}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										required={!isEditing}
										fullWidth
										name="password"
										label="Password"
										type="password"
										id="password"
										value={formState.password}
										onChange={handleInputChange}
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
			<Dialog
				open={areaState.isOpen}
				onClose={handleCloseAssign}
				aria-labelledby="assign-areas-title"
				aria-describedby="assign-areas-description">
				<form onSubmit={handleAreaAssign}>
					<DialogTitle id="assign-areas-title">{"Assign Area"}</DialogTitle>
					<DialogContent component="form">
						<DialogContentText mb={2} id="assign-areas-description">
							Assign Areas
						</DialogContentText>

						<Box sx={{ mt: 3, width: "500px", minHeight: "300px" }}>
							{areaState.area.map((v, i) => {
								console.log(v);
								return (
									<Box
										key={i}
										sx={{
											padding: "0.8rem",
											margin: "0.4rem 0",
											border: "1px solid #c9a90c",
											borderRadius: "8px",
											position: "relative",
											width: "100%",
										}}>
										{i !== 0 ? (
											<IconButton
												size="small"
												onClick={removeArea.bind(this, i)}
												sx={{
													backgroundColor: "grey",
													position: "absolute",
													right: "-10px",
													top: "-20px",
												}}>
												<RemoveIcon />
											</IconButton>
										) : null}
										<AreaSelector
											onChange={handleAreaChange.bind(this, i)}
											layoutDirection="row"
											defaultCityValue={v.city}
											defaultStateValue={v.state}
											defaultZoneValue={v.zone}
										/>
									</Box>
								);
							})}
							<Stack direction={"row"} justifyContent={"flex-end"}>
								<CustomButton startIcon={<AddIcon />} onClick={handleAddArea}>
									Add More
								</CustomButton>
							</Stack>
						</Box>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleCloseAssign}>Cancel</Button>
						<Button
							variant="contained"
							disabled={isLoading}
							type="submit"
							autoFocus>
							Save
						</Button>
					</DialogActions>
				</form>
			</Dialog>
		</SuperAdminLayout>
	);
};

export default PlannerList;

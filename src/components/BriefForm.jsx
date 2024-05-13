import React, { useState, forwardRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	FormControl,
	Paper,
	TextField,
	Grid,
	Box,
	Stack,
	FormLabel,
	Typography,
	IconButton,
	Select,
	MenuItem,
} from "@mui/material";
import DatePicker from "react-datepicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import AreaSelector from "./AreaSelector";
import CustomButton from "./CustomButton";

import "react-datepicker/dist/react-datepicker.css";

export const defaultBudget = {
	zone: {},
	state: {},
	city: {},
	budget: 0,
	id: 1,
};

export const defaultFormState = {
	isImmediate: 0,
	startDate: "",
	specialNotes: "",
	mediaApproach: "",
	category: "",
	brand: "",
	targetAud: "",
	campObj: "",
	brandLogo: null,
};

const DateInput = forwardRef(({ value, onClick }, ref) => (
	<TextField value={value} onClick={onClick} ref={ref} />
));

const BriefForm = ({
	onSubmit,
	initialBudgetState,
	initialFormState,
	submitButtonText = "Create",
}) => {
	const navigate = useNavigate();

	const [budgets, setbudgets] = useState(initialBudgetState);
	const [isLoading, setisLoading] = useState(false);
	const [formState, setformState] = useState(initialFormState);
	const [focusedBudgetErrorField, setFocusedBudgetErrorField] = useState({
		index: 0,
		msg: "",
		field: "",
	});

	const onDrop = useCallback((acceptedFiles) => {
		const file = acceptedFiles[0];

		if (!file) {
			return;
		}

		const reader = new FileReader();

		reader.onload = (e) => {
			setformState((prev) => ({
				...prev,
				brandLogo: file,
				previewSrc: e.target.result,
			}));
		};

		reader.readAsDataURL(file);
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		maxFiles: 1,
		accept: {
			"image/*": [".jpg", ".png", ".jpeg"],
		},
	});

	const totalBudgets = budgets.reduce(
		(acc, obj) => {
			const currentZoneTotal = parseFloat(acc[obj.zone.label]);
			const budget = parseFloat(obj.budget);

			if (!isNaN(budget) && !isNaN(currentZoneTotal)) {
				acc[obj.zone.label] = currentZoneTotal + budget;
			}

			return acc;
		},
		{
			North: 0,
			South: 0,
			West: 0,
			East: 0,
			"North East": 0,
		}
	);

	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;

		setformState((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const addBudget = () => {
		setbudgets((prev) => [...prev, { ...defaultBudget, id: prev.length + 1 }]);
	};

	const removeBudget = (id) => {
		setbudgets((prev) => prev.filter((v) => v.id !== id));
	};

	const setDate = (v) => {
		setformState((prev) => ({
			...prev,
			startDate: v,
		}));
	};

	const handleBudgetAreaChange = (index, val) => {
		setbudgets((prev) => {
			const newData = [...prev];
			newData[index] = {
				...newData[index],
				...val,
			};
			return newData;
		});

		setFocusedBudgetErrorField({});
	};

	const handleBudgetChange = (index, e) => {
		const value = e.target.value?.trim();
		setbudgets((prev) => {
			const newData = [...prev];
			newData[index] = {
				...newData[index],
				budget: value,
			};
			return newData;
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		for (let budgetIndex in budgets) {
			budgetIndex = parseInt(budgetIndex);
			const budget = budgets[budgetIndex];
			let msg = "";

			if (!budget.zone.id) {
				msg = "Please select zone!";
				toast.error(msg);
				setFocusedBudgetErrorField({ index: budgetIndex, msg, field: "zone" });
				return;
			}
			if (!budget.state.id) {
				msg = "Please select State!";
				toast.error(msg);
				setFocusedBudgetErrorField({ index: budgetIndex, msg, field: "state" });
				return;
			}
			if (!budget.city.id) {
				msg = "Please select City!";
				toast.error(msg);
				setFocusedBudgetErrorField({ index: budgetIndex, msg, field: "city" });
				return;
			}

			if (budget.budget < 1000) {
				msg = "Invalid budget!";
				toast.error(msg);
				setFocusedBudgetErrorField({ index: budgetIndex, msg, field: "city" });
				return;
			}
		}

		if (formState.isImmediate && !formState.startDate) {
			toast.error("Please select campaign start date!");
			return;
		}

		if (!formState.brandLogo) {
			toast.error("Please select brand logo!");
			return;
		}

		// Prepare data
		const fd = new FormData();

		fd.append("category", formState.category?.trim());
		fd.append("brand_name", formState.brand?.trim());
		fd.append("target_aud", formState.targetAud?.trim());
		fd.append("camp_obj", formState.campObj?.trim());
		fd.append("med_app", formState.mediaApproach?.trim());
		fd.append("is_immediate_camp", formState.isImmediate);
		fd.append("brand_logo", formState.brandLogo);

		if (formState.startDate) {
			fd.append("start_date", formState.startDate.toISOString().split("T")[0]);
		}

		if (formState.specialNotes) {
			fd.append("notes", formState.specialNotes);
		}

		fd.append(
			`budgets`,
			JSON.stringify(
				budgets.map((item) => ({
					zone_id: item.zone.zone_id,
					state_id: item.state.state_id,
					city_id: item.city.city_id,
					budget: item.budget,
				}))
			)
		);

		setisLoading(true);

		onSubmit(fd).finally(() => {
			setisLoading(false);
		});
	};

	useEffect(() => {
		setbudgets(initialBudgetState);
		setformState(initialFormState);
	}, [initialBudgetState, initialFormState]);

	return (
		<Stack justifyContent={"center"} alignItems={"center"}>
			<Box width={"80%"}>
				<Paper>
					<form onSubmit={handleSubmit}>
						<Box padding={"2rem"}>
							<Stack gap={2}>
								<Box width={"100%"}>
									<SectionTitle>Brief Info</SectionTitle>
									<SectionContainer width="100%">
										{/* Category and Brand */}
										<Grid spacing={3} container mb={2}>
											<Grid md={6} item>
												<FormControl fullWidth>
													<FormLabel htmlFor="category">Category:</FormLabel>
													<TextField
														name="category"
														onChange={handleChange}
														value={formState.category}
														size="small"
														id="category"
														required
													/>
												</FormControl>
											</Grid>
											<Grid md={6} item>
												<FormControl fullWidth>
													<FormLabel htmlFor="brand">Brand:</FormLabel>
													<TextField
														size="small"
														id="brand"
														name="brand"
														value={formState.brand}
														onChange={handleChange}
														required
													/>
												</FormControl>
											</Grid>
										</Grid>

										{/* Target Audience and Campaign Objective*/}
										<Grid spacing={3} container>
											<Grid md={6} item>
												<FormControl fullWidth>
													<FormLabel htmlFor="target-audience">
														Target Audience:
													</FormLabel>
													<TextField
														size="small"
														id="target-audience"
														name="targetAud"
														value={formState.targetAud}
														onChange={handleChange}
														required
													/>
												</FormControl>
											</Grid>
											<Grid md={6} item>
												<FormControl fullWidth>
													<FormLabel htmlFor="campaign-objecttive">
														Campaign Objective:
													</FormLabel>
													<TextField
														size="small"
														id="campaign-objecttive"
														name="campObj"
														value={formState.campObj}
														onChange={handleChange}
														required
													/>
												</FormControl>
											</Grid>
										</Grid>

										<Box mt={3}>
											<div
												style={{
													border: "1px dashed #333",
													padding: "20px",
													borderRadius: "15px",
												}}
												{...getRootProps()}>
												<input {...getInputProps()} />
												{isDragActive ? (
													<p>Drop the brand logo here ...</p>
												) : (
													<div>
														{formState.previewSrc ? (
															<img
																width={150}
																height={100}
																alt="preview"
																src={formState.previewSrc}
															/>
														) : (
															"Drag and drop brand logo here"
														)}
													</div>
												)}
											</div>
										</Box>
									</SectionContainer>
								</Box>
								{/* Budget */}
								<Box width={"100%"}>
									<SectionTitle>Budget Details</SectionTitle>
									<SectionContainer>
										<Stack gap={2}>
											{budgets.map((v, i) => {
												const budgetVal = budgets[i].budget;

												return (
													<Grid key={v.id} spacing={1} container>
														<Grid md={8} item>
															<AreaSelector
																onChange={handleBudgetAreaChange.bind(this, i)}
																layoutDirection="row"
																defaultCityValue={budgets[i].city}
																defaultStateValue={budgets[i].state}
																defaultZoneValue={budgets[i].zone}
															/>
															{focusedBudgetErrorField.index === i ? (
																<Typography color="error">
																	{focusedBudgetErrorField.msg}
																</Typography>
															) : null}
														</Grid>
														<Grid md={3} item>
															<TextField
																id="budget"
																label="Budget"
																size="small"
																value={budgetVal}
																type="number"
																inputProps={{
																	min: 1000,
																}}
																onChange={handleBudgetChange.bind(this, i)}
																required
															/>
														</Grid>
														{i !== 0 ? (
															<Grid md={1} item>
																<IconButton
																	size="small"
																	sx={{ border: "1px solid grey" }}
																	onClick={removeBudget.bind(this, v.id)}
																	aria-label="delete">
																	<RemoveIcon />
																</IconButton>
															</Grid>
														) : null}
													</Grid>
												);
											})}
										</Stack>
									</SectionContainer>
									<Stack mt={2} direction={"row"} justifyContent={"flex-end"}>
										<CustomButton
											startIcon={<AddIcon />}
											size="small"
											variant="contained"
											onClick={addBudget}
											disableElevation>
											Add More Budget
										</CustomButton>
									</Stack>
									<Box padding={2}>
										<Typography variant="h6" mb={1}>
											Total Budget (Zone Wise)
										</Typography>
										<Stack
											flexWrap={"wrap"}
											gap={1}
											// direction={"row"}
											justifyContent={"space-between"}
											// alignItems={"center"}
											width={"100%"}>
											{Object.entries(totalBudgets).map(([key, value]) => {
												return (
													<Stack
														flex={1}
														key={key}
														direction={"row"}
														gap={1}
														alignItems={"center"}>
														<Typography>{key}: </Typography>
														<Typography fontWeight={600}>
															&#x20B9;{value}
														</Typography>
													</Stack>
												);
											})}
										</Stack>
									</Box>
								</Box>

								<Box width={"100%"}>
									<SectionTitle>Other Info</SectionTitle>

									<SectionContainer>
										<Stack gap={2} alignItems={"center"} width={"100%"}>
											<FormControl fullWidth>
												<FormLabel id="immediate-campaign">
													Media Approach
												</FormLabel>
												<TextField
													size="small"
													name="mediaApproach"
													value={formState.mediaApproach}
													onChange={handleChange}
													multiline
													required
												/>
											</FormControl>
											<FormControl fullWidth>
												<FormLabel id="immediate-campaign">
													Immediate Campaign
												</FormLabel>
												<Select
													size="small"
													labelId="immediate-campaign"
													name="isImmediate"
													value={formState.isImmediate}
													onChange={handleChange}>
													<MenuItem value={1}>Yes</MenuItem>
													<MenuItem value={0}>No</MenuItem>
												</Select>
											</FormControl>

											{formState.isImmediate ? (
												<Box width={"100%"}>
													<LocalizationProvider dateAdapter={AdapterMoment}>
														<Typography>Select Campaign Start Date</Typography>
														<DatePicker
															dateFormat={"YYYY/MM/dd"}
															showIcon
															selected={formState.startDate}
															onChange={setDate}
															customInput={<DateInput />}
														/>
													</LocalizationProvider>
												</Box>
											) : null}

											<FormControl fullWidth>
												<FormLabel>Special Notes</FormLabel>
												<TextField
													size="small"
													name="specialNotes"
													value={formState.specialNotes}
													onChange={handleChange}
													multiline
												/>
											</FormControl>
										</Stack>
									</SectionContainer>
								</Box>
								<Stack
									width={"100%"}
									direction={"row"}
									justifyContent={"flex-end"}>
									<CustomButton
										size="large"
										type="submit"
										isLoading={isLoading}>
										{submitButtonText}
									</CustomButton>
								</Stack>
							</Stack>
						</Box>
					</form>
				</Paper>
			</Box>
		</Stack>
	);
};

export default BriefForm;

function SectionTitle({ children }) {
	return (
		<Box
			padding={1}
			sx={{
				backgroundColor: "#f5ddba",
			}}
			width={"100%"}>
			<Typography variant="body" mb={1}>
				{children}
			</Typography>
		</Box>
	);
}

function SectionContainer(params) {
	return <Box padding={3} {...params} />;
}

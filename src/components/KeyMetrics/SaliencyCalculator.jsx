import React, { useState, useEffect } from "react";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import IconButton from "@mui/material/IconButton";

import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

import AreaSelector from "../AreaSelector";
import CustomButton from "../CustomButton";

import colors from "../../constants/colors";
import { APIerrorMessageHandler } from "../../utils/helper.utils";
import { calculateSaliencyAPI } from "../../apis/metrics.apis";
import { toast } from "react-toastify";

const parameters = [
	{
		label: "Distance To Center",
		key: "distance_to_center",
	},
	{
		label: "Average Areas",
		key: "average_areas",
	},
	{
		label: "Focal Vision Duration",
		key: "focal_vision_duration",
	},
	{
		label: "Near Peripheral Vision Duration",
		key: "near_p_duration",
	},
	{
		label: "Mid Peripheral Vision Duration",
		key: "mid_p_duration",
	},
	{
		label: "Far Peripheral Vision Duration",
		key: "far_p_duration",
	},
	{
		label: "Speed",
		key: "average_speed",
	},
	{
		label: "Saliency",
		key: "saliency",
	},
];

function reduceParams(acc, v) {
	acc[v.key] = parseFloat(v.weightings);

	return acc;
}

const SaliencyCalculator = ({ setisLoading }) => {
	const [selectedLevel, setselectedLevel] = useState("city");

	const [selectedArea, setSelectedArea] = useState({});
	const [frontViewParams, setFrontViewParams] = useState([]);
	const [rearViewParams, setrearViewParams] = useState([]);

	const handleChange = (v) => {
		setselectedLevel((prev) => {
			if (prev === v) {
				return "";
			} else {
				return v;
			}
		});
	};

	const handleAreaChange = (v) => {
		setSelectedArea(v);
	};

	const handleFrontParamsChange = (params) => {
		setFrontViewParams(params);
	};

	const handleRearParamsChange = (params) => {
		setrearViewParams(params);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!selectedArea?.city?.id) {
			alert("select the zone, state and city");
			return;
		}

		if (!selectedLevel) {
			alert("select the levels, location level or city level.");
			return;
		}

		setisLoading(true);

		const body = {
			zone_id: selectedArea.zone.id,
			state_id: selectedArea.state.id,
			city_id: selectedArea.city.id,
			level: selectedLevel,
			front_weightings: frontViewParams.reduce(reduceParams, {}),
			rear_weightings: rearViewParams.reduce(reduceParams, {}),
		};

		try {
			await calculateSaliencyAPI(body);

			toast.success("Saliency set successfully!");
		} catch (error) {
			APIerrorMessageHandler(error);
		} finally {
			setisLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<Grid container>
				<Grid sm={4} item>
					<Typography mb={2}>Market Selection</Typography>
					<AreaSelector onChange={handleAreaChange} />
					<Stack mt={3} direction={"row"} gap={2}>
						<FormControlLabel
							checked={selectedLevel === "city"}
							control={<Checkbox />}
							onChange={handleChange.bind(this, "city")}
							label="City Level"
						/>
						<FormControlLabel
							checked={selectedLevel === "location"}
							control={<Checkbox />}
							label="Location Level"
							onChange={handleChange.bind(this, "location")}
						/>
					</Stack>
				</Grid>
				<Grid sm={4} item>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Front View Weightings</TableCell>
								<TableCell>Add Weightings</TableCell>
							</TableRow>
						</TableHead>
						<ParameterSelectionBody onChange={handleFrontParamsChange} />
					</Table>
				</Grid>
				<Grid sm={4} item>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Rear View Weightings</TableCell>
								<TableCell>Add Weightings</TableCell>
							</TableRow>
						</TableHead>
						<ParameterSelectionBody onChange={handleRearParamsChange} />
					</Table>
				</Grid>
			</Grid>
			<Stack direction={"row"} justifyContent={"center"} alignItems={"center"}>
				<CustomButton type="submit" sx={{ minWidth: "200px" }}>
					Calculate
				</CustomButton>
			</Stack>
		</form>
	);
};

export default SaliencyCalculator;

function ParameterSelectionBody({ onChange }) {
	const [params, setparams] = useState([]);

	const addParams = () => {
		setparams((prev) => {
			return [
				...prev,
				{
					key: "",
					weightings: "",
				},
			];
		});
	};

	const removeParams = (index) => {
		setparams((prev) => {
			return prev.filter((v, i) => {
				return i !== index;
			});
		});
	};

	const handleChange = (i, key, e) => {
		const value = e.target.value;

		setparams((v) => {
			const d = [...v];

			d[i] = { ...d[i], [key]: value.trim() };

			return d;
		});
	};

	useEffect(() => {
		onChange?.(params);
	}, [onChange, params]);

	return (
		<>
			<TableBody>
				{params.map((v, i) => {
					return (
						<TableRow>
							<TableCell>
								<FormControl size="small" sx={{ maxWidth: "100px" }} fullWidth>
									<InputLabel id="select-param">Select Parameter</InputLabel>
									<Select
										labelId="select-param"
										id="select-parameter"
										value={params[i].key}
										onChange={handleChange.bind(this, i, "key")}
										label="Select Parameter">
										{parameters.map((v) => (
											<MenuItem key={v.key} value={v.key}>
												{v.label}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</TableCell>
							<TableCell>
								<TextField
									placeholder="Add Weightings"
									size="small"
									type="number"
									value={params[i].weightings}
									onChange={handleChange.bind(this, i, "weightings")}
									sx={{ backgroundColor: "white" }}
								/>
							</TableCell>
							<TableCell>
								<IconButton
									size="small"
									sx={{ backgroundColor: colors.PRIMARY }}
									onClick={removeParams.bind(this, i)}>
									<RemoveIcon />
								</IconButton>
							</TableCell>
						</TableRow>
					);
				})}
				<TableRow>
					<TableCell></TableCell>
					<TableCell></TableCell>
					<TableCell>
						<IconButton
							size="small"
							sx={{ backgroundColor: colors.PRIMARY }}
							onClick={addParams}>
							<AddIcon />
						</IconButton>
					</TableCell>
				</TableRow>
			</TableBody>
		</>
	);
}

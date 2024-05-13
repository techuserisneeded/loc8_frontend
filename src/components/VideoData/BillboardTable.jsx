import React, { useState } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";

import Loader from "../Loader";

import { mergeBillboardsAPI } from "../../apis/videos.apis";
import { Button } from "@mui/material";
import { toast } from "react-toastify";

export default function BillboardTable({ data, onMerge, disableMerge }) {
	const [selectedBills, setSelectedBills] = useState([]);
	const [isLoading, setisLoading] = useState(false);

	const isChecked = (id) => selectedBills.includes(id);

	const handleCheckboxChange = (id) => {
		if (selectedBills.includes(id)) {
			setSelectedBills((prev) => {
				return prev.filter((preId) => preId !== id);
			});

			return;
		}

		setSelectedBills((prev) => [...prev, id]);
	};

	const handleSelectAll = (e) => {
		const isChecked = e.target.checked;
		setSelectedBills(isChecked ? data.map((v) => v.id) : []);
	};

	const handleMerge = () => {
		if (!window.confirm("Are you sure you want to merge?!")) {
			return;
		}

		setisLoading(true);
		mergeBillboardsAPI(selectedBills)
			.then((v) => {
				toast.success("Merge Successfull!!");
				onMerge?.();
				setSelectedBills([]);
			})
			.catch((e) => {
				console.log(e);
				toast.error("Something went wrong!");
			})
			.finally((v) => {
				setisLoading(false);
			});
	};

	return (
		<TableContainer component={Paper}>
			{!disableMerge ? (
				<Button
					variant="contained"
					size="small"
					disableElevation
					sx={{ margin: "15px" }}
					onClick={handleMerge}
					disabled={selectedBills.length < 2}>
					Merge Selected
				</Button>
			) : null}
			<Table size="small">
				<TableHead>
					<TableRow>
						{!disableMerge ? (
							<TableCell>
								<Checkbox
									size="small"
									onChange={handleSelectAll}
									checked={selectedBills.length === data.length}
								/>
							</TableCell>
						) : null}
						<TableCell>Billboard ID</TableCell>
						<TableCell align="right">Tracker ID</TableCell>
						<TableCell align="right">Average Areas</TableCell>
						<TableCell align="right">Visibility Duration</TableCell>
						<TableCell align="right">Central Distance</TableCell>
						<TableCell align="right">Distance To Center</TableCell>
						<TableCell align="right">Confidence</TableCell>
						<TableCell align="right">Far P Distance</TableCell>
						<TableCell align="right">Far P Duration</TableCell>
						<TableCell align="right">Mid P Distance</TableCell>
						<TableCell align="right">Mid P Duration</TableCell>
						<TableCell align="right">Near P Distance</TableCell>
						<TableCell align="right">Near P Duration</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{data.map((row) => (
						<TableRow
							key={row.id}
							sx={{
								"&:last-child td, &:last-child th": { border: 0 },
								backgroundColor: isChecked(row.id) ? "#fff59d" : "",
							}}>
							{!disableMerge ? (
								<TableCell>
									<Checkbox
										size="small"
										onChange={handleCheckboxChange.bind(this, row.id)}
										checked={isChecked(row.id)}
									/>
								</TableCell>
							) : null}
							<TableCell component="th" scope="row">
								{row.id}
							</TableCell>
							<TableCell align="right">{row.tracker_id}</TableCell>
							<TableCell align="right">{row.average_areas}</TableCell>
							<TableCell align="right">{row.visibility_duration}</TableCell>
							<TableCell align="right">{row.central_distance}</TableCell>
							<TableCell align="right">{row.distance_to_center}</TableCell>
							<TableCell align="right">{row.confidence}</TableCell>
							<TableCell align="right">{row.far_p_distance}</TableCell>
							<TableCell align="right">{row.far_p_duration}</TableCell>
							<TableCell align="right">{row.mid_p_distance}</TableCell>
							<TableCell align="right">{row.mid_p_duration}</TableCell>
							<TableCell align="right">{row.near_p_distance}</TableCell>
							<TableCell align="right">{row.near_p_duration}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<Loader open={isLoading} />
		</TableContainer>
	);
}

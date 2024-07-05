import React, { useState } from "react";
import { toast } from "react-toastify";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import { Stack } from "@mui/material";

import CustomButton from "./CustomButton";
import ModalContainer from "./ModalContainer";

import { mergeBillboardsAPI } from "../apis/videos.apis";

const MergeDialog = ({ open, onClose, rows = [], onMerge }) => {
	const [selectedId, setSelectedId] = useState(null);
	const [isLoading, setisLoading] = useState(false);

	const handleCheck = (v) => {
		setSelectedId(v);
	};

	const handleMerge = () => {
		if (!selectedId) {
			alert("Please select a row.");
			return;
		}

		const doAllHaveSameVideoId = rows.every(
			(v) => v.video_id === rows[0].video_id
		);

		if (!doAllHaveSameVideoId) {
			alert(
				"Some of your assets have different video id, in order to merge the assets, all the asset must belong to the same video."
			);
			return;
		}

		if (!window.confirm("Are you sure you want to merge?!")) {
			return;
		}

		setisLoading(true);

		mergeBillboardsAPI(
			rows.map((v) => v.id),
			selectedId
		)
			.then((v) => {
				toast.success("Merge Successfull!!");
				onMerge();
				onClose();
			})
			.catch((e) => {
				toast.error("Something went wrong!");
			})
			.finally((v) => {
				setisLoading(false);
			});
	};

	return (
		<ModalContainer
			title={
				"Select one row which you want to keep after all the features are merged."
			}
			width={"xl"}
			open={open}>
			<TableContainer component={Paper}>
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell>Select</TableCell>
							<TableCell>Vendor Name</TableCell>
							<TableCell>Location</TableCell>
							<TableCell>Media Type</TableCell>
							<TableCell>Illumination</TableCell>
							<TableCell>Area</TableCell>
							<TableCell>Cost Of Duration</TableCell>
							<TableCell>Total Cost</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{rows
							? rows.map((row) => (
									<TableRow
										key={row.id}
										sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
										<TableCell>
											<Checkbox
												size="small"
												onChange={handleCheck.bind(this, row.id)}
												checked={selectedId === row.id}
											/>
										</TableCell>
										<TableCell component="th" scope="row">
											{row.vendor_name}
										</TableCell>
										<TableCell component="th" scope="row">
											{row.location}
										</TableCell>
										<TableCell>{row.media_type}</TableCell>
										<TableCell>{row.illumination}</TableCell>
										<TableCell>{row.area}</TableCell>
										<TableCell>{row.cost_for_duration}</TableCell>
										<TableCell>{row.total_cost}</TableCell>
									</TableRow>
							  ))
							: null}
					</TableBody>
				</Table>
			</TableContainer>
			<Stack mt={2} gap={2} direction={"row"} justifyContent={"flex-end"}>
				<CustomButton onClick={handleMerge} disabled={isLoading}>
					{isLoading ? "Merging..." : "Merge"}
				</CustomButton>
				<CustomButton color="info" onClick={onClose}>
					Close
				</CustomButton>
			</Stack>
		</ModalContainer>
	);
};

export default MergeDialog;

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
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";

import Loader from "../../components/Loader";
import MergeDialog from "../../components/MergeDialog";

import { deleteBillboardsAPI, deleteVideosAPI } from "../../apis/videos.apis";
import { Button, IconButton } from "@mui/material";

export default function BillboardTable({
	data,
	onMerge,
	videoId,
	isAuthorized,
	onAddAssetInfo,
	onMergeSuccess,
}) {
	const [selectedBills, setSelectedBills] = useState([]);
	const [isLoading, setisLoading] = useState(false);
	const [mergeSate, setMergeSate] = useState({
		isOpen: false,
		rows: [],
	});

	const isChecked = (id) => selectedBills.findIndex((v) => v.id === id) > -1;

	const handleCheckboxChange = (row) => {
		const isBillAlreadyPresent =
			selectedBills.findIndex((v) => v.id === row.id) > -1;

		if (isBillAlreadyPresent) {
			setSelectedBills((prev) => {
				return prev.filter((b) => b.id !== row.id);
			});

			return;
		}

		setSelectedBills((prev) => [...prev, row]);
	};

	const handleSelectAll = (e) => {
		const isChecked = e.target.checked;
		setSelectedBills(isChecked ? data.map((v) => v) : []);
	};

	const handleDelete = () => {
		if (
			!window.confirm(
				"Are you sure you want to delete the selected billboards?"
			)
		) {
			return;
		}

		setisLoading(true);
		deleteBillboardsAPI(selectedBills)
			.then((v) => {
				toast.success("selected billboards deleted Successfully!!");
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

	const handleDiscardVideo = () => {
		if (
			!window.confirm(
				"Are you sure you want to delete this video and its associated data? \nThis action is irreversible."
			)
		) {
			return;
		}

		setisLoading(true);
		deleteVideosAPI(videoId)
			.then((v) => {
				toast.success("Video discarded Successfully!!");
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

	const openMergeDialog = () => {
		setMergeSate({
			isOpen: true,
			rows: selectedBills,
		});
	};

	const handleMergeDialogClose = () => {
		setMergeSate({
			isOpen: false,
			rows: [],
		});

		setSelectedBills([]);
	};

	const handleMergeSucess = () => {
		onMergeSuccess?.();
	};

	return (
		<TableContainer component={Paper}>
			{isAuthorized ? (
				<>
					<Button
						variant="contained"
						size="small"
						disableElevation
						sx={{ margin: "15px" }}
						onClick={openMergeDialog}
						disabled={selectedBills.length < 2}>
						Merge Selected
					</Button>
					<Button
						variant="contained"
						size="small"
						disableElevation
						sx={{ margin: "15px" }}
						onClick={handleDelete}
						disabled={selectedBills.length < 1}>
						Delete Selected
					</Button>
					<Button
						variant="contained"
						size="small"
						disableElevation
						sx={{ margin: "15px", backgroundColor: "red", color: "white" }}
						onClick={handleDiscardVideo}>
						Discard Video
					</Button>
				</>
			) : null}
			<Table size="small">
				<TableHead>
					<TableRow>
						<TableCell>
							<Checkbox
								size="small"
								onChange={handleSelectAll}
								checked={selectedBills.length === data.length}
							/>
						</TableCell>
						<TableCell>Asset ID</TableCell>
						<TableCell>Asset Info</TableCell>
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
							<TableCell>
								<Checkbox
									size="small"
									onChange={handleCheckboxChange.bind(this, row)}
									checked={isChecked(row.id)}
								/>
							</TableCell>
							<TableCell component="th" scope="row">
								{row.id}
							</TableCell>
							<TableCell component="th" scope="row">
								<IconButton
									onClick={onAddAssetInfo.bind(this, row)}
									size="small"
									sx={{
										border: "1px solid #555",
									}}>
									<PlaylistAddIcon />
								</IconButton>
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
			<MergeDialog
				open={mergeSate.isOpen}
				rows={mergeSate.rows}
				onClose={handleMergeDialogClose}
				onMerge={handleMergeSucess}
			/>
			<Loader open={isLoading} />
		</TableContainer>
	);
}

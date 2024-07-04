import React, { useState } from "react";
import { toast } from "react-toastify";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import ClearIcon from "@mui/icons-material/Clear";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import Loader from "../../../components/Loader";

import { deletePlanById } from "../../../apis/plans.apis";

function TableHeadCell(params) {
	return <TableCell sx={{ fontWeight: "600" }} {...params} />;
}
const handleClick = (e) => {
	alert("Clicked");
};

const QuickViewTable = ({ rows = [], onRemovedPlan }) => {
	const [isLoading, setisLoading] = useState(false);

	const handleDeletePlan = (plan_id) => {
		if (!window.confirm("Are you sure you want to delete?")) {
			return;
		}

		setisLoading(true);

		deletePlanById(plan_id)
			.then((v) => {
				onRemovedPlan();
				toast.success("Plan removed!");
			})
			.catch((e) => {
				toast.error("Failed to delete the plan!");
			})
			.finally((e) => {
				setisLoading(false);
			});
	};

	return (
		<Box>
			<TableContainer component={Paper}>
				<Table sx={{ width: "100%" }}>
					<TableHead>
						<TableRow>
							<TableHeadCell>Remove</TableHeadCell>
							<TableHeadCell>Sr</TableHeadCell>
							<TableHeadCell>Location</TableHeadCell>
							<TableHeadCell align="right">Size</TableHeadCell>
							<TableHeadCell align="center">Cost</TableHeadCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{rows?.map((row, i) => {
							return (
								<TableRow
									key={row.plan_id}
									sx={{
										"&:last-child td, &:last-child th": {
											border: 0,
										},
									}}>
									<TableCell align="right">
										<IconButton
											size="small"
											onClick={handleDeletePlan.bind(this, row.plan_id)}
											sx={{ backgroundColor: "red", borderRadius: "6px" }}>
											<DeleteIcon fontSize="12" sx={{ color: "white" }} />
										</IconButton>
									</TableCell>
									<TableCell align="right">{row.sr_no}</TableCell>
									<TableCell align="right">{row.location}</TableCell>
									<TableCell align="center">
										{row.width}X{row.height}
									</TableCell>
									<TableCell align="right">{row.total_cost}</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
			<Loader open={isLoading} />
		</Box>
	);
};

export default QuickViewTable;

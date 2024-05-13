import React from "react";
import useSWR from "swr";
import moment from "moment";
import { Link } from "react-router-dom";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import SuperAdminLayout from "../../../layouts/SuperAdminLayout";
import Loader from "../../../components/Loader";

import { getPlannerBriefListAPI } from "../../../apis/briefs.apis";
import BriefStatusTag from "../../../components/BriefStatusTag";

function CountToolTip({ counts }) {
	return (
		<Tooltip title={counts.join(", ")} placement="right">
			<Typography
				sx={{
					textDecoration: "underline",
					cursor: "pointer",
					color: "blue",
				}}>
				{counts.length}
			</Typography>
		</Tooltip>
	);
}

function TableHeadCell(params) {
	return <TableCell sx={{ fontWeight: "600" }} {...params} />;
}

const BriefList = () => {
	const { data, error, isLoading } = useSWR(
		"/briefs/planner",
		getPlannerBriefListAPI
	);

	return (
		<SuperAdminLayout activeLink={"/"} containerComponent="box">
			<Box padding={"15px"}>
				<TableContainer component={Paper}>
					<Table sx={{ width: "100%" }}>
						<TableHead>
							<TableRow>
								<TableHeadCell>Brief ID</TableHeadCell>
								<TableHeadCell align="right">Creation Date</TableHeadCell>
								<TableHeadCell align="center">Category</TableHeadCell>
								<TableHeadCell align="right">Brands</TableHeadCell>
								<TableHeadCell align="right">Zone</TableHeadCell>
								<TableHeadCell align="right">Campaign Objective</TableHeadCell>
								<TableHeadCell align="right">State</TableHeadCell>
								<TableHeadCell align="right">City</TableHeadCell>
								<TableHeadCell align="right">Budget</TableHeadCell>
								<TableHeadCell align="right">Start Date</TableHeadCell>
								<TableHeadCell align="right">Brief Status</TableHeadCell>
								<TableHeadCell align="right">Actions</TableHeadCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{data?.map((row) => {
								const counts = row.budgets.reduce(
									(acc, cv) => {
										//count zone
										if (!acc.zones.includes(cv.zone_name)) {
											acc.zones.push(cv.zone_name);
										}

										//count state
										if (!acc.states.includes(cv.state_name)) {
											acc.states.push(cv.state_name);
										}

										//count zone
										if (!acc.cities.includes(cv.city_name)) {
											acc.cities.push(cv.city_name);
										}

										//count budget
										acc["budget"] =
											parseFloat(acc["budget"]) + parseFloat(cv.budget);

										return acc;
									},
									{
										zones: [],
										states: [],
										cities: [],
										budget: 0,
									}
								);

								return (
									<TableRow
										key={row.brief_id}
										sx={{
											"&:last-child td, &:last-child th": {
												border: 0,
											},
										}}>
										<TableCell align="right">{row.brief_id}</TableCell>
										<TableCell align="center">
											{moment(row.created_at).format("YYYY-MM-DD")}
										</TableCell>
										<TableCell align="right">{row.category}</TableCell>
										<TableCell align="right">{row.brand_name}</TableCell>
										<TableCell align="right">
											<CountToolTip counts={counts.zones} />
										</TableCell>
										<TableCell align="right">{row.campaign_obj}</TableCell>
										<TableCell align="right">
											<CountToolTip counts={counts.states} />
										</TableCell>
										<TableCell align="right">
											<CountToolTip counts={counts.cities} />
										</TableCell>
										<TableCell align="right">&#x20B9;{counts.budget}</TableCell>
										<TableCell align="right">
											{row.start_date
												? moment(row.start_date).format("YYYY-MM-DD")
												: "-"}
										</TableCell>
										<TableCell align="right">
											<BriefStatusTag statusId={row.status} />
										</TableCell>
										<TableCell align="right">
											<Typography
												component={Link}
												to={"briefs/" + row.brief_id}>
												View Details
											</Typography>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
			<Loader open={isLoading} />
		</SuperAdminLayout>
	);
};

export default BriefList;

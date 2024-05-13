import React, { useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";
import moment from "moment";
import { useNavigate } from "react-router-dom";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";

import SuperAdminLayout from "../../layouts/SuperAdminLayout";
import Loader from "../../components/Loader";

import {
	deleteBriefAPI,
	downloadPlan,
	getBriefListAPI,
	getPlansByBriefIdAPI,
} from "../../apis/briefs.apis";
import BriefStatusTag from "../../components/BriefStatusTag";
import roles from "../../constants/roles";
import useAuth from "../../hooks/useAuth";
import { mapPlanCSVDownload, convertToCSV } from "../../utils/helper.utils";

const ALLOWED_ROLES_TO_DOWNLOAD_BRIEF_PPT = [
	roles.SUPERADMIN,
	roles.CONTROLLER,
];

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
	const [isLoaderOpen, setisLoaderOpen] = useState(false);

	const navigate = useNavigate();
	const { data, error, isLoading, mutate } = useSWR(
		"/briefs/briefs",
		getBriefListAPI
	);

	const { role_id } = useAuth();

	const isAllowedToDownload =
		ALLOWED_ROLES_TO_DOWNLOAD_BRIEF_PPT.includes(role_id);

	const handleDelete = (brief_id) => {
		if (!window.confirm("Are you sure you want to delete this?")) {
			return;
		}

		setisLoaderOpen(true);
		deleteBriefAPI(brief_id)
			.then(() => {
				mutate();
				toast.success("Deleted successfully!");
			})
			.catch((e) => {
				let msg = "Something went wrong!";

				if (e.response && e.response?.data?.message) {
					msg = e.response?.data?.message;
				}

				toast.error(msg);
			})
			.finally(() => {
				setisLoaderOpen(false);
			});
	};

	const handleEdit = (brief_id) => {
		navigate("/edit-brief/" + brief_id);
	};

	const handleDownloadPlan = (brief_id) => {
		setisLoaderOpen(true);

		downloadPlan(brief_id)
			.then((v) => {})
			.catch((e) => {
				const msg = e?.response?.data?.message || "Something went wrong!";
				toast.error(msg);
			})
			.finally((v) => {
				setisLoaderOpen(false);
			});
	};

	const handleDownloadCSV = (brief_id) => {
		setisLoaderOpen(true);
		getPlansByBriefIdAPI(brief_id)
			.then((d) => {
				const mappedData = d.map(mapPlanCSVDownload("CONTROLLER"));
				convertToCSV(mappedData);
			})
			.catch((e) => {
				toast.error("something went wrong!");
			})
			.finally((v) => {
				setisLoaderOpen(false);
			});
	};

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
								<TableHeadCell align="right">Action</TableHeadCell>
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
											<Stack
												direction={"row"}
												alignItems={"center"}
												justifyContent={"flex-start"}
												gap={1}>
												<IconButton
													onClick={handleEdit.bind(this, row.brief_id)}
													sx={{ bgcolor: "green", color: "white" }}
													size="small">
													<ModeEditIcon fontSize="15" />
												</IconButton>
												<IconButton
													onClick={handleDelete.bind(this, row.brief_id)}
													sx={{ bgcolor: "red", color: "white" }}
													size="small">
													<DeleteIcon fontSize="15" />
												</IconButton>
												{isAllowedToDownload && row.status === 1 ? (
													<>
														<IconButton
															onClick={handleDownloadPlan.bind(
																this,
																row.brief_id
															)}
															size="small">
															<img
																src="/ppt.png"
																height={30}
																width={30}
																alt="ppt icon"
															/>
														</IconButton>
														<IconButton
															onClick={handleDownloadCSV.bind(
																this,
																row.brief_id
															)}
															size="small">
															<img
																src="/csv.png"
																height={30}
																width={30}
																alt="csv icon"
															/>
														</IconButton>
													</>
												) : (
													""
												)}
											</Stack>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
			<Loader open={isLoading || isLoaderOpen} />
		</SuperAdminLayout>
	);
};

export default BriefList;

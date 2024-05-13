import React from "react";
import useSWR from "swr";
import { Link, useParams } from "react-router-dom";
import {
	FormControl,
	Paper,
	Grid,
	Box,
	Stack,
	FormLabel,
	Typography,
	TableContainer,
	Table,
	TableCell,
	TableRow,
} from "@mui/material";

import SuperAdminLayout from "../../../layouts/SuperAdminLayout";
import Loader from "../../../components/Loader";
import CustomButton from "../../../components/CustomButton";

import { getPlannerBriefDetailsByBriefIdAPI } from "../../../apis/briefs.apis";

const BriefDetails = () => {
	const { brief_id } = useParams();

	const {
		data = {},
		isLoading,
		error,
	} = useSWR(
		brief_id ? "briefs/briefs/" + brief_id + "/planner" : null,
		getPlannerBriefDetailsByBriefIdAPI.bind(this, brief_id)
	);

	const totalBudgets =
		data?.budgets?.reduce(
			(acc, obj) => {
				const currentZoneTotal = parseFloat(acc[obj.zone_name]);
				const budget = parseFloat(obj.budget);

				if (!isNaN(budget) && !isNaN(currentZoneTotal)) {
					acc[obj.zone_name] = currentZoneTotal + budget;
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
		) || {};

	return (
		<SuperAdminLayout activeLink={"/"}>
			<Box>
				<Box width={"80%"}>
					<Paper>
						<Box padding={"2rem"}>
							<Stack gap={2}>
								<Box width={"100%"}>
									<SectionTitle>Brief Info</SectionTitle>
									<SectionContainer width="100%">
										{/* Category and Brand */}
										<Grid spacing={3} container mb={2}>
											<Grid md={6} item>
												<LabelValueDisplay
													label="Category"
													value={data.category}
												/>
											</Grid>
											<Grid md={6} item>
												<LabelValueDisplay
													label="Brand"
													value={data.brand_name}
												/>
											</Grid>
										</Grid>

										{/* Target Audience and Campaign Objective*/}
										<Grid spacing={3} container>
											<Grid md={6} item>
												<LabelValueDisplay
													label="Target Audience"
													value={data.target_audience}
												/>
											</Grid>
											<Grid md={6} item>
												<LabelValueDisplay
													label="Campaign Objective"
													value={data.campaign_obj}
												/>
											</Grid>
										</Grid>
									</SectionContainer>
								</Box>
								{/* Budget */}
								<Box width={"100%"}>
									<SectionTitle>Budget Details</SectionTitle>
									<SectionContainer>
										<TableContainer>
											<Table>
												{data?.budgets?.map((v, i) => {
													const budgetVal = v.budget;

													return (
														<TableRow>
															<TableCell>
																<Typography
																	variant="body2"
																	textTransform={"capitalize"}>
																	{v.zone_name}
																</Typography>
															</TableCell>
															<TableCell>
																<Typography
																	variant="body2"
																	textTransform={"capitalize"}>
																	{v.state_name}
																</Typography>
															</TableCell>
															<TableCell>
																<Typography
																	variant="body2"
																	textTransform={"capitalize"}>
																	{v.city_name}
																</Typography>
															</TableCell>
															<TableCell>&#8377;{budgetVal}</TableCell>
															<TableCell>
																<CustomButton
																	component={Link}
																	to={`/briefs/${v.budget_id}/start-planning`}>
																	Start Planning
																</CustomButton>
															</TableCell>
														</TableRow>
													);
												})}
											</Table>
										</TableContainer>
									</SectionContainer>
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
										<Stack gap={2} justifyContent={"center"} width={"100%"}>
											<LabelValueDisplay
												label="Media Approach"
												value={data.media_approach}
												direction="column"
												alignItems="flex-start"
											/>
											<LabelValueDisplay
												label="Immediate Campaign"
												value={data.isImmediate ? "Yes" : "No"}
											/>
											<LabelValueDisplay
												label="Start Date"
												value={data.start_date}
											/>
											<LabelValueDisplay
												label="Special Notes"
												value={data.notes}
												direction="column"
												alignItems="flex-start"
											/>
										</Stack>
									</SectionContainer>
								</Box>
							</Stack>
						</Box>
					</Paper>
				</Box>
			</Box>
			<Loader open={isLoading} />
		</SuperAdminLayout>
	);
};

export default BriefDetails;

function SectionContainer(params) {
	return <Box padding={3} {...params} />;
}

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

function LabelValueDisplay({
	label = "",
	value = "",
	direction = "row",
	...rest
}) {
	if (!value) {
		return null;
	}
	return (
		<Stack alignItems={"center"} gap={1} direction={direction} {...rest}>
			<Typography color={"grey"}>{label} : </Typography>
			<Typography textTransform={"capitalize"}>{value}</Typography>
		</Stack>
	);
}

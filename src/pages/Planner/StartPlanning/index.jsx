import React, { useState } from "react";
import useSWR from "swr";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { Stack, Grid, Paper, IconButton } from "@mui/material";

import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import DoneIcon from "@mui/icons-material/Done";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

import SuperAdminLayout from "../../../layouts/SuperAdminLayout";
import Loader from "../../../components/Loader";
import CustomButton from "../../../components/CustomButton";
import MapView from "./MapView";
import AddToPlan from "./AddToPlan";
import PlanList from "./PlanList";

import {
	getBudgetDetailsByBudgetIdAPI,
	finishPlanAPI,
} from "../../../apis/briefs.apis";
import {
	mapPlanCSVDownload,
	convertToCSV,
	getTotal,
} from "../../../utils/helper.utils";

const StartPlanning = () => {
	const { budget_id } = useParams();
	const [addToPlanState, setaddToPlanState] = useState({
		isOpen: false,
		video_id: null,
	});

	const [isLoaderOpen, setisLoaderOpen] = useState(false);

	const [isPlanListOpen, setIsPlanListOpen] = useState(false);

	const {
		data = {},
		isLoading,
		error,
		mutate,
	} = useSWR(
		budget_id ? "briefs/budgets/" + budget_id : null,
		getBudgetDetailsByBudgetIdAPI.bind(this, budget_id)
	);

	const handlePlanClose = () => {
		setaddToPlanState({
			isOpen: false,
			video_id: null,
		});
		mutate();
	};

	const handleViewPlan = () => {
		setIsPlanListOpen(true);
	};

	const handlePlanListClose = () => {
		setIsPlanListOpen(false);
		mutate();
	};

	const handleDownload = () => {
		if (data.plans) {
			const newData = data.plans.map(mapPlanCSVDownload("PLANNER"));
			convertToCSV(newData);
		}
	};

	const handleFinishPlan = () => {
		if (!window.confirm("Are you sure?")) {
			return;
		}

		setisLoaderOpen(true);
		finishPlanAPI(data.budget.budget_id, data.budget.brief_id)
			.then((v) => {
				mutate();
				toast.success("Plan is finished!");
			})
			.catch((e) => {
				const msg = e?.response?.data?.message || "Something went wrong!";
				toast.error(msg);
			})
			.finally((v) => {
				setisLoaderOpen(false);
			});
	};

	const openAddToPlan = (video_id, coords = []) => {
		if (data.videos) {
			setaddToPlanState({
				isOpen: true,
				video_id,
				brief_id: data.budget?.brief_id,
				budget_id: data.budget?.budget_id,
				coords,
			});
		} else {
			alert("No Videos Found");
		}
	};

	const totalAmount = data.plans ? getTotal(data.plans, "total") : 0;
	const totalCostForDuration = data.plans
		? getTotal(data.plans, "cost_for_duration")
		: 0;

	const totalPrintingCost = data.plans
		? getTotal(data.plans, "printing_cost")
		: 0;

	const totalMountingCost = data.plans
		? getTotal(data.plans, "mounting_cost")
		: 0;

	const totalImpressions = data.plans
		? getTotal(data.plans, "imp_per_month")
		: 0;

	const totalRentalCostMonth = data.plans
		? getTotal(data.plans, "rental_per_month")
		: 0;

	const totalUnits = data.plans ? getTotal(data.plans, "units") : 0;

	return (
		<SuperAdminLayout activeLink={"/"}>
			<Box>
				<Typography mb={2} variant={"h5"}>
					Start Planning
				</Typography>
				<Divider />
				<Stack direction={"row"} gap={3} mt={2}>
					<LabelValueDisplay label="Zone" value={data?.budget?.zone_name} />
					<LabelValueDisplay label="State" value={data?.budget?.state_name} />
					<LabelValueDisplay label="City" value={data?.budget?.city_name} />
					<LabelValueDisplay
						label="Budget"
						value={data.budget?.budget}
						isCurrency
					/>
					<CustomButton
						variant="outlined"
						onClick={handleViewPlan}
						endIcon={<KeyboardDoubleArrowRightIcon />}>
						View Plan
					</CustomButton>
					<CustomButton
						onClick={handleFinishPlan}
						endIcon={<DoneIcon />}
						disabled={data?.budget?.status === 2}>
						Finish Planning
					</CustomButton>
					<IconButton onClick={handleDownload} size="small">
						<CloudDownloadIcon color="primary" />
					</IconButton>
				</Stack>
			</Box>
			<Grid mt={2} spacing={2} container>
				<Grid md={8} item>
					<Box>
						<Paper>
							<MapView videos={data.videos || []} onAddToPlan={openAddToPlan} />
						</Paper>
					</Box>
				</Grid>
				<Grid md={4} item>
					<Stack gap={2}>
						<LabelValueDisplay value={totalUnits} label="Total Units" />
						<LabelValueDisplay
							value={totalRentalCostMonth}
							label="Total Display Cost Per Month"
							isCurrency
						/>
						<LabelValueDisplay
							value={totalCostForDuration}
							label="Total Display Cost For Duration"
							isCurrency
						/>
						<LabelValueDisplay
							value={totalPrintingCost}
							label="Total Printing Cost"
							isCurrency
						/>
						<LabelValueDisplay
							value={totalMountingCost}
							label="Total Mounting Cost"
							isCurrency
						/>
						<LabelValueDisplay
							value={totalAmount}
							label="Total Cost"
							isCurrency
						/>
						<LabelValueDisplay
							value={totalImpressions}
							label="Total Impressions"
						/>
					</Stack>
				</Grid>
			</Grid>
			<Loader open={isLoading || isLoaderOpen} />
			<AddToPlan
				open={addToPlanState.isOpen}
				videoId={addToPlanState.video_id}
				briefId={addToPlanState.brief_id}
				budgetId={addToPlanState.budget_id}
				initialCoords={addToPlanState.coords}
				onClose={handlePlanClose}
			/>
			<PlanList
				open={isPlanListOpen}
				data={data.plans}
				onClose={handlePlanListClose}
				disableDelete={data?.budget?.status === 2}
			/>
		</SuperAdminLayout>
	);
};

function LabelValueDisplay({
	label = "",
	value = "",
	direction = "row",
	isCurrency,
	...rest
}) {
	if (!value) {
		return null;
	}

	const newVal = isCurrency
		? new Intl.NumberFormat("en-IN", {
				style: "currency",
				currency: "INR",
		  }).format(value)
		: value;

	return (
		<Stack alignItems={"center"} gap={1} direction={direction} {...rest}>
			<Typography variant="body" color={"grey"}>
				{label} :{" "}
			</Typography>
			<Typography variant="body" textTransform={"capitalize"}>
				{newVal}
			</Typography>
		</Stack>
	);
}

export default StartPlanning;

import React, { useState } from "react";
import useSWR from "swr";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { styled } from "@mui/material/styles";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { Stack, Grid, Paper, IconButton } from "@mui/material";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import ClickAwayListener from "@mui/material/ClickAwayListener";

import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import DoneIcon from "@mui/icons-material/Done";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

import SuperAdminLayout from "../../../layouts/SuperAdminLayout";
import Loader from "../../../components/Loader";
import CustomButton from "../../../components/CustomButton";
import MapView from "./MapView";
import AddToPlan from "./AddToPlan";
import PlanList from "./PlanList";
import QuickViewTable from "./QuickViewTable";
import AddToWorkSpace from "./AddToWorkSpace";
import MediaFilters from "./MediaFilters";
import VideoDataFilters from "./VideoDataFilters";

import {
	getBudgetDetailsByBudgetIdAPI,
	finishPlanAPI,
} from "../../../apis/briefs.apis";

import { addAssetsToPlan } from "../../../apis/plans.apis";

import {
	mapPlanCSVDownload,
	convertToCSV,
	getTotal,
	APIerrorMessageHandler,
} from "../../../utils/helper.utils";

const StyledTooltip = styled(({ className, ...props }) => (
	<Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: "#fff",
		color: "rgba(0, 0, 0, 0.87)",
		maxWidth: "90%",
		fontSize: theme.typography.pxToRem(12),
		border: "1px solid #dadde9",
	},
}));

const StartPlanning = () => {
	const { budget_id } = useParams();
	const [addToPlanState, setaddToPlanState] = useState({
		isOpen: false,
		video_id: null,
	});

	const [addToWorkSpaceState, setaddToWorkSpaceState] = useState({
		isOpen: false,
		video_id: null,
	});

	const [isLoaderOpen, setisLoaderOpen] = useState(false);

	const [isPlanListOpen, setIsPlanListOpen] = useState(false);
	const [mediaFilterOpen, setmediaFilterOpen] = useState(false);
	const [videoDataFilterOpen, setvideoDataFilterOpen] = useState(false);

	const [mediaData, setMediaData] = useState([]);

	const [mediaFilter, setmediaFilter] = useState({
		visibility_duration_min: 0,
		visibility_duration_max: null,
	});
	const [videoFilter, setvideoFilter] = useState({
		average_speed_min: 0,
		average_speed_max: null,
	});

	const {
		data = {},
		isLoading,
		error,
		mutate,
	} = useSWR(
		budget_id
			? "briefs/budgets/" +
					budget_id +
					"?" +
					new URLSearchParams(Object.entries(videoFilter)).toString()
			: null,
		getBudgetDetailsByBudgetIdAPI.bind(this, budget_id, videoFilter)
	);

	// const mediaRespState = useSWR(
	// 	data?.budget ? "/plans/media" : null,
	// 	(filters = {}) => {
	// 		console.log({ filters });
	// 		return getMediaPlansAPI({
	// 			city_id: data?.budget?.city_id,
	// 			state_id: data?.budget?.state_id,
	// 			zone_id: data?.budget?.zone_id,
	// 		});
	// 	}
	// );

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

	const openAddToWorkSpace = (video_id) => {
		if (data.videos) {
			setaddToWorkSpaceState({
				isOpen: true,
				video_id,
			});
		} else {
			alert("No Videos Found");
		}
	};

	const handleOncloseWorkSpace = () => {
		setaddToWorkSpaceState({
			isOpen: false,
			video_id: null,
		});
	};

	const openFilter = () => {
		setmediaFilterOpen(true);
	};

	const handleFilterClose = () => {
		setmediaFilterOpen(false);
	};

	const openVideoFilter = () => {
		setvideoDataFilterOpen(true);
	};

	const handleVideoFilterClose = () => {
		setvideoDataFilterOpen(false);
	};

	const handleApplyVideoFilter = (filters) => {
		mutate(
			"briefs/budgets/" +
				budget_id +
				"?" +
				new URLSearchParams(Object.entries(filters)).toString(),
			getBudgetDetailsByBudgetIdAPI(budget_id, filters)
		);
	};

	const handleAddBulkMedia = async () => {
		try {
			setisLoaderOpen(true);

			await addAssetsToPlan({
				billboards: mediaData.map((v) => v.id),
				brief_id: data?.budget?.brief_id,
				budget_id,
			});

			mutate();

			toast.success("Added to plan!");
		} catch (error) {
			APIerrorMessageHandler(error);
		} finally {
			setisLoaderOpen(false);
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
					<LabelValueDisplay
						label="Zone"
						value={data?.budget?.zone_name}
						isStr
					/>
					<LabelValueDisplay
						label="State"
						value={data?.budget?.state_name}
						isStr
					/>
					<LabelValueDisplay
						label="City"
						value={data?.budget?.city_name}
						isStr
					/>
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
				<Stack
					mt={2}
					direction={"row"}
					width={"80%"}
					alignItems={"center"}
					gap={2}>
					<CustomButton
						variant="contained"
						size="small"
						disableElevation
						onClick={openFilter}>
						Media Data
					</CustomButton>

					<ClickAwayListener onClickAway={handleVideoFilterClose}>
						<div>
							<StyledTooltip
								placement="left-start"
								onClose={handleVideoFilterClose}
								open={videoDataFilterOpen}
								disableFocusListener
								disableHoverListener
								disableTouchListener
								title={
									<VideoDataFilters
										filters={videoFilter}
										setfilters={setvideoFilter}
										closeFilter={handleVideoFilterClose}
										onApply={handleApplyVideoFilter}
									/>
								}>
								<CustomButton
									variant="contained"
									size="small"
									disableElevation
									onClick={openVideoFilter}>
									Video Data
								</CustomButton>
							</StyledTooltip>
						</div>
					</ClickAwayListener>

					<CustomButton
						variant="contained"
						size="small"
						disableElevation
						sx={{ bgcolor: "green", color: "white" }}
						onClick={handleAddBulkMedia}
						disabled={!mediaData.length}>
						Add Bulk
					</CustomButton>
				</Stack>
			</Box>
			<Grid mt={2} spacing={2} container>
				<Grid md={4} item>
					<QuickViewTable onRemovedPlan={mutate} rows={data.plans} />
				</Grid>
				<Grid md={6} item>
					<Box>
						<Paper>
							<MapView
								videos={data.videos || []}
								onAddToPlan={openAddToPlan}
								onAddToWorkSpace={openAddToWorkSpace}
								billboards={mediaData}
								// billboards={mediaRespState.data}
								plans={data?.plans}
								refreshPlanData={mutate}
								budgetId={data?.budget?.budget_id}
								briefId={data?.budget?.brief_id}
							/>
						</Paper>
					</Box>
				</Grid>
				<Grid md={2} item>
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

			<MediaFilters
				open={mediaFilterOpen}
				setisLoaderOpen={setisLoaderOpen}
				setMediaData={setMediaData}
				plans={data?.plans}
				city_id={data?.budget?.city_id}
				state_id={data?.budget?.state_id}
				zone_id={data?.budget?.zone_id}
				filters={mediaFilter}
				setfilters={setmediaFilter}
				closeFilter={handleFilterClose}
			/>

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
			<AddToWorkSpace
				open={addToWorkSpaceState.isOpen}
				onClose={handleOncloseWorkSpace}
				videoId={addToWorkSpaceState.video_id}
				budgetId={data?.budget?.budget_id}
				briefId={data?.budget?.brief_id}
				onAddToPlan={mutate}
			/>
		</SuperAdminLayout>
	);
};

function LabelValueDisplay({
	label = "",
	value = "",
	direction = "row",
	isCurrency,
	isStr = false,
	...rest
}) {
	const v = !isStr ? (isNaN(value) ? 0 : value) : value;

	const newVal = isCurrency
		? new Intl.NumberFormat("en-IN", {
				style: "currency",
				currency: "INR",
		  }).format(v)
		: v;

	return (
		<Stack gap={1} direction={direction} {...rest}>
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

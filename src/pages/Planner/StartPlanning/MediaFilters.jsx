import React, { useState } from "react";
import { toast } from "react-toastify";

import Box from "@mui/material/Box";
import { Stack, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";

import DebouncedInput from "../../../components/DebouncedInput";
import CustomButton from "../../../components/CustomButton";

import { getMediaPlansAPI } from "../../../apis/plans.apis";
import MultiSearch from "./MultiSearch";


const MultiSearchfield = [
	{
		label: "Vendor Name",
		type: "text",
		keys: ["vendor_name"],
	},
	{
		label: "Location",
		type: "text",
		keys: ["location"],
	},
	{
		label: "Media Type",
		type: "text",
		keys: ["media_type"],
	},
	{
		label: "Illumination",
		type: "text",
		keys: ["illumination"],
	},
]

const filterFields = [
	{
		label: "Area Range",
		keys: ["area_min", "area_max"],
	},
	{
		label: "Display Cost Per Month Range",
		keys: ["display_cost_per_month_min", "display_cost_per_month_max"],
	},
	// {
	// 	label: "Total Cost Range",
	// 	keys: ["total_cost_min", "total_cost_max"],
	// },
	{
		label: "Visibility Duration",
		keys: ["visibility_duration_min", "visibility_duration_max"],
	},
	{
		label: "Average Speed Range",
		keys: ["average_speed_min", "average_speed_max"],
	},
	// {
	// 	label: "Front Saliency Score City",
	// 	keys: ["front_saliency_score_city_min", "front_saliency_score_city_max"],
	// },
	// {
	// 	label: "Rear Saliency Score City",
	// 	keys: ["rear_saliency_score_city_min", "rear_saliency_score_city_max"],
	// },
	// {
	// 	label: "Net Saliency Score City",
	// 	keys: ["net_saliency_score_city_min", "net_saliency_score_city_max"],
	// },
	// {
	// 	label: "Impressions",
	// 	keys: ["impressions_min", "impressions_max"],
	// },
	// {
	// 	label: "Effective Impressions",
	// 	keys: ["effective_impressions_min", "effective_impressions_max"],
	// },
	// {
	// 	label: "Efficiency",
	// 	keys: ["efficiency_min", "efficiency_max"],
	// },
	{
		label: "Top Area",
		keys: ["top_area"],
	},
	{
		label: "Top Display Cost Per Month",
		keys: ["top_display_cost_per_month"],
	},
	// {
	// 	label: "Top Total Cost",
	// 	keys: ["top_total_cost"],
	// },
	{
		label: "Top Visibility Duration",
		keys: ["top_visibility_duration"],
	},
	{
		label: "Top Front Saliency Citywise",
		keys: ["top_front_saliency_citywise"],
	},
	{
		label: "Top Rear Saliency Citywise",
		keys: ["top_rear_saliency_citywise"],
	},
	{
		label: "Top Net Saliency Citywise",
		keys: ["top_net_saliency_citywise"],
	},
	{
		label: "Top Front Saliency Location",
		keys: ["top_front_saliency_locationwise"],
	},
	{
		label: "Top Rear Saliency Location",
		keys: ["top_rear_saliency_locationwise"],
	},
	{
		label: "Top Net Saliency Location",
		keys: ["top_net_saliency_locationwise"],
	},
	{
		label: "Top Impressions",
		keys: ["top_impressions"],
	},
	{
		label: "Top Effective Impressions",
		keys: ["top_effective_impressions"],
	},
	{
		label: "Top Efficiency",
		keys: ["top_efficiency"],
	},
];

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});



const MediaFilters = ({
	city_id,
	state_id,
	zone_id,
	setisLoaderOpen,
	setMediaData,
	filters,
	plans = [],
	setfilters,
	closeFilter,
	open,
}) => {
	const handleClose = () => {
		closeFilter();
	};

	

	const handleChangeFilter = (key, value) => {
		setfilters((v) => {
			const f = { ...v };
			f[key] = value;
			return f;
		});
	};

	const handleClear = () => {
		setfilters({});
		setMediaData([]);
		setMultiSearchtext([
			[{value:""}],
		[{value:""}],
		[{value:""}],
		[{value:""}],
		])
		closeFilter();
	};

	const [MultiSearchtext, setMultiSearchtext] = useState([
		[{value:""}],
		[{value:""}],
		[{value:""}],
		[{value:""}],
	])

	const handleChildChange = (groupIndex, updatedFields) => {
		const newSearchGroups = [...MultiSearchtext];
		newSearchGroups[groupIndex] = updatedFields;
		setMultiSearchtext(newSearchGroups);
	  };

	const applyFilter = async () => {
		
		try {
			setisLoaderOpen(true);
			const data = await getMediaPlansAPI({
				city_id,
				state_id,
				zone_id,
				...filters,
				...MultiSearchtext,
			});

			const planData = plans?.filter((v) => v.latitude && v.longitude) || [];

			const billIdsInPlans = planData.map((v) => v.id);

			const bills =
				data?.filter(
					(v) => v.latitude && v.longitude && !billIdsInPlans.includes(v.id)
				) || [];

			setMediaData(bills);
			toast.success("Filtered Assets:" + bills.length);
			closeFilter();
		} catch (error) {
			console.log(error);
			toast.error("something went wrong!");
		} finally {
			setisLoaderOpen(false);
		}
	};

	return (
		<>
			<Dialog
				fullScreen
				open={open}
				onClose={handleClose}
				TransitionComponent={Transition}>
				<AppBar sx={{ position: "relative" }}>
					<Toolbar>
						<IconButton
							edge="start"
							color="inherit"
							onClick={handleClose}
							aria-label="close">
							<CloseIcon />
						</IconButton>
						<Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
							Media Filters
						</Typography>
					</Toolbar>
				</AppBar>
				<Box padding={1}>
				<Stack m={2} direction={"row"} flexWrap={"wrap"} gap={2}>
					{
						MultiSearchfield.map((v,index) => {
							return (
							<MultiSearch label={v.label} key={v.keys} searchFields={MultiSearchtext[index] }
							setSearchFields={(updatedFields) => handleChildChange(index, updatedFields)} />
							)
						}
					)}
				</Stack>
				</Box>
				<Box padding={1}>
					<Stack m={2} direction={"row"} flexWrap={"wrap"} gap={2}>
						{filterFields.map((v) => {
							const minKey = v.keys[0];
							const maxKey = v.keys[1];
							const input_type = v.type || "number";

							return (
								<Box key={v.label} flex={1} minWidth={"300px"}>
									<Typography>{v.label}</Typography>
									<Stack alignItems={"center"} direction={"row"}>
										<DebouncedInput
										    debounce = {3}
											type={input_type}
											placeholder={
												input_type === "text" ? "Search here..." : "Min"
											}
											value={filters[minKey]}
											onChange={handleChangeFilter.bind(this, minKey)}
										/>

										{maxKey ? (
											<DebouncedInput
											    debounce = {3}
												type={input_type}
												placeholder="Max"
												value={filters[maxKey]}
												onChange={handleChangeFilter.bind(this, maxKey)}
											/>
										) : null}
									</Stack>
								</Box>
							);
						})}
					</Stack>
					<Stack direction={"row"} spacing={2} mb={5} justifyContent={"center"}>
						<CustomButton
							size="large"
							sx={{ bgcolor: "blue", color: "white" }}
							onClick={handleClear}>
							Clear
						</CustomButton>
						<CustomButton size="large" onClick={applyFilter}>
							Apply
						</CustomButton>
					</Stack>
				</Box>
			</Dialog>
		</>
	);
};

export default MediaFilters;

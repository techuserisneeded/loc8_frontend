import React, { useState } from "react";
import Box from "@mui/material/Box";
import { Stack, Typography } from "@mui/material";
import { toast } from "react-toastify";

import DebouncedInput from "../../../components/DebouncedInput";
import CustomButton from "../../../components/CustomButton";

import { getMediaPlansAPI } from "../../../apis/plans.apis";

const filterFields = [
	{
		label: "Frame Size Range",
		keys: ["average_areas_min", "average_areas_max"],
	},
	{
		label: "Visibility Duration Range",
		keys: ["visibility_duration_min", "visibility_duration_max"],
	},
	{
		label: "Near Peripheral Duration Range",
		keys: ["near_p_duration_min", "near_p_duration_max"],
	},
	{
		label: "Mid Peripheral Duration Range",
		keys: ["mid_p_duration_min", "mid_p_duration_max"],
	},
	{
		label: "Far Peripheral Duration Range",
		keys: ["far_p_duration_min", "far_p_duration_max"],
	},
	{
		label: "Dsistance From Center Range",
		keys: ["distance_to_center_min", "distance_to_center_max"],
	},
	{
		label: "Near Peripheral Distance Range",
		keys: ["near_p_distance_min", "near_p_distance_max"],
	},
	{
		label: "Mid Peripheral Distance Range",
		keys: ["mid_p_distance_min", "mid_p_distance_max"],
	},
	{
		label: "Far Peripheral Distance Range",
		keys: ["far_p_distance_min", "far_p_distance_max"],
	},
	{
		label: "Average Speed Range",
		keys: ["average_speed_min", "average_speed_max"],
	},
	{
		label: "Length Of Stretch Range",
		keys: ["length_of_stretch_min", "length_of_stretch_max"],
	},
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
	{
		label: "Area Range",
		keys: ["area_min", "area_max"],
	},
	{
		label: "Display Cost Per Month Range",
		keys: ["display_cost_per_month_min", "display_cost_per_month_max"],
	},
	{
		label: "Total Cost Range",
		keys: ["total_cost_min", "total_cost_max"],
	},
];

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
}) => {
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
		closeFilter();
	};

	const applyFilter = async () => {
		try {
			setisLoaderOpen(true);
			const data = await getMediaPlansAPI({
				city_id,
				state_id,
				zone_id,
				...filters,
			});

			const planData = plans?.filter((v) => v.latitude && v.longitude) || [];

			const billIdsInPlans = planData.map((v) => v.id);

			const bills =
				data?.filter(
					(v) => v.latitude && v.longitude && !billIdsInPlans.includes(v.id)
				) || [];

			setMediaData(bills);
			closeFilter();
		} catch (error) {
			console.log(error);
			toast.error("something went wrong!");
		} finally {
			setisLoaderOpen(false);
		}
	};

	return (
		<Box width={"100%"} padding={1}>
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
									type={input_type}
									placeholder={input_type === "text" ? "Search here..." : "Min"}
									value={filters[minKey]}
									onChange={handleChangeFilter.bind(this, minKey)}
								/>

								{maxKey ? (
									<DebouncedInput
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
			<Stack direction={"row"} spacing={2} justifyContent={"flex-end"}>
				<CustomButton
					sx={{ bgcolor: "blue", color: "white" }}
					onClick={handleClear}>
					Clear
				</CustomButton>
				<CustomButton onClick={applyFilter}>Apply</CustomButton>
			</Stack>
		</Box>
	);
};

export default MediaFilters;

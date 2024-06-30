import React, { useState } from "react";
import Box from "@mui/material/Box";
import { Stack, Typography } from "@mui/material";
import { toast } from "react-toastify";

import DebouncedInput from "../../../components/DebouncedInput";
import CustomButton from "../../../components/CustomButton";

import { getMediaPlansAPI } from "../../../apis/plans.apis";

const MediaFilters = ({
	city_id,
	state_id,
	zone_id,
	setisLoaderOpen,
	setMediaData,
	filters,
	setfilters,
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

			setMediaData(data);
		} catch (error) {
			console.log(error);
			toast.error("something went wrong!");
		} finally {
			setisLoaderOpen(false);
		}
	};

	return (
		<Box padding={1}>
			<Stack m={2} direction={"row"} flexWrap={"wrap"} gap={2}>
				<Box flex={1} minWidth={"300px"}>
					<Typography>Visibility Duration</Typography>
					<Stack alignItems={"center"} direction={"row"}>
						<DebouncedInput
							type="number"
							placeholder="Min"
							value={filters.visibility_duration_min}
							onChange={handleChangeFilter.bind(
								this,
								"visibility_duration_min"
							)}
						/>

						<DebouncedInput
							type="number"
							placeholder="Max"
							value={filters.visibility_duration_max}
							onChange={handleChangeFilter.bind(
								this,
								"visibility_duration_max"
							)}
						/>
					</Stack>
				</Box>
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

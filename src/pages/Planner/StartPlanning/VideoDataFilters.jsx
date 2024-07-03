import React, { useState } from "react";
import Box from "@mui/material/Box";
import { Stack, Typography } from "@mui/material";

import DebouncedInput from "../../../components/DebouncedInput";
import CustomButton from "../../../components/CustomButton";

const filterFields = [
	{
		label: "Average Speed Range",
		keys: ["average_speed_min", "average_speed_max"],
	},
];

const VideoDataFilters = ({ filters, setfilters, closeFilter, onApply }) => {
	const [tempFilters, settempFilters] = useState({});

	const handleChangeFilter = (key, value) => {
		settempFilters((v) => {
			const f = { ...v };
			f[key] = value;
			return f;
		});
	};

	const handleClear = () => {
		setfilters({});
		settempFilters({});
		onApply({});
		closeFilter();
	};

	const applyFilter = () => {
		onApply(tempFilters);
		setfilters(tempFilters);
		closeFilter();
	};

	return (
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

export default VideoDataFilters;

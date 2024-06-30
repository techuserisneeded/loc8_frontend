import React from "react";
import Box from "@mui/material/Box";
import { Stack } from "@mui/material";

const MediaFilters = () => {
	return (
		<Stack m={2} direction={"row"} flexWrap={"wrap"} gap={2}>
			<Box flex={1} minWidth={"300px"}>
				rem
			</Box>
			<Box flex={1} minWidth={"300px"}>
				rem
			</Box>
		</Stack>
	);
};

export default MediaFilters;

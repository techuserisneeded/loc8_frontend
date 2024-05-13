import React from "react";

import Chip from "@mui/material/Chip";

import brief_status from "../constants/brief_status";

const CHIP_COLOR = {
	0: "red",
	1: "green",
};

const BriefStatusTag = ({ statusId }) => {
	const status = brief_status[statusId || 0];
	const bgColor = CHIP_COLOR[statusId || 0];

	return (
		<Chip
			size="small"
			label={status}
			sx={{ bgcolor: bgColor, color: "white" }}
		/>
	);
};

export default BriefStatusTag;

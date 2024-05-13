import React from "react";
import Box from "@mui/material/Box";

import VideoData from "../../components/VideoData";

const VideoDetails = () => {
	return (
		<Box padding={3}>
			<VideoData disableMerge />
		</Box>
	);
};

export default VideoDetails;

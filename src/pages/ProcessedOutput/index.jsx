import React from "react";
import useSWR from "swr";
import { Link, useParams } from "react-router-dom";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import SuperAdminLayout from "../../layouts/SuperAdminLayout";
import BillboardTable from "./BillboardTable";
import VideoFileDetails from "./VideoFileDetails";
import VideoCoordinatesTable from "./VideoCoordiatesTable";

import { getProcessedOutputAPI } from "../../apis/videos.apis";

const ProcessedOutput = () => {
	const { video_id } = useParams();

	const { data, isLoading, mutate } = useSWR("/videos/output" + video_id, () =>
		getProcessedOutputAPI(video_id)
	);

	const handleMerge = () => {
		mutate();
	};

	return (
		<SuperAdminLayout activeLink={"/add-video"}>
			{isLoading ? (
				<Typography>Loading...</Typography>
			) : !data || !data?.video_details ? (
				<center>
					<Typography>No Data Found!</Typography>
				</center>
			) : null}

			{data?.video_details ? (
				<>
					<Typography variant="h6" mb={1}>
						Video Details
					</Typography>
					<VideoFileDetails data={data.video_details} />

					<Typography my={2} variant="h6" mb={1}>
						Detected Billboards
					</Typography>
					<BillboardTable data={data.billboards} onMerge={handleMerge} />

					<Typography my={2} variant="h6" mb={1}>
						Detected Coordinates
					</Typography>
					<VideoCoordinatesTable videoCoordinates={data.video_coordinates} />

					<Box mt={4}>
						<Button LinkComponent={Link} variant="contained" to="/add-video">
							Done
						</Button>
					</Box>
				</>
			) : null}
		</SuperAdminLayout>
	);
};

export default ProcessedOutput;

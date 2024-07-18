import React from "react";
import useSWR from "swr";
import { useParams } from "react-router-dom";

import Typography from "@mui/material/Typography";

import BillboardTable from "./BillboardTable";
import VideoFileDetails from "./VideoFileDetails";
import VideoCoordinatesTable from "./VideoCoordiatesTable";

import { getProcessedOutputAPI } from "../../apis/videos.apis";

const VideoData = ({ disableMerge }) => {
	const { video_id } = useParams();

	const { data, isLoading, mutate } = useSWR("/videos/output" + video_id, () =>
		getProcessedOutputAPI(video_id)
	);

	const handleMerge = () => {
		mutate();
	};

	return (
		<div>
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
					<BillboardTable
						data={data.billboards}
						onMerge={handleMerge}
						disableMerge={disableMerge}
						onAddAssetInfo={()=>null}
					/>

					<Typography my={2} variant="h6" mb={1}>
						Detected Coordinates
					</Typography>
					<VideoCoordinatesTable
						videoCoordinates={data.video_coordinates}
						avgSpeed={data.avg_speed_km}
						stretchedDistance={data.stretched_in_meters}
					/>
				</>
			) : null}
		</div>
	);
};

export default VideoData;

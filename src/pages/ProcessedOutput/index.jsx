import React, { useState } from "react";
import useSWR from "swr";
import { Link, useParams } from "react-router-dom";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import SuperAdminLayout from "../../layouts/SuperAdminLayout";
import BillboardTable from "./BillboardTable";
import VideoFileDetails from "./VideoFileDetails";
import VideoCoordinatesTable from "./VideoCoordiatesTable";
import AddToPlan from "../../components/AddToPlan";

import { getProcessedOutputAPI } from "../../apis/videos.apis";
import roles from "../../constants/roles";
import useAuth from "../../hooks/useAuth";

const ProcessedOutput = () => {
	const { video_id } = useParams();
	const [assetInfoState, setAssetInfoState] = useState({
		isOpen: false,
		assetId: null,
		coords: [],
	});

	const { user_id, role_id } = useAuth();

	const { data, isLoading, mutate } = useSWR("/videos/output/" + video_id, () =>
		getProcessedOutputAPI(video_id)
	);

	const isAuthorizedForActions =
		role_id === roles.SUPERADMIN ||
		data?.video_details?.created_by_user_id === user_id;

	const handleMerge = () => {
		mutate();
	};

	const handleAssetClose = () => {
		setAssetInfoState({
			isOpen: false,
			assetId: null,
			coords: [],
			avgSpeed: 0,
		});

		mutate();
	};

	const openAssetInfo = (row) => {
		setAssetInfoState({
			isOpen: true,
			assetId: row.id,
			coords: data.video_coordinates?.map((v) => [v.latitude, v.longitude]),
			row,
		});
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
						Detected OOH Assets
					</Typography>
					<BillboardTable
						data={data.billboards || []}
						onMerge={handleMerge}
						videoId={data?.video_details?.video_id}
						isAuthorized={isAuthorizedForActions}
						onAddAssetInfo={openAssetInfo}
					/>

					<Typography my={2} variant="h6" mb={1}>
						Detected Coordinates
					</Typography>
					<VideoCoordinatesTable
						videoCoordinates={data.video_coordinates}
						avgSpeed={data.avg_speed_km}
						stretchedDistance={data.stretched_in_meters}
					/>

					<Box mt={4}>
						<Button LinkComponent={Link} variant="contained" to="/add-video">
							Done
						</Button>
					</Box>
				</>
			) : null}

			{assetInfoState?.assetId ? (
				<AddToPlan
					assetId={assetInfoState.assetId}
					open={assetInfoState.isOpen}
					onClose={handleAssetClose}
					initialCoords={assetInfoState.coords}
					row={assetInfoState.row}
				/>
			) : null}
		</SuperAdminLayout>
	);
};

export default ProcessedOutput;

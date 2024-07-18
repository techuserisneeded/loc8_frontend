import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";

import AddToPlan from "../components/AddToPlan";
import { Typography } from "@mui/material";
import { getAssetInfoAPI } from "../apis/videos.apis";

const AssetInfo = () => {
	const { assetId } = useParams();

	const { data, isLoading } = useSWR("/videos/output" + assetId, () =>
		getAssetInfoAPI(assetId)
	);

	const handleAssetClose = () => {
		return null;
	};

	if (isLoading) {
		return (
			<Typography variant="h4" textAlign={"center"}>
				Loading...
			</Typography>
		);
	}

	if (!data) {
		return (
			<Typography variant="h4" textAlign={"center"}>
				No Data was found!
			</Typography>
		);
	}

	const coords = data.video_coordinates
		? data.video_coordinates?.map((v) => [v.latitude, v.longitude])
		: [];

	const row = {
		...data.asset,
		video_coordinates: data.video_coordinates,
		...data.video,
	};

	return (
		<AddToPlan
			assetId={data.asset.id}
			open={true}
			onClose={handleAssetClose}
			initialCoords={coords}
			row={row}
			clearAfterSubmit={false}
		/>
	);
};

export default AssetInfo;

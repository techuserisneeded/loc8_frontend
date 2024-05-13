import React, { useRef, useEffect } from "react";
import { MapContainer, TileLayer, Polyline, Popup } from "react-leaflet";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import "leaflet/dist/leaflet.css";

import base_url from "../../../constants/base_url";

const defaultCenter = [51.505, -0.09];

const MapView = ({ videos = [], onAddToPlan }) => {
	const mapRef = useRef(null);

	const lines = videos
		.filter((v) => Boolean(v.coordinates.length))
		.map((v) => ({
			video_id: v.video_id,
			filename: v.filename,
			coords: v.coordinates.map((c) => [c.latitude, c.longitude]),
		}));

	const handleVideoOpen = (filename) => {
		const fileurl = base_url + "videos/uploads/" + filename.split(".")[0];
		window.open(fileurl, "_blank");
	};

	const handleVideDataOpen = (video_id) => {
		window.open(`/videos/${video_id}/all-data`, "_blank");
	};

	useEffect(() => {
		const center = mapRef?.current?.getCenter();
		if (!center) {
			return;
		}
		//if center is same as default
		// even if we have line coordinates
		//set map view to line coordinates
		if (
			center.lat === defaultCenter[0] &&
			center.lng === defaultCenter[1] &&
			lines[0]?.coords
		) {
			mapRef?.current?.setView(lines[0].coords[0], 12);
		}
	}, [lines]);

	return (
		<div>
			<MapContainer
				center={defaultCenter}
				zoom={13}
				ref={mapRef}
				style={{ height: "50vh", width: "100%" }}>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				{lines.length
					? lines.map((c) => (
							<Polyline
								key={JSON.stringify(c)}
								pathOptions={{ color: "red", weight: "10" }}
								positions={c.coords}>
								<Popup>
									<List sx={{ padding: 0 }}>
										<ListItemButton
											onClick={handleVideoOpen.bind(this, c.filename)}>
											<ListItemText primary="View Video" />
										</ListItemButton>
										<ListItemButton
											onClick={handleVideDataOpen.bind(this, c.video_id)}>
											<ListItemText primary="View Data" />
										</ListItemButton>
										<ListItemButton
											onClick={onAddToPlan.bind(this, c.video_id, c.coords[0])}>
											<ListItemText primary="Add To Plan" />
										</ListItemButton>
									</List>
								</Popup>
							</Polyline>
					  ))
					: null}
			</MapContainer>
		</div>
	);
};

export default MapView;

import React, { useRef, useEffect, useMemo, useCallback } from "react";
import { MapContainer, TileLayer, Polyline, Popup } from "react-leaflet";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import "leaflet/dist/leaflet.css";

import base_url from "../../../constants/base_url";

const defaultCenter = [51.505, -0.09];
const defaultZoom = 13;

const getColorBasedOnSpeed = (currentSpeed) => {
	if (currentSpeed >= 0 && currentSpeed < 20) {
		return "red";
	} else if (currentSpeed >= 20 && currentSpeed < 40) {
		return "orange";
	} else if (currentSpeed >= 40 && currentSpeed < 60) {
		return "yellow";
	} else {
		return "green";
	}
};

const MapView = ({ videos = [], onAddToPlan }) => {
	const mapRef = useRef(null);

	const lines = useMemo(() => {
		return videos
			.filter((v) => v.coordinates.length > 0)
			.map((v) => ({
				video_id: v.video_id,
				filename: v.filename,
				coords: v.coordinates.map((c) => [c.latitude, c.longitude]),
				speeds: v.coordinates.map((c) => c.speed),
			}));
	}, [videos]);

	const handleVideoOpen = useCallback((filename) => {
		const fileurl = `${base_url}videos/uploads/${filename}`;
		window.open(fileurl, "_blank");
	}, []);

	const handleVideoDataOpen = useCallback((video_id) => {
		window.open(`/videos/${video_id}/all-data`, "_blank");
	}, []);

	useEffect(() => {
		const center = mapRef?.current?.getCenter();
		if (!center) {
			return;
		}
		// if center is same as default and we have line coordinates, set map view to line coordinates
		if (
			center.lat === defaultCenter[0] &&
			center.lng === defaultCenter[1] &&
			lines.length > 0 &&
			lines[0].coords.length > 0
		) {
			mapRef.current.setView(lines[0].coords[0], 12);
		}
	}, [lines]);

	return (
		<div>
			<MapContainer
				center={defaultCenter}
				zoom={defaultZoom}
				ref={mapRef}
				style={{ height: "50vh", width: "100%" }}>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				{lines.length > 0 &&
					lines.map((line) => {
						const avgSpeed =
							line.speeds.reduce((acc, speed) => acc + speed, 0) /
							line.speeds.length;
						const segments = [];
						for (let i = 1; i < line.coords.length; i++) {
							const segment = [line.coords[i - 1], line.coords[i]];
							const color = getColorBasedOnSpeed(line.speeds[i]);
							segments.push({ segment, color });
						}
						return segments.map((seg, index) => (
							<Polyline
								key={`${line.video_id}-${index}`}
								pathOptions={{
									color: seg.color,
									weight: 10,
								}}
								positions={seg.segment}>
								<Popup>
									<List sx={{ padding: 0 }}>
										<ListItemButton
											onClick={() => handleVideoOpen(line.filename)}>
											<ListItemText primary="View Video" />
										</ListItemButton>
										<ListItemButton
											onClick={() => handleVideoDataOpen(line.video_id)}>
											<ListItemText primary="View Data" />
										</ListItemButton>
										<ListItemButton
											onClick={() =>
												onAddToPlan(line.video_id, line.coords[0])
											}>
											<ListItemText primary="Add To Plan" />
										</ListItemButton>
									</List>
								</Popup>
							</Polyline>
						));
					})}
			</MapContainer>
		</div>
	);
};

export default MapView;

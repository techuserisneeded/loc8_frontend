import * as React from "react";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useMapEvents } from "react-leaflet/hooks";
import axios from "axios";
import L from "leaflet";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import Box from "@mui/material/Box";
import { Stack, Grid, TextField } from "@mui/material";

import { addPlanAPI } from "../../../apis/plans.apis";
import Loader from "../../../components/Loader";

import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
	iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
	iconUrl: require("leaflet/dist/images/marker-icon.png"),
	shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddToPlan({
	open,
	onClose,
	briefId,
	budgetId,
	videoId,
	initialCoords = [],
}) {
	const [formState, setformState] = React.useState({});
	const [isLoading, setisLoading] = React.useState(false);
	const [locationText, setLocationText] = React.useState("");
	const [coords, setcoords] = React.useState({ lat: 0, long: 0 });

	const mapRef = React.useRef(null);

	const onDropSiteSS = React.useCallback((acceptedFiles) => {
		const file = acceptedFiles[0];

		if (!file) {
			return;
		}

		const reader = new FileReader();

		reader.onload = (e) => {
			setformState((prev) => ({
				...prev,
				siteSSFile: file,
				siteSSPreviewSrc: e.target.result,
			}));
		};

		reader.readAsDataURL(file);
	}, []);

	const onDropMapSS = React.useCallback((acceptedFiles) => {
		const file = acceptedFiles[0];

		if (!file) {
			return;
		}

		const reader = new FileReader();

		reader.onload = (e) => {
			setformState((prev) => ({
				...prev,
				mapSSFile: file,
				mapSSPreviewSrc: e.target.result,
			}));
		};

		reader.readAsDataURL(file);
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop: onDropSiteSS,
		maxFiles: 1,
		accept: {
			"image/*": [".jpg", ".png", ".jpeg"],
		},
	});

	const mapSSDropzoneObj = useDropzone({
		onDrop: onDropMapSS,
		maxFiles: 1,
		accept: {
			"image/*": [".jpg", ".png", ".jpeg"],
		},
	});

	const handleInputChange = (e) => {
		const name = e.target.name;
		setformState((prev) => {
			return {
				...prev,
				[name]: e.target.value,
			};
		});
	};

	const handleClose = () => {
		onClose?.();
	};

	const cost_for_duration =
		formState.rental_per_month && formState.duration
			? Number(
					(parseFloat(formState.rental_per_month) *
						parseFloat(formState.duration)) /
						30
			  ).toFixed(2)
			: 0;

	const printing_count =
		!isNaN(parseFloat(formState.printing)) && !isNaN(parseFloat(formState.size))
			? parseFloat(formState.printing) * parseFloat(formState.size)
			: 0;

	const mounting_count =
		!isNaN(parseFloat(formState.mounting)) && !isNaN(parseFloat(formState.size))
			? parseFloat(formState.mounting) * parseFloat(formState.size)
			: 0;

	const total = Number(
		parseFloat(cost_for_duration) + printing_count + mounting_count
	).toFixed(2);

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!formState.mapSSFile) {
			alert("Map Screenshot is required!");
			return;
		}

		if (!formState.siteSSFile) {
			alert("Site Screenshot is required!");
			return;
		}

		const data = {
			media_type: formState.media_type.trim(),
			illumination: formState.illumination.trim(),
			duration: parseFloat(formState.duration),
			cost_for_duration,
			h: parseFloat(formState.h),
			imp_per_month: parseFloat(formState.imp_per_month),
			mounting: parseFloat(formState.mounting),
			printing: parseFloat(formState.printing),
			qty: parseInt(formState.qty),
			rental_per_month: parseFloat(formState.rental_per_month),
			size: parseFloat(formState.size),
			units: parseFloat(formState.units),
			w: parseInt(formState.w),
			brief_id: briefId,
			video_id: videoId,
			budget_id: budgetId,
			map_image: formState.mapSSFile,
			site_image: formState.siteSSFile,
			location: locationText,
			latitude: coords.lat,
			longitude: coords.long,
		};

		const fd = new FormData();

		for (const key of Object.keys(data)) {
			fd.append(key, data[key]);
		}

		setisLoading(true);

		addPlanAPI(fd)
			.then((res) => {
				toast.success("Plan saved!");
				setformState({});
				handleClose();
			})
			.catch((e) => {
				const msg = e?.response?.data?.message || "Something went wrong!";
				toast.error(msg);
			})
			.finally((v) => {
				setisLoading(false);
			});
	};

	React.useEffect(() => {
		if (coords.lat && coords.long) {
			setisLoading(true);
			axios
				.get("https://nominatim.openstreetmap.org/reverse", {
					params: {
						lat: coords.lat,
						lon: coords.long,
					},
				})
				.then((response) => {
					const xmlData = response.data;
					const parser = new DOMParser();
					const xml = parser.parseFromString(xmlData, "text/xml");

					setLocationText(xml.querySelector("result").textContent);
				})
				.finally((v) => {
					setisLoading(false);
				});
		}
	}, [coords.lat, coords.long]);

	return (
		<Dialog
			fullScreen
			open={open}
			onClose={handleClose}
			TransitionComponent={Transition}>
			<AppBar sx={{ position: "relative" }}>
				<Toolbar>
					<IconButton
						edge="start"
						color="inherit"
						onClick={handleClose}
						aria-label="close">
						<CloseIcon />
					</IconButton>
					<Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
						Add To Plan
					</Typography>
				</Toolbar>
			</AppBar>
			<Stack
				mt={4}
				justifyContent={"center"}
				alignItems={"center"}
				width={"100%"}>
				<Box width={"60%"} m={3}>
					<form onSubmit={handleSubmit}>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<TextField
									required
									fullWidth
									id="media_type"
									label="Media Type"
									name="media_type"
									value={formState.media_type}
									onChange={handleInputChange}
									InputLabelProps={{ shrink: true }}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									autoComplete="family-name"
									name="illumination"
									required
									fullWidth
									id="Illumination"
									value={formState.illumination}
									onChange={handleInputChange}
									label="Illumination"
									InputLabelProps={{ shrink: true }}
								/>
							</Grid>

							<Grid item xs={12}>
								<Typography variant="h6">Select Location</Typography>
								{initialCoords ? (
									<MapContainer
										center={initialCoords}
										zoom={11}
										ref={mapRef}
										style={{ height: "50vh", width: "100%" }}>
										<TileLayer
											attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
											url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
										/>
										<LocationPicker setPosition={setcoords} />
									</MapContainer>
								) : null}
							</Grid>
							<Grid item xs={12} sm={12}>
								<TextField required fullWidth value={locationText} disabled />
							</Grid>
							<Grid item xs={12} sm={3}>
								<TextField
									type="number"
									required
									fullWidth
									id="w"
									label="Width"
									name="w"
									value={formState.w}
									onChange={handleInputChange}
									InputLabelProps={{ shrink: true }}
								/>
							</Grid>
							<Grid item xs={12} sm={3}>
								<TextField
									type="number"
									required
									fullWidth
									id="h"
									label="Height"
									name="h"
									value={formState.h}
									onChange={handleInputChange}
									InputLabelProps={{ shrink: true }}
								/>
							</Grid>
							<Grid item xs={12} sm={3}>
								<TextField
									type="number"
									required
									fullWidth
									id="qty"
									label="Quantity"
									name="qty"
									value={formState.qty}
									onChange={handleInputChange}
									InputLabelProps={{ shrink: true }}
								/>
							</Grid>
							<Grid item xs={12} sm={3}>
								<TextField
									type="number"
									required
									fullWidth
									id="size"
									label="size"
									name="size"
									value={formState.size}
									onChange={handleInputChange}
									InputLabelProps={{ shrink: true }}
								/>
							</Grid>
							<Grid item xs={12} sm={4}>
								<TextField
									type="number"
									required
									fullWidth
									id="duration"
									label="Duration"
									name="duration"
									value={formState.duration}
									onChange={handleInputChange}
									InputLabelProps={{ shrink: true }}
								/>
							</Grid>
							<Grid item xs={12} sm={4}>
								<TextField
									type="number"
									required
									fullWidth
									id="rental_per_month"
									label="Rental Per Month"
									name="rental_per_month"
									value={formState.rental_per_month}
									onChange={handleInputChange}
									InputLabelProps={{ shrink: true }}
								/>
							</Grid>
							<Grid item xs={12} sm={4}>
								<TextField
									type="number"
									required
									fullWidth
									id="units"
									label="Units"
									name="units"
									value={formState.units}
									onChange={handleInputChange}
									InputLabelProps={{ shrink: true }}
								/>
							</Grid>
							<Grid item xs={12} sm={4}>
								<TextField
									type="number"
									required
									fullWidth
									id="imp_per_month"
									label="Impressions Per Month"
									name="imp_per_month"
									value={formState.imp_per_month}
									onChange={handleInputChange}
									InputLabelProps={{ shrink: true }}
								/>
							</Grid>
							<Grid item xs={12} sm={4}>
								<TextField
									type="number"
									required
									fullWidth
									id="printing"
									label="Printing Rate"
									name="printing"
									value={formState.printing}
									onChange={handleInputChange}
									InputLabelProps={{ shrink: true }}
								/>
							</Grid>
							<Grid item xs={12} sm={4}>
								<TextField
									type="number"
									required
									fullWidth
									id="mounting"
									label="Mounting Rate"
									name="mounting"
									value={formState.mounting}
									onChange={handleInputChange}
									InputLabelProps={{ shrink: true }}
								/>
							</Grid>
							<Grid item xs={6}>
								<Typography variant="h6">Mounting Cost</Typography>
								<TextField
									fullWidth
									value={mounting_count}
									name="Mounting Cost"
									type="number"
									disabled
								/>
							</Grid>
							<Grid item xs={6}>
								<Typography variant="h6">Printing Cost</Typography>
								<TextField
									fullWidth
									value={printing_count}
									name="Printing Count"
									type="number"
									disabled
								/>
							</Grid>
							<Grid item xs={12} sm={12}>
								<Typography variant="h6">Display Cost of Duration</Typography>
								<TextField
									type="number"
									required
									fullWidth
									id="cost_per_duration"
									name="cost_for_duration"
									value={cost_for_duration}
									onChange={handleInputChange}
									disabled
									InputLabelProps={{ shrink: true }}
								/>
							</Grid>
							<Grid item xs={12}>
								<Typography variant="h6">Total</Typography>
								<TextField
									fullWidth
									value={total}
									name="total"
									type="number"
									id="total"
									disabled
								/>
							</Grid>
							<Grid sm={12} item>
								<Box mt={3}>
									<div
										style={{
											border: "1px dashed #333",
											padding: "20px",
											borderRadius: "15px",
										}}
										{...getRootProps()}>
										<input {...getInputProps()} />
										{isDragActive ? (
											<p>Drop the Site Screenshot here ...</p>
										) : (
											<div>
												{formState.siteSSPreviewSrc ? (
													<img
														width={150}
														height={100}
														alt="preview"
														src={formState.siteSSPreviewSrc}
													/>
												) : (
													"Drag and drop Site Screenshot here"
												)}
											</div>
										)}
									</div>
								</Box>
							</Grid>
							<Grid sm={12} item>
								<Box mt={3}>
									<div
										style={{
											border: "1px dashed #333",
											padding: "20px",
											borderRadius: "15px",
										}}
										{...mapSSDropzoneObj.getRootProps()}>
										<input {...mapSSDropzoneObj.getInputProps()} />
										{mapSSDropzoneObj.isDragActive ? (
											<p>Drop the brand Map Screenshot here ...</p>
										) : (
											<div>
												{formState.mapSSPreviewSrc ? (
													<img
														width={150}
														height={100}
														alt="preview"
														src={formState.mapSSPreviewSrc}
													/>
												) : (
													"Drag and drop Map Screenshot here"
												)}
											</div>
										)}
									</div>
								</Box>
							</Grid>
							<Grid item xs={12}>
								<Stack direction={"row"} justifyContent={"flex-end"}>
									<Button type="submit" variant="contained">
										Save
									</Button>
								</Stack>
							</Grid>
						</Grid>
					</form>
				</Box>
			</Stack>
			<Loader open={isLoading} />
		</Dialog>
	);
}

function LocationPicker({ setPosition }) {
	const [pos, setpos] = React.useState(null);

	const map = useMapEvents({
		click(v) {
			setPosition({ lat: v.latlng.lat, long: v.latlng.lng });
			setpos(v.latlng);
		},
	});

	if (!pos) {
		return null;
	}

	return <Marker position={pos} />;
}

// todo

// 1) Mounting Rate
// 2) Printing Rate
// 3) Mounting Cost
// 4) Printing Cost
// 5) Total Cost (Display Cost of Duration + Printing Cost + Mounting Cost)
// 6) Total Area = W*H*Units

import React, {
	useRef,
	useEffect,
	useMemo,
	useCallback,
	useState,
} from "react";
import { toast } from "react-toastify";
import {
	MapContainer,
	TileLayer,
	Polyline,
	Popup,
	Circle,
	Marker,
	CircleMarker,
} from "react-leaflet";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Box, Grid, Stack, Typography } from "@mui/material";
import "leaflet/dist/leaflet.css";

import L from "leaflet";

import { getColorBasedOnSpeed } from "../../../utils/helper.utils";

import base_url from "../../../constants/base_url";
import colors from "../../../constants/colors";
import ModalContainer from "../../../components/ModalContainer";
import CustomButton from "../../../components/CustomButton";

import { deletePlanById, addAssetsToPlan } from "../../../apis/plans.apis";
import Loader from "../../../components/Loader";

const defaultCenter = [51.505, -0.09];
const defaultZoom = 13;

const createIcon = (number) => {
	return L.divIcon({
		html: `<div style="
      background-color: ${number ? colors.PRIMARY : "grey"}; 
      color: white; 
      border-radius: 50%; 
      width: 20px; 
      height: 20px; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      font-size: 12px; 
      margin: 0; 
      padding: 0;
      line-height: 1;
      ">${number ? number : ""}</div>`,
		className: "",
		iconSize: [20, 20],
	});
};

const MapView = ({
	videos = [],
	onAddToWorkSpace,
	refreshPlanData,
	billboards = [],
	plans = [],
	briefId,
	budgetId,
}) => {
	const mapRef = useRef(null);

	const [activePopup, setActivePopup] = useState(null);
	const [isLoaderOpen, setisLoaderOpen] = useState(false);

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

	const handleClosePopUp = () => setActivePopup(null);

	const handleDeletePlan = (plan_id) => {
		if (!window.confirm("Are you sure you want to remove this plan?")) {
			return;
		}

		setisLoaderOpen(true);

		deletePlanById(plan_id)
			.then((v) => {
				toast.success("Plan removed!");
				refreshPlanData();
				handleClosePopUp();
			})
			.catch((e) => {
				toast.error("Failed to remove the plan!");
			})
			.finally((e) => {
				setisLoaderOpen(false);
			});
	};

	const handleAddToPlan = async (billId, videoId) => {
		try {
			setisLoaderOpen(true);

			await addAssetsToPlan({
				billboards: [billId],
				video_id: videoId,
				brief_id: briefId,
				budget_id: budgetId,
			});

			refreshPlanData();
			handleClosePopUp();

			toast.success("Added to plan!");
		} catch (error) {
			toast.error("Something went wrong!");
		} finally {
			setisLoaderOpen(false);
		}
	};

	const planData = plans?.filter((v) => v.latitude && v.longitude) || [];
	const billIdsInPlans = planData.map((v) => v.id);

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

						return (
							<Polyline
								key={`${line.video_id}`}
								pathOptions={{
									color: getColorBasedOnSpeed(avgSpeed),
									weight: 10,
								}}
								positions={line.coords}>
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
											onClick={() => onAddToWorkSpace(line.video_id)}>
											<ListItemText primary="Add all assets to workspace" />
										</ListItemButton>
									</List>
								</Popup>
							</Polyline>
						);
					})}

				{billboards.map((bil, index) => {
					return (
						<React.Fragment key={bil.id}>
							<Marker
								position={[bil.latitude, bil.longitude]}
								eventHandlers={{
									click: () => {
										setActivePopup(bil);
									},
								}}
								icon={createIcon(0)}></Marker>
						</React.Fragment>
					);
				})}

				{planData.map((plan, index) => {
					return (
						<React.Fragment key={plan.plan_id}>
							<Marker
								position={[plan.latitude, plan.longitude]}
								eventHandlers={{
									click: () => {
										setActivePopup(plan);
									},
								}}
								icon={createIcon(plan.sr_no)}></Marker>
						</React.Fragment>
					);
				})}
			</MapContainer>
			<AssetPopUp
				isOpen={!!activePopup}
				info={activePopup}
				isInPlans={billIdsInPlans.includes(activePopup?.id)}
				onClose={handleClosePopUp}
				onRemovePlan={handleDeletePlan}
				onAddToPlan={handleAddToPlan}
			/>
			<Loader open={isLoaderOpen} />
		</div>
	);
};

export default MapView;

function AssetPopUp({
	info,
	isOpen,
	onClose,
	isInPlans,
	onRemovePlan,
	onAddToPlan,
}) {

	console.log(info);
	return (
		<ModalContainer onClose={onClose} width={"md"} open={isOpen}>
			<Grid spacing={2} container>
				{info ? (
					<>
						<Grid md={6} item>
							<img
								style={{
									width: "100%",
								}}
								src={base_url + "/files/images/" + info.site_image}
								alt="asset"
							/>
							<LabelValue label={"Vendor"} value={info.vendor_name} />
							<LabelValue label={"Illumination"} value={info.illumination} />

							<LabelValue label={"Rank Net Saliency Location"} value={info.rank_net_saliency_locationwise} />
							<LabelValue label={"Rank Net Saliency City"} value={info.Rank_net_saliency_citywise} />
							<LabelValue label={"Visibility Duration"} value={info.visibility_duration} />
							<LabelValue label={"Efficiency"} value={info.efficiency} />
						</Grid>
						<Grid md={6} item>
							<Stack >
								<Stack justifyContent={"space-between"} direction={"row"}>
									<LabelValue label={"Width"} value={info.width} />
									<LabelValue label={"Height"} value={info.height} />
									<LabelValue label={"Quantity"} value={info.quantity} />
								</Stack>

								<Stack justifyContent={"space-between"} direction={"row"}>
									<LabelValue
										label={"Display Cost Per Month"}
										value={info.rental_per_month}
									/>
									<LabelValue
										label={"Printing Cost"}
										value={info.printing_cost}
									/>
									<LabelValue
										label={"Mounting Cost"}
										value={info.mounting_cost}
									/>
								</Stack>

								<LabelValue label={"Location"} value={info.location} />

								<LabelValue label={"Size"} value={info.width * info.height * info.quantity} />
								<LabelValue label={"Rental Per Month"} value={info.rental_per_month} />
								<LabelValue label={"Duration"} value={info.duration} />
								<LabelValue label={"Total Cost"} value={info.total_cost} />

								

							</Stack>


							
						</Grid>
					</>
				) : null}
			</Grid>
			<Stack direction={"row"} justifyContent={"flex-end"} spacing={2}>
				<CustomButton
					sx={{ bgcolor: "blue", color: "white" }}
					onClick={onClose}>
					Close
				</CustomButton>
				<CustomButton
					onClick={() => {
						if (isInPlans) {
							onRemovePlan(info.plan_id);
							return;
						}

						onAddToPlan(info.id, info.video_id);
					}}>
					{isInPlans ? "Remove From Plan" : "Add To Plan"}
				</CustomButton>
			</Stack>
		</ModalContainer>
	);
}

function LabelValue({ label, value }) {
	return (
		<Stack my={2}>
			<Typography variant="capitalize" fontWeight={600}>
				{label}
			</Typography>
			<Typography variant="capitalize">{value ? value : "NIL"}</Typography>
		</Stack>
	);
}

import * as React from "react";

import useSWR from "swr";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";

import Loader from "../../../components/Loader";
import { formatPricing } from "../../../utils/helper.utils";

import { getProcessedOutputAPI } from "../../../apis/videos.apis";
import { addAssetsToPlan } from "../../../apis/plans.apis";
import { toast } from "react-toastify";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddToWorkSpace({
	open,
	onClose,
	videoId,
	budgetId,
	briefId,
	onAddToPlan,
}) {
	const [selectedBills, setSelectedBills] = React.useState([]);
	const [saving, setsaving] = React.useState(false);

	const { data, isLoading, mutate } = useSWR(
		videoId ? "/videos/output/" + videoId : null,
		() => getProcessedOutputAPI(videoId)
	);

	const filteredBillboards =
		data?.billboards?.filter((v) => v.latitude && v.longitude) || [];

	const handleClose = () => {
		onClose(false);
	};

	const isChecked = (id) => selectedBills.includes(id);

	const handleCheckboxChange = (id) => {
		if (selectedBills.includes(id)) {
			setSelectedBills((prev) => {
				return prev.filter((preId) => preId !== id);
			});

			return;
		}

		setSelectedBills((prev) => [...prev, id]);
	};

	const toggleCheckAll = () => {
		if (selectedBills.length === filteredBillboards.length) {
			setSelectedBills([]);
		} else {
			setSelectedBills(filteredBillboards?.map((v) => v.id));
		}
	};

	const handleAddToPlan = async () => {
		try {
			setsaving(true);

			await addAssetsToPlan({
				billboards: selectedBills,
				video_id: videoId,
				brief_id: briefId,
				budget_id: budgetId,
			});

			onAddToPlan?.();
			onClose?.();

			toast.success("Added to plan!");
		} catch (error) {
			toast.error("Something went wrong!");
		} finally {
			setsaving(false);
		}
	};
console.log(filteredBillboards)
	return (
		<React.Fragment>
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
							Video Assets
						</Typography>
						<Button
							autoFocus
							variant="contained"
							sx={{ bgcolor: "white" }}
							onClick={handleAddToPlan}>
							Add To Plan
						</Button>
					</Toolbar>
				</AppBar>
				<TableContainer sx={{ mt: 2 }} component={Paper}>
					<Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
						<TableHead>
							<TableRow>
								<TableCell>
									<TableCell>
										<Checkbox
											size="small"
											onChange={toggleCheckAll}
											checked={
												selectedBills.length === filteredBillboards?.length
											}
										/>
									</TableCell>
								</TableCell>
								<TableCell>Location</TableCell>
								<TableCell align="right">Illumination</TableCell>
								<TableCell align="right">Media Type</TableCell>
								<TableCell align="right">Width</TableCell>
								<TableCell align="right">Height</TableCell>
								<TableCell align="right">Qty</TableCell>
								<TableCell align="right">Effective Impressions</TableCell>
								<TableCell align="right">Size</TableCell>
								<TableCell align="right">Duration</TableCell>
								<TableCell align="right">Impression Per Month</TableCell>
								<TableCell align="right">Rental Per Month In Lakhs</TableCell>
								<TableCell align="right">Cost For Duration in Lakhs</TableCell>
								<TableCell align="right">Net Saliency Score</TableCell>
								<TableCell align="right">Efficiency</TableCell>
								<TableCell align="right">Total in Lakhs</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{filteredBillboards?.map((row) => (
								
								<TableRow
									key={row.id}
									sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
									<TableCell>
										<Checkbox
											size="small"
											onChange={handleCheckboxChange.bind(this, row.id)}
											checked={isChecked(row.id)}
										/>
									</TableCell>
									<TableCell component="th" scope="row">
										{row.location}
									</TableCell>
									<TableCell component="th" scope="row">
										{row.illumination}
									</TableCell>
									<TableCell align="right">{row.media_type}</TableCell>
									<TableCell align="right">{row.width}</TableCell>
									<TableCell align="right">{row.height}</TableCell>
									<TableCell align="right">{row.quantity}</TableCell>
									<TableCell align="right">{(row.effective_impression)}</TableCell>
									<TableCell align="right">{row.area}</TableCell>
									<TableCell align="right">{row.duration}</TableCell>
									<TableCell align="right">{row.imp_per_month}</TableCell>
									<TableCell align="right">
										{(row.rental_per_month/100000).toFixed(2)}
									</TableCell>
									<TableCell align="right">
										{(row.cost_for_duration/100000).toFixed(2)}
									</TableCell>
									<TableCell align="right">
										{row.net_saliency_score_city.toFixed(2)}
									</TableCell>
									<TableCell align="right">
										{row.efficiency.toFixed(2)}
									</TableCell>
									<TableCell align="right">
										{(row.total_cost/100000).toFixed(2)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
				<Loader open={isLoading || saving} />
			</Dialog>
		</React.Fragment>
	);
}

import React, { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { Button } from "@mui/material";

import { abortVideosAPI } from "../../apis/videos.apis";

export default function UploadProgress({
	isLoading,
	onClose,
	progress,
	message,
	roomId,
}) {
	const [isRequestin, setIsRequestin] = useState(false);
	const [isAbortRequested, setisAbortRequested] = useState(false);

	const handleClose = () => {
		onClose?.();
	};

	const handleAbortVideo = async () => {
		try {
			setIsRequestin(true);
			await abortVideosAPI(roomId);
			setisAbortRequested(true);
		} catch (error) {
			alert("unable send abort request!");
		} finally {
			setIsRequestin(false);
		}
	};

	return (
		<Dialog open={isLoading} onClose={handleClose}>
			<DialogContent
				style={{
					width: "350px",
				}}>
				<DialogContentText>
					<center>
						<Typography variant="h6">
							{message ? message : "Processing..."}
						</Typography>
						{progress > 0 ? (
							<Box
								sx={{
									position: "relative",
									display: "inline-flex",
									marginTop: 3,
								}}>
								<CircularProgress
									variant="determinate"
									size={150}
									value={progress}
								/>
								<Box
									sx={{
										top: 0,
										left: 0,
										bottom: 0,
										right: 0,
										position: "absolute",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}>
									<Typography
										variant="h5"
										component="div"
										color="text.secondary">
										{`${Math.round(progress)}%`}
									</Typography>
								</Box>
							</Box>
						) : null}
						<Box>
							<img
								src="/location_pin_loading.gif"
								alt="loading..."
								width={100}
							/>
						</Box>
						{isAbortRequested ? (
							<Typography>
								Abort has been requested, This video processing will be aborted
								after all the clean ups.
							</Typography>
						) : (
							<Button
								variant="contained"
								sx={{ bgcolor: "red", color: "white" }}
								disableElevation
								onClick={handleAbortVideo}
								disabled={isAbortRequested}>
								{isRequestin ? "requesting..." : "Request Abort"}
							</Button>
						)}
					</center>
				</DialogContentText>
			</DialogContent>
		</Dialog>
	);
}

import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

export default function UploadProgress({
	isLoading,
	onClose,
	progress,
	message,
}) {
	const handleClose = () => {
		onClose?.();
	};

	return (
		<Dialog open={isLoading} onClose={handleClose}>
			<DialogContent>
				<DialogContentText>
					{progress < 0 ? (
						<Box
							display={"flex"}
							justifyContent={"center"}
							alignItems={"center"}
							gap={2}>
							<CircularProgress size={22} />
							<Typography variant="h6">
								{message ? message : "Uploading Video..."}
							</Typography>
						</Box>
					) : (
						<center>
							<Box sx={{ position: "relative", display: "inline-flex" }}>
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
							<Typography variant="h6">
								{message ? message : "Processing..."}
							</Typography>
						</center>
					)}
				</DialogContentText>
			</DialogContent>
		</Dialog>
	);
}

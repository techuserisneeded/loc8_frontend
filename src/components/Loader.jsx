import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

export default function Loader({ open, onClose }) {
	const handleClose = () => {
		onClose?.();
	};

	return (
		<React.Fragment>
			<Dialog open={open} onClose={handleClose}>
				<DialogContent>
					<DialogContentText
						display={"flex"}
						justifyContent={"center"}
						alignItems={"center"}
						gap={2}>
						<CircularProgress size={18} />
						<Typography>Loading...</Typography>
					</DialogContentText>
				</DialogContent>
			</Dialog>
		</React.Fragment>
	);
}

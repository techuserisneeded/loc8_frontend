import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function ModalContainer({ open, onClose, children }) {
	const handleClose = () => {
		onClose?.(false);
	};

	return (
		<React.Fragment>
			<Dialog
				open={open}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleClose}>
				<DialogTitle>{"Filters"}</DialogTitle>
				<DialogContent sx={{ minWidth: "450px" }}>{children}</DialogContent>
				{/* <DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button onClick={handleClose}>Save</Button>
				</DialogActions> */}
			</Dialog>
		</React.Fragment>
	);
}

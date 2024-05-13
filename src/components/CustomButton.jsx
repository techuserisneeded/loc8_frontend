import React from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

export default function CustomButton(props) {
	const loadingProps = {};

	if (props.isLoading) {
		loadingProps.startIcon = <CircularProgress size={15} />;
		loadingProps.disabled = true;
	}

	return (
		<Button
			size="small"
			variant="contained"
			disableElevation
			{...props}
			{...loadingProps}
		/>
	);
}

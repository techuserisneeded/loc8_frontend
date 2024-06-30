import React, { forwardRef } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

const CustomButton = forwardRef((props, ref) => {
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
			ref={ref}
			{...props}
			{...loadingProps}
		/>
	);
});

export default CustomButton;

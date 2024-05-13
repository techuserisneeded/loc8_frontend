import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";

export default function DebouncedInput({
	value: initialValue,
	onChange,
	debounce = 500,
	...props
}) {
	const [value, setValue] = useState(initialValue);

	useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			onChange(value);
		}, debounce);

		return () => clearTimeout(timeout);
	}, [value, debounce, onChange]);

	return (
		<TextField
			size="small"
			inputProps={{
				style: {
					height: "20px",
				},

				...props.inputProps,
			}}
			placeholder="search here.."
			fullWidth
			{...props}
			value={value}
			onChange={(e) => setValue(e.target.value)}
		/>
	);
}

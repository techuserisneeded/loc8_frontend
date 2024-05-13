import React, { useMemo } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import DebouncedInput from "../../components/DebouncedInput";

export default function ASearchFilter({ column, table }) {
	const columnFilterValue = column.getFilterValue();
	const firstValue = table
		.getPreFilteredRowModel()
		.flatRows[0]?.getValue(column.id);

	const sortedUniqueValues = useMemo(
		() =>
			typeof firstValue === "number"
				? []
				: Array.from(column.getFacetedUniqueValues().keys()).sort(),
		[column.getFacetedUniqueValues()]
	);

	if (typeof firstValue === "number") {
		return (
			<div className="w-full">
				<Typography>{column.columnDef.header} Range</Typography>
				<Stack flexDirection={"row"} alignItems={"center"}>
					<DebouncedInput
						type="number"
						min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
						max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
						value={columnFilterValue?.[0] ?? ""}
						onChange={(value) =>
							column.setFilterValue((old) => [value, old?.[1]])
						}
						placeholder={`Min Number`}
					/>

					<DebouncedInput
						type="number"
						min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
						max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
						value={columnFilterValue?.[1] ?? ""}
						onChange={(value) =>
							column.setFilterValue((old) => [old?.[0], value])
						}
						placeholder={`Max Number`}
					/>
				</Stack>
			</div>
		);
	}

	return (
		<div className="w-full">
			<Typography>{column.columnDef.header}</Typography>
			<datalist id={column.id + "list"}>
				{sortedUniqueValues.map((value) => (
					<option value={value} key={value} />
				))}
			</datalist>
			<DebouncedInput
				type="text"
				value={columnFilterValue ?? ""}
				onChange={(value) => column.setFilterValue(value)}
				// label={`Search ${column.columnDef.header}`}
				className="w-36 border shadow rounded"
				inputProps={{
					list: column.id + "list",
				}}
			/>
		</div>
	);
}

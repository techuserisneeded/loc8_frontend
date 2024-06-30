import React from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

function TableHeadCell(params) {
	return <TableCell sx={{ fontWeight: "600" }} {...params} />;
}

const QuickViewTable = ({ rows = [] }) => {
	return (
		<Box>
			<TableContainer component={Paper}>
				<Table sx={{ width: "100%" }}>
					<TableHead>
						<TableRow>
							<TableHeadCell>Sr</TableHeadCell>
							<TableHeadCell>Location</TableHeadCell>
							<TableHeadCell align="right">Size</TableHeadCell>
							<TableHeadCell align="center">Cost</TableHeadCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{rows?.map((row, i) => {
							return (
								<TableRow
									key={row.brief_id}
									sx={{
										"&:last-child td, &:last-child th": {
											border: 0,
										},
									}}>
									<TableCell align="right">{i + 1}</TableCell>
									<TableCell align="right">{row.location}</TableCell>
									<TableCell align="center">
										{row.width}X{row.height}
									</TableCell>
									<TableCell align="right">{row.total_cost}</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
};

export default QuickViewTable;

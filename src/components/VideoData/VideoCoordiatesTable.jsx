import React from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableFooter from "@mui/material/TableFooter";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";

const tableCellSx = {
	fontSize: "1rem",
};

export default function VideoCoordinatesTable({
	videoCoordinates = [],
	avgSpeed = 0,
	stretchedDistance = 0,
}) {
	return (
		<TableContainer component={Paper}>
			<Table size="small">
				<TableHead>
					<TableRow>
						<TableCell>Latitude</TableCell>
						<TableCell>Longitude</TableCell>
						<TableCell>Speed</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{videoCoordinates.map((v) => (
						<TableRow>
							<TableCell>{v.latitude}</TableCell>
							<TableCell>{v.longitude}</TableCell>
							<TableCell>{v.speed}km/hr</TableCell>
						</TableRow>
					))}
				</TableBody>
				<TableFooter>
					<TableRow>
						<TableCell sx={tableCellSx} colSpan={2}>
							<Typography variant="span">
								Total length of the stretch :{" "}
							</Typography>

							<Typography variant="span" fontWeight={700}>
								{stretchedDistance} meters
							</Typography>
						</TableCell>
						<TableCell sx={tableCellSx}>
							<Typography variant="span">Average speed : </Typography>
							<Typography variant="span" fontWeight={700}>
								{avgSpeed} km/hr
							</Typography>
						</TableCell>
					</TableRow>
				</TableFooter>
			</Table>
		</TableContainer>
	);
}

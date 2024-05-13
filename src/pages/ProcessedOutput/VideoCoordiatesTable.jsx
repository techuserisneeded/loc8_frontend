import React from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function VideoCoordinatesTable({ videoCoordinates = [] }) {
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
			</Table>
		</TableContainer>
	);
}

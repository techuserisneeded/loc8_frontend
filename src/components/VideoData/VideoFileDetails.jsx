import React from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import base_url from "../../constants/base_url";

export default function VideoFileDetails({ data }) {
	const fileurl = base_url + "videos/uploads/" + data?.filename?.split(".")[0];

	return (
		<TableContainer component={Paper}>
			<Table size="small">
				<TableHead>
					<TableRow>
						<TableCell>Video ID</TableCell>
						<TableCell align="right">Processed Video</TableCell>
						<TableCell align="right">Zone</TableCell>
						<TableCell align="right">State</TableCell>
						<TableCell align="right">City</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow
						key={data.video_id}
						sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
						<TableCell component="th" scope="row">
							{data.video_id}
						</TableCell>
						<TableCell align="right">
							<a href={fileurl} target="_blank" rel="noreferrer">
								{data.filename}
							</a>
						</TableCell>
						<TableCell align="right">{data.zone_name}</TableCell>
						<TableCell align="right">{data.state_name}</TableCell>
						<TableCell align="right">{data.city_name}</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</TableContainer>
	);
}

import React from "react";

import Grid from "@mui/material/Grid";

import SuperAdminLayout from "../../layouts/SuperAdminLayout";
import States from "./States";
import City from "./city";

const Marketting = () => {
	return (
		<SuperAdminLayout activeLink="/marketing">
			<Grid spacing={2} container>
				<Grid md={6} item>
					<States />
				</Grid>
				<Grid md={6} item>
					<City />
				</Grid>
			</Grid>
		</SuperAdminLayout>
	);
};

export default Marketting;

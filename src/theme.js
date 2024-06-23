import { createTheme } from "@mui/material/styles";

import colors from "./constants/colors";

const theme = createTheme({
	palette: {
		primary: {
			// main: "#042374",
			main: colors.PRIMARY,
		},
	},
	typography: {
		fontFamily: ['"Tisa Sans Pro"', "sans-serif"].join(","),
	},
});

export default theme;

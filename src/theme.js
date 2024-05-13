import { createTheme } from "@mui/material/styles";

const theme = createTheme({
	palette: {
		primary: {
			// main: "#042374",
			main: "#f39c1c",
		},
	},
	typography: {
		fontFamily: ['"Tisa Sans Pro"', "sans-serif"].join(","),
	},
});

export default theme;

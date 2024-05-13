import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

export default function Copyright(props) {
	return (
		<Typography
			variant="body2"
			color="text.secondary"
			align="center"
			{...props}>
			{"Copyright © "}
			<Link color="inherit" target="_blank" href="https://www.osmo.media/">
				OSMO
			</Link>{" "}
			{new Date().getFullYear()}
			{"."}
		</Typography>
	);
}

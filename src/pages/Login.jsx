import * as React from "react";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import Copyright from "../components/Copyright";
import AuthHeader from "../components/AuthHeader";

import { useAuthState } from "../contexts/AuthProvider";

import { login } from "../apis/auth.apis";

export default function Login() {
	const [isLoading, setisLoading] = React.useState(false);
	const { saveUser } = useAuthState();
	const navigate = useNavigate();

	const handleSubmit = (event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);

		setisLoading(true);

		login(data.get("email").trim(), data.get("password").trim())
			.then((data) => {
				saveUser(data);
				navigate("/");
			})
			.catch((e) => {
				const msg =
					e.response && e.response?.data?.message
						? e.response.data.message
						: "Something went wrong!";
				alert(msg);
			})
			.finally(() => {
				setisLoading(false);
			});
	};

	return (
		<>
			<AuthHeader />
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box
					sx={{
						marginTop: 8,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}>
					<img src="/product_logo.png" alt="loc 8 logo" height={120} />
					<Box
						component="form"
						onSubmit={handleSubmit}
						noValidate
						sx={{ mt: 1 }}>
						<TextField
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
							autoFocus
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							disabled={isLoading}
							sx={{ mt: 3, mb: 2 }}>
							Sign In
						</Button>
						<Grid container>
							<Grid item xs>
								<Link href="#" variant="body2">
									Forgot password?
								</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
				<Copyright sx={{ mt: 8, mb: 4 }} />
			</Container>
		</>
	);
}

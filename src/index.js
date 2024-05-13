import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

import "./index.css";
import "react-toastify/dist/ReactToastify.css";

import App from "./App";
import theme from "./theme";

import AuthProvider from "./contexts/AuthProvider";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

root.render(
	<ThemeProvider theme={theme}>
		<AuthProvider>
			<CssBaseline />
			<App />
			<ToastContainer autoClose={1000} hideProgressBar={true} />
		</AuthProvider>
	</ThemeProvider>
);

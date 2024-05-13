import * as React from "react";
import { RouterProvider } from "react-router-dom";

import {
	authRouter,
	superAdminRouter,
	adminRouter,
	plannerRouter,
	controllerRouter,
} from "./routes";

import useAuth from "./hooks/useAuth";
import roles from "./constants/roles";

export default function App() {
	const user = useAuth();

	if (!user) {
		return <RouterProvider router={authRouter} />;
	}

	switch (user.role_id) {
		case roles.SUPERADMIN:
			return <RouterProvider router={superAdminRouter} />;
		case roles.ADMIN:
			return <RouterProvider router={adminRouter} />;
		case roles.CONTROLLER:
			return <RouterProvider router={controllerRouter} />;
		case roles.PLANNER:
			return <RouterProvider router={plannerRouter} />;

		default:
			<RouterProvider router={superAdminRouter} />;
	}
}

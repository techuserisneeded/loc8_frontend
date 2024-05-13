import { createBrowserRouter } from "react-router-dom";

import Login from "./pages/Login";
import AdminList from "./pages/AdminList";
import Marketting from "./pages/Marketting";
import AddVideo from "./pages/AddVideo";
import ProcessedOutput from "./pages/ProcessedOutput";
import Videos from "./pages/videos";
import PlannerList from "./pages/PlannerList";
import Test from "./pages/Test";
import ControllerList from "./pages/ControllerList";
import CreateBrief from "./pages/CreateBrief";
import BriefList from "./pages/BriefList";
import EditBrief from "./pages/EditBrief";
import PlannerBriefList from "./pages/Planner/BriefList";
import PlannerBriefDetails from "./pages/Planner/BriefDetails";
import PlannerStartPlanning from "./pages/Planner/StartPlanning";
import PlannerVideoDetails from "./pages/Planner/VideoDetails";

export const authRouter = createBrowserRouter([
	{
		path: "/",
		element: <Login />,
	},
	{
		path: "/login",
		element: <Login />,
	},
]);

export const superAdminRouter = createBrowserRouter([
	{
		path: "/marketing",
		element: <Marketting />,
	},
	{
		path: "/",
		element: <BriefList />,
	},
	{
		path: "/controllers",
		element: <ControllerList />,
	},
	{
		path: "/admins",
		element: <AdminList />,
	},
	{
		path: "/planners",
		element: <PlannerList />,
	},
	{
		path: "/add-video",
		element: <AddVideo />,
	},
	{
		path: "/add-video/:video_id/processed-output",
		element: <ProcessedOutput />,
	},
	{
		path: "/videos",
		element: <Videos />,
	},
	{
		path: "/create-brief",
		element: <CreateBrief />,
	},
	{
		path: "/briefs",
		element: <BriefList />,
	},
	{
		path: "/edit-brief/:brief_id",
		element: <EditBrief />,
	},
]);

export const adminRouter = createBrowserRouter([
	{
		path: "/add-video",
		element: <AddVideo />,
	},
	{
		path: "/add-video/:video_id/processed-output",
		element: <ProcessedOutput />,
	},
	{
		path: "/planners",
		element: <PlannerList />,
	},
	{
		path: "/",
		element: <Videos />,
	},
	{
		path: "/videos",
		element: <Videos />,
	},
]);

export const controllerRouter = createBrowserRouter([
	{
		path: "/",
		element: <BriefList />,
	},
	{
		path: "/create-brief",
		element: <CreateBrief />,
	},
	{
		path: "/edit-brief/:brief_id",
		element: <EditBrief />,
	},
]);

export const plannerRouter = createBrowserRouter([
	{
		path: "/",
		element: <PlannerBriefList />,
	},
	{
		path: "/briefs/:brief_id",
		element: <PlannerBriefDetails />,
	},
	{
		path: "/videos/:video_id/all-data",
		element: <PlannerVideoDetails />,
	},
	{
		path: "/briefs/:budget_id/start-planning",
		element: <PlannerStartPlanning />,
	},
]);

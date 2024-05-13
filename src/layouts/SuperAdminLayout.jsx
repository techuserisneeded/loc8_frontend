import * as React from "react";
import { Link } from "react-router-dom";

import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import GroupIcon from "@mui/icons-material/Group";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import ViewListIcon from "@mui/icons-material/ViewList";
import EditNoteIcon from "@mui/icons-material/EditNote";
import PublicIcon from "@mui/icons-material/Public";
import PersonPinIcon from "@mui/icons-material/PersonPin";

import Copyright from "../components/Copyright";

import { useAuthState } from "../contexts/AuthProvider";
import roles from "../constants/roles";

const drawerWidth = 240;

const navs = [
	{
		title: "Admins",
		link: "/admins",
		Icon: GroupIcon,
		isSuperAdmin: true,
		isAdmin: false,
	},
	{
		title: "Controllers",
		link: "/controllers",
		Icon: GroupIcon,
		isSuperAdmin: true,
		isAdmin: false,
	},
	{
		title: "Marketing",
		link: "/marketing",
		Icon: PublicIcon,
		isSuperAdmin: true,
		isAdmin: false,
	},
	{
		title: "Planners",
		link: "/planners",
		Icon: PersonPinIcon,
		isSuperAdmin: true,
		isAdmin: true,
	},
	{
		title: "View Data",
		link: "/videos",
		Icon: OndemandVideoIcon,
		isSuperAdmin: true,
		isAdmin: true,
	},
	{
		title: "Upload Video",
		link: "/add-video",
		Icon: VideoCallIcon,
		isSuperAdmin: true,
		isAdmin: true,
	},
	{
		title: "Create Brief",
		link: "/create-brief",
		Icon: EditNoteIcon,
		isSuperAdmin: true,
		isController: true,
		isAdmin: false,
	},
	{
		title: "Briefs",
		link: "/",
		Icon: ViewListIcon,
		isSuperAdmin: true,
		isAdmin: false,
		isController: true,
		isPlanner: true,
	},
];

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(["width", "margin"], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(["width", "margin"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

const Drawer = styled(MuiDrawer, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
	"& .MuiDrawer-paper": {
		position: "relative",
		whiteSpace: "nowrap",
		width: drawerWidth,
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
		boxSizing: "border-box",
		...(!open && {
			overflowX: "hidden",
			transition: theme.transitions.create("width", {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),
			width: theme.spacing(7),
			[theme.breakpoints.up("sm")]: {
				width: theme.spacing(9),
			},
		}),
	},
}));

export default function SuperAdminLayout({
	children,
	activeLink,
	containerComponent = "container",
}) {
	const { user: userData } = useAuthState();

	let roleNavs = [];

	if (userData.role_id === roles.SUPERADMIN) {
		roleNavs = navs.filter((v) => v.isSuperAdmin);
	}

	if (userData.role_id === roles.ADMIN) {
		roleNavs = navs.filter((v) => v.isAdmin);
	}

	if (userData.role_id === roles.CONTROLLER) {
		roleNavs = navs.filter((v) => v.isController);
	}

	if (userData.role_id === roles.PLANNER) {
		roleNavs = navs.filter((v) => v.isPlanner);
	}

	const activeNav = roleNavs.find((v) => v.link === activeLink);

	const { saveUser } = useAuthState();
	const [open, setOpen] = React.useState(true);

	const toggleDrawer = () => {
		setOpen(!open);
	};

	const handleLogout = () => {
		saveUser(null);
		window.location.href = "/";
	};

	const ContainerComp = containerComponent === "container" ? Container : Box;

	return (
		<Box sx={{ display: "flex" }}>
			<AppBar position="absolute" open={open}>
				<Toolbar
					sx={{
						pr: "24px",
					}}>
					<IconButton
						edge="start"
						color="inherit"
						aria-label="open drawer"
						onClick={toggleDrawer}
						sx={{
							marginRight: "36px",
							...(open && { display: "none" }),
						}}>
						<MenuIcon />
					</IconButton>
					<Typography
						component="h1"
						variant="h6"
						color="inherit"
						noWrap
						sx={{ flexGrow: 1 }}>
						{activeNav.title}
					</Typography>
					{/* <IconButton color="inherit">
						<Badge badgeContent={4} color="secondary">
							<NotificationsIcon />
						</Badge>
					</IconButton> */}
				</Toolbar>
			</AppBar>
			<Drawer variant="permanent" open={open}>
				<Toolbar
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "flex-end",
						px: [1],
					}}>
					<Box
						flex={1}
						display={"flex"}
						justifyContent={"center"}
						alignItems={"center"}>
						<img src="/product_logo.png" alt="osmo logo" height={40} />
					</Box>
					<IconButton onClick={toggleDrawer}>
						<ChevronLeftIcon />
					</IconButton>
				</Toolbar>
				<Divider />
				<List component="nav">
					{roleNavs.map((v) => (
						<ListItemButton
							LinkComponent={Link}
							sx={
								activeLink === v.link
									? {
											backgroundColor: "#aaa",
									  }
									: {}
							}
							to={v.link}
							key={v.title}>
							<ListItemIcon>
								<v.Icon />
							</ListItemIcon>
							<ListItemText primary={v.title} />
						</ListItemButton>
					))}
				</List>
				<Stack direction={"row"} justifyContent={"center"} padding={1} mt={10}>
					<Button
						onClick={handleLogout}
						variant="contained"
						disableElevation
						fullWidth>
						Logout
					</Button>
				</Stack>
			</Drawer>
			<Box
				component="main"
				sx={{
					backgroundColor: (theme) =>
						theme.palette.mode === "light"
							? theme.palette.grey[100]
							: theme.palette.grey[900],
					flexGrow: 1,
					height: "100vh",
					overflow: "auto",
				}}>
				<Toolbar />
				<ContainerComp sx={{ mt: 4, mb: 4 }}>
					<Box>{children}</Box>
					<Copyright sx={{ pt: 4 }} />
				</ContainerComp>
			</Box>
		</Box>
	);
}

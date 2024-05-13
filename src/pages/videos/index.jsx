import React, { useState } from "react";
import useSWR from "swr";
import { styled } from "@mui/material/styles";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import IconButton from "@mui/material/IconButton";
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
	createColumnHelper,
	getSortedRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFacetedMinMaxValues,
} from "@tanstack/react-table";

import { rankItem } from "@tanstack/match-sorter-utils";

import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ChecklistIcon from "@mui/icons-material/Checklist";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

import SuperAdminLayout from "../../layouts/SuperAdminLayout";
import DebouncedInput from "../../components/DebouncedInput";

import { getVidoesAPI } from "../../apis/videos.apis";
import { Stack, TextField } from "@mui/material";
import ModalContainer from "../../components/ModalContainer";
import ASearchFilter from "./ASearchFilter";
import base_url from "../../constants/base_url";

const columnHelper = createColumnHelper();

const speedCell = ({ getValue }) => `${getValue()}km/hr`;

const columns = [
	columnHelper.accessor("id", {
		header: "Billboard Id",
		enableColumnFilter: false,
	}),
	columnHelper.accessor("video_id", {
		header: "Video Id",
		enableColumnFilter: false,
	}),
	columnHelper.accessor("tracker_id", {
		header: "Tracker Id",
		enableColumnFilter: false,
	}),
	columnHelper.accessor("filename", {
		cell: (info) => {
			const filename = info.getValue();

			const fileurl = base_url + "videos/uploads/" + filename?.split(".")[0];

			return (
				<a href={fileurl} target="_blank" rel="noreferrer">
					{filename}
				</a>
			);
		},
		header: "Video File name",
		enableColumnFilter: false,
	}),
	columnHelper.accessor("zone_name", {
		header: "Zone Name",
	}),
	columnHelper.accessor("state_name", {
		header: "State Name",
	}),
	columnHelper.accessor("city_name", {
		header: "City Name",
	}),
	columnHelper.accessor("distance_to_center", {
		header: "Distance To Center",
		enableColumnFilter: false,
	}),
	columnHelper.accessor("far_p_distance", {
		header: "Far P Distance",
		enableColumnFilter: false,
	}),
	columnHelper.accessor("far_p_duration", {
		header: "Far P Duration",
		enableColumnFilter: false,
	}),
	columnHelper.accessor("mid_p_distance", {
		header: "Mid P Distance",
		enableColumnFilter: false,
	}),
	columnHelper.accessor("mid_p_duration", {
		header: "Mid P Duration",
		enableColumnFilter: false,
	}),
	columnHelper.accessor("near_p_distance", {
		header: "Near P Distance",
		enableColumnFilter: false,
	}),
	columnHelper.accessor("near_p_duration", {
		header: "Near P Duration",
		enableColumnFilter: false,
	}),
	columnHelper.accessor("visibility_duration", {
		header: "Visibility Duration",
		enableColumnFilter: false,
	}),
	columnHelper.accessor("average_areas", {
		header: "Average Areas",
		enableColumnFilter: false,
	}),
	columnHelper.accessor("central_distance", {
		header: "Central Distance",
		enableColumnFilter: false,
	}),
	columnHelper.accessor("central_duration", {
		header: "Central Duration",
		enableColumnFilter: false,
	}),
	columnHelper.accessor("confidence", {
		header: "Confidence",
		enableColumnFilter: false,
	}),
	columnHelper.accessor("latitude0", {
		header: "latitude 1",

		enableColumnFilter: false,
	}),
	columnHelper.accessor("longitude0", {
		header: "longitude 1",
		enableColumnFilter: false,
	}),
	columnHelper.accessor("speed0", {
		header: "speed 1",
		cell: speedCell,
		enableColumnFilter: true,
	}),
	columnHelper.accessor("latitude1", {
		header: "latitude 2",
		enableColumnFilter: false,
	}),
	columnHelper.accessor("longitude1", {
		header: "longitude 2",
		enableColumnFilter: false,
	}),
	columnHelper.accessor("speed1", {
		header: "speed 2",
		cell: speedCell,
		enableColumnFilter: true,
	}),
	columnHelper.accessor("latitude2", {
		header: "latitude 3",
		enableColumnFilter: false,
	}),
	columnHelper.accessor("longitude2", {
		header: "longitude 3",
		enableColumnFilter: false,
	}),
	columnHelper.accessor("speed2", {
		header: "speed 3",
		cell: speedCell,
		enableColumnFilter: true,
	}),
	columnHelper.accessor("latitude3", {
		header: "latitude 4",
		enableColumnFilter: false,
	}),
	columnHelper.accessor("longitude3", {
		header: "longitude 4",
		enableColumnFilter: false,
	}),
	columnHelper.accessor("speed3", {
		header: "speed 4",
		cell: speedCell,
		enableColumnFilter: true,
	}),
	columnHelper.accessor("latitude4", {
		header: "latitude 5",
		enableColumnFilter: false,
	}),
	columnHelper.accessor("longitude4", {
		header: "longitude 5",
		enableColumnFilter: false,
	}),
	columnHelper.accessor("speed4", {
		header: "speed 5",
		cell: speedCell,
		enableColumnFilter: true,
	}),
	columnHelper.accessor("latitude5", {
		header: "latitude 6",
		enableColumnFilter: false,
	}),
	columnHelper.accessor("longitude5", {
		header: "longitude 6",
		enableColumnFilter: false,
	}),
	columnHelper.accessor("speed5", {
		header: "speed 6",
		cell: speedCell,
		enableColumnFilter: true,
	}),
	columnHelper.accessor("created_at", {
		header: "Created At",
		enableColumnFilter: false,
	}),
];

const fuzzyFilter = (row, columnId, value, addMeta) => {
	const itemRank = rankItem(row.getValue(columnId), value);

	addMeta({
		itemRank,
	});

	return itemRank.passed;
};

const StyledTooltip = styled(({ className, ...props }) => (
	<Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: "#fff",
		color: "rgba(0, 0, 0, 0.87)",
		maxWidth: 800,
		fontSize: theme.typography.pxToRem(12),
		border: "1px solid #dadde9",
	},
}));

const Videos = () => {
	const [isColumnDisplayPopUp, setIsColumnDisplayPopUp] = useState(false);
	const [filterOpen, setfilterOpen] = useState(false);
	const [sorting, setSorting] = useState();
	const [globalFilter, setGlobalFilter] = useState("");
	const [columnFilters, setColumnFilters] = useState([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});

	const { isLoading, data } = useSWR("/videos/", getVidoesAPI);
	const [columnVisibility, setColumnVisibility] = useState({
		average_areas: false,
		central_distance: false,
		central_duration: false,
		confidence: false,
		far_p_distance: false,
		far_p_duration: false,
		mid_p_distance: false,
		mid_p_duration: false,
		near_p_distance: false,
		near_p_duration: false,
		visibility_duration: false,
		distance_to_center: false,
		latitude0: true,
		longitude0: true,
		speed0: true,
		latitude1: false,
		longitude1: false,
		speed1: false,
		latitude2: false,
		longitude2: false,
		speed2: false,
		latitude3: false,
		longitude3: false,
		speed3: false,
		latitude4: false,
		longitude4: false,
		speed4: false,
		latitude5: false,
		longitude5: false,
		speed5: false,
		created_at: false,
	});

	const table = useReactTable({
		data,
		columns,
		filterFns: {
			fuzzy: fuzzyFilter,
		},
		state: {
			sorting,
			columnVisibility,
			globalFilter,
			columnFilters,
			pagination,
		},
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		getPaginationRowModel: getPaginationRowModel(),
		onPaginationChange: setPagination,
		onColumnVisibilityChange: setColumnVisibility,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onGlobalFilterChange: setGlobalFilter,
		globalFilterFn: fuzzyFilter,
		getFacetedMinMaxValues: getFacetedMinMaxValues(),
		debugTable: true,
		debugHeaders: true,
		debugColumns: true,
	});

	const toggleColumnDisplayPopUp = () => {
		setIsColumnDisplayPopUp((prev) => !prev);
	};

	const handleTooltipClose = () => {
		setIsColumnDisplayPopUp(false);
	};

	const handleFilterClose = () => {
		setfilterOpen(false);
	};

	const openFilter = () => {
		setfilterOpen(true);
	};

	if (!data) {
		return (
			<SuperAdminLayout activeLink="/videos">
				<center>
					<h1>No Data Found</h1>
				</center>
			</SuperAdminLayout>
		);
	}

	return (
		<SuperAdminLayout activeLink="/videos" containerComponent="box">
			<Container component="div" maxWidth="xl">
				<Box>
					<Typography variant="h4" mb={2}>
						Uploaded Videos
					</Typography>
					<TableContainer component={Paper}>
						<Stack
							margin={"15px"}
							justifyContent={"space-between"}
							direction={"row"}>
							<Stack direction={"row"} alignItems={"center"} gap={2}>
								<ClickAwayListener onClickAway={handleFilterClose}>
									<div>
										<StyledTooltip
											PopperProps={{
												disablePortal: true,
											}}
											placement="left-start"
											onClose={handleFilterClose}
											open={filterOpen}
											disableFocusListener
											disableHoverListener
											disableTouchListener
											title={
												<Stack
													m={2}
													direction={"row"}
													flexWrap={"wrap"}
													gap={2}>
													{table
														.getAllColumns()
														.filter((c) => c.getCanFilter() && c.getIsVisible())
														.map((c) => (
															<Box key={c.id} flex={1} minWidth={"300px"}>
																<ASearchFilter column={c} table={table} />
															</Box>
														))}
												</Stack>
											}>
											<Button
												variant="contained"
												size="small"
												startIcon={<FilterAltIcon />}
												disableElevation
												onClick={openFilter}
												sx={{ borderRadius: "15px" }}>
												Filters
											</Button>
										</StyledTooltip>
									</div>
								</ClickAwayListener>
								<DebouncedInput
									value={globalFilter ?? ""}
									onChange={(value) => setGlobalFilter(String(value))}
								/>
							</Stack>
							<ClickAwayListener onClickAway={handleTooltipClose}>
								<div>
									<StyledTooltip
										PopperProps={{
											disablePortal: true,
										}}
										placement="left-start"
										onClose={handleTooltipClose}
										open={isColumnDisplayPopUp}
										disableFocusListener
										disableHoverListener
										disableTouchListener
										title={
											<List
												sx={{
													width: "100%",
													display: "flex",
													flexWrap: "wrap",
												}}>
												<ListItemButton
													onClick={table.getToggleAllColumnsVisibilityHandler()}
													sx={{ flex: "1 1 25%" }}>
													<ListItemIcon>
														<Checkbox
															edge="start"
															{...{
																type: "checkbox",
																checked: table.getIsAllColumnsVisible(),
																onChange:
																	table.getToggleAllColumnsVisibilityHandler(),
															}}
															tabIndex={-1}
															disableRipple
														/>
													</ListItemIcon>
													<ListItemText
														sx={{ fontSize: "15px" }}
														primary={`Toggle All`}
													/>
												</ListItemButton>
												{table.getAllLeafColumns().map((column) => {
													return (
														<ListItemButton
															key={column.id}
															sx={{ flex: "1 1 25%" }}
															onClick={column.getToggleVisibilityHandler()}
															dense>
															<ListItemIcon>
																<Checkbox
																	edge="start"
																	{...{
																		type: "checkbox",
																		checked: column.getIsVisible(),
																		onChange:
																			column.getToggleVisibilityHandler(),
																	}}
																	tabIndex={-1}
																	disableRipple
																/>
															</ListItemIcon>
															<ListItemText primary={column.columnDef.header} />
														</ListItemButton>
													);
												})}
											</List>
										}>
										<Button
											variant="contained"
											size="small"
											disableElevation
											onClick={toggleColumnDisplayPopUp}
											startIcon={<ChecklistIcon />}
											sx={{ borderRadius: "15px" }}>
											Column Display
										</Button>
									</StyledTooltip>
								</div>
							</ClickAwayListener>
						</Stack>
						<Table
							sx={{ minWidth: 650 }}
							size="small"
							aria-label="a dense table">
							<TableHead>
								{table.getHeaderGroups().map((headerGroup) => (
									<TableRow key={headerGroup.id}>
										{headerGroup.headers.map((header) => (
											<TableCell
												sx={{ fontWeight: "600", cursor: "pointer" }}
												key={header.id}
												colSpan={header.colSpan}
												onClick={header.column.getToggleSortingHandler()}>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext()
													  )}

												{{
													asc: " 🔼",
													desc: " 🔽",
												}[header.column.getIsSorted()] ?? null}
											</TableCell>
										))}
									</TableRow>
								))}
							</TableHead>
							<TableBody>
								{table.getRowModel().rows.map((row) => (
									<TableRow key={row.id}>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</TableCell>
										))}
									</TableRow>
								))}
							</TableBody>
						</Table>
						<Stack
							gap={2}
							alignItems={"center"}
							margin={"15px"}
							direction={"row"}
							justifyContent={"flex-end"}>
							<Stack alignItems={"center"} direction={"row"} gap={1}>
								<div>Page</div>
								<strong>
									{table.getState().pagination.pageIndex + 1} of{" "}
									{table.getPageCount().toLocaleString()}
								</strong>
							</Stack>
							<Stack alignItems={"center"} direction={"row"} gap={1}>
								<Typography>| Go to page:</Typography>
								<TextField
									size="small"
									type="number"
									defaultValue={table.getState().pagination.pageIndex + 1}
									onChange={(e) => {
										const page = e.target.value
											? Number(e.target.value) - 1
											: 0;
										table.setPageIndex(page);
									}}
								/>
							</Stack>

							<Select
								value={table.getState().pagination.pageSize}
								size="small"
								onChange={(e) => {
									table.setPageSize(Number(e.target.value));
								}}>
								{[10, 20, 30, 40, 50].map((pageSize) => (
									<MenuItem key={pageSize} value={pageSize}>
										Show {pageSize}
									</MenuItem>
								))}
							</Select>

							<IconButton
								size="small"
								onClick={() => table.firstPage()}
								disabled={!table.getCanPreviousPage()}>
								<KeyboardDoubleArrowLeftIcon fontSize="small" />
							</IconButton>
							<IconButton
								size="small"
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}>
								<KeyboardArrowLeftIcon fontSize="small" />
							</IconButton>
							<IconButton
								size="small"
								onClick={() => table.nextPage()}
								disabled={!table.getCanNextPage()}>
								<KeyboardArrowRightIcon fontSize="small" />
							</IconButton>
							<IconButton
								size="small"
								onClick={() => table.lastPage()}
								disabled={!table.getCanNextPage()}>
								<KeyboardDoubleArrowRightIcon fontSize="small" />
							</IconButton>
						</Stack>
					</TableContainer>
				</Box>
			</Container>
		</SuperAdminLayout>
	);
};

export default Videos;

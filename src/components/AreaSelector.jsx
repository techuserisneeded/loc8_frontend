import React, { useState } from "react";
import useSWR from "swr";

import Grid from "@mui/material/Grid";
import RSelect from "react-select";

import { getCitiesAPI, getZonesAPI, getStatesAPI } from "../apis/location.apis";
import { Stack, Box } from "@mui/material";

const defaultStateOptions = [{ value: 0, label: "Please Select Zone" }];

const defaultCityOptions = [{ value: 0, label: "Please Select State" }];

export default function AreaSelector({
	onChange,
	defaultZoneValue,
	defaultStateValue,
	defaultCityValue,
	layoutDirection = "column",
	disableAll = false,
}) {
	const [selectedData, setselectedData] = useState({
		zone: defaultZoneValue || { id: 0, label: "Select Zone", value: 0 },
		state: defaultStateValue || { id: 0, label: "Select State", value: 0 },
		city: defaultCityValue || { id: 0, label: "Select City", value: 0 },
	});

	const citiesDataResp = useSWR(
		selectedData.state.id
			? "/location/cities?state_id=" + selectedData.state.id
			: null,
		getCitiesAPI.bind(this, selectedData.state.id)
	);

	const zoneDataResp = useSWR("/location/zones", getZonesAPI);

	const statesDataResp = useSWR(
		selectedData.zone.id
			? "/location/states?zone_id=" + selectedData.zone.id
			: null,
		getStatesAPI.bind(this, selectedData.zone.id)
	);

	const handleSelectChange = (key = "", d = {}) => {
		setselectedData((prev) => {
			let newData = {};

			if (key === "zone") {
				newData = { zone: d, state: { id: null }, city: { id: null } };
			}

			if (key === "state") {
				newData = { ...prev, state: d, city: { id: null } };
			}

			if (key === "city") {
				newData = { ...prev, city: d };
			}

			onChange?.(newData);
			return newData;
		});
	};

	const zoneOptions = zoneDataResp.data
		? zoneDataResp.data.map((v) => ({
				...v,
				label: v.zone_name,
				value: v.zone_id,
				id: v.zone_id,
		  }))
		: [];

	const stateOptions = statesDataResp.data
		? statesDataResp.data.map((v) => ({
				...v,
				label: v.state_name,
				value: v.state_id,
				id: v.state_id,
		  }))
		: defaultStateOptions;

	const cityOptions = citiesDataResp.data
		? citiesDataResp.data.map((v) => ({
				...v,
				label: v.city_name,
				value: v.city_id,
				id: v.city_id,
		  }))
		: defaultCityOptions;

	return (
		<Stack width={"100%"} direction={layoutDirection} spacing={2}>
			<Box flex={1}>
				<RSelect
					isLoading={zoneDataResp.isLoading}
					placeholder="Select Zone"
					options={zoneOptions}
					value={selectedData.zone}
					onChange={handleSelectChange.bind(this, "zone")}
					isDisabled={disableAll}
					required
				/>
			</Box>
			<Box flex={1}>
				<RSelect
					isLoading={statesDataResp.isLoading}
					placeholder="Select State"
					options={stateOptions}
					value={selectedData.state}
					onChange={handleSelectChange.bind(this, "state")}
					isDisabled={disableAll}
					required
				/>
			</Box>
			<Box flex={1}>
				<RSelect
					isLoading={citiesDataResp.isLoading}
					placeholder="Select City"
					options={cityOptions}
					value={selectedData.city}
					onChange={handleSelectChange.bind(this, "city")}
					isDisabled={disableAll}
					required
				/>
			</Box>
		</Stack>
	);
}

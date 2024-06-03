import key_labels from "../constants/key_lables";

export const ROLE_WISE_PLAN_CSV_HEADERS = {
	CONTROLLER: [
		"zone_name",
		"state_name",
		"city_name",
		"location",
		"media_type",
		"illumination",
		"width",
		"height",
		"units",
		"total_area",
		"duration",
		"rental_per_month",
		"cost_for_duration",
		"printing_cost",
		"mounting_cost",
		"total",
	],
	PLANNER: [
		"zone_name",
		"state_name",
		"city_name",
		"location",
		"media_type",
		"illumination",
		"width",
		"height",
		"units",
		"total_area",
		"duration",
		"imp_per_month",
		"rental_per_month",
		"cost_for_duration",
		"printing_rate",
		"mountig_rate",
		"printing_cost",
		"mounting_cost",
		"total",
	],
};

export function cleanString(str = "") {
	return str.trim().toLowerCase();
}

export function formatPricing(value = 0) {
	return new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
	}).format(value);
}

export const convertToCSV = (array = []) => {
	let csvContent = "data:text/csv;charset=utf-8,";

	const headerRow = Object.keys(array[0]).join(",");
	csvContent += headerRow + "\r\n";

	array.forEach((item) => {
		const row = Object.values(item)
			.map((value) =>
				value.includes ? (value.includes(",") ? `"${value}"` : value) : value
			)
			.join(",");
		csvContent += row + "\r\n";
	});

	const encodedUri = encodeURI(csvContent);
	window.open(encodedUri);
};

export function mapPlanCSVDownload(role) {
	const ALLOWED_KEYS = ROLE_WISE_PLAN_CSV_HEADERS[role];

	return function (obj) {
		const newObj = {};

		for (const key in obj) {
			if (ALLOWED_KEYS.includes(key)) {
				const value = obj[key];
				const humanize_header = key_labels[key];

				newObj[humanize_header] = value;
			}
		}

		return newObj;
	};
}

export function getTotal(objectsArray = [], key = "") {
	return objectsArray.reduce((acc, obj) => {
		return parseFloat(acc) + parseFloat(obj[key]);
	}, 0);
}

export function generateRandomUniqueString(length = 16) {
	const array = new Uint8Array(length);
	window.crypto.getRandomValues(array);
	return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
		""
	);
}

export const getColorBasedOnSpeed = (currentSpeed) => {
	if (currentSpeed >= 0 && currentSpeed < 20) {
		return "red";
	} else if (currentSpeed >= 20 && currentSpeed < 40) {
		return "orange";
	} else if (currentSpeed >= 40 && currentSpeed < 60) {
		return "yellow";
	} else {
		return "green";
	}
};

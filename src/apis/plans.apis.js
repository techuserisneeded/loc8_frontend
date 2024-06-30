import axios from "../libs/axios.lib";
import * as loginUtils from "../utils/login.utils";

export async function addPlanAPI(fd) {
	const token = loginUtils.getUser().token;

	const { data } = await axios.post("plans/plans", fd, {
		headers: {
			Authorization: token,
			"Content-Type": "multipart/form-data",
		},
	});

	return data;
}

export async function getMediaPlansAPI({
	zone_id,
	state_id,
	city_id,
	...rest
}) {
	const token = loginUtils.getUser().token;

	const { data } = await axios.get("plans/plans/media", {
		params: {
			city_id,
			state_id,
			zone_id,
			...rest,
		},
		headers: {
			Authorization: token,
		},
	});

	return data;
}

export async function addAssetsToPlan(
	body = {
		billboards: [],
		budget_id: null,
		brief_id: null,
		video_id: null,
	}
) {
	const token = loginUtils.getUser().token;

	const { data } = await axios.post("plans/plans/assets", body, {
		headers: {
			Authorization: token,
		},
	});

	return data;
}

export async function deletePlanById(planId) {
	const token = loginUtils.getUser().token;

	await axios.delete("plans/plans/" + encodeURIComponent(planId), {
		headers: {
			Authorization: token,
		},
	});

	return true;
}

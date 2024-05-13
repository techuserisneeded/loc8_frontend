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

export async function deletePlanById(planId) {
	const token = loginUtils.getUser().token;

	await axios.delete("plans/plans/" + encodeURIComponent(planId), {
		headers: {
			Authorization: token,
		},
	});

	return true;
}

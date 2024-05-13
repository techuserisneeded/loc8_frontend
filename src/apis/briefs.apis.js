import axios from "../libs/axios.lib";
import * as loginUtils from "../utils/login.utils";

export async function getAdminsAPI() {
	const token = loginUtils.getUser().token;

	const { data } = await axios.get("admin/admins", {
		headers: {
			Authorization: token,
		},
	});

	return data;
}

export async function getBriefListAPI() {
	const token = loginUtils.getUser().token;

	const { data } = await axios.get("briefs/briefs", {
		headers: {
			Authorization: token,
		},
	});

	return data;
}

export async function getPlannerBriefListAPI() {
	const token = loginUtils.getUser().token;

	const { data } = await axios.get("briefs/planner", {
		headers: {
			Authorization: token,
		},
	});

	return data;
}

export async function getPlannersAPI() {
	const token = loginUtils.getUser().token;

	const { data } = await axios.get("admin/planners", {
		headers: {
			Authorization: token,
		},
	});

	return data;
}

export async function deleteBriefAPI(brief_id) {
	const token = loginUtils.getUser().token;

	await axios.delete("briefs/briefs/" + encodeURIComponent(brief_id), {
		headers: {
			Authorization: token,
		},
	});

	return true;
}

export async function getBriefDetailsByBriefIdAPI(brief_id) {
	const token = loginUtils.getUser().token;

	const { data } = await axios.get(
		"briefs/briefs/" + encodeURIComponent(brief_id),
		{
			headers: {
				Authorization: token,
			},
		}
	);

	return data;
}

export async function getPlannerBriefDetailsByBriefIdAPI(brief_id) {
	const token = loginUtils.getUser().token;

	const { data } = await axios.get(
		"briefs/briefs/" + encodeURIComponent(brief_id) + "/planner",
		{
			headers: {
				Authorization: token,
			},
		}
	);

	return data;
}

export async function getPlansByBriefIdAPI(brief_id) {
	const token = loginUtils.getUser().token;

	const { data } = await axios.get(
		"briefs/briefs/" + encodeURIComponent(brief_id) + "/plans",
		{
			headers: {
				Authorization: token,
			},
		}
	);

	return data;
}

export async function createBrief(formData) {
	const token = loginUtils.getUser().token;

	const { data } = await axios.post("briefs/briefs", formData, {
		headers: {
			Authorization: token,
			"Content-Type": "multipart/form-data",
		},
	});

	return data;
}

export async function editUserAPI(
	user_id,
	body = {
		first_name: "",
		last_name: "",
		emp_id: "",
		email: "",
		password: "",
		role_id: 0,
	}
) {
	const token = loginUtils.getUser().token;

	const { data } = await axios.put(
		"admin/admins/" + encodeURIComponent(user_id),
		{
			...body,
		},
		{
			headers: {
				Authorization: token,
			},
		}
	);

	return data;
}

export async function getBudgetDetailsByBudgetIdAPI(budget_id) {
	const token = loginUtils.getUser().token;

	const { data } = await axios.get(
		"briefs/budgets/" + encodeURIComponent(budget_id),
		{
			headers: {
				Authorization: token,
			},
		}
	);

	return data;
}

export async function finishPlanAPI(budget_id, brief_id) {
	const token = loginUtils.getUser().token;

	const { data } = await axios.put(
		"briefs/budgets/" + budget_id + "/" + brief_id + "/finish",
		{},
		{
			headers: {
				Authorization: token,
			},
		}
	);

	return data;
}

export async function downloadPlan(brief_id) {
	const token = loginUtils.getUser().token;

	const response = await axios.get("/briefs/briefs/" + brief_id + "/download", {
		headers: {
			Authorization: token,
		},
		responseType: "blob",
	});

	const url = window.URL.createObjectURL(new Blob([response.data]));
	const link = document.createElement("a");
	link.href = url;

	link.setAttribute("download", "presentation.pptx");
	document.body.appendChild(link);
	link.click();

	window.URL.revokeObjectURL(url);
}

import axios from "../libs/axios.lib";
import * as loginUtils from "../utils/login.utils";

export async function getControllersAPI() {
	const token = loginUtils.getUser().token;

	const { data } = await axios.get("controllers/controllers", {
		headers: {
			Authorization: token,
		},
	});

	return data;
}

export async function addControllerAPI(
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

	const { data } = await axios.post(
		"controllers/controller",
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

export async function editControllerAPI(
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
		"controllers/controllers/" + encodeURIComponent(user_id),
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

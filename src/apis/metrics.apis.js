import axios from "../libs/axios.lib";
import * as loginUtils from "../utils/login.utils";

export async function calculateSaliencyAPI(body = {}) {
	const token = loginUtils.getUser().token;

	const { data } = await axios.post("metrics/saliency", body, {
		headers: {
			Authorization: token,
		},
	});

	return data;
}

import axios from "../libs/axios.lib";
import * as loginUtils from "../utils/login.utils";

export async function addVideosAPI(fd) {
	const token = loginUtils.getUser().token;

	const { data } = await axios.post("videos/upload", fd, {
		headers: {
			Authorization: token,
			"Content-Type": "application/form-data",
		},
	});

	return data;
}

export async function mergeBillboardsAPI(billboard_ids = []) {
	const token = loginUtils.getUser().token;

	const { data } = await axios.post(
		"videos/billboards/merge",
		{
			billboard_ids,
		},
		{
			headers: {
				Authorization: token,
			},
		}
	);

	return data;
}

export async function getProcessedOutputAPI(video_id) {
	const token = loginUtils.getUser().token;

	const { data } = await axios.get(
		"videos/output/" + encodeURIComponent(video_id),
		{
			headers: {
				Authorization: token,
			},
		}
	);

	return data;
}

export async function getVidoesAPI() {
	const token = loginUtils.getUser().token;

	const { data } = await axios.get("videos/", {
		headers: {
			Authorization: token,
		},
	});

	return data;
}

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

export async function deleteVideosAPI(video_id) {
	const token = loginUtils.getUser().token;

	const { data } = await axios.delete(
		"videos/videos/" + encodeURIComponent(video_id),
		{
			headers: {
				Authorization: token,
			},
		}
	);

	return data;
}

export async function mergeBillboardsAPI(billboard_ids = [], selected_id) {
	const token = loginUtils.getUser().token;

	const { data } = await axios.post(
		"videos/billboards/merge",
		{
			billboard_ids,
			selected_id,
		},
		{
			headers: {
				Authorization: token,
			},
		}
	);

	return data;
}

export async function addAssetInfoAPI(billboard_id = "", fd) {
	const token = loginUtils.getUser().token;

	const { data } = await axios.put(
		"videos/billboards/asset-info/" + billboard_id,
		fd,
		{
			headers: {
				Authorization: token,
				"Content-Type": "application/form-data",
			},
		}
	);

	return data;
}

export async function getAssetInfoAPI(billboard_id = "") {
	const token = loginUtils.getUser().token;

	const { data } = await axios.get(
		"videos/billboards/asset-info/" + billboard_id,

		{
			headers: {
				Authorization: token,
				"Content-Type": "application/form-data",
			},
		}
	);

	return data;
}

export async function deleteBillboardsAPI(billboard_ids = []) {
	const token = loginUtils.getUser().token;

	const { data } = await axios.post(
		"videos/billboards/delete",
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

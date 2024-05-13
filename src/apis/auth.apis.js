import axios from "../libs/axios.lib";

export async function login(email, password) {
	const { data } = await axios.post("auth/login", {
		email,
		password,
	});

	return data;
}

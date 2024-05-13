import { useAuthState } from "../contexts/AuthProvider";

/**
 * @description returns auth state
 * @returns {{ saveUser:Function, user:{ first_name, last_name, token, role_id } || || null }}
 */
const useAuth = () => {
	const { user } = useAuthState();

	return user;
};

export default useAuth;

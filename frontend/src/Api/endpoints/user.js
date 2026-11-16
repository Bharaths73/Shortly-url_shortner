const API_URL = import.meta.env.VITE_API_BASE_URL;

export const userEndPoints = {
    login : `${API_URL}/api/v1/users/login`,
    register: `${API_URL}/api/v1/users/register`,
    getUser : `${API_URL}/api/v1/users/user`, //should pass Id in path variable
    me: `${API_URL}/api/v1/users/me`,
    updateUser: `${API_URL}/api/v1/users/user`, //should pass Id in path variable
    deleteUser: `${API_URL}/api/v1/users/user`, //should pass Id in path variable
    refreshToken: `${API_URL}/api/v1/users/refresh-token`,
    logout: `${API_URL}/api/v1/users/logout`
}
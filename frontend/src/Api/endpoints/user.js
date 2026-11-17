
export const userEndPoints = {
    login : `/api/v1/users/login`,
    register: `/api/v1/users/register`,
    getUser : `/api/v1/users/user`, //should pass Id in path variable
    me: `/api/v1/users/me`,
    verify_email: `/api/v1/users/verify-email`,
    profile: `/api/v1/users/user`, //should pass Id in path variable
    updateProfile: `/api/v1/users/user/me`,
    updatePassword: `/api/v1/users/user/me/password`,
    updateUser: `/api/v1/users/user`, //should pass Id in path variable
    deleteUser: `/api/v1/users/user`, //should pass Id in path variable
    refreshToken: `/api/v1/users/refresh-token`,
    logout: `/api/v1/users/logout`
}
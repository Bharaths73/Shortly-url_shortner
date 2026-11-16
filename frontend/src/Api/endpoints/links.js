const API_URL = import.meta.env.VITE_API_BASE_URL;

export const linksEndPoints = {
    getAllLinks: `${API_URL}/api/v1/urls/user`,
    createShortLink: `${API_URL}/api/v1/urls/url`,
}
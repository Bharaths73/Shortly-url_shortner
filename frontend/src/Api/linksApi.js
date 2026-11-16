import { authApi } from "./axios/axiosConfig";
import { linksEndPoints } from "./endpoints/links";

export async function getLinksPage(userId, page = 0, size = 10) {
    try {
        const response = await authApi.get(linksEndPoints.getAllLinks+`/${userId}?page=${page}&size=${size}`);
        const details = response.data?.data;
        return details;
    } catch (error) {
        console.log("Something went wrong", error);
        throw error;
    }
}

export async function generateShortLink(originalUrl) {
    try {
        const response = await authApi.post(linksEndPoints.createShortLink, originalUrl);
        const details = response.data?.data;
        return details;
    } catch (error) {
        console.log("Something went wrong", error);
        throw error;
    }
}
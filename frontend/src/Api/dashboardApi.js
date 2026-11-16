import { authApi } from "./axios/axiosConfig";
import { dashboardEndPoints } from "./endpoints/dashboard";

export async function getDashboardPage() {
    try {
        const response = await authApi.get(dashboardEndPoints.getAllCountMetrics);
        const details = response.data?.data;
        return details;
    } catch (error) {
        console.log("Something went wrong", error);
        throw error;
    }
}
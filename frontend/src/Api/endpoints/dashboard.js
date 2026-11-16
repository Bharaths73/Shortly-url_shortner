const API_URL = import.meta.env.VITE_API_BASE_URL;

export const dashboardEndPoints = {
    getAllCountMetrics: `${API_URL}/api/v1/analytics/dashboard`,
}
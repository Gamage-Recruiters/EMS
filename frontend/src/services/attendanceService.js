import api from "../api/api";

export const checkIn =  async () => {
   try {
    const response = await api.post("/attendance/checkIn");
    return {
        success: true,
        data: response.data,
    };
   }catch (error) {
    return {
        success: false,
        error: error.response?.data?.message || 'Failed to check in',
    };
   }
}
export const checkOut = async () => {
    try {
        const response = await api.put("/attendance/checkout");
        return {
            success: true,
            data: response.data,
        };
    }catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || 'Failed to check out',
        };

    }
}
export const getTodayAttendance = async () => {
   try {
    const response = await api.get("/attendance/todayAttendance");
    return {
        success: true,
        data: response.data,
    };
   }catch (error) {
    return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch today\'s attendance',
    };
   }
}
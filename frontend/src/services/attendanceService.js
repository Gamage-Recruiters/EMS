import api from "../api/api.js";

// check-in the user
export const checkIn =  async () => {
   try {
    const response = await api.post("/attendance/checkin");
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

// check-out the user
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

// get today's attendance status
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

// get all attendance records
export const getAllAttendance = async () => {
   try {
    const response = await api.get("/attendance");
    return {
        success: true,
        data: response.data,
    };
   }catch (error) {
    return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch attendance records',
    };
   }
}

// delete an attendance record by ID
export const deleteAttendanceRecord = async (id) => {
    try {
        const response = await api.delete(`/attendance/${id}`);
        return {
            success: true,
            data: response.data,
        };
    }catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || 'Failed to delete attendance record',
        };
    }
}
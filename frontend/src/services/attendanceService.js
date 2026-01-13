export const getEmployees = async () => {
    // MOCK DATA for now
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 1, name: 'John Doe', team: 'Marketing', checkIn: '09:00 AM', checkOut: '05:00 PM', status: 'active', leaveReason: '' },
                { id: 2, name: 'Jane Smith', team: 'Development', checkIn: '', checkOut: '', status: 'leave', leaveReason: 'Medical' },
            ]);
        }, 500); 
    });

    // LATER: replace with real API call
    // return axios.get('/api/employees').then(res => res.data);
};

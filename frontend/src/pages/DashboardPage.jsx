
import React from 'react';
import TimeTrackingCard from '../components/TimeTrackingCard';
import SummaryCard from '../components/SummaryCard';
import QuickActions from '../components/QuickActions';


const todayHours = { value: "7h 45m", remaining: "1h 15m remaining", iconColor: "bg-blue-500" };
const thisWeek = { value: "38h 20m", remaining: "On track", iconColor: "bg-green-500" };
const thisMonth = { value: "142h 15m", remaining: "18 working days", iconColor: "bg-amber-500" };

const DashboardPage = ({ checkInTime }) => {
    return (
        
        <div className="p-6 bg-gray-50 min-h-screen flex-grow overflow-y-auto">
            
           
            <TimeTrackingCard checkInTime={checkInTime} />

           
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                <SummaryCard title="Today's Hours" data={todayHours} />
                <SummaryCard title="This Week" data={thisWeek} />
                <SummaryCard title="This Month" data={thisMonth} />
            </div>

            
            <QuickActions />

        </div>
    );
};

export default DashboardPage;
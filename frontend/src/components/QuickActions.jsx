
import React from 'react';

const QuickActionItem = ({ icon, title, subtitle, iconBgColor }) => {
    const IconColorClass = iconBgColor; 

    return (
        
        <div 
            className="flex flex-col items-center p-5 bg-white rounded-lg border border-gray-100 shadow-sm cursor-pointer 
                        transition duration-150 hover:shadow-md hover:bg-gray-50 text-center flex-1 min-h-[140px]"
        >
            
            <div 
                className={`flex-shrink-0 text-xl p-3 rounded-md text-white mb-2 ${IconColorClass}`}
            >
                {icon}
            </div>
            
            
            <div className="flex flex-col flex-grow justify-center">
                <div className="font-semibold text-gray-800 text-base leading-tight">{title}</div>
                <div className="text-xs text-gray-500 mt-1">{subtitle}</div>
            </div>
        </div>
    );
};

const QuickActions = () => {
    return (
        
        <div className="bg-white p-5 rounded-xl shadow-md flex flex-col border border-gray-100">
            
           
            <h4 className="text-lg font-bold text-gray-800 mb-4 pb-2">Quick Actions</h4>
            
            
            <div className="flex flex-row gap-4">
                <QuickActionItem
                    icon="📄"
                    title="Request Leave"
                    subtitle="Submit a new leave request"
                    iconBgColor="bg-blue-600"
                />
                <QuickActionItem
                    icon="📈"
                    title="View Reports"
                    subtitle="Check attendance reports"
                    iconBgColor="bg-green-600"
                />
                <QuickActionItem
                    icon="⚙️"
                    title="Update Profile"
                    subtitle="Manage your information"
                    iconBgColor="bg-orange-600"
                />
            </div>
        </div>
    );
};

export default QuickActions;
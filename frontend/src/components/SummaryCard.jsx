
import React from 'react';

const SummaryCard = ({ title, data }) => {
    const { value, remaining, iconColor, icon } = data; 
    
    return (
        
        <div className="bg-white p-5 rounded-lg shadow-md relative min-h-32 border border-gray-100 transition duration-150 hover:shadow-lg">
            
          
            <div className="text-gray-500 font-medium text-sm mb-1">{title}</div>
            
            
            <div className="text-3xl font-black text-gray-900 my-1">{value}</div>
            
            
            <div className="text-xs text-gray-500 mt-2">{remaining}</div>

            
            <div 
                className={`absolute top-4 right-4 text-white p-2 rounded-full text-lg ${iconColor} shadow-sm opacity-90`}
            >
                {icon}
            </div>
            
        </div>
    );
};

export default SummaryCard;
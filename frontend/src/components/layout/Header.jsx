
import React from 'react';

const Header = () => {
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const userName = "John Smith";
    const userInitials = userName.split(' ').map(n => n[0]).join('');

    return (
        
        <header className="flex justify-between items-center px-6 py-3 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
            
            
            <div className="text-sm font-normal text-gray-500">
                 {today}
            </div>
            
            <div className="flex items-center space-x-4">
                
              
                <div className="flex items-center space-x-2 cursor-pointer p-1 rounded-full hover:bg-gray-50 transition duration-150">
                    <span className="font-semibold text-gray-800 text-sm hidden sm:inline">{userName}</span>
                    
                    
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex justify-center items-center font-bold text-xs shadow-sm">
                        {userInitials}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;

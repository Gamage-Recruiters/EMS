
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '🏠' },
    { name: 'Attendance', path: '/attendance', icon: '📅' },
    { name: 'Leave Management', path: '/leave-management', icon: '✈️' },
];

const Sidebar = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        
        <div className="flex flex-col w-60 bg-white shadow-lg flex-shrink-0 p-5 border-r border-gray-100">
            
           
            <div className="text-xl font-extrabold text-blue-700 mb-8">
                EMS Portal
            </div>

            
            <nav className="flex-grow space-y-1">
                {navItems.map(item => {
                    const isActive = currentPath === item.path || (currentPath === '/' && item.path === '/dashboard');
                    
                    const itemClasses = `flex items-center p-3 rounded-lg transition duration-150 ease-in-out text-sm ${
                        isActive
                            
                            ? 'bg-blue-50 text-blue-700 font-bold border-r-4 border-blue-600'
                            : 'text-gray-600 hover:bg-gray-100 font-medium'
                    }`;

                    return (
                        <Link 
                            key={item.path}
                            to={item.path}
                            className={itemClasses}
                        >
                            <span className="text-base mr-3">{item.icon}</span>
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

        </div>
    );
};

export default Sidebar;

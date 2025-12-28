import React, { useState } from 'react';

const Header = () => {
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const userName = "John Smith";
    const userInitials = userName.split(' ').map(n => n[0]).join('');

    const [status, setStatus] = useState('Available');
    const [open, setOpen] = useState(false);

    const statuses = [
        { label: 'Available', color: 'bg-green-500' },
        { label: 'Busy', color: 'bg-red-500' },
        { label: 'Be right back', color: 'bg-yellow-500' },
        { label: 'Appear away', color: 'bg-gray-400' },
    ];

    const currentStatus = statuses.find(s => s.label === status);

    return (
        <header className="flex justify-between items-center px-6 py-3 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
            <div className="text-sm font-normal text-gray-500">
                {today}
            </div>

            <div className="flex items-center space-x-4 relative">
                <div
                    className="flex items-center space-x-2 cursor-pointer p-1 rounded-full hover:bg-gray-50 transition duration-150"
                    onClick={() => setOpen(!open)}
                >
                    <span className="font-semibold text-gray-800 text-sm hidden sm:inline">{userName}</span>

                    <div className="relative w-8 h-8 rounded-full bg-blue-500 text-white flex justify-center items-center font-bold text-xs shadow-sm">
                        {userInitials}
                        <span
                            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${currentStatus.color}`}
                        />
                    </div>
                </div>

                {open && (
                    <div className="absolute right-0 top-12 w-44 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden">
                        {statuses.map(s => (
                            <button
                                key={s.label}
                                onClick={() => {
                                    setStatus(s.label);
                                    setOpen(false);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50"
                            >
                                <span className={`w-2 h-2 rounded-full mr-2 ${s.color}`} />
                                {s.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;

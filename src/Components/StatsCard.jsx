import React from 'react';
import { Users, UserPlus, Book } from 'lucide-react';
import UserList from '../Pages/UserList';

function StatsCard() {
    // Mock data
    const mockStats = {
        totalUsers: 1234,
        totalSignups: 856,
        totalQuizzes: 325,
        dashboardUserList: 78,
        UserList: 45,
    };

    const cards = [
        {
            title: 'Total Users',
            value: mockStats.totalUsers,
            icon: <Users className='w-8 h-8 text-blue-500' />,
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Total Signups',
            value: mockStats.totalSignups,
            icon: <UserPlus className='w-8 h-8 text-green-500' />,
            bgColor: 'bg-green-50',
        },
        {
            title: 'Total Quizzes',
            value: mockStats.totalQuizzes,
            icon: <Book className='w-8 h-8 text-purple-500' />,
            bgColor: 'bg-purple-50',
        },
        {
            title: ' dashboardUserList',
            value: mockStats.totalQuizzes,
            icon: <Book className='w-8 h-8 text-purple-500' />,
            bgColor: 'bg-purple-50',
        },
        {
            title: 'UserList',
            value: mockStats.totalSignups,
            icon: <UserPlus className='w-8 h-8 text-green-500' />,
            bgColor: 'bg-green-50',
        },
    ];

    return (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 p-4 '>
            {cards.map((card, index) => (
                <div
                    key={index}
                    className={`${card.bgColor} p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300`}
                >
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-gray-600 text-sm font-medium'>
                                {card.title}
                            </p>
                            <h3 className='text-3xl font-bold text-gray-800 mt-2'>
                                {card.value.toLocaleString()}
                            </h3>
                        </div>
                        {card.icon}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default StatsCard;

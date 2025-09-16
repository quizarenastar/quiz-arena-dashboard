import React, { useState, useEffect } from 'react';
import UserService from '../service/UserService';

const DashboardUserList = () => {
    const [dashboardUsers, setDashboardUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchDashboardUsers();
    }, []);

    const fetchDashboardUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await UserService.getDashboardUserList();
            if (response.success) {
                setDashboardUsers(response.data);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError('Failed to fetch dashboard users');
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = dashboardUsers.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='container mx-auto px-4 py-8'>
            <div className='mb-6'>
                <h1 className='text-2xl font-bold dark:text-white mb-4'>
                    Dashboard Users
                </h1>
                <div className='relative'>
                    <input
                        type='text'
                        placeholder='Search users...'
                        className='w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className='flex justify-center items-center h-64'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
                </div>
            ) : error ? (
                <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
                    {error}
                </div>
            ) : (
                <div className='bg-white min-h-screen dark:bg-gray-800 shadow-md rounded-lg overflow-hidden'>
                    <table className='min-w-full'>
                        <thead className='bg-gray-100 dark:bg-gray-700'>
                            <tr>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                                    Name
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                                    Email
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                                    Status
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                                    Role
                                </th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-200 dark:divide-gray-600'>
                            {filteredUsers.map((user) => (
                                <tr
                                    key={user._id}
                                    className='hover:bg-gray-50 dark:hover:bg-gray-700'
                                >
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <div className='flex items-center'>
                                            <div className='h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center'>
                                                {user.name.charAt(0)}
                                            </div>
                                            <div className='ml-4'>
                                                <div className='text-sm font-medium text-gray-900 dark:text-white'>
                                                    {user.name}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <div className='text-sm text-gray-500 dark:text-gray-300'>
                                            {user.email}
                                        </div>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                user.active
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {user.active
                                                ? 'Active'
                                                : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300'>
                                        {user.role || 'User'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default DashboardUserList;

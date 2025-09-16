import React, { useState, useEffect } from 'react';
import UserService from '../service/UserService';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [dashboardUsers, setDashboardUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('all'); // 'all' or 'dashboard'

    useEffect(() => {
        fetchUsers();
    }, [activeTab]);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            if (activeTab === 'all') {
                const response = await UserService.getUserList();
                if (response.success) {
                    setUsers(response.data);
                } else {
                    setError(response.message);
                }
            } else {
                const response = await UserService.getDashboardUserList();
                if (response.success) {
                    setDashboardUsers(response.data);
                } else {
                    setError(response.message);
                }
            }
        } catch (err) {
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const renderUserTable = (userList) => (
        <table className='min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden'>
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
                </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 dark:divide-gray-600'>
                {userList.map((user) => (
                    <tr key={user._id}>
                        <td className='px-6 py-4 whitespace-nowrap'>
                            {user.name}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                            {user.email}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                            <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    user.active
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                }`}
                            >
                                {user.active ? 'Active' : 'Inactive'}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <div className='container mx-auto px-4 py-8'>
            <div className='flex justify-between items-center mb-6'>
                <h1 className='text-2xl font-bold dark:text-white'>
                    User Management
                </h1>
                <div className='space-x-2'>
                    <button
                        className={`px-4 py-2 rounded ${
                            activeTab === 'all'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700'
                        }`}
                        onClick={() => setActiveTab('all')}
                    >
                        All Users
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${
                            activeTab === 'dashboard'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700'
                        }`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        Dashboard Users
                    </button>
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
                renderUserTable(activeTab === 'all' ? users : dashboardUsers)
            )}
        </div>
    );
};

export default UserList;

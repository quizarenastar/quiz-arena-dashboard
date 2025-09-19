import React, { useState, useEffect } from 'react';
import UserService from '../service/UserService';
import toast from 'react-hot-toast';

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
                toast.success('Loaded dashboard users');
            } else {
                setError(response.message);
                toast.error(
                    response.message || 'Failed to load dashboard users'
                );
            }
        } catch (err) {
            console.log(err);
            toast.error('Failed to fetch dashboard users');
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
        <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                {/* Header */}
                <div className='mb-8 text-center'>
                    <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-4'>
                        <svg
                            className='w-8 h-8 text-white'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z'
                            />
                        </svg>
                    </div>
                    <h1 className='text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2'>
                        Dashboard Users
                    </h1>
                    <p className='text-gray-600 dark:text-gray-400 max-w-md mx-auto'>
                        Manage and view all dashboard users with ease
                    </p>
                </div>

                {/* Search */}
                <div className='mb-8 flex justify-center'>
                    <div className='relative max-w-md w-full'>
                        <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                            <svg
                                className='h-5 w-5 text-indigo-400'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                                />
                            </svg>
                        </div>
                        <input
                            type='text'
                            placeholder='Search users by name or email...'
                            className='block w-full pl-12 pr-4 py-4 border border-transparent rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg dark:bg-gray-800/80 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:bg-white dark:focus:bg-gray-800 transition-all duration-200'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className='absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 pointer-events-none'></div>
                    </div>
                </div>

                {loading ? (
                    <div className='flex justify-center items-center h-64'>
                        <div className='animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-500'></div>
                    </div>
                ) : error ? (
                    <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'>
                        {error}
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className='hidden md:block bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 shadow-2xl rounded-3xl border border-white/20 dark:border-gray-700/50 overflow-hidden'>
                            <div className='bg-gradient-to-r from-indigo-500/5 to-purple-500/5 px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50'>
                                <h2 className='text-lg font-semibold text-gray-800 dark:text-white'>
                                    Users Overview
                                </h2>
                            </div>
                            <table className='min-w-full divide-y divide-gray-200/50 dark:divide-gray-700/50'>
                                <thead className='bg-gradient-to-r from-gray-50/50 to-indigo-50/50 dark:from-gray-700/50 dark:to-gray-600/50'>
                                    <tr>
                                        <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider'>
                                            User Information
                                        </th>
                                        <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider'>
                                            Status
                                        </th>
                                        <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider'>
                                            Role
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className='bg-white/50 dark:bg-gray-800/50 divide-y divide-gray-200/30 dark:divide-gray-700/30'>
                                    {filteredUsers.map((user, index) => (
                                        <tr
                                            key={user._id}
                                            className='hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 dark:hover:from-gray-700/50 dark:hover:to-gray-600/50 transition-all duration-200 group'
                                        >
                                            <td className='px-6 py-6 whitespace-nowrap'>
                                                <div className='flex items-center'>
                                                    <div
                                                        className={`h-12 w-12 rounded-xl shadow-lg flex items-center justify-center text-white font-semibold text-lg bg-gradient-to-br ${
                                                            index % 4 === 0
                                                                ? 'from-blue-500 to-cyan-500'
                                                                : index % 4 ===
                                                                  1
                                                                ? 'from-purple-500 to-pink-500'
                                                                : index % 4 ===
                                                                  2
                                                                ? 'from-green-500 to-emerald-500'
                                                                : 'from-orange-500 to-red-500'
                                                        } group-hover:scale-110 transition-transform duration-200`}
                                                    >
                                                        {user.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>
                                                    <div className='ml-4'>
                                                        <div className='text-sm font-semibold text-gray-900 dark:text-white'>
                                                            {user.name}
                                                        </div>
                                                        <div className='text-sm text-gray-600 dark:text-gray-400'>
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='px-6 py-6 whitespace-nowrap'>
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                                                        user.active
                                                            ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                                                            : 'bg-gradient-to-r from-red-400 to-pink-500 text-white'
                                                    } group-hover:scale-105 transition-transform duration-200`}
                                                >
                                                    <span
                                                        className={`w-2 h-2 mr-2 rounded-full bg-white/80`}
                                                    ></span>
                                                    {user.active
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className='px-6 py-6 whitespace-nowrap'>
                                                <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 dark:from-indigo-900/30 dark:to-purple-900/30 dark:text-indigo-300'>
                                                    {user.role || 'User'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className='md:hidden space-y-4'>
                            {filteredUsers.map((user, index) => (
                                <div
                                    key={user._id}
                                    className='bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-2xl border border-white/20 dark:border-gray-700/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1'
                                >
                                    <div className='flex items-center space-x-4 mb-4'>
                                        <div
                                            className={`h-14 w-14 rounded-xl shadow-lg flex items-center justify-center text-white font-bold text-xl bg-gradient-to-br ${
                                                index % 4 === 0
                                                    ? 'from-blue-500 to-cyan-500'
                                                    : index % 4 === 1
                                                    ? 'from-purple-500 to-pink-500'
                                                    : index % 4 === 2
                                                    ? 'from-green-500 to-emerald-500'
                                                    : 'from-orange-500 to-red-500'
                                            }`}
                                        >
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className='flex-1 min-w-0'>
                                            <div className='text-lg font-semibold text-gray-900 dark:text-white truncate'>
                                                {user.name}
                                            </div>
                                            <div className='text-sm text-gray-600 dark:text-gray-400 truncate'>
                                                {user.email}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex items-center justify-between'>
                                        <span
                                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium shadow-sm ${
                                                user.active
                                                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                                                    : 'bg-gradient-to-r from-red-400 to-pink-500 text-white'
                                            }`}
                                        >
                                            <span className='w-2 h-2 mr-2 rounded-full bg-white/80'></span>
                                            {user.active
                                                ? 'Active'
                                                : 'Inactive'}
                                        </span>
                                        <span className='inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 dark:from-indigo-900/30 dark:to-purple-900/30 dark:text-indigo-300'>
                                            {user.role || 'User'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredUsers.length === 0 && (
                            <div className='text-center py-16'>
                                <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full mb-6'>
                                    <svg
                                        className='w-10 h-10 text-gray-400 dark:text-gray-500'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        stroke='currentColor'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth={1.5}
                                            d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z'
                                        />
                                    </svg>
                                </div>
                                <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                                    No users found
                                </h3>
                                <p className='text-gray-600 dark:text-gray-400 max-w-md mx-auto'>
                                    We couldn't find any users matching your
                                    search criteria. Try adjusting your search
                                    terms.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default DashboardUserList;

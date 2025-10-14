import { useState, useEffect } from 'react';
import UserService from '../service/UserService';
import toast from 'react-hot-toast';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'blocked'
    const [balanceRange, setBalanceRange] = useState({ min: '', max: '' });
    const [viewMode, setViewMode] = useState('table');

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 768px)');
        const handleResize = (e) => {
            setViewMode(e.matches ? 'table' : 'grid');
        };

        // Set initial view mode
        handleResize(mediaQuery);

        // Add listener for window resize
        mediaQuery.addEventListener('change', handleResize);

        // Cleanup
        return () => mediaQuery.removeEventListener('change', handleResize);
    }, []);

    // Filter users based on all criteria
    const filterUsers = (users) => {
        return users.filter((user) => {
            // Search filter for username or email
            const searchMatch =
                !searchTerm ||
                user.username
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase());

            // Status filter
            const statusMatch =
                statusFilter === 'all' ||
                (statusFilter === 'true' && !user.blocked) ||
                (statusFilter === 'false' && user.blocked);

            // Balance range filter
            const minBalance = balanceRange.min
                ? parseFloat(balanceRange.min)
                : -Infinity;
            const maxBalance = balanceRange.max
                ? parseFloat(balanceRange.max)
                : Infinity;
            const balanceMatch =
                (user.currentBalance || 0) >= minBalance &&
                (user.currentBalance || 0) <= maxBalance;

            return searchMatch && statusMatch && balanceMatch;
        });
    };

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await UserService.getUserList();
            if (response.success) {
                setUsers(response.data);
            } else {
                setError(response.message);
                toast.error(response.message || 'Failed to load users');
            }
        } catch (err) {
            console.log(err);
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const renderUserTable = (userList) => {
        const filteredUsers = filterUsers(userList);
        return (
            <>
                {filteredUsers.length === 0 ? (
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
                            Try adjusting your filters or search terms
                        </p>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                        {filteredUsers.map((user, index) => (
                            <div
                                key={user._id}
                                className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden'
                            >
                                <div className='p-6'>
                                    {/* User Header */}
                                    <div className='flex items-center space-x-4 mb-4'>
                                        <div
                                            className={`h-16 w-16 rounded-xl shadow-sm flex items-center justify-center text-white font-semibold text-2xl bg-gradient-to-br ${
                                                index % 4 === 0
                                                    ? 'from-blue-500 to-cyan-500'
                                                    : index % 4 === 1
                                                    ? 'from-purple-500 to-pink-500'
                                                    : index % 4 === 2
                                                    ? 'from-green-500 to-emerald-500'
                                                    : 'from-orange-500 to-red-500'
                                            }`}
                                        >
                                            {user.username
                                                ?.charAt(0)
                                                ?.toUpperCase() || 'U'}
                                        </div>
                                        <div className='flex-1 min-w-0'>
                                            <h3 className='text-lg font-semibold text-gray-900 dark:text-white truncate'>
                                                {user.username || 'No Username'}
                                            </h3>
                                            <p className='text-sm text-gray-500 dark:text-gray-400 truncate'>
                                                {user.email || 'No Email'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className='mb-4'>
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                                                !user.blocked
                                                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                                                    : 'bg-gradient-to-r from-red-400 to-pink-500 text-white'
                                            }`}
                                        >
                                            <span className='w-2 h-2 mr-2 rounded-full bg-white/80'></span>
                                            {!user.blocked
                                                ? 'Active'
                                                : 'Blocked'}
                                        </span>
                                    </div>

                                    {/* Balance Info */}
                                    <div className='grid grid-cols-2 gap-4 text-sm'>
                                        <div>
                                            <p className='text-gray-500 dark:text-gray-400'>
                                                Current Balance
                                            </p>
                                            <p className='text-lg font-semibold text-gray-900 dark:text-white'>
                                                ₹{user.currentBalance || 0}
                                            </p>
                                        </div>
                                        <div>
                                            <p className='text-gray-500 dark:text-gray-400'>
                                                Total Earn
                                            </p>
                                            <p className='text-lg font-semibold text-green-600 dark:text-green-400'>
                                                ₹{user.totalEarn || 0}
                                            </p>
                                        </div>
                                    </div>

                                    <div className='mt-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
                                        <div className='flex items-center justify-between'>
                                            <div className='text-sm text-gray-500 dark:text-gray-400'>
                                                Joined:{' '}
                                                {new Date(
                                                    user.createdAt
                                                ).toLocaleDateString()}
                                            </div>
                                            <div className='text-sm text-gray-500 dark:text-gray-400'>
                                                Redeemed: ₹
                                                {user.totalRedeem || 0}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 shadow-sm rounded-3xl border border-white/20 dark:border-gray-700/50 overflow-hidden'>
                        <div className='bg-gradient-to-r from-indigo-500/5 to-purple-500/5 px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50'>
                            <h2 className='text-lg font-semibold text-gray-800 dark:text-white'>
                                Users Overview
                            </h2>
                        </div>
                        <table className='min-w-full divide-y divide-gray-200/50 dark:divide-gray-700/50'>
                            <thead className='bg-gradient-to-r from-gray-50/50 to-indigo-50/50 dark:from-gray-700/50 dark:to-gray-600/50'>
                                <tr>
                                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider'>
                                        Username
                                    </th>
                                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider'>
                                        Email
                                    </th>
                                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider'>
                                        Current Balance
                                    </th>
                                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider'>
                                        Total Earn
                                    </th>
                                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider'>
                                        Total Redeem
                                    </th>
                                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider'>
                                        Status
                                    </th>
                                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider'>
                                        Created At
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
                                                    className={`h-12 w-12 rounded-xl shadow-sm flex items-center justify-center text-white font-semibold text-lg bg-gradient-to-br ${
                                                        index % 4 === 0
                                                            ? 'from-blue-500 to-cyan-500'
                                                            : index % 4 === 1
                                                            ? 'from-purple-500 to-pink-500'
                                                            : index % 4 === 2
                                                            ? 'from-green-500 to-emerald-500'
                                                            : 'from-orange-500 to-red-500'
                                                    } group-hover:scale-110 transition-transform duration-200`}
                                                >
                                                    {user.username
                                                        ?.charAt(0)
                                                        ?.toUpperCase() || 'U'}
                                                </div>
                                                <div className='ml-4'>
                                                    <div className='text-sm font-semibold text-gray-900 dark:text-white'>
                                                        {user.username ||
                                                            'No Username'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='px-6 py-6 whitespace-nowrap'>
                                            <div className='text-sm text-gray-600 dark:text-gray-400'>
                                                {user.email || 'No Email'}
                                            </div>
                                        </td>
                                        <td className='px-6 py-6 whitespace-nowrap'>
                                            <div className='text-sm text-gray-600 dark:text-gray-400'>
                                                ₹{user.currentBalance || 0}
                                            </div>
                                        </td>
                                        <td className='px-6 py-6 whitespace-nowrap'>
                                            <div className='text-sm text-gray-600 dark:text-gray-400'>
                                                ₹{user.totalEarn || 0}
                                            </div>
                                        </td>
                                        <td className='px-6 py-6 whitespace-nowrap'>
                                            <div className='text-sm text-gray-600 dark:text-gray-400'>
                                                ₹{user.totalRedeem || 0}
                                            </div>
                                        </td>
                                        <td className='px-6 py-6 whitespace-nowrap'>
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                                                    !user.blocked
                                                        ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                                                        : 'bg-gradient-to-r from-red-400 to-pink-500 text-white'
                                                } group-hover:scale-105 transition-transform duration-200`}
                                            >
                                                <span className='w-2 h-2 mr-2 rounded-full bg-white/80'></span>
                                                {!user.blocked
                                                    ? 'Active'
                                                    : 'Blocked'}
                                            </span>
                                        </td>
                                        <td className='px-6 py-6 whitespace-nowrap'>
                                            <div className='text-sm text-gray-600 dark:text-gray-400'>
                                                {new Date(
                                                    user.createdAt
                                                ).toLocaleDateString()}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </>
        );
    };

    return (
        <div className='min-h-screen '>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <div className='mb-6'>
                    <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
                        User Management
                    </h1>
                    <p className='text-gray-600 dark:text-gray-400'>
                        Manage user accounts and permissions
                    </p>
                </div>
                {/* Search and Filters */}
                <div className='mb-8'>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                        {/* Search Bar with Button */}
                        <div className='col-span-1 md:col-span-2 relative'>
                            <div className='flex'>
                                <div className='relative flex-grow'>
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                        <svg
                                            className='h-5 w-5 text-gray-400'
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
                                        placeholder='Search by username or email...'
                                        className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-l-lg bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 dark:border-gray-600 dark:text-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                </div>
                                {/* <button
                                    className='px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-r-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                                    onClick={() => setIsSearching(true)}
                                >
                                    Search
                                </button> */}
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div className='col-span-1'>
                            <select
                                className='block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 dark:border-gray-600 dark:text-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                            >
                                <option value='all'>All Status</option>
                                <option value='true'>Active</option>
                                <option value='false'>Blocked</option>
                            </select>
                        </div>

                        {/* Balance Range Filter */}
                        <div className='col-span-1'>
                            <div className='flex space-x-2'>
                                <input
                                    type='number'
                                    placeholder='Min ₹'
                                    className='block w-1/2 pl-3 pr-3 py-2 border border-gray-300 rounded-lg bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 dark:border-gray-600 dark:text-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                                    value={balanceRange.min}
                                    onChange={(e) =>
                                        setBalanceRange({
                                            ...balanceRange,
                                            min: e.target.value,
                                        })
                                    }
                                />
                                <input
                                    type='number'
                                    placeholder='Max ₹'
                                    className='block w-1/2 pl-3 pr-3 py-2 border border-gray-300 rounded-lg bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 dark:border-gray-600 dark:text-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                                    value={balanceRange.max}
                                    onChange={(e) =>
                                        setBalanceRange({
                                            ...balanceRange,
                                            max: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>

                        {/* View Toggle */}
                        <div className='col-span-1 flex justify-end'>
                            <div className='flex space-x-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg'>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded transition-colors ${
                                        viewMode === 'grid'
                                            ? 'bg-white dark:bg-gray-600 text-indigo-600 shadow-sm'
                                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    <svg
                                        className='w-5 h-5'
                                        fill='none'
                                        stroke='currentColor'
                                        viewBox='0 0 24 24'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth={2}
                                            d='M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
                                        />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={`p-2 rounded transition-colors ${
                                        viewMode === 'table'
                                            ? 'bg-white dark:bg-gray-600 text-indigo-600 shadow-sm'
                                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    <svg
                                        className='w-5 h-5'
                                        fill='none'
                                        stroke='currentColor'
                                        viewBox='0 0 24 24'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth={2}
                                            d='M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table or Loader */}
                {loading ? (
                    <div className='flex justify-center items-center h-64'>
                        <div className='animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-indigo-500'></div>
                    </div>
                ) : error ? (
                    <div className='bg-red-50/80 backdrop-blur-sm border border-red-200/50 text-red-700 px-6 py-4 rounded-2xl dark:bg-red-900/20 dark:border-red-800/50 dark:text-red-400 shadow-lg'>
                        {error}
                    </div>
                ) : (
                    renderUserTable(users.length > 0 ? users : [])
                )}
            </div>
        </div>
    );
};

export default UserList;

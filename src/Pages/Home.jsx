import React, { useState, useEffect } from 'react';
import StatsCard from '../Components/StatsCard';
import StatsService from '../service/StatsService';
import toast from 'react-hot-toast';
import {
    TrendingUp,
    Users,
    DollarSign,
    Activity,
    Clock,
    CheckCircle,
    XCircle,
    Loader2,
} from 'lucide-react';

const Home = () => {
    const [dashboardStats, setDashboardStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                const response = await StatsService.getDashboardStats();
                if (response.success) {
                    setDashboardStats(response.data);
                }
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
                toast.error('Failed to load detailed statistics');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardStats();
    }, []);

    return (
        <div className='container mx-auto bg-blue-50 dark:bg-gray-900 min-h-screen transition-colors duration-200'>
            <h1 className='text-3xl text-center font-bold text-gray-900 dark:text-white mb-6'>
                Welcome to the Admin Dashboard
            </h1>

            {/* Stats Cards */}
            <StatsCard />

            {/* Detailed Dashboard Statistics */}
            {loading ? (
                <div className='flex items-center justify-center h-64 mt-8'>
                    <Loader2 className='w-8 h-8 animate-spin text-blue-600' />
                    <span className='ml-3 text-gray-600 dark:text-gray-400'>
                        Loading detailed statistics...
                    </span>
                </div>
            ) : dashboardStats ? (
                <div className='mt-8 space-y-6'>
                    {/* Overview Section */}
                    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>
                        <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>
                            Platform Overview
                        </h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                            <div className='flex items-center space-x-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg'>
                                <Clock className='w-10 h-10 text-yellow-600' />
                                <div>
                                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                                        Pending Quizzes
                                    </p>
                                    <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                                        {dashboardStats.overview.pendingQuizzes}
                                    </p>
                                </div>
                            </div>

                            <div className='flex items-center space-x-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg'>
                                <CheckCircle className='w-10 h-10 text-green-600' />
                                <div>
                                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                                        Approved Quizzes
                                    </p>
                                    <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                                        {
                                            dashboardStats.overview
                                                .approvedQuizzes
                                        }
                                    </p>
                                </div>
                            </div>

                            <div className='flex items-center space-x-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg'>
                                <XCircle className='w-10 h-10 text-red-600' />
                                <div>
                                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                                        Rejected Quizzes
                                    </p>
                                    <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                                        {
                                            dashboardStats.overview
                                                .rejectedQuizzes
                                        }
                                    </p>
                                </div>
                            </div>

                            <div className='flex items-center space-x-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
                                <Activity className='w-10 h-10 text-blue-600' />
                                <div>
                                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                                        Total Attempts
                                    </p>
                                    <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                                        {dashboardStats.overview.totalAttempts}
                                    </p>
                                </div>
                            </div>

                            <div className='flex items-center space-x-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg'>
                                <Users className='w-10 h-10 text-purple-600' />
                                <div>
                                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                                        Regular Users
                                    </p>
                                    <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                                        {dashboardStats.overview.totalUsers}
                                    </p>
                                </div>
                            </div>

                            <div className='flex items-center space-x-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg'>
                                <TrendingUp className='w-10 h-10 text-indigo-600' />
                                <div>
                                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                                        Quiz Creators
                                    </p>
                                    <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                                        {dashboardStats.overview.totalCreators}
                                    </p>
                                </div>
                            </div>

                            <div className='flex items-center space-x-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg col-span-1 md:col-span-2'>
                                <DollarSign className='w-10 h-10 text-emerald-600' />
                                <div>
                                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                                        Total Revenue
                                    </p>
                                    <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                                        ₹
                                        {dashboardStats.overview.totalRevenue.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Monthly Stats */}
                    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>
                        <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>
                            Last 30 Days Performance
                        </h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                            <div className='p-4 border-2 border-blue-200 dark:border-blue-700 rounded-lg'>
                                <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>
                                    New Quizzes
                                </p>
                                <p className='text-3xl font-bold text-blue-600'>
                                    {dashboardStats.monthly.quizzes}
                                </p>
                            </div>

                            <div className='p-4 border-2 border-purple-200 dark:border-purple-700 rounded-lg'>
                                <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>
                                    New Users
                                </p>
                                <p className='text-3xl font-bold text-purple-600'>
                                    {dashboardStats.monthly.users}
                                </p>
                            </div>

                            <div className='p-4 border-2 border-green-200 dark:border-green-700 rounded-lg'>
                                <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>
                                    Quiz Attempts
                                </p>
                                <p className='text-3xl font-bold text-green-600'>
                                    {dashboardStats.monthly.attempts}
                                </p>
                            </div>

                            <div className='p-4 border-2 border-emerald-200 dark:border-emerald-700 rounded-lg'>
                                <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>
                                    Revenue
                                </p>
                                <p className='text-3xl font-bold text-emerald-600'>
                                    ₹
                                    {dashboardStats.monthly.revenue.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                        {/* Recent Pending Quizzes */}
                        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>
                            <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>
                                Recent Pending Quizzes
                            </h2>
                            {dashboardStats.recent.quizzes.length > 0 ? (
                                <div className='space-y-3'>
                                    {dashboardStats.recent.quizzes.map(
                                        (quiz) => (
                                            <div
                                                key={quiz._id}
                                                className='p-3 bg-gray-50 dark:bg-gray-700 rounded-lg'
                                            >
                                                <p className='font-semibold text-gray-900 dark:text-white'>
                                                    {quiz.title}
                                                </p>
                                                <p className='text-sm text-gray-600 dark:text-gray-400'>
                                                    by{' '}
                                                    {quiz.creatorId?.username ||
                                                        'Unknown'}
                                                </p>
                                                <p className='text-xs text-gray-500 dark:text-gray-500'>
                                                    {new Date(
                                                        quiz.createdAt
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                <p className='text-gray-600 dark:text-gray-400 text-center py-4'>
                                    No pending quizzes
                                </p>
                            )}
                        </div>

                        {/* Recent Transactions */}
                        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>
                            <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>
                                Recent Transactions
                            </h2>
                            {dashboardStats.recent.transactions.length > 0 ? (
                                <div className='space-y-3 max-h-96 overflow-y-auto'>
                                    {dashboardStats.recent.transactions.map(
                                        (txn) => (
                                            <div
                                                key={txn._id}
                                                className='p-3 bg-gray-50 dark:bg-gray-700 rounded-lg flex justify-between items-center'
                                            >
                                                <div>
                                                    <p className='font-semibold text-gray-900 dark:text-white'>
                                                        {txn.userId?.username ||
                                                            'Unknown'}
                                                    </p>
                                                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                                                        {txn.type}
                                                    </p>
                                                    <p className='text-xs text-gray-500'>
                                                        {new Date(
                                                            txn.createdAt
                                                        ).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <p className='text-lg font-bold text-green-600'>
                                                    ₹{txn.amount}
                                                </p>
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                <p className='text-gray-600 dark:text-gray-400 text-center py-4'>
                                    No recent transactions
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default Home;

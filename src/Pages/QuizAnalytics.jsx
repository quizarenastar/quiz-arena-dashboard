import React, { useState, useEffect } from 'react';
import StatsService from '../service/StatsService';
import toast from 'react-hot-toast';
import {
    TrendingUp,
    BarChart3,
    PieChart,
    DollarSign,
    Calendar,
    Loader2,
} from 'lucide-react';

const QuizAnalytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('30');

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await StatsService.getQuizAnalytics(period);
            if (response.success) {
                setAnalytics(response.data);
            } else {
                toast.error('Failed to load analytics');
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
            toast.error('Failed to load quiz analytics');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [period]);

    const getDifficultyColor = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case 'easy':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'hard':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    return (
        <div className='container mx-auto bg-blue-50 dark:bg-gray-900 min-h-screen p-6 transition-colors duration-200'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6'>
                <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0'>
                    Quiz Analytics
                </h1>

                {/* Period Filter */}
                <div className='flex items-center space-x-3'>
                    <Calendar className='w-5 h-5 text-gray-600 dark:text-gray-400' />
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500'
                    >
                        <option value='7'>Last 7 Days</option>
                        <option value='30'>Last 30 Days</option>
                        <option value='90'>Last 90 Days</option>
                        <option value='180'>Last 6 Months</option>
                        <option value='365'>Last Year</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className='flex items-center justify-center h-64'>
                    <Loader2 className='w-8 h-8 animate-spin text-blue-600' />
                    <span className='ml-3 text-gray-600 dark:text-gray-400'>
                        Loading analytics...
                    </span>
                </div>
            ) : analytics ? (
                <div className='space-y-6'>
                    {/* Quiz Trends Chart */}
                    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>
                        <div className='flex items-center mb-4'>
                            <TrendingUp className='w-6 h-6 text-blue-600 mr-2' />
                            <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                Quiz Creation Trends
                            </h2>
                        </div>
                        {analytics.quizTrends.length > 0 ? (
                            <div className='overflow-x-auto'>
                                <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                                    <thead className='bg-gray-50 dark:bg-gray-700'>
                                        <tr>
                                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                                                Date
                                            </th>
                                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                                                Total Quizzes
                                            </th>
                                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                                                Approved
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
                                        {analytics.quizTrends.map(
                                            (trend, idx) => (
                                                <tr key={idx}>
                                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white'>
                                                        {trend._id.year}-
                                                        {trend._id.month}-
                                                        {trend._id.day}
                                                    </td>
                                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white'>
                                                        {trend.count}
                                                    </td>
                                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400'>
                                                        {trend.approved}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className='text-gray-600 dark:text-gray-400 text-center py-8'>
                                No quiz trends data available for this period
                            </p>
                        )}
                    </div>

                    {/* Popular Topics */}
                    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>
                        <div className='flex items-center mb-4'>
                            <BarChart3 className='w-6 h-6 text-purple-600 mr-2' />
                            <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                Popular Topics
                            </h2>
                        </div>
                        {analytics.topicAnalytics.length > 0 ? (
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                {analytics.topicAnalytics.map((topic, idx) => (
                                    <div
                                        key={idx}
                                        className='p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-700'
                                    >
                                        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                                            {topic._id || 'Uncategorized'}
                                        </h3>
                                        <div className='space-y-1'>
                                            <p className='text-sm text-gray-600 dark:text-gray-400'>
                                                <span className='font-medium'>
                                                    Quizzes:
                                                </span>{' '}
                                                {topic.count}
                                            </p>
                                            <p className='text-sm text-gray-600 dark:text-gray-400'>
                                                <span className='font-medium'>
                                                    Attempts:
                                                </span>{' '}
                                                {topic.totalAttempts || 0}
                                            </p>
                                            <p className='text-sm text-gray-600 dark:text-gray-400'>
                                                <span className='font-medium'>
                                                    Avg Revenue:
                                                </span>{' '}
                                                ₹
                                                {(
                                                    topic.avgRevenue || 0
                                                ).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className='text-gray-600 dark:text-gray-400 text-center py-8'>
                                No topic analytics available
                            </p>
                        )}
                    </div>

                    {/* Difficulty Distribution */}
                    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>
                        <div className='flex items-center mb-4'>
                            <PieChart className='w-6 h-6 text-indigo-600 mr-2' />
                            <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                Difficulty Distribution
                            </h2>
                        </div>
                        {analytics.difficultyStats.length > 0 ? (
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                {analytics.difficultyStats.map((stat, idx) => (
                                    <div
                                        key={idx}
                                        className='p-6 bg-gray-50 dark:bg-gray-700 rounded-lg text-center'
                                    >
                                        <span
                                            className={`inline-block px-4 py-2 rounded-full text-lg font-semibold mb-2 ${getDifficultyColor(
                                                stat._id
                                            )}`}
                                        >
                                            {stat._id || 'Unknown'}
                                        </span>
                                        <p className='text-3xl font-bold text-gray-900 dark:text-white mt-2'>
                                            {stat.count}
                                        </p>
                                        <p className='text-sm text-gray-600 dark:text-gray-400'>
                                            Quizzes
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className='text-gray-600 dark:text-gray-400 text-center py-8'>
                                No difficulty distribution data available
                            </p>
                        )}
                    </div>

                    {/* Revenue Analytics */}
                    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>
                        <div className='flex items-center mb-4'>
                            <DollarSign className='w-6 h-6 text-emerald-600 mr-2' />
                            <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                Revenue Analytics
                            </h2>
                        </div>
                        {analytics.revenueAnalytics.length > 0 ? (
                            <div className='overflow-x-auto'>
                                <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                                    <thead className='bg-gray-50 dark:bg-gray-700'>
                                        <tr>
                                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                                                Date
                                            </th>
                                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                                                Revenue (₹)
                                            </th>
                                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                                                Transactions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
                                        {analytics.revenueAnalytics.map(
                                            (rev, idx) => (
                                                <tr key={idx}>
                                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white'>
                                                        {rev._id.year}-
                                                        {rev._id.month}-
                                                        {rev._id.day}
                                                    </td>
                                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-semibold text-emerald-600 dark:text-emerald-400'>
                                                        ₹
                                                        {rev.revenue.toLocaleString()}
                                                    </td>
                                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white'>
                                                        {rev.transactions}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className='text-gray-600 dark:text-gray-400 text-center py-8'>
                                No revenue analytics available for this period
                            </p>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default QuizAnalytics;

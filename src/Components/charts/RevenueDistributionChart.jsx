import React, { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import StatsService from '../../service/StatsService';
import { Loader2, DollarSign } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

const RevenueDistributionChart = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await StatsService.getRevenueDistribution();
                if (response.success) {
                    setData(response.data);
                }
            } catch (error) {
                console.error('Error fetching revenue distribution:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>
                <div className='flex items-center justify-center h-64'>
                    <Loader2 className='w-6 h-6 animate-spin text-emerald-600' />
                    <span className='ml-2 text-gray-600 dark:text-gray-400'>Loading chart...</span>
                </div>
            </div>
        );
    }

    const hasData = data && data.totalPool > 0;

    const chartValues = hasData
        ? [data.prizeMoney, data.creatorFee, data.platformFee]
        : [50, 30, 20]; // Default 50/30/20 split illustration

    const chartData = {
        labels: ['Prize Money (50%)', 'Creator Fee (30%)', 'Platform Fee (20%)'],
        datasets: [
            {
                data: chartValues,
                backgroundColor: ['#10B981', '#3B82F6', '#F59E0B'],
                hoverBackgroundColor: ['#059669', '#2563EB', '#D97706'],
                borderWidth: 3,
                borderColor: document.documentElement.classList.contains('dark') ? '#1F2937' : '#FFFFFF',
                spacing: 4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: document.documentElement.classList.contains('dark') ? '#D1D5DB' : '#374151',
                    usePointStyle: true,
                    padding: 20,
                    font: { size: 13 },
                },
            },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                padding: 12,
                callbacks: {
                    label: (ctx) => {
                        if (hasData) {
                            return ` ${ctx.label}: ₹${ctx.raw.toLocaleString()}`;
                        }
                        return ` ${ctx.label}`;
                    },
                },
            },
        },
    };

    return (
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>
            <div className='flex items-center mb-4'>
                <DollarSign className='w-6 h-6 text-emerald-600 mr-2' />
                <h2 className='text-xl font-bold text-gray-900 dark:text-white'>Revenue Distribution</h2>
            </div>

            <div className='flex flex-col lg:flex-row items-center gap-6'>
                {/* Chart */}
                <div className='relative' style={{ width: '260px', height: '260px' }}>
                    <Doughnut data={chartData} options={options} />
                    {/* Center text */}
                    <div className='absolute inset-0 flex flex-col items-center justify-center pointer-events-none'>
                        <span className='text-xs text-gray-500 dark:text-gray-400'>Total Pool</span>
                        <span className='text-lg font-bold text-gray-900 dark:text-white'>
                            ₹{hasData ? data.totalPool.toLocaleString() : '0'}
                        </span>
                    </div>
                </div>

                {/* Stats sidebar */}
                <div className='flex-1 space-y-3 w-full'>
                    <div className='flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg'>
                        <div className='flex items-center gap-2'>
                            <div className='w-3 h-3 rounded-full bg-emerald-500'></div>
                            <span className='text-sm text-gray-700 dark:text-gray-300'>Prize Money (Winners)</span>
                        </div>
                        <span className='font-bold text-gray-900 dark:text-white'>
                            ₹{hasData ? data.prizeMoney.toLocaleString() : '0'}
                        </span>
                    </div>
                    <div className='flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
                        <div className='flex items-center gap-2'>
                            <div className='w-3 h-3 rounded-full bg-blue-500'></div>
                            <span className='text-sm text-gray-700 dark:text-gray-300'>Creator Fee</span>
                        </div>
                        <span className='font-bold text-gray-900 dark:text-white'>
                            ₹{hasData ? data.creatorFee.toLocaleString() : '0'}
                        </span>
                    </div>
                    <div className='flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg'>
                        <div className='flex items-center gap-2'>
                            <div className='w-3 h-3 rounded-full bg-amber-500'></div>
                            <span className='text-sm text-gray-700 dark:text-gray-300'>Platform Fee</span>
                        </div>
                        <span className='font-bold text-gray-900 dark:text-white'>
                            ₹{hasData ? data.platformFee.toLocaleString() : '0'}
                        </span>
                    </div>

                    {hasData && (
                        <div className='pt-2 border-t border-gray-200 dark:border-gray-700 space-y-1 text-sm text-gray-500 dark:text-gray-400'>
                            <p>Paid Quizzes: <strong className='text-gray-900 dark:text-white'>{data.totalPaidQuizzes}</strong></p>
                            <p>Total Participants: <strong className='text-gray-900 dark:text-white'>{data.totalParticipants}</strong></p>
                        </div>
                    )}

                    {!hasData && (
                        <p className='text-xs text-gray-400 dark:text-gray-500 text-center pt-2'>
                            Showing default 50/30/20 split. Real data will appear when paid quizzes are completed.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RevenueDistributionChart;

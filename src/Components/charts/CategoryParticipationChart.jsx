import React, { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import StatsService from '../../service/StatsService';
import { Loader2, BarChart3 } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const COLORS = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#F97316', '#EC4899', '#14B8A6', '#6B7280',
];

const CategoryParticipationChart = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await StatsService.getCategoryParticipation();
                if (response.success) {
                    setData(response.data);
                }
            } catch (error) {
                console.error('Error fetching category participation:', error);
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
                    <Loader2 className='w-6 h-6 animate-spin text-purple-600' />
                    <span className='ml-2 text-gray-600 dark:text-gray-400'>Loading chart...</span>
                </div>
            </div>
        );
    }

    if (!data || data.categories.length === 0) {
        return (
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>
                <div className='flex items-center mb-4'>
                    <BarChart3 className='w-6 h-6 text-purple-600 mr-2' />
                    <h2 className='text-xl font-bold text-gray-900 dark:text-white'>Quiz Participation by Category</h2>
                </div>
                <p className='text-gray-500 dark:text-gray-400 text-center py-12'>No participation data available yet.</p>
            </div>
        );
    }

    const labels = data.categories.map((c) => {
        const name = c._id || 'Other';
        return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');
    });

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Quiz Attempts',
                data: data.categories.map((c) => c.attempts),
                backgroundColor: data.categories.map((_, i) => COLORS[i % COLORS.length]),
                borderRadius: 6,
                borderSkipped: false,
                barThickness: 36,
            },
        ],
    };

    const avgAttempts = data.totalAttempts / Math.max(data.categories.length, 1);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                padding: 12,
                callbacks: {
                    afterLabel: (ctx) => {
                        const cat = data.categories[ctx.dataIndex];
                        return `Unique Users: ${cat.uniqueUsers}\nAvg Score: ${cat.avgScore}%`;
                    },
                },
            },
        },
        scales: {
            x: {
                title: { display: true, text: 'Number of Attempts', color: '#6B7280' },
                grid: { color: 'rgba(156, 163, 175, 0.15)' },
                ticks: { color: document.documentElement.classList.contains('dark') ? '#9CA3AF' : '#6B7280' },
            },
            y: {
                grid: { display: false },
                ticks: {
                    color: document.documentElement.classList.contains('dark') ? '#D1D5DB' : '#374151',
                    font: { weight: '500' },
                },
            },
        },
    };

    return (
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3'>
                <div className='flex items-center'>
                    <BarChart3 className='w-6 h-6 text-purple-600 mr-2' />
                    <h2 className='text-xl font-bold text-gray-900 dark:text-white'>Quiz Participation by Category</h2>
                </div>
                <div className='flex items-center gap-4 text-sm'>
                    <span className='text-gray-500 dark:text-gray-400'>Total: <strong className='text-gray-900 dark:text-white'>{data.totalAttempts.toLocaleString()}</strong></span>
                    <span className='text-gray-500 dark:text-gray-400'>Quizzes: <strong className='text-gray-900 dark:text-white'>{data.totalQuizzes}</strong></span>
                    <span className='text-gray-500 dark:text-gray-400'>Avg/Quiz: <strong className='text-gray-900 dark:text-white'>{data.avgAttemptsPerQuiz}</strong></span>
                </div>
            </div>
            <div style={{ height: Math.max(200, data.categories.length * 48) + 'px' }}>
                <Bar data={chartData} options={options} />
            </div>
        </div>
    );
};

export default CategoryParticipationChart;

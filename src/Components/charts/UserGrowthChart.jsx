import React, { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import StatsService from '../../service/StatsService';
import { Loader2, TrendingUp } from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
);

const UserGrowthChart = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [weeks, setWeeks] = useState(14);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await StatsService.getUserGrowthStats(weeks);
                if (response.success) {
                    setData(response.data);
                }
            } catch (error) {
                console.error('Error fetching user growth:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [weeks]);

    if (loading) {
        return (
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>
                <div className='flex items-center justify-center h-64'>
                    <Loader2 className='w-6 h-6 animate-spin text-blue-600' />
                    <span className='ml-2 text-gray-600 dark:text-gray-400'>Loading chart...</span>
                </div>
            </div>
        );
    }

    if (!data || data.growth.length === 0) {
        return (
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>
                <div className='flex items-center mb-4'>
                    <TrendingUp className='w-6 h-6 text-blue-600 mr-2' />
                    <h2 className='text-xl font-bold text-gray-900 dark:text-white'>User Registration Growth</h2>
                </div>
                <p className='text-gray-500 dark:text-gray-400 text-center py-12'>No user registration data available yet.</p>
            </div>
        );
    }

    const chartData = {
        labels: data.growth.map((d) => d.week),
        datasets: [
            {
                label: 'Cumulative Users',
                data: data.growth.map((d) => d.cumulativeUsers),
                borderColor: '#1E40AF',
                backgroundColor: 'rgba(30, 64, 175, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#1E40AF',
                yAxisID: 'y',
                order: 1,
            },
            {
                label: 'New Users Per Week',
                data: data.growth.map((d) => d.newUsers),
                borderColor: '#0D9488',
                backgroundColor: 'rgba(13, 148, 136, 0.1)',
                borderDash: [6, 3],
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#0D9488',
                yAxisID: 'y1',
                order: 0,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: document.documentElement.classList.contains('dark') ? '#D1D5DB' : '#374151',
                    usePointStyle: true,
                    padding: 20,
                },
            },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                padding: 12,
                titleFont: { size: 13 },
                bodyFont: { size: 12 },
            },
        },
        scales: {
            x: {
                grid: { color: 'rgba(156, 163, 175, 0.15)' },
                ticks: { color: document.documentElement.classList.contains('dark') ? '#9CA3AF' : '#6B7280' },
            },
            y: {
                type: 'linear',
                position: 'left',
                title: { display: true, text: 'Total Users', color: '#1E40AF' },
                grid: { color: 'rgba(156, 163, 175, 0.15)' },
                ticks: { color: '#1E40AF' },
            },
            y1: {
                type: 'linear',
                position: 'right',
                title: { display: true, text: 'New Users / Week', color: '#0D9488' },
                grid: { drawOnChartArea: false },
                ticks: { color: '#0D9488' },
            },
        },
    };

    return (
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3'>
                <div className='flex items-center'>
                    <TrendingUp className='w-6 h-6 text-blue-600 mr-2' />
                    <h2 className='text-xl font-bold text-gray-900 dark:text-white'>User Registration Growth</h2>
                </div>
                <div className='flex items-center gap-3'>
                    <span className='text-sm text-gray-500 dark:text-gray-400'>Total: <strong className='text-gray-900 dark:text-white'>{data.totalUsers}</strong></span>
                    <select
                        value={weeks}
                        onChange={(e) => setWeeks(Number(e.target.value))}
                        className='px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500'
                    >
                        <option value={4}>Last 4 Weeks</option>
                        <option value={8}>Last 8 Weeks</option>
                        <option value={14}>Last 14 Weeks</option>
                        <option value={26}>Last 26 Weeks</option>
                        <option value={52}>Last Year</option>
                    </select>
                </div>
            </div>
            <div style={{ height: '320px' }}>
                <Line data={chartData} options={options} />
            </div>
        </div>
    );
};

export default UserGrowthChart;

import React, { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import StatsService from '../../service/StatsService';
import { Loader2, ShieldAlert } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const SEVERITY_COLORS = {
    0: '#10B981', // green - clean
    1: '#10B981',
    2: '#F59E0B', // yellow - minor
    3: '#F59E0B',
    4: '#F97316', // orange - moderate
    5: '#F97316',
    6: '#EF4444', // red - severe
    7: '#EF4444',
    8: '#DC2626', // dark red - critical
    9: '#DC2626',
    10: '#991B1B', // very dark red - auto-submitted
};

const SEVERITY_LABELS = {
    0: 'Clean', 1: 'Clean',
    2: 'Minor', 3: 'Minor',
    4: 'Moderate', 5: 'Moderate',
    6: 'Severe', 7: 'Severe',
    8: 'Critical', 9: 'Critical',
    10: 'Auto-Submit',
};

const TYPE_COLORS = ['#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899'];

const AntiCheatChart = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await StatsService.getAntiCheatStats();
                if (response.success) {
                    setData(response.data);
                }
            } catch (error) {
                console.error('Error fetching anti-cheat stats:', error);
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
                    <Loader2 className='w-6 h-6 animate-spin text-red-600' />
                    <span className='ml-2 text-gray-600 dark:text-gray-400'>Loading chart...</span>
                </div>
            </div>
        );
    }

    if (!data || data.summary.totalAttempts === 0) {
        return (
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>
                <div className='flex items-center mb-4'>
                    <ShieldAlert className='w-6 h-6 text-red-600 mr-2' />
                    <h2 className='text-xl font-bold text-gray-900 dark:text-white'>Anti-Cheat Analysis</h2>
                </div>
                <p className='text-gray-500 dark:text-gray-400 text-center py-12'>No quiz attempt data available yet.</p>
            </div>
        );
    }

    // Fill in missing bins (0-10) with 0 count
    const fullDistribution = [];
    for (let i = 0; i <= 10; i++) {
        const existing = data.distribution.find((d) => d._id === i);
        fullDistribution.push({
            violations: i === 10 ? '10+' : String(i),
            count: existing ? existing.count : 0,
            color: SEVERITY_COLORS[i],
            label: SEVERITY_LABELS[i],
        });
    }

    const histogramData = {
        labels: fullDistribution.map((d) => d.violations),
        datasets: [
            {
                label: 'Attempts',
                data: fullDistribution.map((d) => d.count),
                backgroundColor: fullDistribution.map((d) => d.color),
                borderRadius: 4,
                borderSkipped: false,
            },
        ],
    };

    const histogramOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                padding: 12,
                callbacks: {
                    title: (ctx) => `${ctx[0].label} Violations`,
                    afterLabel: (ctx) => {
                        const bin = fullDistribution[ctx.dataIndex];
                        return `Severity: ${bin.label}`;
                    },
                },
            },
        },
        scales: {
            x: {
                title: { display: true, text: 'Violations per Attempt', color: '#6B7280' },
                grid: { display: false },
                ticks: { color: document.documentElement.classList.contains('dark') ? '#9CA3AF' : '#6B7280' },
            },
            y: {
                title: { display: true, text: 'Number of Attempts', color: '#6B7280' },
                grid: { color: 'rgba(156, 163, 175, 0.15)' },
                ticks: { color: document.documentElement.classList.contains('dark') ? '#9CA3AF' : '#6B7280' },
                beginAtZero: true,
            },
        },
    };

    // Violation type doughnut
    const hasViolationTypes = data.violationTypes && data.violationTypes.length > 0;
    const typeChartData = hasViolationTypes
        ? {
              labels: data.violationTypes.map((v) => {
                  const name = v._id || 'Unknown';
                  return name.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
              }),
              datasets: [
                  {
                      data: data.violationTypes.map((v) => v.count),
                      backgroundColor: data.violationTypes.map((_, i) => TYPE_COLORS[i % TYPE_COLORS.length]),
                      borderWidth: 2,
                      borderColor: document.documentElement.classList.contains('dark') ? '#1F2937' : '#FFFFFF',
                  },
              ],
          }
        : null;

    const typeChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '55%',
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: document.documentElement.classList.contains('dark') ? '#D1D5DB' : '#374151',
                    usePointStyle: true,
                    padding: 12,
                    font: { size: 11 },
                },
            },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                padding: 12,
            },
        },
    };

    const { summary } = data;

    return (
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>
            <div className='flex items-center mb-4'>
                <ShieldAlert className='w-6 h-6 text-red-600 mr-2' />
                <h2 className='text-xl font-bold text-gray-900 dark:text-white'>Anti-Cheat Analysis</h2>
            </div>

            {/* Summary Stats */}
            <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mb-6'>
                <div className='p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center'>
                    <p className='text-2xl font-bold text-green-600'>{summary.cleanPercentage}%</p>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>Clean Attempts</p>
                </div>
                <div className='p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center'>
                    <p className='text-2xl font-bold text-blue-600'>{summary.totalAttempts}</p>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>Total Analyzed</p>
                </div>
                <div className='p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-center'>
                    <p className='text-2xl font-bold text-amber-600'>{summary.flaggedAttempts}</p>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>Flagged</p>
                </div>
                <div className='p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-center'>
                    <p className='text-2xl font-bold text-red-600'>{summary.autoSubmitted}</p>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>Auto-Submitted</p>
                </div>
            </div>

            {/* Charts row */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Histogram */}
                <div>
                    <h3 className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3'>Violation Count Distribution</h3>
                    <div style={{ height: '280px' }}>
                        <Bar data={histogramData} options={histogramOptions} />
                    </div>
                    {/* Severity legend */}
                    <div className='flex flex-wrap gap-2 mt-3 justify-center'>
                        {[
                            { label: 'Clean (0-1)', color: '#10B981' },
                            { label: 'Minor (2-3)', color: '#F59E0B' },
                            { label: 'Moderate (4-5)', color: '#F97316' },
                            { label: 'Severe (6-7)', color: '#EF4444' },
                            { label: 'Critical (8+)', color: '#DC2626' },
                        ].map((s) => (
                            <div key={s.label} className='flex items-center gap-1'>
                                <div className='w-2.5 h-2.5 rounded-full' style={{ backgroundColor: s.color }}></div>
                                <span className='text-xs text-gray-500 dark:text-gray-400'>{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Violation Type Breakdown */}
                <div>
                    <h3 className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3'>Violation Type Breakdown</h3>
                    {hasViolationTypes ? (
                        <div style={{ height: '280px' }}>
                            <Doughnut data={typeChartData} options={typeChartOptions} />
                        </div>
                    ) : (
                        <div className='flex items-center justify-center h-64'>
                            <p className='text-gray-400 dark:text-gray-500 text-sm'>No violations recorded yet — all clean! 🎉</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AntiCheatChart;

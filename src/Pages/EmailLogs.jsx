import { useState, useEffect } from 'react';
import EmailService from '../service/EmailService';
import toast from 'react-hot-toast';
import {
    Mail,
    CheckCircle,
    XCircle,
    Search,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    Trophy,
    Rocket,
    RefreshCw,
} from 'lucide-react';

const EmailLogs = () => {
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({});
    const [filters, setFilters] = useState({
        type: 'all',
        status: 'all',
        search: '',
    });
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        fetchData();
    }, [page, filters]);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await EmailService.getEmailLogs({
                page,
                limit: 25,
                ...filters,
            });
            if (response.success) {
                setLogs(response.data);
                setPagination(response.pagination);
            } else {
                toast.error(response.message || 'Failed to load email logs');
            }
        } catch {
            toast.error('Failed to fetch email logs');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await EmailService.getEmailStats();
            if (response.success) {
                setStats(response.data);
            }
        } catch {
            // silent
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        setFilters((f) => ({ ...f, search: searchInput }));
    };

    const handleFilterChange = (key, value) => {
        setPage(1);
        setFilters((f) => ({ ...f, [key]: value }));
    };

    const getTypeConfig = (type) => {
        switch (type) {
            case 'otp':
                return {
                    label: 'OTP',
                    icon: ShieldCheck,
                    color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
                };
            case 'quiz_registration':
                return {
                    label: 'Registration',
                    icon: Trophy,
                    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
                };
            case 'quiz_started':
                return {
                    label: 'Quiz Started',
                    icon: Rocket,
                    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
                };
            case 'quiz_cancelled':
                return {
                    label: 'Cancelled',
                    icon: XCircle,
                    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
                };
            default:
                return {
                    label: type,
                    icon: Mail,
                    color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
                };
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className='min-h-screen'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                {/* Header */}
                <div className='mb-6'>
                    <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
                        Email Logs
                    </h1>
                    <p className='text-gray-600 dark:text-gray-400'>
                        Track all outgoing emails from the platform
                    </p>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
                        <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-5'>
                            <div className='flex items-center gap-3'>
                                <div className='p-2.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl'>
                                    <Mail className='w-5 h-5 text-white' />
                                </div>
                                <div>
                                    <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                                        {stats.total}
                                    </p>
                                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                                        Total Emails
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-5'>
                            <div className='flex items-center gap-3'>
                                <div className='p-2.5 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl'>
                                    <CheckCircle className='w-5 h-5 text-white' />
                                </div>
                                <div>
                                    <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                                        {stats.byStatus?.sent || 0}
                                    </p>
                                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                                        Sent
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-5'>
                            <div className='flex items-center gap-3'>
                                <div className='p-2.5 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl'>
                                    <XCircle className='w-5 h-5 text-white' />
                                </div>
                                <div>
                                    <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                                        {stats.byStatus?.failed || 0}
                                    </p>
                                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                                        Failed
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-5'>
                            <div className='flex items-center gap-3'>
                                <div className='p-2.5 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl'>
                                    <RefreshCw className='w-5 h-5 text-white' />
                                </div>
                                <div>
                                    <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                                        {stats.last24h}
                                    </p>
                                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                                        Last 24h
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className='mb-6 flex flex-wrap items-center gap-4'>
                    {/* Search */}
                    <form onSubmit={handleSearch} className='flex-1 min-w-[200px] max-w-md'>
                        <div className='relative'>
                            <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                            <input
                                type='text'
                                placeholder='Search by email or subject...'
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className='block w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200'
                            />
                        </div>
                    </form>

                    {/* Type filter */}
                    <select
                        value={filters.type}
                        onChange={(e) => handleFilterChange('type', e.target.value)}
                        className='px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm text-sm focus:ring-2 focus:ring-blue-500'
                    >
                        <option value='all'>All Types</option>
                        <option value='otp'>OTP</option>
                        <option value='quiz_registration'>Registration</option>
                        <option value='quiz_started'>Quiz Started</option>
                        <option value='quiz_cancelled'>Cancelled</option>
                    </select>

                    {/* Status filter */}
                    <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className='px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm text-sm focus:ring-2 focus:ring-blue-500'
                    >
                        <option value='all'>All Status</option>
                        <option value='sent'>Sent</option>
                        <option value='failed'>Failed</option>
                    </select>
                </div>

                {/* Table */}
                {loading ? (
                    <div className='flex justify-center items-center h-64'>
                        <div className='animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-indigo-500'></div>
                    </div>
                ) : (
                    <>
                        <div className='bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 shadow-2xl rounded-3xl border border-white/20 dark:border-gray-700/50 overflow-hidden'>
                            <div className='overflow-x-auto'>
                                <table className='min-w-full divide-y divide-gray-200/50 dark:divide-gray-700/50'>
                                    <thead className='bg-gradient-to-r from-gray-50/50 to-indigo-50/50 dark:from-gray-700/50 dark:to-gray-600/50'>
                                        <tr>
                                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider'>
                                                Recipient
                                            </th>
                                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider'>
                                                Type
                                            </th>
                                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider'>
                                                Subject
                                            </th>
                                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider'>
                                                Status
                                            </th>
                                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider'>
                                                Sent At
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className='bg-white/50 dark:bg-gray-800/50 divide-y divide-gray-200/30 dark:divide-gray-700/30'>
                                        {logs.map((log) => {
                                            const typeCfg = getTypeConfig(log.type);
                                            const TypeIcon = typeCfg.icon;
                                            return (
                                                <tr
                                                    key={log._id}
                                                    className='hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 dark:hover:from-gray-700/50 dark:hover:to-gray-600/50 transition-all duration-200'
                                                >
                                                    <td className='px-6 py-4 whitespace-nowrap'>
                                                        <div className='flex items-center gap-3'>
                                                            <div className='w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white text-sm font-bold'>
                                                                {log.to.charAt(0).toUpperCase()}
                                                            </div>
                                                            <span className='text-sm text-gray-900 dark:text-white'>
                                                                {log.to}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className='px-6 py-4 whitespace-nowrap'>
                                                        <span
                                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${typeCfg.color}`}
                                                        >
                                                            <TypeIcon className='w-3.5 h-3.5' />
                                                            {typeCfg.label}
                                                        </span>
                                                    </td>
                                                    <td className='px-6 py-4'>
                                                        <span className='text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate block'>
                                                            {log.subject}
                                                        </span>
                                                    </td>
                                                    <td className='px-6 py-4 whitespace-nowrap'>
                                                        {log.status === 'sent' ? (
                                                            <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'>
                                                                <CheckCircle className='w-3.5 h-3.5' />
                                                                Sent
                                                            </span>
                                                        ) : (
                                                            <span
                                                                className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 cursor-help'
                                                                title={log.error || 'Unknown error'}
                                                            >
                                                                <XCircle className='w-3.5 h-3.5' />
                                                                Failed
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                                                        {formatDate(log.createdAt)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Empty state */}
                        {logs.length === 0 && (
                            <div className='text-center py-16'>
                                <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full mb-6'>
                                    <Mail className='w-10 h-10 text-gray-400 dark:text-gray-500' />
                                </div>
                                <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                                    No email logs found
                                </h3>
                                <p className='text-gray-600 dark:text-gray-400 max-w-md mx-auto'>
                                    No emails match your current filters. Try adjusting your search or filters.
                                </p>
                            </div>
                        )}

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className='mt-6 flex items-center justify-between'>
                                <p className='text-sm text-gray-500 dark:text-gray-400'>
                                    Showing {(page - 1) * 25 + 1}–
                                    {Math.min(page * 25, pagination.total)} of{' '}
                                    {pagination.total}
                                </p>
                                <div className='flex items-center gap-2'>
                                    <button
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={page <= 1}
                                        className='p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200'
                                    >
                                        <ChevronLeft className='w-4 h-4' />
                                    </button>
                                    <span className='px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300'>
                                        {page} / {pagination.totalPages}
                                    </span>
                                    <button
                                        onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                                        disabled={page >= pagination.totalPages}
                                        className='p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200'
                                    >
                                        <ChevronRight className='w-4 h-4' />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default EmailLogs;

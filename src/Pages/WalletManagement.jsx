import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import WalletService from '../service/WalletService';

const WalletManagement = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [viewMode, setViewMode] = useState('table');

    const fetchTransactions = useCallback(async () => {
        try {
            setLoading(true);
            const response = await WalletService.getTransactions({
                status: filter,
            });
            setTransactions(response.data.transactions || []);
        } catch (error) {
            toast.error(error.message || 'Failed to fetch transactions');
            console.error('Fetch Transactions Error:', error);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

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

    const handleApproveFundAddition = async (transactionId) => {
        setActionLoading(true);
        try {
            await WalletService.approveFundAddition(transactionId);
            toast.success('Fund addition approved successfully!');
            fetchTransactions();
            setShowModal(false);
        } catch (error) {
            toast.error(error.message || 'Failed to approve');
            console.error('Approve Error:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleRejectFundAddition = async (transactionId, reason) => {
        if (!reason.trim() || reason.length < 10) {
            toast.error('Please provide a reason (min 10 characters)');
            return;
        }

        setActionLoading(true);
        try {
            await WalletService.rejectFundAddition(transactionId, reason);
            toast.success('Fund addition rejected');
            fetchTransactions();
            setShowModal(false);
            setRejectReason('');
        } catch (error) {
            toast.error(error.message || 'Failed to reject');
            console.error('Reject Error:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleApproveWithdrawal = async (transactionId) => {
        setActionLoading(true);
        try {
            await WalletService.approveWithdrawal(transactionId);
            toast.success('Withdrawal approved and marked as paid!');
            fetchTransactions();
            setShowModal(false);
        } catch (error) {
            toast.error(error.message || 'Failed to approve withdrawal');
            console.error('Approve Withdrawal Error:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleRejectWithdrawal = async (transactionId, reason) => {
        if (!reason.trim() || reason.length < 10) {
            toast.error('Please provide a reason (min 10 characters)');
            return;
        }

        setActionLoading(true);
        try {
            await WalletService.rejectWithdrawal(transactionId, reason);
            toast.success('Withdrawal rejected and amount returned');
            fetchTransactions();
            setShowModal(false);
            setRejectReason('');
        } catch (error) {
            toast.error(error.message || 'Failed to reject withdrawal');
            console.error('Reject Withdrawal Error:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const openTransactionModal = (transaction) => {
        setSelectedTransaction(transaction);
        setShowModal(true);
        setRejectReason('');
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            completed: 'bg-green-100 text-green-800',
            failed: 'bg-red-100 text-red-800',
            cancelled: 'bg-gray-100 text-gray-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getTypeLabel = (type) => {
        const labels = {
            payment: 'Fund Addition',
            withdrawal: 'Withdrawal',
            earning: 'Quiz Earning',
            refund: 'Refund',
        };
        return labels[type] || type;
    };

    const filteredTransactions = transactions.filter((transaction) => {
        const userMatch =
            transaction.userId?.username
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            transaction.userId?.email
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase());

        return userMatch;
    });

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500 mx-auto'></div>
                    <p className='mt-4 text-gray-600 dark:text-gray-400'>
                        Loading transactions...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen p-6'>
            <div className='max-w-7xl mx-auto'>
                {/* Header */}
                <div className='mb-6'>
                    <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
                        Wallet Management
                    </h1>
                    <p className='text-gray-600 dark:text-gray-400'>
                        Manage fund additions and withdrawals
                    </p>
                </div>

                {/* Filters and Search */}
                <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 mb-6'>
                    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                        <div className='flex items-center space-x-4'>
                            {/* Status Filter */}
                            <div className='flex flex-wrap gap-2'>
                                {['pending', 'completed', 'failed', 'all'].map(
                                    (status) => (
                                        <button
                                            key={status}
                                            onClick={() => setFilter(status)}
                                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                                filter === status
                                                    ? 'bg-yellow-600 text-white'
                                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                            }`}
                                        >
                                            {status.charAt(0).toUpperCase() +
                                                status.slice(1)}
                                        </button>
                                    )
                                )}
                            </div>

                            {/* View Toggle */}
                            <div className='flex space-x-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg'>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded transition-colors ${
                                        viewMode === 'grid'
                                            ? 'bg-white dark:bg-gray-600 text-yellow-600 shadow-sm'
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
                                            ? 'bg-white dark:bg-gray-600 text-yellow-600 shadow-sm'
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

                        {/* Search */}
                        <div className='relative'>
                            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                            <input
                                type='text'
                                placeholder='Search by user...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className='pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
                            />
                        </div>
                    </div>
                </div>

                {/* Transactions List */}
                <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden'>
                    {filteredTransactions.length === 0 ? (
                        <div className='p-8 text-center'>
                            <p className='text-gray-500 dark:text-gray-400'>
                                No transactions found
                            </p>
                        </div>
                    ) : viewMode === 'grid' ? (
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6'>
                            {filteredTransactions.map((transaction) => (
                                <div
                                    key={transaction._id}
                                    className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow'
                                >
                                    <div className='p-4'>
                                        {/* Header */}
                                        <div className='flex justify-between items-start mb-4'>
                                            <div className='space-y-1'>
                                                <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                                                    {getTypeLabel(
                                                        transaction.type
                                                    )}
                                                </h3>
                                                <p className='text-sm text-gray-500 dark:text-gray-400'>
                                                    {transaction.userId
                                                        ?.username || 'Unknown'}
                                                </p>
                                            </div>
                                            <span
                                                className={`ml-2 px-2 py-1 text-xs font-medium rounded-full shrink-0 ${getStatusColor(
                                                    transaction.status
                                                )}`}
                                            >
                                                {transaction.status
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    transaction.status.slice(1)}
                                            </span>
                                        </div>

                                        {/* Amount */}
                                        <div className='flex justify-between items-baseline mb-4'>
                                            <span className='text-2xl font-bold text-gray-900 dark:text-white'>
                                                ₹{transaction.amount}
                                            </span>
                                            <span className='text-sm text-gray-500 dark:text-gray-400'>
                                                {new Date(
                                                    transaction.createdAt
                                                ).toLocaleDateString('en-IN', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </span>
                                        </div>

                                        {/* Balances */}
                                        <div className='grid grid-cols-2 gap-4 mb-4 text-sm'>
                                            <div>
                                                <p className='text-gray-500 dark:text-gray-400'>
                                                    Before
                                                </p>
                                                <p className='font-semibold text-gray-900 dark:text-white'>
                                                    ₹{transaction.balanceBefore}
                                                </p>
                                            </div>
                                            <div>
                                                <p className='text-gray-500 dark:text-gray-400'>
                                                    After
                                                </p>
                                                <p className='font-semibold text-gray-900 dark:text-white'>
                                                    ₹{transaction.balanceAfter}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        {transaction.status === 'pending' && (
                                            <div className='mt-4 flex justify-end'>
                                                <button
                                                    onClick={() =>
                                                        openTransactionModal(
                                                            transaction
                                                        )
                                                    }
                                                    className='px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-md inline-flex items-center'
                                                >
                                                    Review Transaction
                                                </button>
                                            </div>
                                        )}

                                        {/* Rejection Reason */}
                                        {transaction.status === 'failed' &&
                                            transaction.reasonForRejection && (
                                                <div className='mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-md'>
                                                    <div className='flex items-start space-x-2'>
                                                        <XCircle className='w-4 h-4 text-red-500 flex-shrink-0 mt-0.5' />
                                                        <div>
                                                            <p className='text-xs font-semibold text-red-700 dark:text-red-400'>
                                                                Rejection
                                                                Reason:
                                                            </p>
                                                            <p className='text-sm text-red-600 dark:text-red-300'>
                                                                {
                                                                    transaction.reasonForRejection
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='overflow-x-auto'>
                            <table className='w-full'>
                                <thead className='bg-gray-50 dark:bg-gray-700'>
                                    <tr>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                                            User
                                        </th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                                            Type
                                        </th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                                            Amount
                                        </th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                                            Status
                                        </th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                                            Date
                                        </th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
                                    {filteredTransactions.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan='6'
                                                className='px-6 py-4 text-center text-gray-500 dark:text-gray-400'
                                            >
                                                No transactions found
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredTransactions.map(
                                            (transaction) => (
                                                <React.Fragment
                                                    key={transaction._id}
                                                >
                                                    <tr className='hover:bg-gray-50 dark:hover:bg-gray-700'>
                                                        <td className='px-6 py-4 whitespace-nowrap'>
                                                            <div>
                                                                <div className='text-sm font-medium text-gray-900 dark:text-white'>
                                                                    {transaction
                                                                        .userId
                                                                        ?.username ||
                                                                        'Unknown'}
                                                                </div>
                                                                <div className='text-sm text-gray-500 dark:text-gray-400'>
                                                                    {transaction
                                                                        .userId
                                                                        ?.email ||
                                                                        'N/A'}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className='px-6 py-4 whitespace-nowrap'>
                                                            <span className='text-sm text-gray-900 dark:text-white'>
                                                                {getTypeLabel(
                                                                    transaction.type
                                                                )}
                                                            </span>
                                                        </td>
                                                        <td className='px-6 py-4 whitespace-nowrap'>
                                                            <span className='text-sm font-semibold text-gray-900 dark:text-white'>
                                                                ₹
                                                                {
                                                                    transaction.amount
                                                                }
                                                            </span>
                                                        </td>
                                                        <td className='px-6 py-4 whitespace-nowrap'>
                                                            <span
                                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                                                    transaction.status
                                                                )}`}
                                                            >
                                                                {
                                                                    transaction.status
                                                                }
                                                            </span>
                                                        </td>
                                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                                                            {new Date(
                                                                transaction.createdAt
                                                            ).toLocaleDateString(
                                                                'en-IN',
                                                                {
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                }
                                                            )}
                                                        </td>
                                                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                                                            {transaction.status ===
                                                                'pending' && (
                                                                <button
                                                                    onClick={() =>
                                                                        openTransactionModal(
                                                                            transaction
                                                                        )
                                                                    }
                                                                    className='text-yellow-600 hover:text-yellow-900'
                                                                >
                                                                    Review
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                    {transaction.status ===
                                                        'failed' &&
                                                        transaction.reasonForRejection && (
                                                            <tr>
                                                                <td
                                                                    colSpan='6'
                                                                    className='px-6 py-3 bg-red-50 dark:bg-red-900/20'
                                                                >
                                                                    <div className='flex items-start space-x-2'>
                                                                        <XCircle className='w-5 h-5 text-red-500 flex-shrink-0 mt-0.5' />
                                                                        <div>
                                                                            <p className='text-xs font-semibold text-red-700 dark:text-red-400 mb-1'>
                                                                                Rejection
                                                                                Reason:
                                                                            </p>
                                                                            <p className='text-sm text-red-600 dark:text-red-300'>
                                                                                {
                                                                                    transaction.reasonForRejection
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )}
                                                </React.Fragment>
                                            )
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Transaction Review Modal */}
                {showModal && selectedTransaction && (
                    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
                        <div className='bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
                            <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>
                                Review {getTypeLabel(selectedTransaction.type)}
                            </h3>

                            <div className='space-y-4 mb-6'>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div>
                                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                                            User
                                        </p>
                                        <p className='font-medium text-gray-900 dark:text-white'>
                                            {selectedTransaction.userId
                                                ?.username || 'Unknown'}
                                        </p>
                                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                                            {selectedTransaction.userId
                                                ?.email || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                                            Amount
                                        </p>
                                        <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                                            ₹{selectedTransaction.amount}
                                        </p>
                                    </div>
                                </div>

                                <div className='grid grid-cols-2 gap-4'>
                                    <div>
                                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                                            Balance Before
                                        </p>
                                        <p className='text-lg font-semibold text-gray-900 dark:text-white'>
                                            ₹{selectedTransaction.balanceBefore}
                                        </p>
                                    </div>
                                    <div>
                                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                                            Balance After
                                        </p>
                                        <p className='text-lg font-semibold text-gray-900 dark:text-white'>
                                            ₹{selectedTransaction.balanceAfter}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                                        Description
                                    </p>
                                    <p className='text-gray-900 dark:text-white'>
                                        {selectedTransaction.description}
                                    </p>
                                </div>

                                {selectedTransaction.metadata
                                    ?.userTransactionId && (
                                    <div>
                                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                                            User's Transaction ID
                                        </p>
                                        <p className='font-mono text-sm bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded'>
                                            {
                                                selectedTransaction.metadata
                                                    .userTransactionId
                                            }
                                        </p>
                                    </div>
                                )}

                                {selectedTransaction.metadata?.upiId && (
                                    <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg'>
                                        <p className='text-sm text-gray-500 dark:text-gray-400 mb-1'>
                                            UPI ID (Withdrawal Destination)
                                        </p>
                                        <p className='font-mono text-lg font-semibold text-gray-900 dark:text-white'>
                                            {selectedTransaction.metadata.upiId}
                                        </p>
                                    </div>
                                )}

                                {selectedTransaction.metadata
                                    ?.accountDetails && (
                                    <div>
                                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                                            Account Details
                                        </p>
                                        <p className='text-gray-900 dark:text-white'>
                                            {JSON.stringify(
                                                selectedTransaction.metadata
                                                    .accountDetails
                                            )}
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                                        Requested At
                                    </p>
                                    <p className='text-gray-900 dark:text-white'>
                                        {new Date(
                                            selectedTransaction.createdAt
                                        ).toLocaleString('en-IN')}
                                    </p>
                                </div>

                                {selectedTransaction.status === 'failed' &&
                                    selectedTransaction.reasonForRejection && (
                                        <div className='bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800'>
                                            <p className='text-sm font-medium text-red-700 dark:text-red-400 mb-1'>
                                                Rejection Reason
                                            </p>
                                            <p className='text-red-600 dark:text-red-300'>
                                                {
                                                    selectedTransaction.reasonForRejection
                                                }
                                            </p>
                                        </div>
                                    )}
                            </div>

                            {/* Rejection Reason Input */}
                            <div className='mb-6'>
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                    Rejection Reason (if rejecting)
                                </label>
                                <textarea
                                    value={rejectReason}
                                    onChange={(e) =>
                                        setRejectReason(e.target.value)
                                    }
                                    rows='3'
                                    className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white'
                                    placeholder='Enter reason for rejection (min 10 characters)'
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className='flex space-x-4'>
                                {selectedTransaction.type === 'payment' &&
                                    selectedTransaction.metadata
                                        ?.walletAddition && (
                                        <>
                                            <button
                                                onClick={() =>
                                                    handleApproveFundAddition(
                                                        selectedTransaction._id
                                                    )
                                                }
                                                disabled={actionLoading}
                                                className='flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium flex items-center justify-center space-x-2'
                                            >
                                                <CheckCircle size={20} />
                                                <span>
                                                    {actionLoading
                                                        ? 'Processing...'
                                                        : 'Approve & Credit'}
                                                </span>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleRejectFundAddition(
                                                        selectedTransaction._id,
                                                        rejectReason
                                                    )
                                                }
                                                disabled={actionLoading}
                                                className='flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-medium flex items-center justify-center space-x-2'
                                            >
                                                <XCircle size={20} />
                                                <span>
                                                    {actionLoading
                                                        ? 'Processing...'
                                                        : 'Reject'}
                                                </span>
                                            </button>
                                        </>
                                    )}

                                {selectedTransaction.type === 'withdrawal' && (
                                    <>
                                        <button
                                            onClick={() =>
                                                handleApproveWithdrawal(
                                                    selectedTransaction._id
                                                )
                                            }
                                            disabled={actionLoading}
                                            className='flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium flex items-center justify-center space-x-2'
                                        >
                                            <CheckCircle size={20} />
                                            <span>
                                                {actionLoading
                                                    ? 'Processing...'
                                                    : 'Approve & Mark Paid'}
                                            </span>
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleRejectWithdrawal(
                                                    selectedTransaction._id,
                                                    rejectReason
                                                )
                                            }
                                            disabled={actionLoading}
                                            className='flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-medium flex items-center justify-center space-x-2'
                                        >
                                            <XCircle size={20} />
                                            <span>
                                                {actionLoading
                                                    ? 'Processing...'
                                                    : 'Reject & Refund'}
                                            </span>
                                        </button>
                                    </>
                                )}

                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        setRejectReason('');
                                    }}
                                    className='px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium'
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WalletManagement;
